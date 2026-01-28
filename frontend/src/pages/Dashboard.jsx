import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState({
    notes: 0,
    todos: 0,
    summaries: 0,
  });

  const [open, setOpen] = useState(false); // 🔹 dropdown state

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:5000/api/dashboard/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setStats({
          notes: data.notes,
          todos: data.todos,
          summaries: data.summariesToday, // daily reset
        });
      })
      .catch(err => console.error(err));
  }, [token, navigate]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.logo}>StudySync</h1>

        {/* 🔹 USER + DROPDOWN */}
        <div style={styles.userBox}>
          <div
            style={styles.userTrigger}
            onClick={() => setOpen(prev => !prev)}
          >
            <span>{user?.name || "User"}</span>
            <span style={{ fontSize: "12px" }}>▼</span>
          </div>

          {open && (
            <div style={styles.dropdown}>
              <button style={styles.dropdownItem} onClick={logout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Dashboard Overview</h2>
        <p style={styles.subtitle}>
          Live productivity stats from your workspace
        </p>
      </div>

      {/* Cards */}
      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>📘 Notes</h3>
          <p>Total notes created</p>
          <h1>{stats.notes}</h1>
          <button style={styles.button} onClick={() => navigate("/notes")}>
            Open Notes
          </button>
        </div>

        <div style={styles.card}>
          <h3>✅ Pending Todos</h3>
          <p>Tasks remaining</p>
          <h1>{stats.todos}</h1>
          <button style={styles.button} onClick={() => navigate("/todos")}>
            View Todos
          </button>
        </div>

        <div style={styles.card}>
          <h3>🤖 AI Summaries</h3>
          <p>Generated today</p>
          <h1>{stats.summaries}</h1>
          <button style={styles.button} onClick={() => navigate("/summary")}>
            Generate Summary
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(circle at top, #0f172a, #020617)",
    color: "white",
    fontFamily: "Inter, sans-serif",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    borderBottom: "1px solid rgba(255,255,255,0.12)",
  },
  logo: {
    fontSize: "30px",
    fontWeight: "800",
    color: "#a78bfa",
  },

  /* 🔹 USER DROPDOWN STYLES */
  userBox: {
    position: "relative",
  },
  userTrigger: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    cursor: "pointer",
    padding: "10px 14px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.06)",
  },
  dropdown: {
    position: "absolute",
    top: "120%",
    right: 0,
    background: "#020617",
    borderRadius: "10px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
    overflow: "hidden",
  },
  dropdownItem: {
    background: "none",
    border: "none",
    color: "white",
    padding: "12px 20px",
    width: "100%",
    textAlign: "left",
    cursor: "pointer",
  },

  header: {
    padding: "40px",
  },
  title: {
    fontSize: "36px",
  },
  subtitle: {
    opacity: 0.7,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "30px",
    padding: "40px",
  },
  card: {
    background: "rgba(255,255,255,0.03)",
    borderRadius: "20px",
    padding: "30px",
    backdropFilter: "blur(10px)",
  },
  button: {
    marginTop: "15px",
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    background: "linear-gradient(90deg,#7c3aed,#9333ea)",
    border: "none",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default Dashboard;
