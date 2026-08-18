const db = require("../config/db");

// ================================
// GET ALL CATEGORIES
// ================================

const getCategories = async (req, res) => {
    try {
        const [categories] = await db.query(
            `SELECT id, name, created_at
             FROM categories
             ORDER BY id DESC`
        );

        res.status(200).json({
            success: true,
            count: categories.length,
            categories
        });

    } catch (error) {
        console.error("Get Categories Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ================================
// GET CATEGORY BY ID
// ================================

const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const [categories] = await db.query(
            `SELECT id, name, created_at
             FROM categories
             WHERE id = ?`,
            [id]
        );

        if (categories.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.status(200).json({
            success: true,
            category: categories[0]
        });

    } catch (error) {
        console.error("Get Category Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ================================
// CREATE CATEGORY
// ================================

const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        // Validate input
        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });
        }

        const categoryName = name.trim();

        // Check duplicate
        const [existingCategory] = await db.query(
            `SELECT id
             FROM categories
             WHERE name = ?`,
            [categoryName]
        );

        if (existingCategory.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Category already exists"
            });
        }

        // Create category
        const [result] = await db.query(
            `INSERT INTO categories (name)
             VALUES (?)`,
            [categoryName]
        );

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category: {
                id: result.insertId,
                name: categoryName
            }
        });

    } catch (error) {
        console.error("Create Category Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ================================
// UPDATE CATEGORY
// ================================

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });
        }

        const categoryName = name.trim();

        // Check category exists
        const [category] = await db.query(
            `SELECT id
             FROM categories
             WHERE id = ?`,
            [id]
        );

        if (category.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        // Check duplicate name
        const [duplicate] = await db.query(
            `SELECT id
             FROM categories
             WHERE name = ? AND id != ?`,
            [categoryName, id]
        );

        if (duplicate.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Another category with this name already exists"
            });
        }

        // Update
        await db.query(
            `UPDATE categories
             SET name = ?
             WHERE id = ?`,
            [categoryName, id]
        );

        res.status(200).json({
            success: true,
            message: "Category updated successfully"
        });

    } catch (error) {
        console.error("Update Category Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ================================
// DELETE CATEGORY
// ================================

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Check category exists
        const [category] = await db.query(
            `SELECT id
             FROM categories
             WHERE id = ?`,
            [id]
        );

        if (category.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        // Delete category
        await db.query(
            `DELETE FROM categories
             WHERE id = ?`,
            [id]
        );

        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });

    } catch (error) {
        console.error("Delete Category Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};