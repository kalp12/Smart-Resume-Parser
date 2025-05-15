import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Tools from "./tools";

function App() {
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

        <Routes>
          <Route
            path="/"
            element={
              <div className="main-content flex flex-col md:flex-row justify-between items-center max-w-6xl mt-12 mb-8 px-4">
                <div className="left-text max-w-xl mb-8 md:mb-0">
                  <h2 className="text-5xl font-extrabold mb-4 text-gray-800">Is your resume good enough?</h2>
                  <p className="mb-6 text-lg text-gray-600">Upload your resume and get an instant ATS score with our AI-powered checker.</p>
                  <button
                    className="upload-btn bg-green-600 hover:bg-green-700 transition-colors text-white px-8 py-4 rounded-xl shadow-lg text-lg"
                    onClick={() => {
                      // call ATS API
                    }}
                  >
                    Upload Your Resume
                  </button>
                </div>
              </div>
            }
          />
          <Route path="/tools" element={<Tools />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;