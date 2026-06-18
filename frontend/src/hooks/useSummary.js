import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5000/api";

export const useSummary = (month = "") => {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    const fetchSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = month ? `?month=${month}` : "";
        const res = await fetch(`${API}/transactions/summary${query}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setSummary(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [token, month]);

  return { summary, loading, error };
};
