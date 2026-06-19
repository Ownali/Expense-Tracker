const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getProfile, updateProfile, updatePassword, updateSecurityQuestion } = require("../controllers/profileController");

router.use(auth);

router.get("/", getProfile);
router.put("/", updateProfile);
router.put("/password", updatePassword);
router.put("/security-question", updateSecurityQuestion);

module.exports = router;
