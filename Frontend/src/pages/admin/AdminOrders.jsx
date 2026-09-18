import { useEffect, useState } from "react";
import {
  FiEye,
  FiRefreshCw,
  FiSearch,
  FiShoppingBag,
} from "react-icons/fi";
import { Link } from "react-router-dom";

import api from "../../services/api";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // FETCH ORDERS
  // ========================================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/orders/admin/all"
      );

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Failed to fetch admin orders");

      setError(
        error.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // INITIAL LOAD
  // ========================================

  useEffect(() => {
    fetchOrders();
  }, []);

  // ========================================
  // FILTER ORDERS
  // ========================================

  const filteredOrders = orders.filter((order) => {
    const searchValue =
      search.trim().toLowerCase();

    const matchesSearch =
      !searchValue ||
      String(order.id).includes(searchValue) ||
      order.user_name
        ?.toLowerCase()
        .includes(searchValue) ||
      order.user_email
        ?.toLowerCase()
        .includes(searchValue);

    const matchesStatus =
      status === "all" ||
      order.status === status;

    return matchesSearch && matchesStatus;
  });

  // ========================================
  // STATUS BADGE
  // ========================================

  const getStatusClass = (orderStatus) => {
    switch (orderStatus) {
      case "pending":
        return "bg-yellow-50 text-yellow-700";

      case "processing":
        return "bg-blue-50 text-blue-700";

      case "shipped":
        return "bg-purple-50 text-purple-700";

      case "delivered":
        return "bg-green-50 text-green-700";

      case "cancelled":
        return "bg-red-50 text-red-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <main className="min-h-screen bg-surface py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <Link
              to="/admin"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-primary"
            >
              ← Back to Dashboard
            </Link>

            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Administration
            </p>

            <h1 className="mt-2 text-4xl font-bold text-text">
              Orders
            </h1>

            <p className="mt-3 text-muted">
              Manage customer orders and their status.
            </p>
          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-danger">
            {error}
          </div>
        )}

        {/* Filters */}
        <section className="mt-8 rounded-2xl border border-border bg-white p-5">
          <div className="grid gap-4 md:grid-cols-[1fr_220px_auto]">

            {/* Search */}
            <div className="relative">
              <FiSearch
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search by order ID, name or email..."
                className="w-full rounded-lg border border-border py-3 pl-10 pr-4 outline-none transition focus:border-primary"
              />
            </div>

            {/* Status */}
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="rounded-lg border border-border bg-white px-4 py-3 outline-none transition focus:border-primary"
            >
              <option value="all">
                All Status
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="processing">
                Processing
              </option>

              <option value="shipped">
                Shipped
              </option>

              <option value="delivered">
                Delivered
              </option>

              <option value="cancelled">
                Cancelled
              </option>
            </select>

            {/* Refresh */}
            <button
              type="button"
              onClick={fetchOrders}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-5 py-3 font-medium text-text transition hover:border-primary hover:text-primary disabled:opacity-50"
            >
              <FiRefreshCw
                size={17}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>

          </div>
        </section>

        {/* Orders Table */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-white">

          {loading ? (
            <div className="py-20 text-center">
              <p className="text-muted">
                Loading orders...
              </p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-20 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FiShoppingBag size={25} />
              </div>

              <h2 className="mt-5 text-xl font-semibold text-text">
                No orders found
              </h2>

              <p className="mt-2 text-muted">
                Try changing your search or status filter.
              </p>

            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left">

                <thead>
                  <tr className="border-b border-border bg-surface text-sm text-muted">

                    <th className="px-5 py-4 font-semibold">
                      Order
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Customer
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Total
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Status
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Date
                    </th>

                    <th className="px-5 py-4 text-right font-semibold">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-border last:border-0 hover:bg-surface/50"
                    >

                      {/* Order */}
                      <td className="px-5 py-5">
                        <p className="font-semibold text-text">
                          #{order.id}
                        </p>

                        <p className="mt-1 text-xs text-muted">
                          Order ID
                        </p>
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-5">
                        <p className="font-medium text-text">
                          {order.user_name}
                        </p>

                        <p className="mt-1 text-sm text-muted">
                          {order.user_email}
                        </p>
                      </td>

                      {/* Total */}
                      <td className="px-5 py-5 font-semibold text-text">
                        ₹
                        {Number(
                          order.total_amount
                        ).toLocaleString("en-IN")}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-5 text-sm text-muted">
                        {new Date(
                          order.created_at
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-5">
                        <div className="flex justify-end">

                          <Link
                            to={`/admin/orders/${order.id}`}
                            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted transition hover:border-primary hover:bg-primary/5 hover:text-primary"
                          >
                            <FiEye size={16} />
                            View
                          </Link>

                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

        </section>

        {/* Count */}
        {!loading && filteredOrders.length > 0 && (
          <p className="mt-4 text-sm text-muted">
            Showing {filteredOrders.length} order
            {filteredOrders.length !== 1
              ? "s"
              : ""}
          </p>
        )}

      </div>
    </main>
  );
}

export default AdminOrders;