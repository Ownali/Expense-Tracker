import { useState, useRef } from "react";

const CATEGORIES = {
  expense: ["Food", "Transport", "Shopping", "Utilities", "Health", "Education", "Entertainment", "Other"],
  income: ["Salary", "Freelance", "Business", "Investment", "Gift", "Other"],
};

export default function AddTransactionModal({ onClose, onAdd }) {
  const [type, setType] = useState("expense");
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const titleRef = useRef(null);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleTypeChange = (newType) => {
    setType(newType);
    setForm((prev) => ({ ...prev, category: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.category) return setError("Please select a category");
    if (parseFloat(form.amount) <= 0) return setError("Amount must be greater than 0");
    setLoading(true);
    const result = await onAdd({ ...form, type, amount: parseFloat(form.amount) });
    setLoading(false);
    if (!result.success) {
      setError(result.message);
      titleRef.current?.focus();
    } else {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>Add Transaction</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <div className="type-toggle">
          <button
            type="button"
            className={`type-btn ${type === "expense" ? "active expense" : ""}`}
            onClick={() => handleTypeChange("expense")}
          >
            ⬇️ Expense
          </button>
          <button
            type="button"
            className={`type-btn ${type === "income" ? "active income" : ""}`}
            onClick={() => handleTypeChange("income")}
          >
            ⬆️ Income
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              ref={titleRef}
              name="title"
              type="text"
              placeholder={type === "expense" ? "e.g. Grocery shopping" : "e.g. Monthly salary"}
              value={form.title}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Amount (PKR)</label>
              <input
                name="amount"
                type="number"
                placeholder="0"
                min="0"
                step="any"
                value={form.amount}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select name="category" value={form.category} onChange={handleChange} required>
              <option value="">Select category</option>
              {CATEGORIES[type].map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Note (optional)</label>
            <textarea
              name="note"
              placeholder="Any additional details..."
              value={form.note}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
            <button type="button" className="btn btn-ghost" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 2 }}>
              {loading ? "Adding..." : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
