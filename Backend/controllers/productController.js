const db = require("../config/db");


// ========================================
// GET ALL PRODUCTS
// ========================================

const getProducts = async (req, res) => {
    try {
        const {
            search,
            category,
            sort = "newest",
            page = 1,
            limit = 10
        } = req.query;

        const pageNumber = Math.max(parseInt(page) || 1, 1);
        const limitNumber = Math.min(
            Math.max(parseInt(limit) || 10, 1),
            100
        );

        const offset = (pageNumber - 1) * limitNumber;

        let conditions = ["p.is_active = TRUE"];
        let values = [];

        // Search
        if (search) {
            conditions.push(
                "(p.name LIKE ? OR p.description LIKE ?)"
            );

            const searchValue = `%${search}%`;

            values.push(searchValue, searchValue);
        }

        // Category filter
        if (category) {
            conditions.push("p.category_id = ?");
            values.push(category);
        }

        const whereClause = conditions.join(" AND ");

        // Sorting
        let orderBy = "p.created_at DESC";

        if (sort === "price_asc") {
            orderBy = "p.price ASC";
        } else if (sort === "price_desc") {
            orderBy = "p.price DESC";
        } else if (sort === "name_asc") {
            orderBy = "p.name ASC";
        } else if (sort === "name_desc") {
            orderBy = "p.name DESC";
        }

        // Get products
        const [products] = await db.query(
            `SELECT
                p.id,
                p.name,
                p.description,
                p.price,
                p.stock,
                p.image,
                p.category_id,
                c.name AS category_name,
                p.created_at,
                p.updated_at
             FROM products p
             INNER JOIN categories c
                ON p.category_id = c.id
             WHERE ${whereClause}
             ORDER BY ${orderBy}
             LIMIT ? OFFSET ?`,
            [...values, limitNumber, offset]
        );

        // Get total count
        const [countResult] = await db.query(
            `SELECT COUNT(*) AS total
             FROM products p
             WHERE ${whereClause}`,
            values
        );

        const total = countResult[0].total;

        res.status(200).json({
            success: true,
            products,
            pagination: {
                page: pageNumber,
                limit: limitNumber,
                total,
                totalPages: Math.ceil(total / limitNumber)
            }
        });

    } catch (error) {
        console.error("Get Products Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ========================================
// GET PRODUCT BY ID
// ========================================

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const [products] = await db.query(
            `SELECT
                p.id,
                p.name,
                p.description,
                p.price,
                p.stock,
                p.image,
                p.category_id,
                c.name AS category_name,
                p.created_at,
                p.updated_at
             FROM products p
             INNER JOIN categories c
                ON p.category_id = c.id
             WHERE p.id = ?
             AND p.is_active = TRUE`,
            [id]
        );

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            product: products[0]
        });

    } catch (error) {
        console.error("Get Product Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ========================================
// CREATE PRODUCT
// ========================================

const createProduct = async (req, res) => {
    try {
        const {
            category_id,
            name,
            description,
            price,
            stock,
            image
        } = req.body;

        // Validation
        if (
            !category_id ||
            !name ||
            price === undefined ||
            stock === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Category, name, price and stock are required"
            });
        }

        if (Number(price) < 0) {
            return res.status(400).json({
                success: false,
                message: "Price cannot be negative"
            });
        }

        if (!Number.isInteger(Number(stock)) || Number(stock) < 0) {
            return res.status(400).json({
                success: false,
                message: "Stock must be a non-negative integer"
            });
        }

        // Check category
        const [category] = await db.query(
            `SELECT id
             FROM categories
             WHERE id = ?`,
            [category_id]
        );

        if (category.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        // Create product
        const [result] = await db.query(
            `INSERT INTO products
                (category_id, name, description, price, stock, image)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                category_id,
                name.trim(),
                description || null,
                Number(price),
                Number(stock),
                image || null
            ]
        );

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            productId: result.insertId
        });

    } catch (error) {
        console.error("Create Product Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ========================================
// UPDATE PRODUCT
// ========================================

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            category_id,
            name,
            description,
            price,
            stock,
            image,
            is_active
        } = req.body;

        // Check product
        const [existingProduct] = await db.query(
            `SELECT id
             FROM products
             WHERE id = ?`,
            [id]
        );

        if (existingProduct.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Validate category
        if (category_id !== undefined) {
            const [category] = await db.query(
                `SELECT id
                 FROM categories
                 WHERE id = ?`,
                [category_id]
            );

            if (category.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Category not found"
                });
            }
        }

        if (price !== undefined && Number(price) < 0) {
            return res.status(400).json({
                success: false,
                message: "Price cannot be negative"
            });
        }

        if (
            stock !== undefined &&
            (!Number.isInteger(Number(stock)) ||
                Number(stock) < 0)
        ) {
            return res.status(400).json({
                success: false,
                message: "Stock must be a non-negative integer"
            });
        }

        // Build dynamic update
        const fields = [];
        const values = [];

        if (category_id !== undefined) {
            fields.push("category_id = ?");
            values.push(category_id);
        }

        if (name !== undefined) {
            fields.push("name = ?");
            values.push(name.trim());
        }

        if (description !== undefined) {
            fields.push("description = ?");
            values.push(description);
        }

        if (price !== undefined) {
            fields.push("price = ?");
            values.push(Number(price));
        }

        if (stock !== undefined) {
            fields.push("stock = ?");
            values.push(Number(stock));
        }

        if (image !== undefined) {
            fields.push("image = ?");
            values.push(image);
        }

        if (is_active !== undefined) {
            fields.push("is_active = ?");
            values.push(Boolean(is_active));
        }

        if (fields.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No fields provided for update"
            });
        }

        values.push(id);

        await db.query(
            `UPDATE products
             SET ${fields.join(", ")}
             WHERE id = ?`,
            values
        );

        res.status(200).json({
            success: true,
            message: "Product updated successfully"
        });

    } catch (error) {
        console.error("Update Product Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ========================================
// DELETE PRODUCT
// ========================================

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const [product] = await db.query(
            `SELECT id
             FROM products
             WHERE id = ?`,
            [id]
        );

        if (product.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Soft delete
        await db.query(
            `UPDATE products
             SET is_active = FALSE
             WHERE id = ?`,
            [id]
        );

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        console.error("Delete Product Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};