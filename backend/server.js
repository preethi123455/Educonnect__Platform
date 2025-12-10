const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const faceapi = require('face-api.js');
const canvas = require('canvas');
const path = require('path');
require('dotenv').config();

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const app = express();

// Body parser
app.use(express.json({ limit: '10mb' }));

// CORS
const allowedOrigins = [
  'http://localhost:3000',
  'https://educonnect-platform-frontend.onrender.com',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (!allowedOrigins.includes(origin)) {
        return callback(new Error('❌ CORS blocked'), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((error) => {
    console.error('❌ MongoDB error:', error.message);
    process.exit(1);
  });

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: { type: String, unique: true },
  role: { type: String, default: 'user' },
  faceDescriptors: [[Number]],
});

const User = mongoose.model('User', userSchema);

// Load Models
async function loadModels() {
  const modelPath = path.join(__dirname, 'models');
  try {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
    console.log('✅ Face API models loaded');
  } catch (err) {
    console.error('❌ Model loading error:', err.message);
  }
}
loadModels();

// Extract Face Descriptor
async function getFaceDescriptor(imageBase64) {
  const img = await canvas.loadImage(imageBase64);
  const detection = await faceapi
    .detectSingleFace(img)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) throw new Error('No face detected');

  return Array.from(detection.descriptor);
}

// Signup
app.post('/signup', async (req, res) => {
  try {
    const { name, age, email, role, image } = req.body;

    if (!name || !age || !email || !image)
      return res.status(400).json({ message: '❌ All fields required' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: '❌ User exists' });

    const descriptor = await getFaceDescriptor(image);

    const user = new User({
      name,
      age,
      email,
      role: role || 'user',
      faceDescriptors: [descriptor],
    });

    await user.save();

    res.json({ message: '✅ Signup successful' });
  } catch (error) {
    res.status(500).json({ message: '❌ Signup failed' });
  }
});

// Login
app.post('/login', async (req, res) => {
  try {
    const { email, image } = req.body;

    if (!email || !image)
      return res.status(400).json({ message: '❌ Email + image required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: '❌ User not found' });

    const loginDescriptor = await getFaceDescriptor(image);

    const labeled = new faceapi.LabeledFaceDescriptors(
      user.email,
      user.faceDescriptors.map((d) => new Float32Array(d))
    );

    const matcher = new faceapi.FaceMatcher(labeled, 0.4);
    const bestMatch = matcher.findBestMatch(new Float32Array(loginDescriptor));

    if (bestMatch.label === user.email) {
      return res.json({
        success: true,
        message: '✅ Login successful',
        role: user.role,
      });
    } else {
      return res.json({ success: false, message: '❌ Face does not match' });
    }
  } catch (error) {
    res.status(500).json({ message: '❌ Login failed' });
  }
});

// Start Server
const PORT = process.env.PORT || 6001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
