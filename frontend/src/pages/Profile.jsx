import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../config/api";

const SECURITY_QUESTIONS = [
  "What was the name of your first pet?",
  "What city were you born in?",
  "What is your mother's maiden name?",
  "What was the name of your first school?",
  "What is your favourite childhood movie?",
  "What street did you grow up on?",
];

export default function Profile() {
  const { user, token, updateUser } = useAuth();

  const [profileForm, setProfileForm] = useState({ name: "", email: "" });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);

  const [passForm, setPassForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [passLoading, setPassLoading] = useState(false);
  const [passMsg, setPassMsg] = useState(null);

  const [sqForm, setSqForm] = useState({ securityQuestion: "", securityAnswer: "", password: "" });
  const [sqLoading, setSqLoading] = useState(false);
  const [sqMsg, setSqMsg] = useState(null);

  const nameRef = useRef(null);
  const currentPassRef = useRef(null);

  useEffect(() => {
    if (user) setProfileForm({ name: user.name || "", email: user.email || "" });
  }, [user]);

  const handleProfileChange = (e) => setProfileForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handlePassChange = (e) => setPassForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSqChange = (e) => setSqForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg(null);
    setProfileLoading(true);
    try {
      const res = await fetch(`${API}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(profileForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      updateUser(data.user, data.token);
      setProfileMsg({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setProfileMsg({ type: "error", text: err.message });
      nameRef.current?.focus();
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePassSubmit = async (e) => {
    e.preventDefault();
    setPassMsg(null);
    if (passForm.newPassword !== passForm.confirm)
      return setPassMsg({ type: "error", text: "New passwords do not match" });
    if (passForm.newPassword.length < 6)
      return setPassMsg({ type: "error", text: "Password must be at least 6 characters" });
    setPassLoading(true);
    try {
      const res = await fetch(`${API}/profile/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: passForm.currentPassword, newPassword: passForm.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPassMsg({ type: "success", text: "Password changed successfully!" });
      setPassForm({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (err) {
      setPassMsg({ type: "error", text: err.message });
      currentPassRef.current?.focus();
    } finally {
      setPassLoading(false);
    }
  };

  const handleSqSubmit = async (e) => {
    e.preventDefault();
    setSqMsg(null);
    if (!sqForm.securityQuestion) return setSqMsg({ type: "error", text: "Please select a question" });
    if (!sqForm.securityAnswer.trim()) return setSqMsg({ type: "error", text: "Please provide an answer" });
    setSqLoading(true);
    try {
      const res = await fetch(`${API}/profile/security-question`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(sqForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSqMsg({ type: "success", text: "Security question updated!" });
      setSqForm({ securityQuestion: "", securityAnswer: "", password: "" });
    } catch (err) {
      setSqMsg({ type: "error", text: err.message });
    } finally {
      setSqLoading(false);
    }
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div>
      <div className="page-header">
        <h1>Profile</h1>
        <p>Manage your account information, password and security settings</p>
      </div>

      {/* Avatar row */}
      <div className="card" style={{ marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
        <div style={{
          width: 68, height: 68, borderRadius: "50%",
          background: "linear-gradient(135deg, #7c6ff7, #6358e8)",
          color: "white", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "1.5rem", fontWeight: 700,
          boxShadow: "0 4px 14px rgba(124,111,247,0.3)", flexShrink: 0
        }}>
          {initials}
        </div>
        <div>
          <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>{user?.name}</div>
          <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: 2 }}>{user?.email}</div>
        </div>
      </div>

      {/* Responsive grid: 2 cols on desktop, 1 col on mobile */}
      <div className="profile-grid">

        {/* Update Profile */}
        <div className="card">
          <div className="card-header"><span className="card-title">Update Profile</span></div>
          {profileMsg && <div className={profileMsg.type === "success" ? "success-msg" : "error-msg"}>{profileMsg.text}</div>}
          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input ref={nameRef} name="name" type="text" value={profileForm.name} onChange={handleProfileChange} required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input name="email" type="email" value={profileForm.email} onChange={handleProfileChange} required />
            </div>
            <button className="btn btn-primary" type="submit" disabled={profileLoading}>
              {profileLoading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="card">
          <div className="card-header"><span className="card-title">Change Password</span></div>
          {passMsg && <div className={passMsg.type === "success" ? "success-msg" : "error-msg"}>{passMsg.text}</div>}
          <form onSubmit={handlePassSubmit}>
            <div className="form-group">
              <label>Current Password</label>
              <input ref={currentPassRef} name="currentPassword" type="password" value={passForm.currentPassword} onChange={handlePassChange} placeholder="Enter current password" required />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input name="newPassword" type="password" value={passForm.newPassword} onChange={handlePassChange} placeholder="Min. 6 characters" required />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input name="confirm" type="password" value={passForm.confirm} onChange={handlePassChange} placeholder="Repeat new password" required />
            </div>
            <button className="btn btn-primary" type="submit" disabled={passLoading}>
              {passLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* Security Question — full width */}
        <div className="card profile-grid-full">
          <div className="card-header"><span className="card-title">🔐 Security Question for Password Recovery</span></div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
            This question is used to verify your identity if you forget your password. Enter your current password to change it.
          </p>
          {sqMsg && <div className={sqMsg.type === "success" ? "success-msg" : "error-msg"}>{sqMsg.text}</div>}
          <form onSubmit={handleSqSubmit}>
            <div className="security-question-grid">
              <div className="form-group">
                <label>Security Question</label>
                <select name="securityQuestion" value={sqForm.securityQuestion} onChange={handleSqChange} required>
                  <option value="">Select a question</option>
                  {SECURITY_QUESTIONS.map((q) => <option key={q} value={q}>{q}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Your Answer</label>
                <input name="securityAnswer" type="text" placeholder="Case-insensitive" value={sqForm.securityAnswer} onChange={handleSqChange} required />
              </div>
              <div className="form-group">
                <label>Current Password</label>
                <input name="password" type="password" placeholder="Confirm with password" value={sqForm.password} onChange={handleSqChange} required />
              </div>
            </div>
            <button className="btn btn-primary" type="submit" disabled={sqLoading} style={{ width: "auto", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
              {sqLoading ? "Saving..." : "Save Security Question"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
