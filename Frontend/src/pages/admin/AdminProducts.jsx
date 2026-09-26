import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiEdit2,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiPower,
  FiChevronLeft,
  FiChevronRight,
  FiExternalLink,
  FiPackage,
} from "react-icons/fi";

import api from "../../services/api";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const limit = 10;

  // -----------------------------
  // Fetch Products
  // -----------------------------

  const fetchProducts = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const params = {
        page,
        limit,
        status,
        sort,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (category) {
        params.category = category;
      }

      const response = await api.get("/products/admin", {
        params,
      });

      setProducts(response.data.products || []);

      if (response.data.pagination) {
        setPagination(response.data.pagination);
      } else {
        setPagination({
          page,
          limit,
          total: response.data.products?.length || 0,
          totalPages: 1,
        });
      }
    } catch (error) {
      console.error("Failed to fetch admin products");

      setError(
        error.response?.data?.message ||
          "Failed to load products"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // -----------------------------
  // Fetch Categories
  // -----------------------------

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");

      setCategories(
        response.data.categories || []
      );
    } catch (error) {
      console.error(
        "Failed to fetch categories"
      );
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [
    page,
    search,
    category,
    status,
    sort,
  ]);

  // -----------------------------
  // Reset page when filters change
  // -----------------------------

  useEffect(() => {
    setPage(1);
  }, [search, category, status, sort]);

  // -----------------------------
  // Activate / Deactivate
  // -----------------------------

  const handleToggleStatus = async (product) => {
    const isActive = Boolean(product.is_active);

    const action = isActive
      ? "deactivate"
      : "activate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingId(product.id);
      setError("");

      await api.put(`/products/${product.id}`, {
        is_active: !isActive,
      });

      await fetchProducts(true);
    } catch (error) {
      console.error(
        "Failed to update product status"
      );

      setError(
        error.response?.data?.message ||
          `Failed to ${action} product`
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // -----------------------------
  // Helpers
  // -----------------------------

  const formatCurrency = (price) => {
    return `₹${Number(price || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  const getStockState = (stock) => {
    const value = Number(stock || 0);

    if (value === 0) {
      return {
        label: "Out of stock",
        className:
          "bg-red-50 text-red-700",
        dot: "bg-red-500",
      };
    }

    if (value <= 5) {
      return {
        label: `${value} left`,
        className:
          "bg-amber-50 text-amber-700",
        dot: "bg-amber-500",
      };
    }

    return {
      label: `${value} in stock`,
      className:
        "bg-green-50 text-green-700",
      dot: "bg-green-500",
    };
  };

  const totalProducts =
    pagination.total || 0;

  const startItem =
    totalProducts === 0
      ? 0
      : (page - 1) * limit + 1;

  const endItem = Math.min(
    page * limit,
    totalProducts
  );

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
                Loading products...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // -----------------------------
  // UI
  // -----------------------------

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
              Products
            </h1>

            <p className="mt-2 text-sm text-muted">
              Manage your product catalog, inventory and availability.
            </p>
          </div>

          <Link
            to="/admin/products/new"
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark"
          >
            <FiPlus size={18} />
            Add Product
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Filters */}
        <section className="mt-7 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">

          <div className="grid gap-3 lg:grid-cols-[minmax(250px,1fr)_180px_150px_160px_auto]">

            {/* Search */}
            <div className="relative">
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
                placeholder="Search products..."
                className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>

            {/* Category */}
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            >
              <option value="">
                All Categories
              </option>

              {categories.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.name}
                </option>
              ))}
            </select>

            {/* Status */}
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            >
              <option value="all">
                All Status
              </option>
              <option value="active">
                Active
              </option>
              <option value="inactive">
                Inactive
              </option>
            </select>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value)
              }
              className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            >
              <option value="newest">
                Newest
              </option>
              <option value="name_asc">
                Name A-Z
              </option>
              <option value="name_desc">
                Name Z-A
              </option>
              <option value="price_asc">
                Price Low-High
              </option>
              <option value="price_desc">
                Price High-Low
              </option>
            </select>

            {/* Refresh */}
            <button
              type="button"
              onClick={() =>
                fetchProducts(true)
              }
              disabled={refreshing}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiRefreshCw
                size={17}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              <span className="hidden xl:inline">
                Refresh
              </span>
            </button>
          </div>
        </section>

        {/* Summary */}
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-muted">
            {totalProducts === 0
              ? "No products found"
              : `Showing ${startItem}-${endItem} of ${totalProducts} products`}
          </p>

          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              In stock
            </span>

            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Low stock
            </span>

            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Out of stock
            </span>
          </div>
        </div>

        {/* Products Table */}
        <section className="mt-3 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

          {products.length === 0 ? (
            <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">

              <div className="rounded-full bg-gray-100 p-4 text-gray-400">
                <FiPackage size={30} />
              </div>

              <h3 className="mt-4 font-semibold text-text">
                No products found
              </h3>

              <p className="mt-1 max-w-sm text-sm text-muted">
                Try changing your search or filters, or add a new product.
              </p>

              <Link
                to="/admin/products/new"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
              >
                <FiPlus size={17} />
                Add Product
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px]">

                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70 text-left">
                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Product
                    </th>

                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Category
                    </th>

                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Price
                    </th>

                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Inventory
                    </th>

                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Status
                    </th>

                    <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">

                  {products.map((product) => {
                    const stockState =
                      getStockState(
                        product.stock
                      );

                    const isActive =
                      Boolean(
                        product.is_active
                      );

                    const isUpdating =
                      updatingId ===
                      product.id;

                    return (
                      <tr
                        key={product.id}
                        className="group transition hover:bg-gray-50/70"
                      >

                        {/* Product */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">

                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                              {product.image ? (
                                <img
                                  src={
                                    product.image
                                  }
                                  alt={
                                    product.name
                                  }
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display =
                                      "none";
                                  }}
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-gray-300">
                                  <FiPackage
                                    size={20}
                                  />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[280px] truncate text-sm font-semibold text-text">
                                {product.name}
                              </p>

                              <p className="mt-0.5 text-xs text-muted">
                                ID #{product.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-5 py-4">
                          <span className="text-sm text-gray-600">
                            {product.category_name ||
                              product.category ||
                              "Uncategorized"}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="px-5 py-4">
                          <span className="text-sm font-semibold text-text">
                            {formatCurrency(
                              product.price
                            )}
                          </span>
                        </td>

                        {/* Stock */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${stockState.className}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${stockState.dot}`}
                            />

                            {stockState.label}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                              isActive
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {isActive
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">

                            <Link
                              to={`/products/${product.id}`}
                              target="_blank"
                              rel="noreferrer"
                              title="View product"
                              className="rounded-lg border border-gray-200 p-2.5 text-gray-500 transition hover:border-primary hover:bg-teal-50 hover:text-primary"
                            >
                              <FiExternalLink
                                size={16}
                              />
                            </Link>

                            <Link
                              to={`/admin/products/edit/${product.id}`}
                              title="Edit product"
                              className="rounded-lg border border-gray-200 p-2.5 text-gray-500 transition hover:border-primary hover:bg-teal-50 hover:text-primary"
                            >
                              <FiEdit2
                                size={16}
                              />
                            </Link>

                            <button
                              type="button"
                              onClick={() =>
                                handleToggleStatus(
                                  product
                                )
                              }
                              disabled={
                                isUpdating
                              }
                              title={
                                isActive
                                  ? "Deactivate product"
                                  : "Activate product"
                              }
                              className={`rounded-lg border p-2.5 transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                isActive
                                  ? "border-gray-200 text-gray-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                                  : "border-green-200 bg-green-50 text-green-600 hover:bg-green-100"
                              }`}
                            >
                              {isUpdating ? (
                                <FiRefreshCw
                                  size={16}
                                  className="animate-spin"
                                />
                              ) : (
                                <FiPower
                                  size={16}
                                />
                              )}
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })}

                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-sm text-muted">
              Page {page} of{" "}
              {pagination.totalPages}
            </p>

            <div className="flex items-center gap-2">

              <button
                type="button"
                disabled={page <= 1}
                onClick={() =>
                  setPage((current) =>
                    Math.max(1, current - 1)
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiChevronLeft size={16} />
                Previous
              </button>

              <button
                type="button"
                disabled={
                  page >=
                  pagination.totalPages
                }
                onClick={() =>
                  setPage((current) =>
                    Math.min(
                      pagination.totalPages,
                      current + 1
                    )
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <FiChevronRight size={16} />
              </button>

            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default AdminProducts;