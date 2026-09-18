const db = require("../config/db");

// ========================================
// GET ALL USERS - ADMIN
// ========================================

const getAllUsers = async (req, res) => {
    try {
        const {
            search,
            role = "all",
            page = 1,
            limit = 20
        } = req.query;

        const pageNumber = Math.max(
            parseInt(page) || 1,
            1
        );

        const limitNumber = Math.min(
            Math.max(parseInt(limit) || 20, 1),
            100
        );

        const offset =
            (pageNumber - 1) * limitNumber;

        const conditions = [];
        const values = [];

        // Search
        if (search && search.trim()) {
            conditions.push(
                "(u.name LIKE ? OR u.email LIKE ?)"
            );

            const searchValue = `%${search.trim()}%`;

            values.push(
                searchValue,
                searchValue
            );
        }

        // Role filter
        if (role === "customer" || role === "admin") {
            conditions.push("u.role = ?");
            values.push(role);
        }

        const whereClause =
            conditions.length > 0
                ? `WHERE ${conditions.join(" AND ")}`
                : "";

        // Get users
        const [users] = await db.query(
            `SELECT
                u.id,
                u.name,
                u.email,
                u.role,
                u.created_at
             FROM users u
             ${whereClause}
             ORDER BY u.created_at DESC
             LIMIT ? OFFSET ?`,
            [...values, limitNumber, offset]
        );

        // Total count
        const [countResult] = await db.query(
            `SELECT COUNT(*) AS total
             FROM users u
             ${whereClause}`,
            values
        );

        const total =
            Number(countResult[0].total) || 0;

        res.status(200).json({
            success: true,
            users,
            pagination: {
                page: pageNumber,
                limit: limitNumber,
                total,
                totalPages: Math.ceil(
                    total / limitNumber
                )
            }
        });

    } catch (error) {
        console.error(
            "Get All Users Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ========================================
// UPDATE USER ROLE - ADMIN
// ========================================

const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        // Validate role
        if (
            role !== "customer" &&
            role !== "admin"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Role must be customer or admin"
            });
        }

        // Prevent admin from changing their own role
        if (Number(id) === Number(req.user.id)) {
            return res.status(400).json({
                success: false,
                message:
                    "You cannot change your own role"
            });
        }

        // Check user
        const [users] = await db.query(
            `SELECT id, name, email, role
             FROM users
             WHERE id = ?`,
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        await db.query(
            `UPDATE users
             SET role = ?
             WHERE id = ?`,
            [role, id]
        );

        res.status(200).json({
            success: true,
            message:
                "User role updated successfully"
        });

    } catch (error) {
        console.error(
            "Update User Role Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    getAllUsers,
    updateUserRole
};