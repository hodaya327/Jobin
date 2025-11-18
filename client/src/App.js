import React, { useState } from "react";
import "./App.css";

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
        <h1 className="title">CV Optimizer — Optimize for a specific job</h1>

        <label className="label">
          Upload your CV (PDF):
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="file-input"
          />
        </label>

        <label className="label">
          Paste job description:
          <textarea
            value={jobListing}
            onChange={(e) => setJobListing(e.target.value)}
            placeholder="Paste the full job description here..."
            rows={8}
            className="textarea"
          />
        </label>

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
            Reset
          </button>
        </div>

        <div className="results-area">
          {loading && <div className="loading">Processing... (this may take a few seconds)</div>}

          {results && (
            <div>
              <h2>Analysis</h2>
              <pre className="pre">{JSON.stringify(results, null, 2)}</pre>
            </div>
          )}

          {pdfFilename && (
            <div className="download-row">
              <div>Generated PDF: <strong>{pdfFilename.split("/").pop()}</strong></div>
              <button onClick={downloadPDF} className="button">Download Improved PDF</button>
            </div>
          )}
        </div>

        <div className="hint">
          <strong>Notes:</strong>
          <ul>
            <li>This frontend assumes the backend is running at <code>http://localhost:3001</code> and exposes <code>POST /api/optimize-for-job</code> and <code>GET /api/download/:filename</code>.</li>
            <li>Use FormData to send the file and the job description.</li>
            <li>Enable CORS on the server for the frontend origin (e.g. http://localhost:3000).</li>
          </ul>
        </div>
      </div>
    </div>
  );
}