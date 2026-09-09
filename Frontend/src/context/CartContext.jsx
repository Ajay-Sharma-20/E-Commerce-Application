import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }

    try {
      setLoading(true);

      const response = await api.get("/cart");

      setCart(response.data.cart);
    } catch (error) {
      console.error("Failed to fetch cart");
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchCart();
    }
  }, [isAuthenticated, authLoading]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      throw new Error("Please login to add products to cart");
    }

    try {
      const response = await api.post("/cart", {
        product_id: productId,
        quantity,
      });

      await fetchCart();

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to add product to cart";

      throw new Error(message);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const response = await api.put(`/cart/${itemId}`, {
        quantity,
      });

      await fetchCart();

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to update cart item";

      throw new Error(message);
    }
  };

  const removeCartItem = async (itemId) => {
    try {
      const response = await api.delete(`/cart/${itemId}`);

      await fetchCart();

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to remove cart item";

      throw new Error(message);
    }
  };

  const clearCart = async () => {
    try {
      const response = await api.delete("/cart");

      await fetchCart();

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to clear cart";

      throw new Error(message);
    }
  };

  const cartCount =
    cart?.items?.reduce(
      (total, item) => total + Number(item.quantity),
      0
    ) || 0;

  const value = {
    cart,
    cartCount,
    loading,
    fetchCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}