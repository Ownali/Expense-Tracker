import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../config/api";

export const useTransactions = (filters = {}) => {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buildQuery = () => {
    const params = new URLSearchParams();
    if (filters.month) params.append("month", filters.month);
    if (filters.category) params.append("category", filters.category);
    if (filters.type) params.append("type", filters.type);
    return params.toString();
  };

  const fetchTransactions = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const query = buildQuery();
      const res = await fetch(`${API}/transactions${query ? "?" + query : ""}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setTransactions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [token, filters.month, filters.category, filters.type]);

  const addTransaction = async (transactionData) => {
    try {
      const res = await fetch(`${API}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(transactionData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setTransactions((prev) => [data, ...prev]);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const res = await fetch(`${API}/transactions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setTransactions((prev) => prev.filter((t) => t._id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  return { transactions, loading, error, addTransaction, deleteTransaction, refetch: fetchTransactions };
};
