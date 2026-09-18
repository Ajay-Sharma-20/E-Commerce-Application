import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiMapPin,
  FiPackage,
  FiRefreshCw,
  FiShoppingBag,
  FiUser,
} from "react-icons/fi";
import { Link, useParams } from "react-router-dom";

import api from "../../services/api";

function AdminOrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ========================================
  // FETCH ORDER
  // ========================================

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      /*
       * We use the existing customer order endpoint
       * because the backend already checks order ownership.
       *
       * For admin, we'll create a dedicated endpoint next
       * if required.
       */
      const response = await api.get(`/orders/admin/${id}`);

      const orderData = response.data.order;

      setOrder(orderData);
      setItems(response.data.items || []);
    } catch (error) {
      console.error("Failed to fetch order");

      setError(
        error.response?.data?.message ||
          "Failed to load order"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // ========================================
  // GET AVAILABLE STATUS OPTIONS
  // ========================================

  const getAvailableStatuses = () => {
    if (!order) {
      return [];
    }

    switch (order.status) {
      case "pending":
        return ["processing", "cancelled"];

      case "processing":
        return ["shipped", "cancelled"];

      case "shipped":
        return ["delivered"];

      default:
        return [];
    }
  };

  // ========================================
  // UPDATE STATUS
  // ========================================

  const handleStatusUpdate = async (newStatus) => {
    if (!order) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to change order #${order.id} from "${order.status}" to "${newStatus}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdating(true);
      setError("");
      setSuccess("");

      await api.put(
        `/orders/admin/${order.id}/status`,
        {
          status: newStatus,
        }
      );

      setOrder((currentOrder) => ({
        ...currentOrder,
        status: newStatus,
      }));

      setSuccess(
        `Order status updated to ${newStatus}.`
      );
    } catch (error) {
      console.error(
        "Failed to update order status"
      );

      setError(
        error.response?.data?.message ||
          "Failed to update order status"
      );
    } finally {
      setUpdating(false);
    }
  };

  // ========================================
  // STATUS STYLING
  // ========================================

  const getStatusClass = (status) => {
    switch (status) {
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

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-surface py-10">
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-muted">
            Loading order...
          </p>
        </div>
      </main>
    );
  }

  // ========================================
  // ERROR / NOT FOUND
  // ========================================

  if (!order) {
    return (
      <main className="min-h-screen bg-surface py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-primary"
          >
            <FiArrowLeft size={17} />
            Back to Orders
          </Link>

          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <h1 className="text-xl font-semibold text-text">
              Order not found
            </h1>

            <p className="mt-2 text-sm text-danger">
              {error || "Unable to load this order."}
            </p>
          </div>

        </div>
      </main>
    );
  }

  const availableStatuses =
    getAvailableStatuses();

  return (
    <main className="min-h-screen bg-surface py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

          <div>
            <Link
              to="/admin/orders"
              className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-primary"
            >
              <FiArrowLeft size={17} />
              Back to Orders
            </Link>

            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Administration
            </p>

            <h1 className="mt-2 text-3xl font-bold text-text sm:text-4xl">
              Order #{order.id}
            </h1>

            <p className="mt-2 text-sm text-muted">
              Placed on{" "}
              {new Date(
                order.created_at
              ).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Current Status */}
          <div>
            <span
              className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold capitalize ${getStatusClass(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </div>

        </div>

        {/* Messages */}
        {error && (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-danger">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-8 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-success">
            <FiCheckCircle size={18} />
            {success}
          </div>
        )}

        {/* Status Management */}
        <section className="mt-8 rounded-2xl border border-border bg-white p-6 sm:p-8">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-xl font-bold text-text">
                Order Status
              </h2>

              <p className="mt-1 text-sm text-muted">
                Update the order to the next available status.
              </p>
            </div>

            {availableStatuses.length > 0 ? (
              <div className="flex flex-wrap gap-3">

                {availableStatuses.map(
                  (statusOption) => (
                    <button
                      key={statusOption}
                      type="button"
                      onClick={() =>
                        handleStatusUpdate(
                          statusOption
                        )
                      }
                      disabled={updating}
                      className={
                        statusOption ===
                        "cancelled"
                          ? "rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-danger transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          : "rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                      }
                    >
                      {updating
                        ? "Updating..."
                        : `Mark ${statusOption}`}
                    </button>
                  )
                )}

              </div>
            ) : (
              <div className="rounded-lg bg-surface px-4 py-3 text-sm font-medium text-muted">
                No further status changes available.
              </div>
            )}

          </div>

        </section>

        {/* Main Grid */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_350px]">

          {/* Order Items */}
          <section className="rounded-2xl border border-border bg-white">

            <div className="border-b border-border p-6">
              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FiPackage size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-text">
                    Order Items
                  </h2>

                  <p className="text-sm text-muted">
                    {items.length} item
                    {items.length !== 1
                      ? "s"
                      : ""}
                  </p>
                </div>

              </div>
            </div>

            <div className="divide-y divide-border">

              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-6"
                >

                  {/* Image */}
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.product_name}
                      className="h-20 w-20 shrink-0 rounded-xl bg-surface object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-surface text-xs text-muted">
                      No Image
                    </div>
                  )}

                  {/* Product */}
                  <div className="min-w-0 flex-1">

                    <h3 className="font-semibold text-text">
                      {item.product_name}
                    </h3>

                    <p className="mt-1 text-sm text-muted">
                      Quantity: {item.quantity}
                    </p>

                    <p className="mt-1 text-sm text-muted">
                      Price: ₹
                      {Number(
                        item.price
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </p>

                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <p className="font-bold text-text">
                      ₹
                      {(
                        Number(item.price) *
                        Number(item.quantity)
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>

                </div>
              ))}

            </div>

            {/* Total */}
            <div className="border-t border-border p-6">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-text">
                  Order Total
                </span>

                <span className="text-xl font-bold text-primary">
                  ₹
                  {Number(
                    order.total_amount
                  ).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

          </section>

          {/* Customer + Shipping */}
          <div className="space-y-8">

            {/* Customer */}
            <section className="rounded-2xl border border-border bg-white p-6">

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                  <FiUser size={20} />
                </div>

                <h2 className="text-lg font-bold text-text">
                  Customer
                </h2>
              </div>

              <div className="mt-5 space-y-3 text-sm">

                <div>
                  <p className="text-muted">
                    Name
                  </p>

                  <p className="mt-1 font-semibold text-text">
                    {order.user_name}
                  </p>
                </div>

                <div>
                  <p className="text-muted">
                    Email
                  </p>

                  <p className="mt-1 break-all font-medium text-text">
                    {order.user_email}
                  </p>
                </div>

                <div>
                  <p className="text-muted">
                    User ID
                  </p>

                  <p className="mt-1 font-medium text-text">
                    #{order.user_id}
                  </p>
                </div>

              </div>

            </section>

            {/* Shipping */}
            <section className="rounded-2xl border border-border bg-white p-6">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FiMapPin size={20} />
                </div>

                <h2 className="text-lg font-bold text-text">
                  Shipping Address
                </h2>

              </div>

              <p className="mt-5 whitespace-pre-line text-sm leading-6 text-muted">
                {order.shipping_address}
              </p>

            </section>

          </div>

        </div>

        {/* Refresh */}
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={fetchOrder}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-text transition hover:border-primary hover:text-primary disabled:opacity-50"
          >
            <FiRefreshCw
              size={16}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />
            Refresh Order
          </button>
        </div>

      </div>
    </main>
  );
}

export default AdminOrderDetails;