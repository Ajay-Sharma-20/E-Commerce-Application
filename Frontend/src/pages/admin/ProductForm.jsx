import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiBox,
  FiCheckCircle,
  FiSave,
} from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    image: "",
    is_active: true,
  });

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data.categories || []);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to load categories."
      );
    }
  };

  // Fetch product when editing
  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/products/admin/${id}`);
      const product = response.data.product;

      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        stock: product.stock || "",
        category_id: product.category_id || "",
        image: product.image || "",
        is_active: Boolean(product.is_active),
      });
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to load product."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();

    if (isEditMode) {
      fetchProduct();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Frontend validation
    if (!formData.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!formData.category_id) {
      setError("Please select a category.");
      return;
    }

    if (formData.price === "" || Number(formData.price) < 0) {
      setError("Please enter a valid price.");
      return;
    }

    if (formData.stock === "" || Number(formData.stock) < 0) {
      setError("Please enter a valid stock quantity.");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      stock: Number(formData.stock),
      category_id: Number(formData.category_id),
      image: formData.image.trim(),
      is_active: formData.is_active,
    };

    try {
      setSaving(true);

      if (isEditMode) {
        await api.put(`/products/${id}`, payload);
        setSuccess("Product updated successfully.");

        setTimeout(() => {
          navigate("/admin/products");
        }, 800);
      } else {
        await api.post("/products", payload);
        setSuccess("Product created successfully.");

        setTimeout(() => {
          navigate("/admin/products");
        }, 800);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} product.`
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/admin/products"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-primary"
          >
            <FiArrowLeft size={17} />
            Back to Products
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FiBox size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-text sm:text-3xl">
                {isEditMode ? "Edit Product" : "Add Product"}
              </h1>

              <p className="mt-1 text-sm text-muted">
                {isEditMode
                  ? "Update product information."
                  : "Add a new product to your store."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-success">
            <FiCheckCircle size={18} />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-text"
            >
              Product Name *
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="w-full rounded-xl border border-border px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category_id"
              className="mb-2 block text-sm font-semibold text-text"
            >
              Category *
            </label>

            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full rounded-xl border border-border bg-white px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            >
              <option value="">Select category</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price + Stock */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="price"
                className="mb-2 block text-sm font-semibold text-text"
              >
                Price (₹) *
              </label>

              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full rounded-xl border border-border px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <div>
              <label
                htmlFor="stock"
                className="mb-2 block text-sm font-semibold text-text"
              >
                Stock *
              </label>

              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                step="1"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                className="w-full rounded-xl border border-border px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>

          {/* Image */}
          <div>
            <label
              htmlFor="image"
              className="mb-2 block text-sm font-semibold text-text"
            >
              Image URL
            </label>

            <input
              id="image"
              name="image"
              type="url"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/product-image.jpg"
              className="w-full rounded-xl border border-border px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />

            <p className="mt-2 text-xs text-muted">
              Enter a publicly accessible image URL.
            </p>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-semibold text-text"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows="5"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write a short product description..."
              className="w-full resize-none rounded-xl border border-border px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          {/* Active */}
          <div className="rounded-xl border border-border bg-surface p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="mt-1 h-4 w-4 accent-primary"
              />

              <div>
                <p className="text-sm font-semibold text-text">
                  Active Product
                </p>

                <p className="mt-1 text-xs text-muted">
                  Active products are visible to customers.
                </p>
              </div>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
            <Link
              to="/admin/products"
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
                  ? "Update Product"
                  : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;