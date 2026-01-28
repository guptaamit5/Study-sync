import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/workspace.css";

export default function Notes() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [notes, setNotes] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 🔥 Read / Edit modal states
  const [activeNote, setActiveNote] = useState(null);
  const [mode, setMode] = useState("read"); // read | edit

  // 🔥 LOAD NOTES
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchNotes();
  }, [token]);

  const fetchNotes = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotes(data);
    } catch {
      alert("Failed to load notes");
    }
  };

  // 🔥 CREATE NOTE
  const saveNote = async () => {
    if (!title.trim() || !content.trim()) return;

    try {
      const res = await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      const newNote = await res.json();
      setNotes(prev => [newNote, ...prev]);

      setShowModal(false);
      setTitle("");
      setContent("");
    } catch {
      alert("Failed to save note");
    }
  };

  // 🔥 DELETE NOTE (DB is truth)
  const deleteNote = async (id) => {
    if (!window.confirm("Delete this note?")) return;

    try {
      await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchNotes(); // reload from DB
    } catch {
      alert("Delete failed");
    }
  };

  // 🔥 UPDATE NOTE
  const updateNote = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/notes/${activeNote._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: activeNote.title,
            content: activeNote.content,
          }),
        }
      );

      if (!res.ok) throw new Error();

      fetchNotes();
      setActiveNote(null);
    } catch {
      alert("Update failed");
    }
  };

  return (
    <div className="workspace">
      <button className="secondary-btn" onClick={() => navigate("/dashboard")}>
        ← Back to Dashboard
      </button>
      <div className="page-divider" />

      <div className="workspace-header">
        <h1>My Notes</h1>
        <button className="primary-btn" onClick={() => setShowModal(true)}>
          + New Note
        </button>
        
      </div>

      {/* 🔥 CREATE MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>New Note</h2>

            <input
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />

            <textarea
              placeholder="Content..."
              value={content}
              onChange={e => setContent(e.target.value)}
            />

            <div className="modal-actions">
              <button className="secondary-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="primary-btn" onClick={saveNote}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔥 NOTES GRID */}
      <div className="card-grid">
        {notes.map(note => (
          <div className="card" key={note._id}>
            <h3>{note.title}</h3>

            <p className="note-preview">
              {note.content.length > 120
                ? note.content.slice(0, 120) + "..."
                : note.content}
            </p>

            <div className="card-actions">
              <button
                className="secondary-btn"
                onClick={() => {
                  setActiveNote(note);
                  setMode("read");
                }}
              >
                Read
              </button>

              <button
                className="secondary-btn"
                onClick={() => {
                  setActiveNote(note);
                  setMode("edit");
                }}
              >
                Edit
              </button>

              <button
                className="secondary-btn"
                onClick={() => deleteNote(note._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🔥 READ / EDIT MODAL */}
      {activeNote && (
        <div className="modal-overlay">
          <div className="modal-box large">
            <h2>{mode === "read" ? "View Note" : "Edit Note"}</h2>

            <input
              value={activeNote.title}
              disabled={mode === "read"}
              onChange={e =>
                setActiveNote({ ...activeNote, title: e.target.value })
              }
            />

            <textarea
              value={activeNote.content}
              disabled={mode === "read"}
              onChange={e =>
                setActiveNote({ ...activeNote, content: e.target.value })
              }
              style={{ minHeight: "220px" }}
            />

            <div className="modal-actions">
              <button
                className="secondary-btn"
                onClick={() => setActiveNote(null)}
              >
                Close
              </button>

              {mode === "edit" && (
                <button className="primary-btn" onClick={updateNote}>
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


