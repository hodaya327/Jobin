

// export default App;
import React, { useState } from "react";

// CV Optimizer - Frontend (Option 1: Optimize for a specific job)
// Drop this file as src/App.jsx in a Create React App project (or adapt to your setup).
// Run: npx create-react-app client && replace src/App.jsx with this file, then npm start in client

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

      // Make sure your backend accepts CORS from your frontend origin and the route below exists.
      const res = await fetch("http://localhost:3000/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Server returned ${res.status}`);
      }

      const json = await res.json();
      // Expected response: { analysis: {...}, filename: "generated/xxx.pdf" }
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
    // The server should expose GET /api/download/:filename
    // If filename contains slashes, you may want to send only the basename.
    const basename = pdfFilename.split("/").pop();
    const url = `http://localhost:3001/api/download/${encodeURIComponent(basename)}`;
    window.open(url, "_blank");
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>CV Optimizer — Optimize for a specific job</h1>

        <label style={styles.label}>
          Upload your CV (PDF):
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            style={styles.fileInput}
          />
        </label>

        <label style={styles.label}>
          Paste job description:
          <textarea
            value={jobListing}
            onChange={(e) => setJobListing(e.target.value)}
            placeholder="Paste the full job description here..."
            rows={8}
            style={styles.textarea}
          />
        </label>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.controls}>
          <button onClick={analyzeCV} disabled={loading} style={styles.button}>
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
            style={{ ...styles.button, background: "white", color: "#333", border: "1px solid #ddd" }}
          >
            Reset
          </button>
        </div>

        <div style={styles.resultsArea}>
          {loading && <div style={styles.loading}>Processing... (this may take a few seconds)</div>}

          {results && (
            <div>
              <h2>Analysis</h2>
              <pre style={styles.pre}>{JSON.stringify(results, null, 2)}</pre>
            </div>
          )}

          {pdfFilename && (
            <div style={styles.downloadRow}>
              <div>Generated PDF: <strong>{pdfFilename.split("/").pop()}</strong></div>
              <button onClick={downloadPDF} style={styles.button}>Download Improved PDF</button>
            </div>
          )}
        </div>

        <div style={styles.hint}>
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

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg,#eef2ff,#ffffff)",
    padding: 24,
  },
  card: {
    width: 820,
    maxWidth: "100%",
    background: "white",
    borderRadius: 12,
    boxShadow: "0 10px 30px rgba(20,20,60,0.08)",
    padding: 24,
  },
  title: { margin: 0, marginBottom: 12 },
  label: { display: "block", marginTop: 12, marginBottom: 6 },
  fileInput: { display: "block", marginTop: 8 },
  textarea: { width: "100%", padding: 8, fontSize: 14, marginTop: 8, borderRadius: 6, border: "1px solid #e6e6ef" },
  controls: { marginTop: 16, display: "flex", gap: 12 },
  button: { padding: "10px 16px", borderRadius: 8, border: "none", background: "#4f46e5", color: "white", cursor: "pointer" },
  resultsArea: { marginTop: 18 },
  pre: { background: "#fbfbff", padding: 12, borderRadius: 8, overflowX: "auto" },
  downloadRow: { marginTop: 10, display: "flex", gap: 12, alignItems: "center" },
  loading: { padding: 12, fontStyle: "italic" },
  error: { color: "#9b1c1c", marginTop: 8 },
  hint: { marginTop: 16, fontSize: 13, color: "#555" },
};
