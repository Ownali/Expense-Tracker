# Spendly – Expense Tracker

A full-stack expense tracking web app built with React + Node.js/Express + MongoDb.

## Tech Stack

**Frontend:** React 18, Vite, React Router v6, Recharts, Context API, Custom Hooks  
**Backend:** Node.js, Express, MongoDb, JWT, bcryptjs  
**Styling:** Plain CSS (single file)

---

## Project Structure

```
expense-tracker/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── transactionController.js
│   ├── db/
│   │   └── database.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── transactions.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Layout.jsx
    │   │   └── AddTransactionModal.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── hooks/
    │   │   ├── useTransactions.js
    │   │   └── useSummary.js
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   └── Transactions.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    └── package.json
```

---

## Setup & Running

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on: http://localhost:5000

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:5173

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login and get JWT token |

### Transactions (Protected — requires Bearer token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/transactions | Get all transactions (supports ?month=&category=&type=) |
| POST | /api/transactions | Add a new transaction |
| DELETE | /api/transactions/:id | Delete a transaction |
| GET | /api/transactions/summary | Get income/expense summary + charts data |

---

## Features

- JWT-based authentication (register, login, logout)
- Add income and expense transactions with categories
- Filter transactions by month, type, and category
- Dashboard with bar chart (income vs expenses) and pie chart (by category)
- Recent transactions on dashboard
- Persistent login using localStorage
- Protected routes on frontend and backend
- Clean responsive UI
