import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheck,
  FiFolder,
  FiSave,
  FiX,
} from "react-icons/fi";

import api from "../../services/api";

function CategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = Boolean(id);

  const [name, setName] = useState("");

  const [loading, setLoading] = useState(
    isEditMode
  );

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --------------------------------
  // Fetch category for edit
  // --------------------------------

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const fetchCategory = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/categories/${id}`
        );

        const category =
          response.data.category;

        if (!category) {
          throw new Error(
            "Category not found"
          );
        }

        setName(category.name || "");
      } catch (error) {
        console.error(
          "Failed to fetch category",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load category"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id, isEditMode]);

  // --------------------------------
  // Input
  // --------------------------------

  const handleChange = (e) => {
    setName(e.target.value);

    setError("");
    setSuccess("");
  };

  // --------------------------------
  // Validation
  // --------------------------------

  const validate = () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return "Category name is required.";
    }

    if (trimmedName.length < 2) {
      return "Category name must contain at least 2 characters.";
    }

    if (trimmedName.length > 100) {
      return "Category name cannot exceed 100 characters.";
    }

    return "";
  };

  // --------------------------------
  // Submit
  // --------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: name.trim(),
      };

      if (isEditMode) {
        await api.put(
          `/categories/${id}`,
          payload
        );

        setSuccess(
          "Category updated successfully."
        );
      } else {
        await api.post(
          "/categories",
          payload
        );

        setSuccess(
          "Category created successfully."
        );
      }

      setTimeout(() => {
        navigate("/admin/categories");
      }, 700);
    } catch (error) {
      console.error(
        "Failed to save category",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to save category. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------
  // Loading
  // --------------------------------

  if (loading) {
    return (
      <main className="min-h-screen bg-surface px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[500px] max-w-4xl items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-primary" />

            <p className="mt-4 text-sm text-muted">
              Loading category...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface py-8 sm:py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-7">

          <Link
            to="/admin/categories"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-primary"
          >
            <FiArrowLeft size={17} />
            Back to Categories
          </Link>

          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Store Management
          </p>

          <h1 className="mt-1 text-3xl font-bold text-text">
            {isEditMode
              ? "Edit Category"
              : "Add Category"}
          </h1>

          <p className="mt-2 text-sm text-muted">
            {isEditMode
              ? "Update the category name used to organize your products."
              : "Create a category to organize products in your store."}
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700">
            <FiX
              className="mt-0.5 shrink-0"
              size={17}
            />

            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3.5 text-sm text-green-700">
            <FiCheck
              className="mt-0.5 shrink-0"
              size={17}
            />

            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-[1fr_300px]">

            {/* Form */}
            <section className="rounded-xl border border-gray-100 bg-white shadow-sm">

              <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="font-semibold text-text">
                  Category Information
                </h2>

                <p className="mt-1 text-xs text-muted">
                  Keep category names short and easy for customers to understand.
                </p>
              </div>

              <div className="p-6">

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Category Name
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={handleChange}
                  placeholder="e.g. Electronics"
                  maxLength={100}
                  autoFocus
                  className="h-12 w-full rounded-lg border border-gray-200 px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />

                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-gray-400">
                    Choose a unique name for this category.
                  </p>

                  <span className="text-xs text-gray-400">
                    {name.length}/100
                  </span>
                </div>

              </div>

            </section>

            {/* Preview */}
            <section className="rounded-xl border border-gray-100 bg-white shadow-sm">

              <div className="border-b border-gray-100 px-5 py-4">
                <h2 className="font-semibold text-text">
                  Preview
                </h2>

                <p className="mt-1 text-xs text-muted">
                  How the category will appear in the admin list.
                </p>
              </div>

              <div className="p-5">

                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-primary">
                      <FiFolder size={20} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-text">
                        {name.trim() ||
                          "Category Name"}
                      </p>

                      <p className="mt-0.5 text-xs text-muted">
                        Category
                      </p>
                    </div>

                  </div>

                </div>

                <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50 p-4">
                  <p className="text-xs font-semibold text-blue-800">
                    Important
                  </p>

                  <p className="mt-1 text-xs leading-5 text-blue-700">
                    A category containing products cannot be deleted. This protects your product catalog from accidental data loss.
                  </p>
                </div>

              </div>

            </section>

          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <Link
              to="/admin/categories"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-gray-200 bg-white px-5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Saving...
                </>
              ) : (
                <>
                  <FiSave size={17} />

                  {isEditMode
                    ? "Save Changes"
                    : "Create Category"}
                </>
              )}
            </button>

          </div>
        </form>
      </div>
    </main>
  );
}

export default CategoryForm;