import { useEffect, useState } from "react";
import { FiArrowLeft, FiCheck, FiPackage } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";

import api from "../services/api";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/orders/${id}`);

      setOrder(response.data.order);
    } catch (error) {
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

  if (loading) {
    return (
      <main className="py-20 text-center">
        <p className="text-muted">Loading order...</p>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
          <h1 className="text-xl font-bold text-danger">
            Unable to load order
          </h1>

          <p className="mt-2 text-sm text-danger">
            {error}
          </p>

          <Link
            to="/orders"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-dark"
          >
            <FiArrowLeft size={17} />
            Back to Orders
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-primary"
        >
          <FiArrowLeft size={17} />
          Back to Orders
        </Link>

        {/* Header */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted">
              Order #{order.id}
            </p>

            <h1 className="mt-1 text-3xl font-bold text-text">
              Order Details
            </h1>
          </div>

          <span
            className={`w-fit rounded-full px-4 py-2 text-sm font-semibold capitalize ${getStatusClass(
              order.status
            )}`}
          >
            {order.status}
          </span>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">

          {/* Items */}
          <section className="rounded-2xl border border-border bg-white p-6">
            <div className="flex items-center gap-3">
              <FiPackage
                size={21}
                className="text-primary"
              />

              <h2 className="text-xl font-bold text-text">
                Ordered Items
              </h2>
            </div>

            <div className="mt-6 divide-y divide-border">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 py-5 first:pt-0 last:pb-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 shrink-0 rounded-xl bg-surface object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-text">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-sm text-muted">
                      Quantity: {item.quantity}
                    </p>

                    <p className="mt-1 text-sm text-muted">
                      ₹
                      {Number(item.price).toLocaleString(
                        "en-IN"
                      )}{" "}
                      each
                    </p>
                  </div>

                  <p className="font-bold text-text">
                    ₹
                    {(
                      Number(item.price) *
                      Number(item.quantity)
                    ).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Summary */}
          <aside className="h-fit space-y-6">

            <div className="rounded-2xl border border-border bg-white p-6">
              <h2 className="text-xl font-bold text-text">
                Order Summary
              </h2>

              <div className="my-6 h-px bg-border" />

              <div className="flex justify-between">
                <span className="text-muted">
                  Subtotal
                </span>

                <span className="font-semibold">
                  ₹
                  {Number(
                    order.total_amount
                  ).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="mt-4 flex justify-between">
                <span className="text-muted">
                  Shipping
                </span>

                <span className="font-medium text-success">
                  Free
                </span>
              </div>

              <div className="my-5 h-px bg-border" />

              <div className="flex justify-between">
                <span className="text-lg font-bold">
                  Total
                </span>

                <span className="text-2xl font-bold text-primary">
                  ₹
                  {Number(
                    order.total_amount
                  ).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Shipping */}
            <div className="rounded-2xl border border-border bg-white p-6">
              <h2 className="text-lg font-bold text-text">
                Shipping Address
              </h2>

              <p className="mt-4 whitespace-pre-line text-sm leading-6 text-muted">
                {order.shipping_address}
              </p>
            </div>

            {/* Confirmation */}
            <div className="rounded-2xl bg-primary p-6 text-white">
              <div className="flex gap-3">
                <FiCheck
                  size={20}
                  className="mt-0.5 shrink-0"
                />

                <div>
                  <p className="font-semibold">
                    Order placed successfully
                  </p>

                  <p className="mt-1 text-sm text-white/80">
                    You can track your order status from
                    your orders page.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default OrderDetails;