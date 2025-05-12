import React, { useState } from "react";
import axios from "axios";

export default function UploadResumeJD() {
  const [file, setFile] = useState(null);
  const [jd, setJD] = useState("");
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => setFile(e.target.files[0]);

  const uploadResumeJD = async () => {
    if (!file || !jd) return alert("Provide resume and job description");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file); // Flask expects "file"
    formData.append("job_description", jd);

    try {
      const response = await axios.post("http://127.0.0.1:5000/upload_resume_jd", formData);
      setMatch(response.data.match);
    } catch {
      alert("Error comparing resume with JD.");
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>Compare Resume to Job Description</h2>
      <textarea
        rows="5"
        cols="50"
        placeholder="Paste Job Description"
        value={jd}
        onChange={(e) => setJD(e.target.value)}
      />
      <input type="file" onChange={handleFileUpload} />
      <button onClick={uploadResumeJD} disabled={loading}>
        {loading ? "Uploading..." : "Compare"}
      </button>
      {match && <pre>{JSON.stringify(match, null, 2)}</pre>}
    </div>
  );
}
