import React, { useState,useEffect, useRef } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Tools from "./tools";
import ResumeCheckerPage from "./components/ResumeCheckermainpage";
import axios from "axios";

function HomePage() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="main-content flex flex-col md:flex-row justify-between items-center max-w-6xl mt-12 mb-8 px-4"
    >
      <div className="left-text max-w-xl mb-8 md:mb-0">
        <h2 className="text-5xl font-extrabold mb-4 text-gray-800">Is your resume good enough?</h2>
        <button
          className="upload-btn bg-green-600 hover:bg-green-700 transition-colors text-white px-8 py-4 rounded-xl shadow-lg text-lg"
          onClick={() => navigate('/resources/resume-checker')}
        >
          Click here to check your resume
        </button>
      </div>
    </motion.div>
  );
}

function App() {

  useEffect(() => {
    console.log("App mounted started");
    const interval = setInterval(() => {
      axios.get("https://smart-resume-parser.onrender.com/greet?name=John").catch(() => {});
    }, 10 * 60 * 1000); 

    return () => clearInterval(interval);
  }, []);
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex flex-col items-center">
        <nav className="navbar w-full py-4 px-8 flex justify-between items-center bg-white/60 backdrop-blur-md shadow-md">
          <div className="logo text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500">
            Smart Resume ATS Checker
          </div>
          <div className="auth-buttons flex gap-2">
            <button className="signin px-4 py-2">Sign In</button>
            <button className="get-started px-4 py-2 bg-green-500 text-white rounded">Get Started</button>
          </div>
        </nav>

        <nav className="flex gap-6 mt-2 mb-10 bg-white/40 backdrop-blur-md px-6 py-3 rounded-full shadow-lg">
          <div className="nav-links flex gap-4 text-gray-700 font-medium">
            <Link to="/" className="hover:text-green-600 transition-colors duration-150">Home</Link>
            <Link to="/about" className="hover:text-green-600 transition-colors duration-150">About</Link>
            <Link to="/contact" className="hover:text-green-600 transition-colors duration-150">Contact</Link>
            <Link to="/privacy" className="hover:text-green-600 transition-colors duration-150">Privacy</Link>
            <Link to="/terms" className="hover:text-green-600 transition-colors duration-150">Terms</Link>
            <Link to="/tools" className="hover:text-green-600 transition-colors duration-150">Tools</Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/about"
            element={
              <div className="about-content flex flex-col items-center mt-12 mb-8 px-4">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">About Us</h2>
                <p className="mb-6 text-lg text-gray-600">
                  We are dedicated to helping job seekers optimize their resumes for ATS.
                </p>
              </div>
            }
          />
          <Route
            path="/contact"
            element={
              <div className="contact-content flex flex-col items-center mt-12 mb-8 px-4">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Contact Us</h2>
                <p className="mb-6 text-lg text-gray-600">
                  For inquiries, please reach out to us at <a href="mailto:uWbYt@example.com">uWbYt@example.com</a>
                </p>
              </div>
            }
          />
          <Route
            path="/privacy"
            element={
              <div className="privacy-content flex flex-col items-center mt-12 mb-8 px-4">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Privacy Policy</h2>
                <p className="mb-6 text-lg text-gray-600">
                  We value your privacy. Please read our privacy policy for more information.
                </p>
              </div>
            }
          />
          <Route
            path="/terms"
            element={
              <div className="terms-content flex flex-col items-center mt-12 mb-8 px-4">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Terms of Service</h2>
                <p className="mb-6 text-lg text-gray-600">
                  By using our service, you agree to our terms and conditions.
                </p>
              </div>
            }

          />
          
          <Route
            path="/resources/resume-checker"
            element={<ResumeCheckerPage/>}
          />
          <Route path="/tools" element={<Tools />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
