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

  const [activeNote, setActiveNote] = useState(null);
  const [mode, setMode] = useState("read");

  // ✅ DELETE MODAL STATE
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // ==============================
  // LOAD NOTES
  // ==============================
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchNotes();
  }, [token]);

  const fetchNotes = async () => {
    try {
      const res = await fetch("https://study-sync-2hsw.onrender.com/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotes(data);
    } catch {
      alert("Failed to load notes");
    }
  };

  // ==============================
  // CREATE NOTE
  // ==============================
  const saveNote = async () => {
    if (!title.trim() || !content.trim()) return;

    try {
      const res = await fetch("https://study-sync-2hsw.onrender.com/api/notes", {
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

  // ==============================
  // DELETE NOTE (NO confirm here)
  // ==============================
  const deleteNote = async (id) => {
    try {
      await fetch(`https://study-sync-2hsw.onrender.com/api/notes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchNotes();
    } catch {
      alert("Delete failed");
    }
  };

  // ==============================
  // UPDATE NOTE
  // ==============================
  const updateNote = async () => {
    try {
      const res = await fetch(
        `https://study-sync-2hsw.onrender.com/api/notes/${activeNote._id}`,
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

  // ==============================
  // DOWNLOAD NOTE
  // ==============================
  const downloadNote = (note) => {
    const blob = new Blob([note.content], {
      type: "text/plain;charset=utf-8",
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    const safeTitle = note.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();

    a.href = url;
    a.download = `${safeTitle || "note"}.txt`;
    a.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="workspace">
      <button className="secondary-btn" onClick={() => navigate("/dashboard")}>
        ← Back to Dashboard
      </button>

      <div className="workspace-header">
        <h1>My Notes</h1>

        <button
          className="primary-btn"
          onClick={() => setShowModal(true)}
        >
          + New Note
        </button>
      </div>

      {/* CREATE MODAL */}
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
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button onClick={saveNote}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Delete Note</h2>
            <p>Are you sure you want to delete this note?</p>

            <div className="modal-actions">
              <button
                onClick={() => {
                  setDeleteModal(false);
                  setDeleteId(null);
                }}
              >
                Cancel
              </button>

              <button
                className="delete-btn"
                onClick={() => {
                  deleteNote(deleteId);
                  setDeleteModal(false);
                  setDeleteId(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOTES GRID */}
      <div className="card-grid">
        {notes.map(note => (
          <div className="card" key={note._id}>
            <h3>{note.title}</h3>

            <p>
              {note.content.length > 120
                ? note.content.slice(0, 120) + "..."
                : note.content}
            </p>

            <div className="card-actions">
              <button onClick={() => downloadNote(note)}>Download</button>

              <button
                onClick={() => {
                  setActiveNote(note);
                  setMode("read");
                }}
              >
                Read
              </button>

              <button
                onClick={() => {
                  setActiveNote(note);
                  setMode("edit");
                }}
              >
                Edit
              </button>

              {/* ✅ FIXED DELETE BUTTON */}
              <button
                onClick={() => {
                  setDeleteId(note._id);
                  setDeleteModal(true);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* READ / EDIT MODAL */}
      {activeNote && (
        <div className="modal-overlay">
          <div className="modal-box">
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
            />

            <div className="modal-actions">
              <button onClick={() => setActiveNote(null)}>Close</button>

              {mode === "edit" && (
                <button onClick={updateNote}>Save</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}