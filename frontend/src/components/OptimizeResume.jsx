import React, { useState } from "react";
import axios from "axios";

export default function OptimizeResume() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => setFile(e.target.files[0]);
  // Create a blob from the resume text and trigger download
  // const downloadOptimizedResume = () => {
  //   const blob = new Blob([result.download_url], { type: "text/plain" });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = "Optimized_Resume.docx";
  //   a.click();
  //   URL.revokeObjectURL(url); // clean up
  // };
  
  const getDownloadUrl = (path) => {
    const sanitized = path.replace(/\\/g, "/"); // Convert backslashes to forward slashes
    return `http://127.0.0.1:5000/${sanitized}`;
  };  
  const optimizeResume = async () => {
    if (!file) return alert("Please upload a resume!");

    setLoading(true);
    const formData = new FormData();
    formData.append("resume", file); // Flask expects "resume"

    try {
      const response = await axios.post("http://127.0.0.1:5000/optimize_resume", formData);
      setResult(response.data);
    } catch {
      alert("Error optimizing resume.");
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>Optimize Resume</h2>
      <input type="file" onChange={handleFileUpload} />
      <button onClick={optimizeResume} disabled={loading}>
        {loading ? "Optimizing..." : "Optimize"}
      </button>
      {result && (
                <div>
                  <p><strong>Download:</strong> 
                  <a href={getDownloadUrl(result.download_url)} target="_blank" rel="noopener noreferrer">
                    Optimized Resume
                  </a>
                </p>

          <h4>Explanation:</h4>
          <div style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
            {result.explanation}
          </div>
        </div>
      )}
    </div>
  );
}
