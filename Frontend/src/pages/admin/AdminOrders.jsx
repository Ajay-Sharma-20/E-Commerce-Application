import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiRefreshCw,
  FiSearch,
  FiShoppingBag,
  FiTruck,
  FiXCircle,
} from "react-icons/fi";

import api from "../../services/api";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] = useState("");

  // --------------------------------
  // Fetch orders
  // --------------------------------

  const fetchOrders = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get(
        "/orders/admin/all"
      );

      setOrders(
        response.data.orders || []
      );
    } catch (error) {
      console.error(
        "Failed to fetch admin orders",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // --------------------------------
  // Filter
  // --------------------------------

  const filteredOrders = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        String(order.id)
          .toLowerCase()
          .includes(query) ||
        order.customer_name
          ?.toLowerCase()
          .includes(query) ||
        order.customer_email
          ?.toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        order.status === statusFilter;

      return (
        matchesSearch && matchesStatus
      );
    });
  }, [orders, search, statusFilter]);

  // --------------------------------
  // Statistics
  // --------------------------------

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const processingOrders = orders.filter(
    (order) => order.status === "processing"
  ).length;

  const shippedOrders = orders.filter(
    (order) => order.status === "shipped"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered"
  ).length;

  const cancelledOrders = orders.filter(
    (order) => order.status === "cancelled"
  ).length;

  // --------------------------------
  // Helpers
  // --------------------------------

  const formatCurrency = (amount) => {
    return `₹${Number(
      amount || 0
    ).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatStatus = (status) => {
    if (!status) return "-";

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-700";

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

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FiClock size={13} />;

      case "processing":
        return <FiRefreshCw size={13} />;

      case "shipped":
        return <FiTruck size={13} />;

      case "delivered":
        return <FiCheckCircle size={13} />;

      case "cancelled":
        return <FiXCircle size={13} />;

      default:
        return null;
    }
  };

  // --------------------------------
  // Loading
  // --------------------------------

  if (loading) {
    return (
      <main className="min-h-screen bg-surface px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-primary" />

              <p className="mt-4 text-sm text-muted">
                Loading orders...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Store Management
            </p>

            <h1 className="mt-1 text-3xl font-bold text-text">
              Orders
            </h1>

            <p className="mt-2 text-sm text-muted">
              Manage customer orders and fulfillment status.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              fetchOrders(true)
            }
            disabled={refreshing}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiRefreshCw
              size={17}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>
        </div>

        {/* Statistics */}
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-muted">
              Total Orders
            </p>

            <div className="mt-3 flex items-center justify-between">
              <p className="text-2xl font-bold text-text">
                {totalOrders}
              </p>

              <div className="rounded-lg bg-teal-50 p-2.5 text-primary">
                <FiShoppingBag size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-muted">
              Pending
            </p>

            <div className="mt-3 flex items-center justify-between">
              <p className="text-2xl font-bold text-text">
                {pendingOrders}
              </p>

              <div className="rounded-lg bg-amber-50 p-2.5 text-amber-600">
                <FiClock size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-muted">
              Processing
            </p>

            <div className="mt-3 flex items-center justify-between">
              <p className="text-2xl font-bold text-text">
                {processingOrders}
              </p>

              <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
                <FiRefreshCw size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-muted">
              Shipped
            </p>

            <div className="mt-3 flex items-center justify-between">
              <p className="text-2xl font-bold text-text">
                {shippedOrders}
              </p>

              <div className="rounded-lg bg-purple-50 p-2.5 text-purple-600">
                <FiTruck size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-muted">
              Delivered
            </p>

            <div className="mt-3 flex items-center justify-between">
              <p className="text-2xl font-bold text-text">
                {deliveredOrders}
              </p>

              <div className="rounded-lg bg-green-50 p-2.5 text-green-600">
                <FiCheckCircle size={20} />
              </div>
            </div>
          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Filters */}
        <section className="mt-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">

          <div className="flex flex-col gap-3 lg:flex-row">

            <div className="relative flex-1">
              <FiSearch
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search by order ID, customer name or email..."
                className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="h-11 rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 lg:w-52"
            >
              <option value="all">
                All Statuses
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

          </div>
        </section>

        {/* Results */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted">
            Showing {filteredOrders.length} of{" "}
            {totalOrders} orders
          </p>

          {cancelledOrders > 0 && (
            <p className="text-xs text-red-600">
              {cancelledOrders} cancelled
            </p>
          )}
        </div>

        {/* Orders Table */}
        <section className="mt-3 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

          {filteredOrders.length === 0 ? (
            <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">

              <div className="rounded-full bg-gray-100 p-4 text-gray-400">
                <FiShoppingBag size={30} />
              </div>

              <h3 className="mt-4 font-semibold text-text">
                No orders found
              </h3>

              <p className="mt-1 max-w-sm text-sm text-muted">
                Try changing your search or status filter.
              </p>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[950px]">

                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70 text-left">

                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Order
                    </th>

                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Customer
                    </th>

                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Amount
                    </th>

                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Date
                    </th>

                    <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">

                  {filteredOrders.map(
                    (order) => (
                      <tr
                        key={order.id}
                        className="transition hover:bg-gray-50/70"
                      >

                        {/* Order */}
                        <td className="px-6 py-4">
                          <Link
                            to={`/admin/orders/${order.id}`}
                            className="font-semibold text-primary hover:underline"
                          >
                            #{order.id}
                          </Link>

                          <p className="mt-1 text-xs text-muted">
                            User #{order.user_id}
                          </p>
                        </td>

                        {/* Customer */}
                        <td className="px-6 py-4">

                          <p className="text-sm font-semibold text-text">
                            {order.customer_name ||
                              "-"}
                          </p>

                          <p className="mt-0.5 text-xs text-muted">
                            {order.customer_email ||
                              "-"}
                          </p>

                        </td>

                        {/* Amount */}
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-text">
                            {formatCurrency(
                              order.total_amount
                            )}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(
                              order.status
                            )}`}
                          >
                            {getStatusIcon(
                              order.status
                            )}

                            {formatStatus(
                              order.status
                            )}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 text-sm text-muted">
                          {formatDate(
                            order.created_at
                          )}
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4">

                          <div className="flex justify-end">

                            <Link
                              to={`/admin/orders/${order.id}`}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:border-primary hover:bg-teal-50 hover:text-primary"
                            >
                              View
                              <FiArrowRight
                                size={14}
                              />
                            </Link>

                          </div>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </section>

      </div>
    </main>
  );
}

export default AdminOrders;