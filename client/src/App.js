import React, { useState } from "react";
import "./App.css";
import Logo from "./Logo";

export default function App() {
  const [cvFile, setCvFile] = useState(null);
  const [jobListing, setJobListing] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [pdfFilename, setPdfFilename] = useState(null);
  const [error, setError] = useState(null);

  function handleFileChange(e) {
    setCvFile(e.target.files?.[0] ?? null);
  }

  async function analyzeCV() {
    setError(null);
    if (!cvFile) return setError("Please choose a PDF file first.");
    if (!jobListing.trim()) return setError("Please paste the job description.");

    setLoading(true);
    setResults(null);
    setPdfFilename(null);

    try {
      const formData = new FormData();
      formData.append("cv", cvFile);
      formData.append("jobDescription", jobListing);

      const res = await fetch("http://localhost:3000/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Server returned ${res.status}`);
      }

      const json = await res.json();
      setResults(json.analysis ?? json);
      setPdfFilename(json.filename ?? json.pdfFilename ?? null);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  function downloadPDF() {
    if (!pdfFilename) return;
    const basename = pdfFilename.split("/").pop();
    const url = `http://localhost:3001/api/download/${encodeURIComponent(basename)}`;
    window.open(url, "_blank");
  }

  return (
    <div className="page">
      <div className="card">
        <div className="header">
          <Logo />
          <h1 className="title">Optimize your CV</h1>
          <p className="subtitle">Upload your CV and job description to get personalized optimization suggestions</p>
        </div>

        <div className="content">
          <div className="left-panel">
            <div className="section">
              <label className="label">Upload CV (PDF)</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="file-input"
                />
                <div className="file-input-label">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10M11.3333 5.33333L8 2M8 2L4.66667 5.33333M8 2V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {cvFile ? cvFile.name : "Choose file"}
                </div>
              </div>
            </div>

            <div className="section">
              <label className="label">Job Description</label>
              <textarea
                value={jobListing}
                onChange={(e) => setJobListing(e.target.value)}
                placeholder="Paste the job description here..."
                className="textarea"
              />
            </div>

            {error && <div className="error">{error}</div>}

            <div className="controls">
              <button onClick={analyzeCV} disabled={loading} className="button">
                {loading ? "Analyzing..." : "Analyze & Optimize"}
              </button>

              <button
                onClick={() => {
                  setCvFile(null);
                  setJobListing("");
                  setResults(null);
                  setPdfFilename(null);
                  setError(null);
                }}
                className="button button-reset"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="right-panel">
            <div className="results-area">
              {loading && <div className="loading">Processing your CV... This may take a few moments</div>}

              {results && (
                <>
                  <h2>Analysis Results</h2>
                  <pre className="pre">{JSON.stringify(results, null, 2)}</pre>
                </>
              )}

              {pdfFilename && (
                <div className="download-row">
                  <div>
                    <strong>{pdfFilename.split("/").pop()}</strong>
                    <div style={{ fontSize: '12px', color: '#667eea', marginTop: '4px' }}>
                      Your optimized CV is ready
                    </div>
                  </div>
                  <button onClick={downloadPDF} className="button">Download PDF</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}