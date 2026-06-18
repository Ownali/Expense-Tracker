import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5000/api";

export default function Profile() {
  const { user, token, updateUser } = useAuth();

  const [profileForm, setProfileForm] = useState({ name: "", email: "" });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);

  const [passForm, setPassForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [passLoading, setPassLoading] = useState(false);
  const [passMsg, setPassMsg] = useState(null);

  const nameRef = useRef(null);
  const currentPassRef = useRef(null);

  useEffect(() => {
    if (user) setProfileForm({ name: user.name || "", email: user.email || "" });
  }, [user]);

  const handleProfileChange = (e) =>
    setProfileForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePassChange = (e) =>
    setPassForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

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
      return setPassMsg({ type: "error", text: "New password must be at least 6 characters" });

    setPassLoading(true);
    try {
      const res = await fetch(`${API}/profile/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          currentPassword: passForm.currentPassword,
          newPassword: passForm.newPassword,
        }),
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

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div>
      <div className="page-header">
        <h1>Profile</h1>
        <p>Manage your account information and password</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", alignItems: "start" }}>

        {/* Profile Info Card */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.75rem" }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "linear-gradient(135deg, #7c6ff7, #6358e8)",
              color: "white", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "1.4rem", fontWeight: 700,
              boxShadow: "0 4px 14px rgba(124,111,247,0.3)", flexShrink: 0
            }}>
              {initials}
            </div>
            <div>
              <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>{user?.name}</div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 2 }}>{user?.email}</div>
            </div>
          </div>

          <div className="card-header" style={{ marginBottom: "1.25rem" }}>
            <span className="card-title">Update Profile</span>
          </div>

          {profileMsg && (
            <div className={profileMsg.type === "success" ? "success-msg" : "error-msg"}>
              {profileMsg.text}
            </div>
          )}

          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                ref={nameRef}
                name="name"
                type="text"
                value={profileForm.name}
                onChange={handleProfileChange}
                placeholder="Your full name"
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                name="email"
                type="email"
                value={profileForm.email}
                onChange={handleProfileChange}
                placeholder="your@email.com"
                required
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={profileLoading}>
              {profileLoading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="card">
          <div className="card-header" style={{ marginBottom: "1.25rem" }}>
            <span className="card-title">Change Password</span>
          </div>

          {passMsg && (
            <div className={passMsg.type === "success" ? "success-msg" : "error-msg"}>
              {passMsg.text}
            </div>
          )}

          <form onSubmit={handlePassSubmit}>
            <div className="form-group">
              <label>Current Password</label>
              <input
                ref={currentPassRef}
                name="currentPassword"
                type="password"
                value={passForm.currentPassword}
                onChange={handlePassChange}
                placeholder="Enter current password"
                required
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                name="newPassword"
                type="password"
                value={passForm.newPassword}
                onChange={handlePassChange}
                placeholder="Min. 6 characters"
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                name="confirm"
                type="password"
                value={passForm.confirm}
                onChange={handlePassChange}
                placeholder="Repeat new password"
                required
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={passLoading}>
              {passLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
