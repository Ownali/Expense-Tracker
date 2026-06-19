import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../config/api";

// Step 1: Enter email
// Step 2: Answer security question
// Step 3: Set new password
// Step 4: Success

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/forgot-password/question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSecurityQuestion(data.securityQuestion);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!securityAnswer.trim()) return setError("Please enter your answer");
    setStep(3);
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirm) return setError("Passwords do not match");
    if (newPassword.length < 6) return setError("Password must be at least 6 characters");
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/forgot-password/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, securityAnswer, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStep(4);
    } catch (err) {
      setError(err.message);
      setStep(2); // go back to answer step on wrong answer
    } finally {
      setLoading(false);
    }
  };

  const stepLabel = ["", "Find Account", "Security Question", "New Password", "Done"];

  return (
    <div className="auth-page">
      {/* Banner */}
      <div className="auth-banner">
        <div className="auth-banner-logo">Spend<span>ly</span></div>
        <h2>Reset your password</h2>
        <p>Answer your security question to regain access to your account securely.</p>
        <ul className="auth-banner-features">
          <li>No email required</li>
          <li>Instant reset via security question</li>
          <li>Your data stays safe</li>
        </ul>
      </div>

      {/* Form Side */}
      <div className="auth-form-side">
        <div className="auth-form-box">

          {/* Step indicator */}
          {step < 4 && (
            <div style={{ display: "flex", gap: 8, marginBottom: "1.75rem" }}>
              {[1, 2, 3].map((s) => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700,
                    background: s < step ? "var(--success)" : s === step ? "var(--primary)" : "var(--border)",
                    color: s <= step ? "white" : "var(--text-muted)",
                    transition: "all 0.2s",
                  }}>
                    {s < step ? "✓" : s}
                  </div>
                  <span style={{ fontSize: 11, color: s === step ? "var(--text-primary)" : "var(--text-muted)", fontWeight: s === step ? 600 : 400 }}>
                    {stepLabel[s]}
                  </span>
                  {s < 3 && <div style={{ flex: 1, height: 1, background: s < step ? "var(--success)" : "var(--border)" }} />}
                </div>
              ))}
            </div>
          )}

          {error && <div className="error-msg">{error}</div>}

          {/* Step 1: Email */}
          {step === 1 && (
            <>
              <h1>Forgot Password</h1>
              <p>Enter your registered email address to get started.</p>
              <form onSubmit={handleEmailSubmit} style={{ marginTop: "1.5rem" }}>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    ref={inputRef}
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <button className="btn btn-primary" type="submit" disabled={loading}>
                  {loading ? "Looking up..." : "Continue →"}
                </button>
              </form>
            </>
          )}

          {/* Step 2: Security Question */}
          {step === 2 && (
            <>
              <h1>Security Question</h1>
              <p>Answer the question you set when registering.</p>
              <form onSubmit={handleAnswerSubmit} style={{ marginTop: "1.5rem" }}>
                <div style={{
                  background: "var(--primary-light)", border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)", padding: "0.85rem 1rem", marginBottom: "1.1rem",
                }}>
                  <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Your Question</p>
                  <p style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--text-primary)" }}>{securityQuestion}</p>
                </div>
                <div className="form-group">
                  <label>Your Answer</label>
                  <input
                    type="text"
                    placeholder="Type your answer"
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button type="button" className="btn btn-ghost" onClick={() => { setStep(1); setError(""); }} style={{ flex: 1 }}>← Back</button>
                  <button className="btn btn-primary" type="submit" style={{ flex: 2 }}>Continue →</button>
                </div>
              </form>
            </>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <>
              <h1>New Password</h1>
              <p>Choose a strong password for your account.</p>
              <form onSubmit={handleResetSubmit} style={{ marginTop: "1.5rem" }}>
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    placeholder="Min. 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Repeat new password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                  />
                </div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button type="button" className="btn btn-ghost" onClick={() => { setStep(2); setError(""); }} style={{ flex: 1 }}>← Back</button>
                  <button className="btn btn-primary" type="submit" disabled={loading} style={{ flex: 2 }}>
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div style={{ textAlign: "center", padding: "1rem 0" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
              <h1 style={{ marginBottom: "0.5rem" }}>Password Reset!</h1>
              <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
                Your password has been updated successfully. You can now sign in with your new password.
              </p>
              <button className="btn btn-primary" onClick={() => navigate("/login")}>
                Go to Login →
              </button>
            </div>
          )}

          {step < 4 && (
            <div className="auth-switch">
              Remember your password? <a onClick={() => navigate("/login")}>Sign in</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
