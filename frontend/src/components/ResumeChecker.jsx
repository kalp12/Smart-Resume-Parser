import React, { useState } from "react";
import axios from "axios";

export default function ResumeChecker() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => setFile(e.target.files[0]);

  const analyzeResume = async () => {
    if (!file) return alert("Please upload a resume!");

    setLoading(true);
    const formData = new FormData();
    formData.append("resume", file); // Flask expects "resume" for this route

    try {
      const response = await axios.post("http://127.0.0.1:5000/upload_resume_ats", formData);
      setResult(response.data);
    } catch {
      alert("Error analyzing resume.");
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>ATS Resume Checker</h2>
      <input type="file" onChange={handleFileUpload} accept=".pdf,.docx" />
      <button onClick={analyzeResume} disabled={loading}>
        {loading ? "Analyzing..." : "Check Resume"}
      </button>

      {result && (
        <div>
          <h3>ATS Score: {result.readability_score}%</h3>
          <h4>Formatting Issues:</h4>
          <ul>{result.format_issues.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
          <h4>Missing Sections:</h4>
          <ul>{result.missing_sections.map((s, idx) => <li key={idx}>{s}</li>)}</ul>
          <h4>Suggestions:</h4>
          <ul>{result.suggestions.map((s, idx) => <li key={idx}>{s}</li>)}</ul>
        </div>
      )}
    </div>
  );
}