import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiFolder,
  FiSave,
} from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";

function CategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = Boolean(id);

  const [name, setName] = useState("");

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ========================================
  // FETCH CATEGORY
  // ========================================

  const fetchCategory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/categories/${id}`);

      setName(response.data.category?.name || "");
    } catch (error) {
      console.error("Failed to fetch category");

      setError(
        error.response?.data?.message ||
          "Failed to load category"
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // INITIAL LOAD
  // ========================================

  useEffect(() => {
    if (isEditMode) {
      fetchCategory();
    }
  }, [id]);

  // ========================================
  // SUBMIT
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const trimmedName = name.trim();

    // Validation
    if (!trimmedName) {
      setError("Category name is required.");
      return;
    }

    if (trimmedName.length < 2) {
      setError(
        "Category name must contain at least 2 characters."
      );
      return;
    }

    try {
      setSaving(true);

      if (isEditMode) {
        await api.put(`/categories/${id}`, {
          name: trimmedName,
        });

        setSuccess(
          "Category updated successfully."
        );
      } else {
        await api.post("/categories", {
          name: trimmedName,
        });

        setSuccess(
          "Category created successfully."
        );
      }

      setTimeout(() => {
        navigate("/admin/categories");
      }, 800);
    } catch (error) {
      console.error("Failed to save category");

      setError(
        error.response?.data?.message ||
          `Failed to ${
            isEditMode ? "update" : "create"
          } category`
      );
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-surface py-10">
        <div className="mx-auto flex min-h-[50vh] max-w-4xl items-center justify-center px-4">
          <p className="text-muted">
            Loading category...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface py-10 sm:py-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">

          <Link
            to="/admin/categories"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-primary"
          >
            <FiArrowLeft size={17} />
            Back to Categories
          </Link>

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FiFolder size={24} />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Administration
              </p>

              <h1 className="mt-1 text-3xl font-bold text-text sm:text-4xl">
                {isEditMode
                  ? "Edit Category"
                  : "Add Category"}
              </h1>

              <p className="mt-2 text-sm text-muted">
                {isEditMode
                  ? "Update the category name."
                  : "Create a new product category."}
              </p>
            </div>

          </div>
        </div>

        {/* Form Card */}
        <section className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-danger">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-6 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-success">
              <FiCheckCircle size={18} />
              {success}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* Category Name */}
            <div>
              <label
                htmlFor="category-name"
                className="mb-2 block text-sm font-semibold text-text"
              >
                Category Name *
              </label>

              <input
                id="category-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                  setSuccess("");
                }}
                placeholder="Enter category name"
                maxLength={100}
                autoFocus
                className="w-full rounded-xl border border-border px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />

              <p className="mt-2 text-xs text-muted">
                Choose a clear and unique name for the category.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">

              <Link
                to="/admin/categories"
                className="inline-flex items-center justify-center rounded-xl border border-border px-5 py-3 text-sm font-semibold text-text transition hover:bg-surface"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiSave size={18} />

                {saving
                  ? "Saving..."
                  : isEditMode
                    ? "Update Category"
                    : "Create Category"}
              </button>

            </div>

          </form>
        </section>
      </div>
    </main>
  );
}

export default CategoryForm;