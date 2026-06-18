import { useState } from "react";
import { useTransactions } from "../hooks/useTransactions";
import AddTransactionModal from "../components/AddTransactionModal";

const CATEGORIES = [
  "Food","Transport","Shopping","Utilities","Health",
  "Education","Entertainment","Salary","Freelance","Business","Investment","Gift","Other",
];

const formatPKR = (val) =>
  "PKR " + Number(val).toLocaleString("en-PK", { maximumFractionDigits: 0 });

export default function Transactions() {
  const [filters, setFilters] = useState({ month: "", category: "", type: "" });
  const [showModal, setShowModal] = useState(false);
  const { transactions, loading, error, addTransaction, deleteTransaction } = useTransactions(filters);

  const handleFilterChange = (e) =>
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const clearFilters = () => setFilters({ month: "", category: "", type: "" });
  const hasFilters = filters.month || filters.category || filters.type;

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1>Transactions</h1>
          <p>Manage all your income and expenses in one place</p>
        </div>
        <button
          className="btn btn-primary"
          style={{ width: "auto", paddingLeft: "1.25rem", paddingRight: "1.25rem" }}
          onClick={() => setShowModal(true)}
        >
          + Add Transaction
        </button>
      </div>

      <div className="filters-bar">
        <input type="month" name="month" value={filters.month} onChange={handleFilterChange} />
        <select name="type" value={filters.type} onChange={handleFilterChange}>
          <option value="">All Types</option>
          <option value="income">⬆️ Income</option>
          <option value="expense">⬇️ Expense</option>
        </select>
        <select name="category" value={filters.category} onChange={handleFilterChange}>
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {hasFilters && (
          <button className="clear-filter-btn" onClick={clearFilters}>Clear filters ✕</button>
        )}
      </div>

      {!loading && (
        <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "0.85rem", fontWeight: 500 }}>
          {transactions.length} transaction{transactions.length !== 1 ? "s" : ""} found
        </p>
      )}

      {error && <div className="error-msg">{error}</div>}

      {loading ? (
        <div className="loading"><div className="spinner"></div>Loading transactions...</div>
      ) : transactions.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🧾</span>
          <p>{hasFilters ? "No transactions match your filters." : "No transactions yet. Add your first one!"}</p>
        </div>
      ) : (
        <div className="transaction-list">
          {transactions.map((t) => (
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
                  {t.note && <><span>·</span><span style={{ fontStyle: "italic" }}>{t.note}</span></>}
                </div>
              </div>
              <div className={`t-amount ${t.type}`}>
                {t.type === "income" ? "+" : "-"}{formatPKR(t.amount)}
              </div>
              <button
                className="btn btn-danger"
                onClick={async () => {
                  if (window.confirm("Delete this transaction?")) await deleteTransaction(t._id);
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <button className="fab" onClick={() => setShowModal(true)} title="Add Transaction">+</button>

      {showModal && (
        <AddTransactionModal onClose={() => setShowModal(false)} onAdd={addTransaction} />
      )}
    </div>
  );
}
