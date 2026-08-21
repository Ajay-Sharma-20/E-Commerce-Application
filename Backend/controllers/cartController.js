const db = require("../config/db");


// ========================================
// GET USER CART
// ========================================

const getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find user's cart
        const [cartRows] = await db.query(
            `SELECT id
             FROM cart
             WHERE user_id = ?`,
            [userId]
        );

        // User has no cart yet
        if (cartRows.length === 0) {
            return res.status(200).json({
                success: true,
                cart: {
                    id: null,
                    items: [],
                    total: 0
                }
            });
        }

        const cartId = cartRows[0].id;

        // Get cart items
        const [items] = await db.query(
            `SELECT
                ci.id AS item_id,
                ci.product_id,
                ci.quantity,
                p.name,
                p.price,
                p.image,
                p.stock,
                (p.price * ci.quantity) AS subtotal
             FROM cart_items ci
             INNER JOIN products p
                ON ci.product_id = p.id
             WHERE ci.cart_id = ?
             AND p.is_active = TRUE
             ORDER BY ci.id DESC`,
            [cartId]
        );

        // Calculate total
        const total = items.reduce(
            (sum, item) => sum + Number(item.subtotal),
            0
        );

        res.status(200).json({
            success: true,
            cart: {
                id: cartId,
                items,
                total
            }
        });

    } catch (error) {
        console.error("Get Cart Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ========================================
// ADD TO CART
// ========================================

const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            product_id,
            quantity = 1
        } = req.body;

        // Validate product ID
        if (!product_id) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }

        const requestedQuantity = Number(quantity);

        if (
            !Number.isInteger(requestedQuantity) ||
            requestedQuantity <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be a positive integer"
            });
        }

        // Find product
        const [products] = await db.query(
            `SELECT id, name, price, stock
             FROM products
             WHERE id = ?
             AND is_active = TRUE`,
            [product_id]
        );

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const product = products[0];

        // Check stock
        if (product.stock < requestedQuantity) {
            return res.status(400).json({
                success: false,
                message: `Only ${product.stock} items available`
            });
        }

        // Find user's cart
        let cartId;

        const [cartRows] = await db.query(
            `SELECT id
             FROM cart
             WHERE user_id = ?`,
            [userId]
        );

        if (cartRows.length === 0) {

            const [cartResult] = await db.query(
                `INSERT INTO cart (user_id)
                 VALUES (?)`,
                [userId]
            );

            cartId = cartResult.insertId;

        } else {
            cartId = cartRows[0].id;
        }

        // Check if product already exists in cart
        const [existingItems] = await db.query(
            `SELECT id, quantity
             FROM cart_items
             WHERE cart_id = ?
             AND product_id = ?`,
            [cartId, product_id]
        );

        if (existingItems.length > 0) {

            const item = existingItems[0];

            const newQuantity =
                item.quantity + requestedQuantity;

            if (newQuantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: `Only ${product.stock} items available`
                });
            }

            await db.query(
                `UPDATE cart_items
                 SET quantity = ?
                 WHERE id = ?`,
                [newQuantity, item.id]
            );

        } else {

            await db.query(
                `INSERT INTO cart_items
                    (cart_id, product_id, quantity)
                 VALUES (?, ?, ?)`,
                [cartId, product_id, requestedQuantity]
            );
        }

        res.status(200).json({
            success: true,
            message: "Product added to cart"
        });

    } catch (error) {
        console.error("Add Cart Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

//Cart Update
const updateCartItem = async (req, res) => {
        try {
                const userId = req.user.id;
                const {itemId} = req.params;
                const {quantity} = req.body;

                const newQuantity = Number(quantity);

                if(!Number.isInteger(newQuantity) || newQuantity <= 0) {
                        return res.status(400).json({
                                success: false,
                                message: "Quantity must be a positive integer"
                        });
                }

                const [cartRows] = await db.query(
                        `SELECT id
                        FROM cart
                        WHERE user_id = ?`,
                        [userId]
                );

                if(cartRows.length === 0) {
                        return res.status(404).json({
                                success: false,
                                message: "Cart not found"
                        });
                }

                const cartId = cartRows[0].id;

                const [items] = await db.query(
                     `SELECT
                         ci.id,
                         ci.product_id,
                         p.stock
                      FROM cart_items ci
                      INNER JOIN products p
                         ON ci.product_id = p.id
                      WHERE ci.id = ?
                      AND ci.cart_id = ?
                      AND p.is_active = TRUE`,
                      [itemId, cartId]
                );

                if(items.length === 0){
                        return res.status(404).json({
                                success: false,
                                message: "Cart item not found"
                        });
                }

                const item = items[0];

                if(newQuantity > item.stock) {
                        return res.status(400).json({
                                success: false,
                                message: `Only ${item.stock} items available`
                        });
                }


                await db.query(
                        `UPDATE cart_items
                        SET quantity = ?
                        WHERE id = ?
                        AND cart_id = ?`,
                        [newQuantity, itemId, cartId]
                );

                res.status(200).json({
                        success: true,
                        message: "Cart quantity update successfully"
                });
        } catch (error) {
                console.error("Update cart Error: ", error);

                res.status(500).json({
                        success: false,
                        message: "Server error"
                });
        }
}


//Cart Remove
const removeCartItem = async (req, res) => {
        try {
                const userId = req.user.id;
                const {itemId} = req.params;

                const [cartRows] = await db.query(
                        `SELECT id
                        FROM cart
                        WHERE user_id = ?`,
                        [userId]
                );

                if(cartRows.length === 0){
                        return res.status(404).json({
                                success: false,
                                message: "Cart not found"
                        });
                }

                const cartId = cartRows[0].id;

                const [result] = await db.query(
                        `DELETE FROM cart_items
                        WHERE id = ?
                        AND cart_id = ?`,
                        [itemId, cartId]
                );

                if(result.affectedRows === 0){
                        return res.status(404).json({
                                success: false,
                                message: "Cart item not found"
                        });
                }

                res.status(200).json({
                        success: true,
                        message: "Item remove from cart"
                });

        } catch (error) {
                console.error("Remove cart Item Error: ", error);

                res.status(500).json({
                        success: false,
                        message: "Server error"
                });
        }
};


// Clear Cart
const clearCart = async (req, res) => {
        try {
                const userId = req.user.id;

                const [cartRows] = await db.query(
                        `SELECT id
                        FROM cart
                        WHERE user_id = ?`,
                        [userId]
                );

                if(cartRows.length === 0){
                        return res.status(404).json({
                                success: false,
                                message: "Cart Not Found"
                        });
                }

                const cartId = cartRows[0].id;

                await db.query(
                        `DELETE FROM cart_items
                        WHERE cart_id = ?`,
                        [cartId]
                );

                res.status(200).json({
                        success: true,
                        message: "Cart cleared successfully"
                });

        } catch (error) {
                console.error("Clear Cart Error: ", error);

                res.status(500).json({
                        success: false,
                        message: "Server error"
                });
        }
};


module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart
};