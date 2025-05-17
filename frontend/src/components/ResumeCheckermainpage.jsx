import React from "react";
import ResumeChecker from "./ResumeChecker";

export default function ResumeCheckerPage() {
  return (
    <div>
    <div className="main-content flex flex-col md:flex-row justify-between items-center max-w-6xl mt-12 mb-8 px-4">
      <div className="left-text max-w-xl mb-8 md:mb-0">
        <h2 className="text-5xl font-extrabold mb-4 text-gray-800">Resume ATS checker</h2>
        <p className="mb-6 text-lg text-gray-600">
          Upload your resume and get an instant ATS score with our AI-powered checker
        </p>
      </div>

      
    </div>
    <div className="resume-checker-component max-w-xl">
        <ResumeChecker />
      </div>
      </div>
  );
}
