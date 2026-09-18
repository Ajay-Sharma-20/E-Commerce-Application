const express = require("express");

const {
        createOrder,
        getMyOrders,
        getOrderById,
        getAllOrders,
        updateOrderStatus,
        getAdminOrderById
} = require("../controllers/orderController.js");


const authMiddleware = require("../middleware/authMiddleware.js");
const adminMiddleware = require("../middleware/adminMiddleware.js");

const router = express.Router();


router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, getMyOrders);

router.get("/admin/all", authMiddleware, adminMiddleware, getAllOrders);

router.get(
    "/admin/:id",
    authMiddleware,
    adminMiddleware,
    getAdminOrderById
);
router.get("/:id", authMiddleware, getOrderById);

router.put(
        "/admin/:id/status",
        authMiddleware,
        adminMiddleware,
        updateOrderStatus
);




module.exports = router;
