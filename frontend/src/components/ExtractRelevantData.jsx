import React, { useState } from "react";
import axios from "axios";

export default function ExtractRelevantData() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => setFile(e.target.files[0]);

  const extractResume = async () => {
    if (!file) return alert("Upload a resume!");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file); 
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    // console.log("API_BASE_URL", API_BASE_URL);
    try {
      const response = await axios.post(`${API_BASE_URL}upload_resume`, formData);
      setResult(response.data);
    } catch {
      alert("Error extracting data.");
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>Extract Resume Data</h2>
      <input type="file" onChange={handleFileUpload} />
      <button onClick={extractResume} disabled={loading}>
        {loading ? "Extracting..." : "Extract"}
      </button>
      {result && (
        <div>
          <h4>Links: {result.links ? result.links : "No links available"}</h4>
          <h4>Data: {result.data ? JSON.stringify(result.data, null, 2) : "No data available"}</h4>
          <h4>Extracted Text: {result.extracted_text ? result.extracted_text : "No extracted text available"}</h4>  
        </div>
      )}
    </div>
  );
}  