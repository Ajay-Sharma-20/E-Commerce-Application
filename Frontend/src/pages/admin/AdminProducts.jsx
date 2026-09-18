import { useEffect, useState } from "react";
import {
  FiEdit2,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
  FiCheck,
} from "react-icons/fi";
import { Link } from "react-router-dom";

import api from "../../services/api";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("all");

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  // ========================================
  // FETCH PRODUCTS
  // ========================================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        limit: 100,
        status,
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
    } catch (error) {
      console.error("Failed to fetch admin products");

      setError(
        error.response?.data?.message ||
          "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // FETCH CATEGORIES
  // ========================================

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");

      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Failed to fetch categories");
    }
  };

  // ========================================
  // INITIAL CATEGORY LOAD
  // ========================================

  useEffect(() => {
    fetchCategories();
  }, []);

  // ========================================
  // FETCH PRODUCTS ON FILTER CHANGE
  // ========================================

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, category, status]);

  // ========================================
  // TOGGLE PRODUCT STATUS
  // ========================================

  const handleStatusChange = async (product) => {
    const isCurrentlyActive = Boolean(product.is_active);

    const action = isCurrentlyActive
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
        is_active: !isCurrentlyActive,
      });

      // Remove product from current filtered list
      setProducts((currentProducts) =>
        currentProducts.filter(
          (item) => item.id !== product.id
        )
      );
    } catch (error) {
      console.error(
        `Failed to ${action} product`
      );

      setError(
        error.response?.data?.message ||
          `Failed to ${action} product`
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-surface py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Administration
            </p>

            <h1 className="mt-2 text-4xl font-bold text-text">
              Products
            </h1>

            <p className="mt-3 text-muted">
              Manage the products available in your store.
            </p>
          </div>

          <Link
            to="/admin/products/new"
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-dark"
          >
            <FiPlus size={19} />
            Add Product
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-danger">
            {error}
          </div>
        )}

        {/* Filters */}
        <section className="mt-8 rounded-2xl border border-border bg-white p-5">
          <div className="grid gap-4 md:grid-cols-[1fr_220px_180px_auto]">

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
                placeholder="Search products..."
                className="w-full rounded-lg border border-border py-3 pl-10 pr-4 outline-none transition focus:border-primary"
              />
            </div>

            {/* Category */}
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="rounded-lg border border-border bg-white px-4 py-3 outline-none transition focus:border-primary"
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
              className="rounded-lg border border-border bg-white px-4 py-3 outline-none transition focus:border-primary"
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

            {/* Refresh */}
            <button
              type="button"
              onClick={fetchProducts}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 font-medium text-text transition hover:border-primary hover:text-primary disabled:opacity-50"
            >
              <FiRefreshCw
                size={17}
                className={
                  loading ? "animate-spin" : ""
                }
              />

              Refresh
            </button>
          </div>
        </section>

        {/* Product Table */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-white">

          {loading ? (
            <div className="py-20 text-center">
              <p className="text-muted">
                Loading products...
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center">
              <h2 className="text-xl font-semibold text-text">
                No products found
              </h2>

              <p className="mt-2 text-muted">
                Try changing your search, category or status filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left">

                <thead>
                  <tr className="border-b border-border bg-surface text-sm text-muted">

                    <th className="px-5 py-4 font-semibold">
                      Product
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Category
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Price
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Stock
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right font-semibold">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => {
                    const stock = Number(product.stock);

                    const isActive =
                      Boolean(product.is_active);

                    const isUpdating =
                      updatingId === product.id;

                    return (
                      <tr
                        key={product.id}
                        className="border-b border-border last:border-0 hover:bg-surface/50"
                      >

                        {/* Product */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-4">

                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-14 w-14 rounded-lg bg-surface object-cover"
                              />
                            ) : (
                              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-surface text-xs text-muted">
                                No Image
                              </div>
                            )}

                            <div className="min-w-0">
                              <p className="font-semibold text-text">
                                {product.name}
                              </p>

                              <p className="mt-1 text-xs text-muted">
                                ID: #{product.id}
                              </p>
                            </div>

                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-5 py-4 text-sm text-muted">
                          {product.category_name}
                        </td>

                        {/* Price */}
                        <td className="px-5 py-4 font-semibold text-text">
                          ₹
                          {Number(
                            product.price
                          ).toLocaleString("en-IN")}
                        </td>

                        {/* Stock */}
                        <td className="px-5 py-4">
                          <span
                            className={
                              stock === 0
                                ? "font-semibold text-danger"
                                : stock <= 5
                                  ? "font-semibold text-yellow-600"
                                  : "text-text"
                            }
                          >
                            {stock}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          {isActive ? (
                            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-success">
                              Active
                            </span>
                          ) : (
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                              Inactive
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">

                            {/* Edit */}
                            <Link
                              to={`/admin/products/edit/${product.id}`}
                              className="rounded-lg border border-border p-2.5 text-muted transition hover:border-primary hover:bg-primary/5 hover:text-primary"
                              title="Edit product"
                            >
                              <FiEdit2 size={17} />
                            </Link>

                            {/* Activate / Deactivate */}
                            <button
                              type="button"
                              onClick={() =>
                                handleStatusChange(product)
                              }
                              disabled={isUpdating}
                              className={
                                isActive
                                  ? "rounded-lg border border-border p-2.5 text-muted transition hover:border-red-300 hover:bg-red-50 hover:text-danger disabled:cursor-not-allowed disabled:opacity-50"
                                  : "rounded-lg border border-border p-2.5 text-muted transition hover:border-green-300 hover:bg-green-50 hover:text-success disabled:cursor-not-allowed disabled:opacity-50"
                              }
                              title={
                                isActive
                                  ? "Deactivate product"
                                  : "Activate product"
                              }
                            >
                              {isActive ? (
                                <FiTrash2 size={17} />
                              ) : (
                                <FiCheck size={17} />
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

        {/* Product Count */}
        {!loading && products.length > 0 && (
          <p className="mt-4 text-sm text-muted">
            Showing {products.length} product
            {products.length !== 1 ? "s" : ""}
          </p>
        )}

      </div>
    </main>
  );
}

export default AdminProducts;