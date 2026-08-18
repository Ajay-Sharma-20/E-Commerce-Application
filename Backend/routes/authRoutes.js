const express = require('express');

const {registerUser, loginUser, registerAdmin} = require("../controllers/authController.js");


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin-register", registerAdmin);

module.exports = router;