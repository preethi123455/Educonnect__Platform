const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const faceapi = require('face-api.js');
const canvas = require('canvas');
const path = require('path');

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

require('dotenv').config();

const app = express();

// 🔹 Body parser
app.use(express.json({ limit: '10mb' }));

// 🔹 CORS - allow local dev and deployed frontend
const allowedOrigins = [
  'http://localhost:3000', // Local frontend
  'https://educonnect-platform-frontend.onrender.com', // Deployed frontend
];
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          '❌ The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// 🔹 MongoDB connection
const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb+srv://preethi:Preethi1234@cluster0.umdwxhv.mongodb.net/test';
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  });

// 🔹 User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: 'user' },
  faceDescriptors: { type: [[Number]], required: true },
});

const User = mongoose.model('User', userSchema);

// 🔹 Load FaceAPI models
async function loadModels() {
  try {
    const modelPath = path.join(__dirname, 'models'); // Ensure models folder exists
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
    console.log('✅ Face API models loaded');
  } catch (err) {
    console.error('❌ Error loading FaceAPI models:', err.message);
  }
}
loadModels();

// 🔹 Get face descriptor from base64 image
async function getFaceDescriptor(imageBase64) {
  try {
    const img = await canvas.loadImage(imageBase64);
    const detection = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) throw new Error('No face detected');

    return Array.from(detection.descriptor);
  } catch (error) {
    console.error('❌ Face Detection Error:', error.message);
    throw new Error('Face detection failed. Try again.');
  }
}

// 🔹 Signup route
app.post('/signup', async (req, res) => {
  try {
    const { name, age, email, role, image } = req.body;

    if (!name || !age || !email || !image) {
      return res.status(400).json({ message: '❌ All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: '❌ User already exists' });
    }

    const faceDescriptor = await getFaceDescriptor(image);

    const newUser = new User({
      name,
      age,
      email,
      role: role || 'user',
      faceDescriptors: [faceDescriptor],
    });
    await newUser.save();

    res.status(201).json({ message: '✅ Signup successful' });
  } catch (error) {
    console.error('❌ Signup Error:', error.message);
    res.status(500).json({ message: '❌ Signup failed. Try again.' });
  }
});

// 🔹 Login route
app.post('/login', async (req, res) => {
  try {
    const { email, image } = req.body;

    if (!email || !image) {
      return res.status(400).json({ message: '❌ Email and image are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: '❌ User not found' });
    }

    const loginFaceDescriptor = await getFaceDescriptor(image);

    const labeledDescriptors = new faceapi.LabeledFaceDescriptors(
      user.email,
      user.faceDescriptors.map((desc) => new Float32Array(desc))
    );

    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.4);
    const bestMatch = faceMatcher.findBestMatch(new Float32Array(loginFaceDescriptor));

    console.log('🔍 Best Match:', bestMatch.toString());

    if (bestMatch.label === user.email) {
      res.status(200).json({ success: true, message: '✅ Login successful', role: user.role });
    } else {
      res.status(400).json({ success: false, message: '❌ Face does not match' });
    }
  } catch (error) {
    console.error('❌ Login Error:', error.message);
    res.status(500).json({ message: '❌ Login failed. Try again.' });
  }
});

// 🔹 Start server
const PORT = process.env.PORT || 6001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
