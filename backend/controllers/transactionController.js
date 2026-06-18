const Transaction = require("../models/Transaction");

const getTransactions = async (req, res) => {
  try {
    const { month, category, type } = req.query;
    const filter = { userId: req.user.id };

    if (month) {
      // match YYYY-MM in the date string
      filter.date = { $regex: `^${month}` };
    }
    if (category) filter.category = category;
    if (type) filter.type = type;

    const transactions = await Transaction.find(filter).sort({ date: -1, createdAt: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const addTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, date, note } = req.body;
    if (!title || !amount || !type || !category || !date)
      return res.status(400).json({ message: "All required fields must be filled" });

    const transaction = await Transaction.create({
      userId: req.user.id,
      title,
      amount: parseFloat(amount),
      type,
      category,
      date,
      note: note || "",
    });

    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, userId: req.user.id });
    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });

    const { title, amount, type, category, date, note } = req.body;
    if (title) transaction.title = title;
    if (amount) transaction.amount = parseFloat(amount);
    if (type) transaction.type = type;
    if (category) transaction.category = category;
    if (date) transaction.date = date;
    if (note !== undefined) transaction.note = note;

    await transaction.save();
    res.status(200).json(transaction);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });

    res.status(200).json({ message: "Transaction deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getSummary = async (req, res) => {
  try {
    const { month } = req.query;
    const userId = req.user.id;

    const matchStage = { userId: new (require("mongoose").Types.ObjectId)(userId) };
    if (month) matchStage.date = { $regex: `^${month}` };

    // Totals
    const totals = await Transaction.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    let total_income = 0, total_expense = 0;
    totals.forEach((t) => {
      if (t._id === "income") total_income = t.total;
      if (t._id === "expense") total_expense = t.total;
    });

    // By category
    const by_category = await Transaction.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { category: "$category", type: "$type" },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { total: -1 } },
      {
        $project: {
          _id: 0,
          category: "$_id.category",
          type: "$_id.type",
          total: 1,
        },
      },
    ]);

    // By month (last 6 months)
    const allMatch = { userId: new (require("mongoose").Types.ObjectId)(userId) };
    const by_month = await Transaction.aggregate([
      { $match: allMatch },
      {
        $group: {
          _id: { $substr: ["$date", 0, 7] },
          income: {
            $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
          },
          expense: {
            $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] },
          },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 6 },
      { $project: { _id: 0, month: "$_id", income: 1, expense: 1 } },
    ]);

    res.status(200).json({
      total_income,
      total_expense,
      balance: total_income - total_expense,
      by_category,
      by_month,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { getTransactions, addTransaction, updateTransaction, deleteTransaction, getSummary };
