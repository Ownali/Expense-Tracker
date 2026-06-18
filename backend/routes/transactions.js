const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
} = require("../controllers/transactionController");

router.use(auth);

router.get("/summary", getSummary);
router.get("/", getTransactions);
router.post("/", addTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;
