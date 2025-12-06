import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const Login = () => {
  const webcamRef = useRef(null);  

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);

  const captureAndLogin = async () => {
    if (!email) {
      setMessage("❌ Email is required!");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setMessage("❌ Failed to capture image. Try again!");
      return;
    }

    setCapturedImage(imageSrc);

    try {
      // ✅ Changed backend URL to Render deployment
      const res = await axios.post("https://educonnect-platform-backend.onrender.com/login", {
        email,
        image: imageSrc,
      });

      if (res.data.success) {
        setMessage("✅ Login successful!");
        window.location.href = "/home";
      } else {
        setMessage("❌ Login failed. Face does not match.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setMessage("❌ Login failed. Try again.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
      {capturedImage && <img src={capturedImage} alt="Captured face" width={100} />}
      
      <input type="email" placeholder="Enter Email" onChange={(e) => setEmail(e.target.value)} required />

      <button onClick={captureAndLogin}>Login</button>

      <p>{message}</p>
    </div>
  );
};

export default Login;
