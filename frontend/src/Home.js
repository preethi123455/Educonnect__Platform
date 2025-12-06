import React, { useState, useEffect } from "react";
import { ShoppingCart, Car, Stethoscope, Users, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("English"); // Default language

  const images = [
    "https://images.pexels.com/photos/5591274/pexels-photo-5591274.jpeg?cs=srgb&dl=pexels-tima-miroshnichenko-5591274.jpg&fm=jpg",
    "https://images.pexels.com/photos/6667801/pexels-photo-6667801.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/8899552/pexels-photo-8899552.jpeg?auto=compress&cs=tinysrgb&w=600",
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navLeft}>
          <LayoutDashboard size={30} style={{ cursor: "pointer" }} onClick={() => navigate("/dashboard")} />
          <h2 style={{ marginLeft: "10px" }}>SeniorEase</h2>
        </div>
        <div>
          <button style={styles.button} onClick={() => navigate("/login")}>
            Login
          </button>
          <button style={styles.button} onClick={() => navigate("/signup")}>
            Signup
          </button>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} style={styles.dropdown}>
            <option value="English">English</option>
            <option value="Tamil">தமிழ் (Tamil)</option>
            <option value="Hindi">हिंदी (Hindi)</option>
          </select>
        </div>
      </nav>

      {/* Carousel */}
      <div style={styles.carouselContainer}>
        <img src={images[currentImage]} alt="Carousel" style={styles.carouselImage} />
      </div>
      <br />
      <center>
        <h1>Services for Senior Citizens</h1>
      </center>
      <br />

      {/* Services Section */}
      <div style={styles.cardContainer}>
        <div className="card">
          <ShoppingCart size={40} color="#6a0dad" />
          <h3>Grocery Assistance</h3>
          <p>Order groceries online with ease.</p>
          <button className="card-button" onClick={() => navigate("/grocery")}>
            Shop Now
          </button>
        </div>
        <div className="card">
          <Car size={40} color="#6a0dad" />
          <h3>Cab<br></br>Booking</h3>
          <p>Book safe and reliable rides anytime.</p>
          <button className="card-button" onClick={() => navigate("/cab")}>
            Book a Ride
          </button>
        </div>
        <div className="card">
          <Stethoscope size={40} color="#6a0dad" />
          <h3>Doctor Consultation</h3>
          <p>Online consultations with doctors.</p>
          <button className="card-button" onClick={() => navigate("/cohome")}>
            Consult Now
          </button>
        </div>
        <div className="card">
          <Users size={40} color="#6a0dad" />
          <h3>Loneliness Support</h3>
          <p>Connect with NGOs for companionship.</p>
          <button className="card-button" onClick={() => navigate("/ngo-support")}>
            Connect Now
          </button>
        </div>
      </div>
      <br />

      {/* Footer */}
      <footer style={styles.footer}>
        <p>&copy; 2025 SeniorEase. All rights reserved.</p>
      </footer>

      {/* Internal CSS Animation */}
      <style>
        {`
          .card {
            width: 250px;
            padding: 20px;
            background: white;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
            text-align: center;
            border-radius: 10px;
            transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
          }
          .card:hover {
            transform: scale(1.1);
            box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.3);
          }
          .card-button {
            margin-top: 10px;
            padding: 8px 15px;
            border: none;
            background: #6a0dad;
            color: white;
            cursor: pointer;
            border-radius: 5px;
          }
          .card-button:hover {
            background: #5a0bab;
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    background: "#6a0dad",
    color: "white",
  },
  navLeft: {
    display: "flex",
    alignItems: "center",
  },
  button: {
    marginLeft: "10px",
    padding: "8px 15px",
    border: "none",
    background: "white",
    color: "#6a0dad",
    cursor: "pointer",
    borderRadius: "5px",
  },
  dropdown: {
    marginLeft: "10px",
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #6a0dad",
    cursor: "pointer",
    background: "white",
    color: "#6a0dad",
    fontSize: "16px",
  },
  carouselContainer: {
    display: "flex",
    justifyContent: "center",
    margin: "1px 0",
  },
  carouselImage: {
    width: "100%",
    height: "650px",
    objectFit: "cover",
  },
  cardContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "50px",
    margin: "20px 0",
  },
  footer: {
    textAlign: "center",
    padding: "10px",
    background: "#6a0dad",
    color: "white",
    marginTop: "20px",
  },
};

export default Home;
