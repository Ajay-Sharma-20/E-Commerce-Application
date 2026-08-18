const express = require("express");

const {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} = require("../controllers/categoryController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


// Public routes

router.get("/", getCategories);

router.get("/:id", getCategoryById);


// Admin routes

router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    createCategory
);

router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    updateCategory
);

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteCategory
);


module.exports = router;