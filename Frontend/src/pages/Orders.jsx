import { useEffect, useState } from "react";
import { FiArrowRight, FiPackage } from "react-icons/fi";
import { Link } from "react-router-dom";

import api from "../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/orders");

      setOrders(response.data.orders || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusClass = (status) => {
    const classes = {
      pending: "bg-yellow-50 text-yellow-700",
      processing: "bg-blue-50 text-blue-700",
      shipped: "bg-purple-50 text-purple-700",
      delivered: "bg-green-50 text-green-700",
      cancelled: "bg-red-50 text-red-700",
    };

    return classes[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <main className="min-h-screen bg-surface py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Account
          </p>

          <h1 className="mt-2 text-4xl font-bold text-text">
            My Orders
          </h1>

          <p className="mt-3 text-muted">
            View and track your previous orders.
          </p>
        </div>

        {loading && (
          <div className="py-20 text-center">
            <p className="text-muted">Loading orders...</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="font-medium text-danger">{error}</p>

            <button
              type="button"
              onClick={fetchOrders}
              className="mt-5 rounded-lg bg-primary px-5 py-2.5 font-semibold text-white hover:bg-primary-dark"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="rounded-2xl border border-border bg-white p-16 text-center">
            <FiPackage
              size={42}
              className="mx-auto text-muted"
            />

            <h2 className="mt-5 text-2xl font-semibold text-text">
              No orders yet
            </h2>

            <p className="mt-2 text-muted">
              Your completed orders will appear here.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark"
            >
              Start Shopping
            </Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-2xl border border-border bg-white p-5 sm:p-6"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <p className="text-sm text-muted">
                      Order #{order.id}
                    </p>

                    <p className="mt-1 text-sm text-muted">
                      {new Date(
                        order.created_at
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>

                  <div>
                    <p className="text-xs text-muted">
                      Total
                    </p>

                    <p className="text-lg font-bold text-text">
                      ₹
                      {Number(
                        order.total_amount
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <Link
                    to={`/orders/${order.id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-text transition hover:border-primary hover:text-primary"
                  >
                    View Details
                    <FiArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Orders;