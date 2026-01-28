import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import "../styles/workspace.css";

export default function Summary() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [summary, setSummary] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/notes", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setNotes);
  }, []);

const generateSummary = async () => {
  const note = notes.find(n => n._id === selectedId);
  if (!note) return;

  setShowModal(true);
  setSummary("Generating summary...");

  const res = await fetch("http://localhost:5000/api/summary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: note.title,
      content: note.content,
    }),
  });

  const data = await res.json();
  setSummary(data.summary);
};

const downloadSummary = () => {
  if (!summary) return;

  const blob = new Blob([summary], { type: "text/plain;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "ai-summary.txt"; // file name
  a.click();

  window.URL.revokeObjectURL(url);
};


  return (
    <div className="workspace">
      <button className="secondary-btn" onClick={() => navigate("/dashboard")}>
        ← Back to Dashboard
      </button>
      <div className="page-divider" />

      <div className="workspace-header">
        <h1>AI Summary</h1>
      </div>

      <div className="summary-stack">
        <select value={selectedId} onChange={e => setSelectedId(e.target.value)}>
          <option value="">Select a note...</option>
          {notes.map(note => (
            <option key={note._id} value={note._id}>{note.title}</option>
          ))}
        </select>

        <button className="primary-btn" onClick={generateSummary}>
          Generate Summary
        </button>
      </div>

      {showModal &&
  createPortal(
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>AI Summary</h3>

        <div className="modal-content">
          {summary}
        </div>

        <div className="modal-actions">
          <button className="secondary-btn" onClick={downloadSummary}>
            Download
          </button>
          <button className="primary-btn" onClick={() => setShowModal(false)}>
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

    </div>
  );
}
