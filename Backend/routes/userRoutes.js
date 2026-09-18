const express = require("express");
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const { getAllUsers, updateUserRole } = require("../controllers/userController");

const router = express.Router();

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const [users] = await db.query(
      `
      SELECT id, name, email, role, created_at
      FROM users
      WHERE id = ?
      `,
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: users[0],
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


// ========================================
// ADMIN USER ROUTES
// ========================================

router.get(
    "/admin",
    authMiddleware,
    adminMiddleware,
    getAllUsers
);

router.put(
    "/admin/:id/role",
    authMiddleware,
    adminMiddleware,
    updateUserRole
);

module.exports = router;