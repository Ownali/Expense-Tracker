/**
 * Centralized API base URL.
 * In production (Vercel), set the VITE_API_URL environment variable to:
 *   https://expense-tracker-production-9f9b.up.railway.app/api
 *
 * For local development, create a `.env` file in the frontend root:
 *   VITE_API_URL=http://localhost:5000/api
 */
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default API;
