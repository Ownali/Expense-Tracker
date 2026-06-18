import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSummary } from "../hooks/useSummary";
import { useTransactions } from "../hooks/useTransactions";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

const CATEGORY_COLORS = [
  "#7c6ff7","#10b981","#f43f5e","#f59e0b",
  "#3b82f6","#ec4899","#14b8a6","#8b5cf6"
];

const formatPKR = (val) =>
  "PKR " + Number(val).toLocaleString("en-PK", { maximumFractionDigits: 0 });

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "white", border: "1px solid #e8eaf0",
        borderRadius: 10, padding: "10px 14px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)", fontSize: 13
      }}>
        <p style={{ fontWeight: 600, marginBottom: 4, color: "#0f1117" }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontWeight: 500 }}>
            {p.name}: {formatPKR(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { user } = useAuth();
  const [month, setMonth] = useState("");
  const { summary, loading } = useSummary(month);
  const { transactions } = useTransactions({});

  const recentTransactions = transactions.slice(0, 5);

  const pieData = summary?.by_category
    ?.filter((c) => c.type === "expense")
    .map((c) => ({ name: c.category, value: c.total })) || [];

  const barData = summary?.by_month?.map((m) => ({
    month: m.month,
    Income: m.income,
    Expense: m.expense,
  })).reverse() || [];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div>
      <div className="page-header">
        <h1>{greeting()}, {user?.name?.split(" ")[0]} 👋</h1>
        <p>Here's a complete overview of your finances</p>
      </div>

      {/* Month Filter */}
      <div style={{ marginBottom: "1.35rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          style={{
            padding: "0.5rem 0.9rem",
            border: "1.5px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            fontFamily: "var(--font)",
            fontSize: "0.85rem",
            fontWeight: 500,
            outline: "none",
            cursor: "pointer",
            background: "var(--surface)",
            color: "var(--text-primary)",
          }}
        />
        {month && (
          <button className="clear-filter-btn" onClick={() => setMonth("")}>Clear ✕</button>
        )}
      </div>

      {loading ? (
        <div className="loading"><div className="spinner"></div>Loading summary...</div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="stats-grid">
            <div className="stat-card income-card">
              <div className="stat-icon income">💰</div>
              <div>
                <div className="stat-label">Total Income</div>
                <div className="stat-value income">{formatPKR(summary?.total_income || 0)}</div>
              </div>
            </div>
            <div className="stat-card expense-card">
              <div className="stat-icon expense">💸</div>
              <div>
                <div className="stat-label">Total Expenses</div>
                <div className="stat-value expense">{formatPKR(summary?.total_expense || 0)}</div>
              </div>
            </div>
            <div className="stat-card balance-card">
              <div className="stat-icon balance">📈</div>
              <div>
                <div className="stat-label">Net Balance</div>
                <div className="stat-value balance">{formatPKR(summary?.balance || 0)}</div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="charts-grid">
            <div className="card">
              <div className="card-header">
                <span className="card-title">Income vs Expenses</span>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 500 }}>Last 6 months</span>
              </div>
              {barData.length === 0 ? (
                <div className="empty-state"><span className="empty-icon">📊</span><p>No data yet</p></div>
              ) : (
                <ResponsiveContainer width="100%" height={210}>
                  <BarChart data={barData} barSize={16} barGap={4}>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#a0aec0" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#a0aec0" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="Income" fill="#10b981" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="Expense" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="card">
              <div className="card-header">
                <span className="card-title">Expenses by Category</span>
              </div>
              {pieData.length === 0 ? (
                <div className="empty-state"><span className="empty-icon">🥧</span><p>No expense data yet</p></div>
              ) : (
                <ResponsiveContainer width="100%" height={210}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={58} outerRadius={85} paddingAngle={3} dataKey="value">
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => formatPKR(v)} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Recent Transactions</span>
            </div>
            {recentTransactions.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🧾</span>
                <p>No transactions yet.<br />Add your first one to get started!</p>
              </div>
            ) : (
              <div className="transaction-list">
                {recentTransactions.map((t) => (
                  <div className="transaction-item" key={t._id}>
                    <div className={`t-icon ${t.type}`}>
                      {t.type === "income" ? "⬆️" : "⬇️"}
                    </div>
                    <div className="t-info">
                      <div className="t-title">{t.title}</div>
                      <div className="t-meta">
                        <span className="cat-badge">{t.category}</span>
                        <span>·</span>
                        <span>{t.date}</span>
                      </div>
                    </div>
                    <div className={`t-amount ${t.type}`}>
                      {t.type === "income" ? "+" : "-"}{formatPKR(t.amount)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
