import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheck,
  FiImage,
  FiPackage,
  FiSave,
  FiX,
} from "react-icons/fi";

import api from "../../services/api";

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = Boolean(id);

  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    category_id: "",
    price: "",
    stock: "",
    image: "",
    description: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(
    isEditMode
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --------------------------------
  // Fetch categories
  // --------------------------------

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get(
          "/categories"
        );

        setCategories(
          response.data.categories || []
        );
      } catch (error) {
        console.error(
          "Failed to fetch categories"
        );

        setError(
          "Failed to load categories. Please refresh the page."
        );
      }
    };

    fetchCategories();
  }, []);

  // --------------------------------
  // Fetch product for edit
  // --------------------------------

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/products/admin/${id}`
        );

        const product =
          response.data.product;

        if (!product) {
          throw new Error(
            "Product not found"
          );
        }

        setForm({
          name: product.name || "",
          category_id:
            product.category_id?.toString() ||
            "",
          price:
            product.price !== undefined &&
            product.price !== null
              ? product.price.toString()
              : "",
          stock:
            product.stock !== undefined &&
            product.stock !== null
              ? product.stock.toString()
              : "",
          image: product.image || "",
          description:
            product.description || "",
          is_active: Boolean(
            product.is_active
          ),
        });
      } catch (error) {
        console.error(
          "Failed to fetch product",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load product"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, isEditMode]);

  // --------------------------------
  // Input handler
  // --------------------------------

  const handleChange = (e) => {
    const { name, value, type, checked } =
      e.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setError("");
    setSuccess("");
  };

  // --------------------------------
  // Validation
  // --------------------------------

  const validateForm = () => {
    const name = form.name.trim();

    if (!name) {
      return "Product name is required.";
    }

    if (name.length < 2) {
      return "Product name must contain at least 2 characters.";
    }

    if (!form.category_id) {
      return "Please select a category.";
    }

    if (
      form.price === "" ||
      Number.isNaN(Number(form.price))
    ) {
      return "Please enter a valid price.";
    }

    if (Number(form.price) < 0) {
      return "Price cannot be negative.";
    }

    if (
      form.stock === "" ||
      !Number.isInteger(Number(form.stock))
    ) {
      return "Stock must be a whole number.";
    }

    if (Number(form.stock) < 0) {
      return "Stock cannot be negative.";
    }

    if (form.image.trim()) {
      try {
        new URL(form.image.trim());
      } catch {
        return "Please enter a valid image URL.";
      }
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

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);

      const payload = {
        category_id: Number(
          form.category_id
        ),
        name: form.name.trim(),
        description:
          form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        image: form.image.trim(),
        is_active: Boolean(form.is_active),
      };

      if (isEditMode) {
        await api.put(
          `/products/${id}`,
          payload
        );

        setSuccess(
          "Product updated successfully."
        );
      } else {
        await api.post(
          "/products",
          payload
        );

        setSuccess(
          "Product created successfully."
        );
      }

      setTimeout(() => {
        navigate("/admin/products");
      }, 700);
    } catch (error) {
      console.error(
        "Failed to save product",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to save product. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------
  // Image preview
  // --------------------------------

  const imageUrl = form.image.trim();

  // --------------------------------
  // Loading
  // --------------------------------

  if (loading) {
    return (
      <main className="min-h-screen bg-surface px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[500px] max-w-5xl items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-primary" />

            <p className="mt-4 text-sm text-muted">
              Loading product...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface py-8 sm:py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-7">
          <Link
            to="/admin/products"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-primary"
          >
            <FiArrowLeft size={17} />
            Back to Products
          </Link>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Store Management
              </p>

              <h1 className="mt-1 text-3xl font-bold text-text">
                {isEditMode
                  ? "Edit Product"
                  : "Add Product"}
              </h1>

              <p className="mt-2 text-sm text-muted">
                {isEditMode
                  ? "Update product information, pricing and inventory."
                  : "Add a new product to your store catalog."}
              </p>
            </div>

            {isEditMode && (
              <span
                className={`inline-flex w-fit items-center rounded-full px-3 py-1.5 text-xs font-semibold ${
                  form.is_active
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {form.is_active
                  ? "Active Product"
                  : "Inactive Product"}
              </span>
            )}
          </div>
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
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

            {/* Main Form */}
            <div className="space-y-6">

              {/* Product Information */}
              <section className="rounded-xl border border-gray-100 bg-white shadow-sm">

                <div className="border-b border-gray-100 px-6 py-5">
                  <h2 className="font-semibold text-text">
                    Product Information
                  </h2>

                  <p className="mt-1 text-xs text-muted">
                    Basic information customers will see.
                  </p>
                </div>

                <div className="space-y-5 p-6">

                  {/* Name */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Product Name
                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Wireless Headphones"
                      maxLength={150}
                      className="h-11 w-full rounded-lg border border-gray-200 px-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />

                    <p className="mt-1.5 text-right text-xs text-gray-400">
                      {form.name.length}/150
                    </p>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Category
                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </label>

                    <select
                      name="category_id"
                      value={
                        form.category_id
                      }
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                    >
                      <option value="">
                        Select category
                      </option>

                      {categories.map(
                        (category) => (
                          <option
                            key={
                              category.id
                            }
                            value={
                              category.id
                            }
                          >
                            {category.name}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">
                        Description
                      </label>

                      <span className="text-xs text-gray-400">
                        {form.description.length}
                        /2000
                      </span>
                    </div>

                    <textarea
                      name="description"
                      value={
                        form.description
                      }
                      onChange={handleChange}
                      maxLength={2000}
                      rows={6}
                      placeholder="Describe the product, features and important details..."
                      className="w-full resize-none rounded-lg border border-gray-200 px-3.5 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                </div>
              </section>

              {/* Pricing & Inventory */}
              <section className="rounded-xl border border-gray-100 bg-white shadow-sm">

                <div className="border-b border-gray-100 px-6 py-5">
                  <h2 className="font-semibold text-text">
                    Pricing & Inventory
                  </h2>

                  <p className="mt-1 text-xs text-muted">
                    Set the selling price and available stock.
                  </p>
                </div>

                <div className="grid gap-5 p-6 sm:grid-cols-2">

                  {/* Price */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Price
                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </label>

                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">
                        ₹
                      </span>

                      <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="h-11 w-full rounded-lg border border-gray-200 pl-8 pr-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                      />
                    </div>
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Stock Quantity
                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </label>

                    <input
                      type="number"
                      name="stock"
                      value={form.stock}
                      onChange={handleChange}
                      min="0"
                      step="1"
                      placeholder="0"
                      className="h-11 w-full rounded-lg border border-gray-200 px-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />

                    <p className="mt-1.5 text-xs text-gray-400">
                      Use 0 for an out-of-stock product.
                    </p>
                  </div>
                </div>
              </section>

              {/* Product Status */}
              <section className="rounded-xl border border-gray-100 bg-white shadow-sm">

                <div className="flex items-center justify-between gap-4 p-6">

                  <div>
                    <h2 className="font-semibold text-text">
                      Product Visibility
                    </h2>

                    <p className="mt-1 text-xs text-muted">
                      Inactive products won't appear in the customer store.
                    </p>
                  </div>

                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={
                        form.is_active
                      }
                      onChange={handleChange}
                      className="peer sr-only"
                    />

                    <div className="h-6 w-11 rounded-full bg-gray-200 transition peer-checked:bg-primary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/10 after:absolute after:left-[3px] after:top-[3px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-all peer-checked:after:translate-x-5" />
                  </label>
                </div>
              </section>
            </div>

            {/* Right Side */}
            <div className="space-y-6">

              {/* Image */}
              <section className="rounded-xl border border-gray-100 bg-white shadow-sm">

                <div className="border-b border-gray-100 px-5 py-4">
                  <h2 className="font-semibold text-text">
                    Product Image
                  </h2>

                  <p className="mt-1 text-xs text-muted">
                    Add an image URL for the product.
                  </p>
                </div>

                <div className="p-5">

                  <div className="mb-4 aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="Product preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";

                          e.currentTarget.parentElement.innerHTML = `
                            <div class="flex h-full items-center justify-center text-gray-400">
                              <div class="text-center">
                                <div class="flex justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.409 2.409M3.75 19.5h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                  </svg>
                                </div>
                                <p class="mt-2 text-xs">Image unavailable</p>
                              </div>
                            </div>
                          `;
                        }}
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center text-gray-400">
                        <FiImage size={34} />

                        <p className="mt-3 text-sm font-medium">
                          Image preview
                        </p>

                        <p className="mt-1 text-xs">
                          Enter an image URL below
                        </p>
                      </div>
                    )}
                  </div>

                  <input
                    type="url"
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="https://example.com/product.jpg"
                    className="h-11 w-full rounded-lg border border-gray-200 px-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              </section>

              {/* Publish Card */}
              <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">

                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-teal-50 p-2.5 text-primary">
                    <FiPackage size={20} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-text">
                      Ready to save?
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-muted">
                      Review the product information before saving your changes.
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
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
                          : "Create Product"}
                      </>
                    )}
                  </button>

                  <Link
                    to="/admin/products"
                    className="inline-flex h-11 items-center justify-center rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                  >
                    Cancel
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

export default ProductForm;