const express = require("express");

const {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart
} = require("../controllers/cartController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getCart);

router.post("/", authMiddleware, addToCart);

router.put("/:itemId", authMiddleware, updateCartItem);

router.delete("/:itemId", authMiddleware, removeCartItem);

router.delete("/", authMiddleware, clearCart);

module.exports = router;