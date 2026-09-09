import { useState } from "react";
import { FiArrowLeft, FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Cart() {
  const navigate = useNavigate();

  const { cart, loading, updateCartItem, removeCartItem, clearCart } =
    useCart();

  const { isAuthenticated } = useAuth();

  const [updatingItem, setUpdatingItem] = useState(null);
  const [removingItem, setRemovingItem] = useState(null);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState("");

  if (!isAuthenticated) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-surface p-12 text-center">
          <h1 className="text-2xl font-bold text-text">
            Please login to view your cart
          </h1>

          <p className="mt-3 text-muted">
            Your cart is linked to your account.
          </p>

          <Link
            to="/login"
            className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-dark"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  if (loading && !cart) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-muted">Loading your cart...</p>
      </main>
    );
  }

  const items = cart?.items || [];
  const total = Number(cart?.total || 0);

  const handleUpdateQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) {
      return;
    }

    if (newQuantity > Number(item.stock)) {
      setError(`Only ${item.stock} items are available.`);
      return;
    }

    try {
      setError("");
      setUpdatingItem(item.item_id);

      await updateCartItem(item.item_id, newQuantity);
    } catch (error) {
      setError(error.message);
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      setError("");
      setRemovingItem(itemId);

      await removeCartItem(itemId);
    } catch (error) {
      setError(error.message);
    } finally {
      setRemovingItem(null);
    }
  };

  const handleClearCart = async () => {
    try {
      setError("");
      setClearing(true);

      await clearCart();
    } catch (error) {
      setError(error.message);
    } finally {
      setClearing(false);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <main className="bg-surface min-h-screen py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Shopping Cart
            </p>

            <h1 className="mt-2 text-4xl font-bold text-text">
              Your Cart
            </h1>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={handleClearCart}
              disabled={clearing}
              className="text-sm font-medium text-danger transition hover:underline disabled:opacity-50"
            >
              {clearing ? "Clearing..." : "Clear Cart"}
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-danger">
            {error}
          </div>
        )}

        {/* Empty Cart */}
        {items.length === 0 ? (
          <div className="rounded-2xl border border-border bg-white p-16 text-center">
            <h2 className="text-2xl font-semibold text-text">
              Your cart is empty
            </h2>

            <p className="mt-3 text-muted">
              Looks like you haven't added anything yet.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-dark"
            >
              <FiArrowLeft size={18} />
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">

            {/* Cart Items */}
            <div className="space-y-4">
              {items.map((item) => {
                const itemUpdating = updatingItem === item.item_id;
                const itemRemoving = removingItem === item.item_id;

                return (
                  <article
                    key={item.item_id}
                    className="rounded-2xl border border-border bg-white p-4 sm:p-5"
                  >
                    <div className="flex gap-4 sm:gap-6">

                      {/* Image */}
                      <Link
                        to={`/products/${item.product_id}`}
                        className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-surface sm:h-36 sm:w-36"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </Link>

                      {/* Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between gap-4">
                          <div>
                            <Link
                              to={`/products/${item.product_id}`}
                              className="font-semibold text-text transition hover:text-primary"
                            >
                              {item.name}
                            </Link>

                            <p className="mt-1 text-sm text-muted">
                              ₹
                              {Number(item.price).toLocaleString("en-IN")}{" "}
                              each
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleRemove(item.item_id)
                            }
                            disabled={itemRemoving}
                            className="shrink-0 rounded-lg p-2 text-muted transition hover:bg-red-50 hover:text-danger disabled:opacity-50"
                            aria-label="Remove item"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">

                          {/* Quantity */}
                          <div className="flex items-center overflow-hidden rounded-lg border border-border">
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item,
                                  Number(item.quantity) - 1
                                )
                              }
                              disabled={
                                itemUpdating ||
                                Number(item.quantity) <= 1
                              }
                              className="p-2.5 transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <FiMinus size={16} />
                            </button>

                            <span className="min-w-10 text-center text-sm font-semibold">
                              {itemUpdating
                                ? "..."
                                : item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item,
                                  Number(item.quantity) + 1
                                )
                              }
                              disabled={
                                itemUpdating ||
                                Number(item.quantity) >=
                                  Number(item.stock)
                              }
                              className="p-2.5 transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <FiPlus size={16} />
                            </button>
                          </div>

                          {/* Subtotal */}
                          <p className="text-lg font-bold text-text">
                            ₹
                            {Number(item.subtotal).toLocaleString(
                              "en-IN"
                            )}
                          </p>
                        </div>

                        <p className="mt-3 text-xs text-muted">
                          {item.stock} available
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}

              <Link
                to="/products"
                className="inline-flex items-center gap-2 pt-2 text-sm font-semibold text-primary transition hover:text-primary-dark"
              >
                <FiArrowLeft size={17} />
                Continue Shopping
              </Link>
            </div>

            {/* Summary */}
            <aside className="h-fit rounded-2xl border border-border bg-white p-6 lg:sticky lg:top-24">
              <h2 className="text-xl font-bold text-text">
                Order Summary
              </h2>

              <div className="my-6 h-px bg-border" />

              <div className="flex items-center justify-between">
                <span className="text-muted">
                  Items
                </span>

                <span className="font-medium text-text">
                  {items.reduce(
                    (sum, item) =>
                      sum + Number(item.quantity),
                    0
                  )}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-muted">
                  Subtotal
                </span>

                <span className="font-semibold text-text">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="my-6 h-px bg-border" />

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-text">
                  Total
                </span>

                <span className="text-2xl font-bold text-primary">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                className="mt-7 w-full rounded-lg bg-primary px-6 py-3.5 font-semibold text-white transition hover:bg-primary-dark"
              >
                Proceed to Checkout
              </button>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

export default Cart;