import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5000/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const emailRef = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
      emailRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-banner">
        <div className="auth-banner-logo">Spend<span>ly</span></div>
        <h2>Take control of your finances</h2>
        <p>Track income and expenses, visualize spending patterns, and reach your financial goals.</p>
        <ul className="auth-banner-features">
          <li>Track income & expenses</li>
          <li>Visual spending dashboard</li>
          <li>Filter by category & month</li>
          <li>Secure & private</li>
        </ul>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-box">
          <h1>Welcome back</h1>
          <p>Sign in to your Spendly account</p>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email address</label>
              <input
                ref={emailRef}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="auth-switch">
            Don't have an account?{" "}
            <a onClick={() => navigate("/register")}>Create one</a>
          </div>
        </div>
      </div>
    </div>
  );
}
