const express = require("express");

const {
        createOrder,
        getMyOrders,
        getOrderById,
        getAllOrders,
        updateOrderStatus
} = require("../controllers/orderController.js");


const authMiddleware = require("../middleware/authMiddleware.js");
const adminMiddleware = require("../middleware/adminMiddleware.js");

const router = express.Router();


router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, getMyOrders);
router.get("/:id", authMiddleware, getOrderById);
router.get("/admin/all", authMiddleware, adminMiddleware, getAllOrders);
router.put(
        "/admin/:id/status",
        authMiddleware,
        adminMiddleware,
        updateOrderStatus
);


module.exports = router;
