import { useEffect, useState } from "react";
import {
  FiEdit2,
  FiFolder,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";
import { Link } from "react-router-dom";

import api from "../../services/api";

function AdminCategories() {
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  // ========================================
  // FETCH CATEGORIES
  // ========================================

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/categories");

      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Failed to fetch categories");

      setError(
        error.response?.data?.message ||
          "Failed to load categories"
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // INITIAL LOAD
  // ========================================

  useEffect(() => {
    fetchCategories();
  }, []);

  // ========================================
  // DELETE CATEGORY
  // ========================================

  const handleDelete = async (category) => {
    if (Number(category.product_count) > 0) {
      setError(
        `Cannot delete "${category.name}" because it has products assigned to it.`
      );

      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(category.id);
      setError("");

      await api.delete(`/categories/${category.id}`);

      setCategories((currentCategories) =>
        currentCategories.filter(
          (item) => item.id !== category.id
        )
      );
    } catch (error) {
      console.error("Failed to delete category");

      setError(
        error.response?.data?.message ||
          "Failed to delete category"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ========================================
  // SEARCH
  // ========================================

  const filteredCategories = categories.filter((category) =>
    category.name
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  return (
    <main className="min-h-screen bg-surface py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

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
              Categories
            </h1>

            <p className="mt-3 text-muted">
              Create and manage product categories.
            </p>
          </div>

          <Link
            to="/admin/categories/new"
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-dark"
          >
            <FiPlus size={19} />
            Add Category
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-danger">
            {error}
          </div>
        )}

        {/* Search / Refresh */}
        <section className="mt-8 rounded-2xl border border-border bg-white p-5">
          <div className="flex flex-col gap-4 sm:flex-row">

            {/* Search */}
            <div className="relative flex-1">
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
                placeholder="Search categories..."
                className="w-full rounded-lg border border-border py-3 pl-10 pr-4 outline-none transition focus:border-primary"
              />
            </div>

            {/* Refresh */}
            <button
              type="button"
              onClick={fetchCategories}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-5 py-3 font-medium text-text transition hover:border-primary hover:text-primary disabled:opacity-50"
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

        {/* Categories */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-white">

          {loading ? (
            <div className="py-20 text-center">
              <p className="text-muted">
                Loading categories...
              </p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="py-20 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FiFolder size={25} />
              </div>

              <h2 className="mt-5 text-xl font-semibold text-text">
                No categories found
              </h2>

              <p className="mt-2 text-muted">
                Try changing your search or create a new category.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">

                <thead>
                  <tr className="border-b border-border bg-surface text-sm text-muted">

                    <th className="px-5 py-4 font-semibold">
                      Category
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Products
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Created
                    </th>

                    <th className="px-5 py-4 text-right font-semibold">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {filteredCategories.map((category) => {
                    const productCount = Number(
                      category.product_count || 0
                    );

                    const isDeleting =
                      deletingId === category.id;

                    return (
                      <tr
                        key={category.id}
                        className="border-b border-border last:border-0 hover:bg-surface/50"
                      >

                        {/* Category */}
                        <td className="px-5 py-5">
                          <div className="flex items-center gap-4">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                              <FiFolder size={20} />
                            </div>

                            <div>
                              <p className="font-semibold text-text">
                                {category.name}
                              </p>

                              <p className="mt-1 text-xs text-muted">
                                ID: #{category.id}
                              </p>
                            </div>

                          </div>
                        </td>

                        {/* Product Count */}
                        <td className="px-5 py-5">
                          <span className="rounded-full bg-surface px-3 py-1 text-sm font-semibold text-text">
                            {productCount}
                          </span>
                        </td>

                        {/* Created */}
                        <td className="px-5 py-5 text-sm text-muted">
                          {new Date(
                            category.created_at
                          ).toLocaleDateString("en-IN")}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-5">
                          <div className="flex justify-end gap-2">

                            {/* Edit */}
                            <Link
                              to={`/admin/categories/edit/${category.id}`}
                              className="rounded-lg border border-border p-2.5 text-muted transition hover:border-primary hover:bg-primary/5 hover:text-primary"
                              title="Edit category"
                            >
                              <FiEdit2 size={17} />
                            </Link>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(category)
                              }
                              disabled={
                                isDeleting ||
                                productCount > 0
                              }
                              className="rounded-lg border border-border p-2.5 text-muted transition hover:border-red-300 hover:bg-red-50 hover:text-danger disabled:cursor-not-allowed disabled:opacity-40"
                              title={
                                productCount > 0
                                  ? "Category has products"
                                  : "Delete category"
                              }
                            >
                              <FiTrash2 size={17} />
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

        {/* Count */}
        {!loading && filteredCategories.length > 0 && (
          <p className="mt-4 text-sm text-muted">
            Showing {filteredCategories.length} categor
            {filteredCategories.length !== 1
              ? "ies"
              : "y"}
          </p>
        )}

      </div>
    </main>
  );
}

export default AdminCategories;