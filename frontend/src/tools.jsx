import React, { useState } from "react";
import ResumeChecker from "./components/ResumeChecker";
import ExtractRelevantData from "./components/ExtractRelevantData";
import UploadResumeJD from "./components/UploadResumeJD";
import OptimizeResume from "./components/OptimizeResume";
import {
  DocumentMagnifyingGlassIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const NAV_ITEMS = [
  { key: "ats", label: "ATS Check", icon: <DocumentMagnifyingGlassIcon className="h-5 w-5 mr-2" /> },
  { key: "extract", label: "Extract", icon: <DocumentTextIcon className="h-5 w-5 mr-2" /> },
  { key: "jd", label: "Compare JD", icon: <ClipboardDocumentListIcon className="h-5 w-5 mr-2" /> },
  { key: "optimize", label: "Optimize", icon: <SparklesIcon className="h-5 w-5 mr-2" /> },
];

export default function Tools() {
  const [view, setView] = useState("ats");

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center pt-8 px-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Resume Tools</h2>
      <nav className="flex gap-4 mb-6 bg-white/40 backdrop-blur-md px-6 py-3 rounded-full shadow-lg">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            onClick={() => setView(item.key)}
            className={`flex items-center px-5 py-2 rounded-full font-medium transition-all duration-300
              ${view === item.key
                ? "bg-green-500 text-white shadow-lg scale-105"
                : "bg-white text-green-700 border border-green-300 hover:bg-green-100/80 hover:scale-105"}`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <main className="w-full max-w-3xl bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 animate-fade-in">
        {view === "ats" && <ResumeChecker />}
        {view === "extract" && <ExtractRelevantData />}
        {view === "jd" && <UploadResumeJD />}
        {view === "optimize" && <OptimizeResume />}
      </main>
    </div>
  );
}
