// import React, { useState } from "react";
// import axios from "axios";

// export default function ResumeChecker() {
//   const [file, setFile] = useState(null);
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleFileUpload = (e) => setFile(e.target.files[0]);

//   const analyzeResume = async () => {
//     if (!file) return alert("Please upload a resume!");

//     setLoading(true);
//     const formData = new FormData();
//     formData.append("resume", file); // Flask expects "resume" for this route

//     try {
//       const response = await axios.post("http://127.0.0.1:5000/upload_resume_ats", formData);
//       setResult(response.data);
//     } catch {
//       alert("Error analyzing resume.");
//     }

//     setLoading(false);
//   };
//   return (
//     <div className="bg-white p-6 rounded-xl shadow-lg">
//       <h2 className="text-2xl font-bold mb-4 text-gray-800">ATS Resume Checker</h2>

//       <div className="flex flex-col gap-4">
//         <input
//           type="file"
//           onChange={handleFileUpload}
//           accept=".pdf,.docx"
//           className="file-input border border-gray-300 rounded px-4 py-2"
//         />

//         <button
//           onClick={analyzeResume}
//           disabled={loading}
//           className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow disabled:opacity-50"
//         >
//           {loading ? "Analyzing..." : "Check Resume"}
//         </button>
//       </div>

//       {result && (
//         <div className="mt-6 space-y-4 text-gray-700">
//           <h3 className="text-lg font-semibold">ATS Score: {result.readability_score}%</h3>

//           <div>
//             <h4 className="font-medium">Formatting Issues:</h4>
//             <ul className="list-disc ml-6">
//               {result.format_issues.map((i, idx) => <li key={idx}>{i}</li>)}
//             </ul>
//           </div>

//           <div>
//             <h4 className="font-medium">Missing Sections:</h4>
//             <ul className="list-disc ml-6">
//               {result.missing_sections.map((s, idx) => <li key={idx}>{s}</li>)}
//             </ul>
//           </div>

//           <div>
//             <h4 className="font-medium">Suggestions:</h4>
//             <ul className="list-disc ml-6">
//               {result.suggestions.map((s, idx) => <li key={idx}>{s}</li>)}
//             </ul>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// //   return (
// //     <div>
// //       <h2>ATS Resume Checker</h2>
// //       <input type="file" onChange={handleFileUpload} accept=".pdf,.docx" />
// //       <button onClick={analyzeResume} disabled={loading}>
// //         {loading ? "Analyzing..." : "Check Resume"}
// //       </button>

// //       {result && (
// //         <div>
// //           <h3>ATS Score: {result.readability_score}%</h3>
// //           <h4>Formatting Issues:</h4>
// //           <ul>{result.format_issues.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
// //           <h4>Missing Sections:</h4>
// //           <ul>{result.missing_sections.map((s, idx) => <li key={idx}>{s}</li>)}</ul>
// //           <h4>Suggestions:</h4>
// //           <ul>{result.suggestions.map((s, idx) => <li key={idx}>{s}</li>)}</ul>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }
import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

export default function ResumeChecker() {
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setFileURL(URL.createObjectURL(uploadedFile));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setFileURL(URL.createObjectURL(droppedFile));
    }
  };

  const analyzeResume = async () => {
    if (!file) return toast.error("Please upload a resume!");

    setLoading(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await axios.post("https://smart-resume-parser.onrender.com/upload_resume_ats", formData);
      setResult(response.data);
      toast.success("Resume analyzed successfully!");
    } catch (err) {
      toast.error("Error analyzing resume.");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold mb-4 text-gray-800">ATS Resume Checker</h2>

      {/* Drag and Drop Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
          dragActive ? "border-green-500 bg-green-50" : "border-gray-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p className="text-gray-600 mb-2">Drag & drop your resume here</p>
        <p className="text-gray-500 text-sm mb-4">or</p>
        <input type="file" onChange={handleFileChange} accept=".pdf,.docx" className="mx-auto block" />
        {file && <p className="mt-2 text-sm text-green-600">{file.name}</p>}
      </div>

      {/* Preview */}
      {file && (
        <div className="mt-4">
          {file.type === "application/pdf" ? (
            <div className="border mt-2 rounded overflow-hidden h-[500px]">
              <iframe src={fileURL} title="PDF Preview" className="w-full h-full" />
            </div>
          ) : (
            <div className="text-sm text-gray-600 mt-2">
              <p>Preview not available for this file type.</p>
              <p><strong>Uploaded:</strong> {file.name}</p>
            </div>
          )}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={analyzeResume}
        disabled={loading}
        className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl shadow transition-all disabled:opacity-50"
      >
        {loading ? (
          <span className="flex justify-center items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
              <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Analyzing...
          </span>
        ) : (
          "Check Resume"
        )}
      </button>

      {/* Results */}
      {result && (
        <motion.div
          className="mt-6 space-y-4 text-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold">ATS Score: {result.readability_score}%</h3>

          <div>
            <h4 className="font-medium">Formatting Issues:</h4>
            <ul className="list-disc ml-6">
              {result.format_issues.map((i, idx) => <li key={idx}>{i}</li>)}
            </ul>
          </div>

          <div>
            <h4 className="font-medium">Missing Sections:</h4>
            <ul className="list-disc ml-6">
              {result.missing_sections.map((s, idx) => <li key={idx}>{s}</li>)}
            </ul>
          </div>

          <div>
            <h4 className="font-medium">Suggestions:</h4>
            <ul className="list-disc ml-6">
              {result.suggestions.map((s, idx) => <li key={idx}>{s}</li>)}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
}
