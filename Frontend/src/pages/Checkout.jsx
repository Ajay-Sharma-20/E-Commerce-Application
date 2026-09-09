import { useState } from "react";
import { FiArrowLeft, FiCheck } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import api from "../services/api";

function Checkout() {
  const navigate = useNavigate();
  const { cart, loading } = useCart();

  const [shippingAddress, setShippingAddress] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  const items = cart?.items || [];
  const total = Number(cart?.total || 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!shippingAddress.trim()) {
      setError("Please enter your shipping address.");
      return;
    }

    try {
      setPlacingOrder(true);
      setError("");

      const response = await api.post("/orders", {
        shipping_address: shippingAddress.trim(),
      });

      const orderId = response.data.order?.id;

      if (orderId) {
        navigate(`/orders/${orderId}`);
      } else {
        navigate("/orders");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading && !cart) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-muted">Loading checkout...</p>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-surface p-12 text-center">
          <h1 className="text-2xl font-bold text-text">
            Your cart is empty
          </h1>

          <p className="mt-3 text-muted">
            Add some products before proceeding to checkout.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-dark"
          >
            <FiArrowLeft size={18} />
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-primary"
          >
            <FiArrowLeft size={17} />
            Back to Cart
          </Link>

          <p className="mt-7 text-sm font-semibold uppercase tracking-wider text-primary">
            Checkout
          </p>

          <h1 className="mt-2 text-4xl font-bold text-text">
            Complete Your Order
          </h1>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-danger">
            {error}
          </div>
        )}

        <form
          onSubmit={handlePlaceOrder}
          className="grid gap-8 lg:grid-cols-[1fr_380px]"
        >

          {/* Shipping */}
          <section className="rounded-2xl border border-border bg-white p-6 sm:p-8">
            <h2 className="text-xl font-bold text-text">
              Shipping Information
            </h2>

            <p className="mt-2 text-sm text-muted">
              Enter the address where you want your order delivered.
            </p>

            <div className="mt-7">
              <label
                htmlFor="shippingAddress"
                className="mb-2 block text-sm font-semibold text-text"
              >
                Shipping Address
              </label>

              <textarea
                id="shippingAddress"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Enter your complete delivery address..."
                rows={6}
                maxLength={500}
                className="w-full resize-none rounded-lg border border-border px-4 py-3 outline-none transition focus:border-primary"
              />

              <p className="mt-2 text-right text-xs text-muted">
                {shippingAddress.length}/500
              </p>
            </div>

            <div className="mt-8 rounded-xl bg-surface p-4">
              <div className="flex gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <FiCheck size={17} />
                </div>

                <div>
                  <p className="font-semibold text-text">
                    Secure Order Processing
                  </p>

                  <p className="mt-1 text-sm leading-6 text-muted">
                    Your order will be securely processed and your
                    cart will be cleared after successful order
                    creation.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Order Summary */}
          <aside className="h-fit rounded-2xl border border-border bg-white p-6 lg:sticky lg:top-24">
            <h2 className="text-xl font-bold text-text">
              Order Summary
            </h2>

            <div className="my-6 space-y-4">
              {items.map((item) => (
                <div
                  key={item.item_id}
                  className="flex gap-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 shrink-0 rounded-lg bg-surface object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold text-text">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-muted">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-semibold text-text">
                    ₹
                    {Number(item.subtotal).toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>
              ))}
            </div>

            <div className="h-px bg-border" />

            <div className="mt-5 flex items-center justify-between">
              <span className="text-muted">
                Subtotal
              </span>

              <span className="font-semibold text-text">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-muted">
                Shipping
              </span>

              <span className="font-medium text-success">
                Free
              </span>
            </div>

            <div className="my-5 h-px bg-border" />

            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-text">
                Total
              </span>

              <span className="text-2xl font-bold text-primary">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>

            <button
              type="submit"
              disabled={placingOrder}
              className="mt-7 w-full rounded-lg bg-primary px-6 py-3.5 font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {placingOrder
                ? "Placing Order..."
                : "Place Order"}
            </button>
          </aside>
        </form>
      </div>
    </main>
  );
}

export default Checkout;