const express = require('express');
const rateLimit = require('express-rate-limit');

const {
        registerUser, 
        loginUser, 
        registerAdmin
} = require("../controllers/authController.js");


const router = express.Router();


const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: {
        success: false,
        message: "Too many authentication attempts. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
});



router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.post("/admin-register", registerAdmin);

module.exports = router;