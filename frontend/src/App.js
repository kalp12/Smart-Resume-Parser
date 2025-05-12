// import React from "react";
// import Chatbot from "./chatbot";
// import ResumeChecker from "./ResumeChecker";


// function App() {
//   return (
//     <div style={{
//       backgroundColor: "lightgreen",
//       alignItems: "center",
//       textAlign: "center",
//     }}>
//       <h1 style={{ color: "#333", fontSize: "2rem", marginBottom: "20px" }}>Welcome to Resume ATS Checker</h1>
      
//         <ResumeChecker />
//         <Chatbot />
//     </div>
    
//   );
// }

// export default App;

import React, { useState } from "react";
import ResumeChecker from "./components/ResumeChecker";
import ExtractRelevantData from "./components/ExtractRelevantData";
import UploadResumeJD from "./components/UploadResumeJD";
import OptimizeResume from "./components/OptimizeResume";

export default function App() {
  const [view, setView] = useState("ats");

  return (
    <div>
      <nav>
        <button onClick={() => setView("ats")}>ATS Check</button>
        <button onClick={() => setView("extract")}>Extract</button>
        <button onClick={() => setView("jd")}>Compare JD</button>
        <button onClick={() => setView("optimize")}>Optimize</button>
      </nav>

      {view === "ats" && <ResumeChecker />}
      {view === "extract" && <ExtractRelevantData />}
      {view === "jd" && <UploadResumeJD />}
      {view === "optimize" && <OptimizeResume />}
    </div>
  );
}