import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiBox,
  FiFolder,
  FiUsers,
  FiShoppingBag,
  FiDollarSign,
  FiRefreshCw,
  FiArrowRight,
  FiAlertTriangle,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiXCircle,
} from "react-icons/fi";

import api from "../../services/api";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const [
        productsResponse,
        categoriesResponse,
        usersResponse,
        ordersResponse,
      ] = await Promise.all([
        api.get("/products/admin", {
          params: {
            limit: 100,
          },
        }),

        api.get("/categories"),

        api.get("/users/admin"),

        api.get("/orders/admin/all"),
      ]);

      setProducts(productsResponse.data.products || []);
      setCategories(categoriesResponse.data.categories || []);
      setUsers(usersResponse.data.users || []);
      setOrders(ordersResponse.data.orders || []);
    } catch (error) {
      console.error("Failed to load dashboard", error);

      setError(
        error.response?.data?.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // -----------------------------
  // Statistics
  // -----------------------------

  const totalProducts = products.length;

  const activeProducts = products.filter(
    (product) => Boolean(product.is_active)
  ).length;

  const totalCategories = categories.length;

  const totalUsers = users.length;

  const totalOrders = orders.length;

  const totalRevenue = orders
    .filter((order) => order.status !== "cancelled")
    .reduce(
      (total, order) =>
        total + Number(order.total_amount || 0),
      0
    );

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

  // Products with low stock
  const lowStockProducts = products
    .filter(
      (product) =>
        Boolean(product.is_active) &&
        Number(product.stock) <= 5
    )
    .sort(
      (a, b) =>
        Number(a.stock) - Number(b.stock)
    );

  // Recent orders
  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.created_at) -
        new Date(a.created_at)
    )
    .slice(0, 5);

  // -----------------------------
  // Helpers
  // -----------------------------

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 2,
      }
    )}`;
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

  const getStatusClasses = (status) => {
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
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FiClock size={14} />;

      case "processing":
        return <FiRefreshCw size={14} />;

      case "shipped":
        return <FiTruck size={14} />;

      case "delivered":
        return <FiCheckCircle size={14} />;

      case "cancelled":
        return <FiXCircle size={14} />;

      default:
        return null;
    }
  };

  // -----------------------------
  // Loading
  // -----------------------------

  if (loading) {
    return (
      <main className="min-h-screen bg-surface px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-primary" />

              <p className="mt-4 text-sm text-muted">
                Loading dashboard...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // -----------------------------
  // Dashboard
  // -----------------------------

  return (
    <main className="min-h-screen bg-surface py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Administration
            </p>

            <h1 className="mt-1 text-3xl font-bold text-text sm:text-4xl">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-muted sm:text-base">
              Here's what's happening with your store.
            </p>
          </div>

          <button
            onClick={() => fetchDashboard(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiRefreshCw
              size={17}
              className={
                refreshing ? "animate-spin" : ""
              }
            />

            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Products */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted">
                  Total Products
                </p>

                <h2 className="mt-2 text-3xl font-bold text-text">
                  {totalProducts}
                </h2>
              </div>

              <div className="rounded-lg bg-teal-50 p-3 text-primary">
                <FiBox size={22} />
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              {activeProducts} active products
            </p>
          </div>

          {/* Categories */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted">
                  Categories
                </p>

                <h2 className="mt-2 text-3xl font-bold text-text">
                  {totalCategories}
                </h2>
              </div>

              <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                <FiFolder size={22} />
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Product categories
            </p>
          </div>

          {/* Users */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted">
                  Users
                </p>

                <h2 className="mt-2 text-3xl font-bold text-text">
                  {totalUsers}
                </h2>
              </div>

              <div className="rounded-lg bg-purple-50 p-3 text-purple-600">
                <FiUsers size={22} />
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Registered users
            </p>
          </div>

          {/* Orders */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted">
                  Total Orders
                </p>

                <h2 className="mt-2 text-3xl font-bold text-text">
                  {totalOrders}
                </h2>
              </div>

              <div className="rounded-lg bg-orange-50 p-3 text-orange-600">
                <FiShoppingBag size={22} />
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              All customer orders
            </p>
          </div>
        </div>

        {/* Revenue + Order Overview */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">

          {/* Revenue */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-50 p-3 text-green-600">
                <FiDollarSign size={22} />
              </div>

              <div>
                <p className="text-sm text-muted">
                  Total Revenue
                </p>

                <h2 className="text-2xl font-bold text-text">
                  {formatCurrency(totalRevenue)}
                </h2>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-5">
              <p className="text-xs text-gray-500">
                Revenue excludes cancelled orders.
              </p>
            </div>
          </div>

          {/* Order Overview */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-text">
                  Order Overview
                </h2>

                <p className="mt-1 text-xs text-muted">
                  Current order status
                </p>
              </div>

              <Link
                to="/admin/orders"
                className="text-sm font-medium text-primary hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">

              <div className="rounded-lg bg-amber-50 p-4">
                <p className="text-xs text-amber-700">
                  Pending
                </p>
                <p className="mt-1 text-2xl font-bold text-amber-800">
                  {pendingOrders}
                </p>
              </div>

              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-xs text-blue-700">
                  Processing
                </p>
                <p className="mt-1 text-2xl font-bold text-blue-800">
                  {processingOrders}
                </p>
              </div>

              <div className="rounded-lg bg-purple-50 p-4">
                <p className="text-xs text-purple-700">
                  Shipped
                </p>
                <p className="mt-1 text-2xl font-bold text-purple-800">
                  {shippedOrders}
                </p>
              </div>

              <div className="rounded-lg bg-green-50 p-4">
                <p className="text-xs text-green-700">
                  Delivered
                </p>
                <p className="mt-1 text-2xl font-bold text-green-800">
                  {deliveredOrders}
                </p>
              </div>

              <div className="rounded-lg bg-red-50 p-4">
                <p className="text-xs text-red-700">
                  Cancelled
                </p>
                <p className="mt-1 text-2xl font-bold text-red-800">
                  {cancelledOrders}
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Recent Orders + Low Stock */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">

          {/* Recent Orders */}
          <div className="rounded-xl border border-gray-100 bg-white shadow-sm lg:col-span-2">

            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h2 className="font-semibold text-text">
                  Recent Orders
                </h2>

                <p className="mt-1 text-xs text-muted">
                  Latest customer orders
                </p>
              </div>

              <Link
                to="/admin/orders"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                View all
                <FiArrowRight size={15} />
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-muted">
                No orders found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px]">
                  <thead>
                    <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wider text-gray-400">
                      <th className="px-6 py-3 font-medium">
                        Order
                      </th>

                      <th className="px-6 py-3 font-medium">
                        Customer
                      </th>

                      <th className="px-6 py-3 font-medium">
                        Amount
                      </th>

                      <th className="px-6 py-3 font-medium">
                        Status
                      </th>

                      <th className="px-6 py-3 font-medium">
                        Date
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <Link
                            to={`/admin/orders/${order.id}`}
                            className="font-semibold text-primary hover:underline"
                          >
                            #{order.id}
                          </Link>
                        </td>

                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-text">
                            {order.customer_name || "-"}
                          </p>

                          <p className="text-xs text-muted">
                            {order.customer_email || "-"}
                          </p>
                        </td>

                        <td className="px-6 py-4 text-sm font-medium text-text">
                          {formatCurrency(
                            order.total_amount
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                              order.status
                            )}`}
                          >
                            {getStatusIcon(order.status)}

                            {order.status
                              ?.charAt(0)
                              .toUpperCase() +
                              order.status?.slice(1)}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-muted">
                          {formatDate(
                            order.created_at
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Low Stock */}
          <div className="rounded-xl border border-gray-100 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h2 className="font-semibold text-text">
                  Low Stock
                </h2>

                <p className="mt-1 text-xs text-muted">
                  Products needing attention
                </p>
              </div>

              <FiAlertTriangle
                className="text-amber-500"
                size={20}
              />
            </div>

            {lowStockProducts.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <FiCheckCircle
                  className="mx-auto text-green-500"
                  size={28}
                />

                <p className="mt-3 text-sm font-medium text-text">
                  Stock looks good
                </p>

                <p className="mt-1 text-xs text-muted">
                  No products are low on stock.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {lowStockProducts
                  .slice(0, 6)
                  .map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between gap-3 px-6 py-4"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-text">
                          {product.name}
                        </p>

                        <p className="mt-1 text-xs text-muted">
                          {product.category_name ||
                            "Product"}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          Number(product.stock) === 0
                            ? "bg-red-50 text-red-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {Number(product.stock) === 0
                          ? "Out of stock"
                          : `${product.stock} left`}
                      </span>
                    </div>
                  ))}
              </div>
            )}

            {lowStockProducts.length > 0 && (
              <div className="border-t border-gray-100 px-6 py-4">
                <Link
                  to="/admin/products"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Manage products
                  <FiArrowRight size={15} />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">

          <div className="mb-5">
            <h2 className="font-semibold text-text">
              Quick Management
            </h2>

            <p className="mt-1 text-xs text-muted">
              Quickly access your store management sections.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            <Link
              to="/admin/products/new"
              className="group flex items-center justify-between rounded-lg border border-gray-200 p-4 transition hover:border-primary hover:bg-teal-50"
            >
              <div className="flex items-center gap-3">
                <FiBox
                  className="text-primary"
                  size={20}
                />

                <span className="text-sm font-medium text-text">
                  Add Product
                </span>
              </div>

              <FiArrowRight
                className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-primary"
                size={17}
              />
            </Link>

            <Link
              to="/admin/categories/new"
              className="group flex items-center justify-between rounded-lg border border-gray-200 p-4 transition hover:border-primary hover:bg-teal-50"
            >
              <div className="flex items-center gap-3">
                <FiFolder
                  className="text-primary"
                  size={20}
                />

                <span className="text-sm font-medium text-text">
                  Add Category
                </span>
              </div>

              <FiArrowRight
                className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-primary"
                size={17}
              />
            </Link>

            <Link
              to="/admin/users"
              className="group flex items-center justify-between rounded-lg border border-gray-200 p-4 transition hover:border-primary hover:bg-teal-50"
            >
              <div className="flex items-center gap-3">
                <FiUsers
                  className="text-primary"
                  size={20}
                />

                <span className="text-sm font-medium text-text">
                  Manage Users
                </span>
              </div>

              <FiArrowRight
                className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-primary"
                size={17}
              />
            </Link>

            <Link
              to="/admin/orders"
              className="group flex items-center justify-between rounded-lg border border-gray-200 p-4 transition hover:border-primary hover:bg-teal-50"
            >
              <div className="flex items-center gap-3">
                <FiShoppingBag
                  className="text-primary"
                  size={20}
                />

                <span className="text-sm font-medium text-text">
                  Manage Orders
                </span>
              </div>

              <FiArrowRight
                className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-primary"
                size={17}
              />
            </Link>

          </div>
        </div>
      </div>
    </main>
  );
}

export default AdminDashboard;