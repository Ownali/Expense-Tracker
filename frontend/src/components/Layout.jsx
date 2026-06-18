import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">Spend<span>ly</span></div>

        <p className="sidebar-section-label">Menu</p>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
            <span className="nav-icon">📊</span> Dashboard
          </NavLink>
          <NavLink to="/transactions" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
            <span className="nav-icon">💳</span> Transactions
          </NavLink>
        </nav>

        <p className="sidebar-section-label" style={{ marginTop: "1rem" }}>Account</p>
        <nav className="sidebar-nav">
          <NavLink to="/profile" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
            <span className="nav-icon">👤</span> Profile
          </NavLink>
        </nav>

        <div className="sidebar-user">
          <div className="user-info">
            <div className="user-avatar">{initials}</div>
            <div>
              <div className="user-name">{user?.name}</div>
              <div className="user-email">{user?.email}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
