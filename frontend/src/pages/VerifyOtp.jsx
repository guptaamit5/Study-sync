import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!otp) {
      alert("Enter OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Invalid OTP");
        return;
      }

      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
        .verify-page {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: radial-gradient(circle at top, #0b1430, #030712);
          font-family: Inter, sans-serif;
        }

        .verify-card {
          width: 380px;
          padding: 40px;
          border-radius: 14px;
          background: rgba(20,30,60,0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.08);
          text-align: center;
          color: white;
        }

        .verify-title {
          font-size: 32px;
          font-weight: 700;
          color: #9b87f5;
        }

        .verify-subtitle {
          margin-top: 6px;
          color: #cbd5e1;
        }

        .verify-email {
          margin-top: 20px;
          font-size: 14px;
          color: #94a3b8;
        }

        .verify-email span {
          color: white;
          font-weight: 500;
        }

        .verify-input {
          width: 100%;
          margin-top: 20px;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #334155;
          background: #020617;
          color: white;
          outline: none;
          font-size: 16px;
        }

        .verify-input:focus {
          border-color: #8b5cf6;
        }

        .verify-btn {
          width: 100%;
          margin-top: 20px;
          padding: 12px;
          border-radius: 8px;
          border: none;
          background: linear-gradient(90deg,#6366f1,#a855f7);
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }

        .verify-btn:hover {
          transform: translateY(-2px);
          opacity: 0.9;
        }
        `}
      </style>

      <div className="verify-page">
        <div className="verify-card">

          <h1 className="verify-title">StudySync</h1>

          <p className="verify-subtitle">
            Verify your email
          </p>

          <p className="verify-email">
            OTP sent to <span>{email}</span>
          </p>

          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="verify-input"
          />

          <button
            onClick={handleVerify}
            disabled={loading}
            className="verify-btn"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

        </div>
      </div>
    </>
  );
}