import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiEdit2,
  FiFolder,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
  FiPackage,
} from "react-icons/fi";

import api from "../../services/api";

function AdminCategories() {
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --------------------------------
  // Fetch categories
  // --------------------------------

  const fetchCategories = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get("/categories");

      setCategories(
        response.data.categories || []
      );
    } catch (error) {
      console.error(
        "Failed to fetch categories",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load categories"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // --------------------------------
  // Search
  // --------------------------------

  const filteredCategories = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return categories;
    }

    return categories.filter((category) =>
      category.name
        ?.toLowerCase()
        .includes(query)
    );
  }, [categories, search]);

  // --------------------------------
  // Delete category
  // --------------------------------

  const handleDelete = async (category) => {
    const productCount = Number(
      category.product_count || 0
    );

    if (productCount > 0) {
      setError(
        `"${category.name}" cannot be deleted because ${productCount} product${
          productCount !== 1 ? "s are" : " is"
        } assigned to it.`
      );

      setSuccess("");
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
      setSuccess("");

      await api.delete(
        `/categories/${category.id}`
      );

      setCategories((current) =>
        current.filter(
          (item) => item.id !== category.id
        )
      );

      setSuccess(
        `"${category.name}" deleted successfully.`
      );
    } catch (error) {
      console.error(
        "Failed to delete category",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete category"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // --------------------------------
  // Helpers
  // --------------------------------

  const totalCategories = categories.length;

  const categoriesWithProducts =
    categories.filter(
      (category) =>
        Number(category.product_count || 0) > 0
    ).length;

  const emptyCategories =
    categories.filter(
      (category) =>
        Number(category.product_count || 0) === 0
    ).length;

  // --------------------------------
  // Loading
  // --------------------------------

  if (loading) {
    return (
      <main className="min-h-screen bg-surface px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-primary" />

              <p className="mt-4 text-sm text-muted">
                Loading categories...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface py-8 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Store Management
            </p>

            <h1 className="mt-1 text-3xl font-bold text-text">
              Categories
            </h1>

            <p className="mt-2 text-sm text-muted">
              Organize your products into manageable store categories.
            </p>
          </div>

          <Link
            to="/admin/categories/new"
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark"
          >
            <FiPlus size={18} />
            Add Category
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-7 grid gap-4 sm:grid-cols-3">

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">
                  Total Categories
                </p>

                <p className="mt-2 text-2xl font-bold text-text">
                  {totalCategories}
                </p>
              </div>

              <div className="rounded-lg bg-teal-50 p-3 text-primary">
                <FiFolder size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">
                  In Use
                </p>

                <p className="mt-2 text-2xl font-bold text-text">
                  {categoriesWithProducts}
                </p>
              </div>

              <div className="rounded-lg bg-green-50 p-3 text-green-600">
                <FiPackage size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">
                  Empty Categories
                </p>

                <p className="mt-2 text-2xl font-bold text-text">
                  {emptyCategories}
                </p>
              </div>

              <div className="rounded-lg bg-amber-50 p-3 text-amber-600">
                <FiFolder size={21} />
              </div>
            </div>
          </div>

        </div>

        {/* Messages */}
        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3.5 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Search / Refresh */}
        <section className="mt-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row">

            <div className="relative flex-1">
              <FiSearch
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setError("");
                }}
                placeholder="Search categories..."
                className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <button
              type="button"
              onClick={() =>
                fetchCategories(true)
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

              Refresh
            </button>

          </div>
        </section>

        {/* Table */}
        <section className="mt-5 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

          {filteredCategories.length === 0 ? (
            <div className="flex min-h-[330px] flex-col items-center justify-center px-6 text-center">

              <div className="rounded-full bg-gray-100 p-4 text-gray-400">
                <FiFolder size={30} />
              </div>

              <h3 className="mt-4 font-semibold text-text">
                {search
                  ? "No categories found"
                  : "No categories yet"}
              </h3>

              <p className="mt-1 max-w-sm text-sm text-muted">
                {search
                  ? "Try a different search term."
                  : "Create your first category to organize your products."}
              </p>

              {!search && (
                <Link
                  to="/admin/categories/new"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
                >
                  <FiPlus size={17} />
                  Add Category
                </Link>
              )}

            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">

                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70 text-left">
                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Category
                    </th>

                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Products
                    </th>

                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">

                  {filteredCategories.map(
                    (category) => {
                      const productCount =
                        Number(
                          category.product_count ||
                            0
                        );

                      const isDeleting =
                        deletingId ===
                        category.id;

                      return (
                        <tr
                          key={category.id}
                          className="group transition hover:bg-gray-50/70"
                        >

                          {/* Category */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">

                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-primary">
                                <FiFolder
                                  size={20}
                                />
                              </div>

                              <div>
                                <p className="font-semibold text-text">
                                  {category.name}
                                </p>

                                <p className="mt-0.5 text-xs text-muted">
                                  Category #
                                  {category.id}
                                </p>
                              </div>

                            </div>
                          </td>

                          {/* Product count */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">

                              <span className="text-sm font-semibold text-text">
                                {productCount}
                              </span>

                              <span className="text-xs text-muted">
                                product
                                {productCount !==
                                1
                                  ? "s"
                                  : ""}
                              </span>

                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            {productCount > 0 ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                In use
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                                <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                                Empty
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">

                              <Link
                                to={`/admin/categories/edit/${category.id}`}
                                title="Edit category"
                                className="rounded-lg border border-gray-200 p-2.5 text-gray-500 transition hover:border-primary hover:bg-teal-50 hover:text-primary"
                              >
                                <FiEdit2
                                  size={16}
                                />
                              </Link>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    category
                                  )
                                }
                                disabled={
                                  isDeleting ||
                                  productCount >
                                    0
                                }
                                title={
                                  productCount >
                                  0
                                    ? "Cannot delete a category containing products"
                                    : "Delete category"
                                }
                                className="rounded-lg border border-gray-200 p-2.5 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                {isDeleting ? (
                                  <FiRefreshCw
                                    size={16}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <FiTrash2
                                    size={16}
                                  />
                                )}
                              </button>

                            </div>
                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Footer info */}
        {filteredCategories.length > 0 && (
          <div className="mt-4 flex flex-col gap-1 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing {filteredCategories.length} of{" "}
              {totalCategories} categories
            </span>

            <span className="text-xs">
              Categories with products cannot be deleted.
            </span>
          </div>
        )}

      </div>
    </main>
  );
}

export default AdminCategories;