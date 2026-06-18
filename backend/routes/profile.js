const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getProfile, updateProfile, updatePassword } = require("../controllers/profileController");

router.use(auth);

router.get("/", getProfile);
router.put("/", updateProfile);
router.put("/password", updatePassword);

module.exports = router;
