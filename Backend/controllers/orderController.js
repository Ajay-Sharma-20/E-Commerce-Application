const db = require("../config/db.js");


const createOrder = async (req, res) => {
        const connection = await db.getConnection();

        try {

                const userId = req.user.id;
                const { shipping_address } = req.body;

                if (!shipping_address || !shipping_address.trim()) {
                        connection.release();

                        return res.status(400).json({
                                success: false,
                                message: "Shipping address is required"
                        });
                }

                await connection.beginTransaction();


                const [cartRows] = await connection.query(
                        `SELECT id
                        FROM cart
                        WHERE user_id = ?
                        FOR UPDATE`,
                        [userId]
                );

                if (cartRows.length === 0) {
                        await connection.rollback();
                        connection.release();

                        return res.status(400).json({
                                success: false,
                                message: "Cart is Empty"
                        });
                }

                const cartId = cartRows[0].id;

                const [cartItems] = await connection.query(
                        `SELECT
                        ci.product_id,
                        ci.quantity,
                        p.name,
                        p.price,
                        p.stock
                        FROM cart_items ci
                        INNER JOIN products p
                        ON ci.product_id = p.id
                        WHERE ci.cart_id = ?
                        AND p.is_active = TRUE
                        FOR UPDATE`,
                        [cartId]
                );

                if (cartItems.length === 0) {
                        await connection.rollback();
                        connection.release();

                        return res.status(400).json({
                                success: false,
                                message: "Cart is Empty"
                        });
                }

                for (const item of cartItems) {
                        if (item.quantity > item.stock) {
                                await connection.rollback();
                                connection.release();

                                return res.status(400).json({
                                        success: false,
                                        message: `Insufficient stock for ${item.name}`
                                });
                        }
                }

                let totalAmount = 0;

                for (const item of cartItems) {
                        totalAmount += Number(item.price) * Number(item.quantity);
                };





                const [orderResult] = await connection.query(
                        `INSERT INTO orders
                           (user_id, total_amount, status, shipping_address)
                           VALUES(?, ?, 'pending', ?)`,
                        [
                                userId,
                                totalAmount,
                                shipping_address.trim()
                        ]
                );

                const orderId = orderResult.insertId;


                for (const item of cartItems) {
                        await connection.query(
                                `INSERT INTO order_items
                                (order_id, product_id, quantity, price)
                                VALUES (?, ?, ?, ?)`,
                                [
                                        orderId,
                                        item.product_id,
                                        item.quantity,
                                        item.price
                                ]
                        );
                }


                for (const item of cartItems) {
                        await connection.query(
                                `UPDATE products
                                SET stock = stock - ?
                                WHERE id = ?
                                AND stock >= ?`,
                                [
                                        item.quantity,
                                        item.product_id,
                                        item.quantity
                                ]
                        );
                }


                await connection.query(
                        `DELETE FROM cart_items
                        WHERE cart_id = ?`,
                        [cartId]
                );

                await connection.commit();

                connection.release();

                res.status(201).json({
                        success: true,
                        message: "Order Placed successfully",
                        order: {
                                id: orderId,
                                total_amount: totalAmount,
                                status: "pending"
                        }
                });
        } catch (error) {
                await connection.rollback();

                connection.release();

                console.log("Create Order Error: ", error);

                res.status(500).json({
                        success: false,
                        message: "Failed to create order"
                });
        }
}




// ========================================
// GET MY ORDERS
// ========================================

const getMyOrders = async (req, res) => {
        try {
                const userId = req.user.id;

                const [orders] = await db.query(
                        `SELECT
                id,
                total_amount,
                status,
                shipping_address,
                created_at
             FROM orders
             WHERE user_id = ?
             ORDER BY created_at DESC`,
                        [userId]
                );

                res.status(200).json({
                        success: true,
                        count: orders.length,
                        orders
                });

        } catch (error) {
                console.error("Get My Orders Error:", error);

                res.status(500).json({
                        success: false,
                        message: "Server error"
                });
        }
};




// ========================================
// GET SINGLE ORDER
// ========================================

const getOrderById = async (req, res) => {
        try {
                const userId = req.user.id;
                const { id } = req.params;

                // Get order
                const [orders] = await db.query(
                        `SELECT
                id,
                total_amount,
                status,
                shipping_address,
                created_at
             FROM orders
             WHERE id = ?
             AND user_id = ?`,
                        [id, userId]
                );

                if (orders.length === 0) {
                        return res.status(404).json({
                                success: false,
                                message: "Order not found"
                        });
                }

                // Get order items
                const [items] = await db.query(
                        `SELECT
                oi.id,
                oi.product_id,
                oi.quantity,
                oi.price,
                p.name,
                p.image
             FROM order_items oi
             INNER JOIN products p
                ON oi.product_id = p.id
             WHERE oi.order_id = ?
             ORDER BY oi.id`,
                        [id]
                );

                res.status(200).json({
                        success: true,
                        order: {
                                ...orders[0],
                                items
                        }
                });

        } catch (error) {
                console.error("Get Order Error:", error);

                res.status(500).json({
                        success: false,
                        message: "Server error"
                });
        }
};



// ========================================
// ADMIN - GET ALL ORDERS
// ========================================

const getAllOrders = async (req, res) => {
        try {

                const [orders] = await db.query(
                        `SELECT
                o.id,
                o.user_id,
                u.name AS customer_name,
                u.email AS customer_email,
                o.total_amount,
                o.status,
                o.shipping_address,
                o.created_at
             FROM orders o
             INNER JOIN users u
                ON o.user_id = u.id
             ORDER BY o.created_at DESC`
                );

                res.status(200).json({
                        success: true,
                        count: orders.length,
                        orders
                });

        } catch (error) {
                console.error("Get All Orders Error:", error);

                res.status(500).json({
                        success: false,
                        message: "Server error"
                });
        }
};



// ========================================
// GET ORDER BY ID - ADMIN
// ========================================

const getAdminOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        // Get order + customer
        const [orders] = await db.query(
            `SELECT
                o.id,
                o.user_id,
                o.total_amount,
                o.status,
                o.shipping_address,
                o.created_at,
                u.name AS user_name,
                u.email AS user_email
             FROM orders o
             INNER JOIN users u
                ON o.user_id = u.id
             WHERE o.id = ?`,
            [id]
        );

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Get order items
        const [items] = await db.query(
            `SELECT
                oi.id,
                oi.product_id,
                oi.quantity,
                oi.price,
                p.name AS product_name,
                p.image
             FROM order_items oi
             INNER JOIN products p
                ON oi.product_id = p.id
             WHERE oi.order_id = ?
             ORDER BY oi.id ASC`,
            [id]
        );

        res.status(200).json({
            success: true,
            order: orders[0],
            items
        });

    } catch (error) {
        console.error(
            "Get Admin Order Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};



// ========================================
// ADMIN - UPDATE ORDER STATUS
// ========================================

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "pending",
            "processing",
            "shipped",
            "delivered",
            "cancelled"
        ];

        // Validate status
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status"
            });
        }

        // Find order
        const [orders] = await db.query(
            `
            SELECT id, status
            FROM orders
            WHERE id = ?
            `,
            [id]
        );

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const order = orders[0];

        // Allowed status transitions
        const allowedTransitions = {
            pending: ["processing", "cancelled"],
            processing: ["shipped", "cancelled"],
            shipped: ["delivered"],
            delivered: [],
            cancelled: []
        };

        // Validate transition
        if (!allowedTransitions[order.status].includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Cannot change order status from ${order.status} to ${status}`
            });
        }

        // Update order status
        const [result] = await db.query(
            `
            UPDATE orders
            SET status = ?
            WHERE id = ?
            `,
            [status, id]
        );

        if (result.affectedRows !== 1) {
            return res.status(400).json({
                success: false,
                message: "Order status update failed"
            });
        }

        res.status(200).json({
            success: true,
            message: "Order status updated successfully"
        });

    } catch (error) {
        console.error("Update Order Status Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};



module.exports = {
        createOrder,
        getMyOrders,
        getOrderById,
        getAllOrders,
        updateOrderStatus,
        getAdminOrderById
};