import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5000/api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nameRef = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) return setError("Passwords do not match");
    if (form.password.length < 6) return setError("Password must be at least 6 characters");
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
      nameRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-banner">
        <div className="auth-banner-logo">Spend<span>ly</span></div>
        <h2>Start your financial journey</h2>
        <p>Join thousands of users who track their spending smarter with Spendly.</p>
        <ul className="auth-banner-features">
          <li>Free to use, always</li>
          <li>Beautiful charts & insights</li>
          <li>Multiple categories</li>
          <li>Your data stays private</li>
        </ul>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-box">
          <h1>Create account</h1>
          <p>Get started with Spendly for free</p>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full name</label>
              <input
                ref={nameRef}
                name="name"
                type="text"
                placeholder="Muhammad Ali"
                value={form.name}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>Email address</label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Min. 6 chars"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm</label>
                <input
                  name="confirm"
                  type="password"
                  placeholder="Repeat password"
                  value={form.confirm}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="auth-switch">
            Already have an account?{" "}
            <a onClick={() => navigate("/login")}>Sign in</a>
          </div>
        </div>
      </div>
    </div>
  );
}
