import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiMinus, FiPlus, FiShoppingCart } from "react-icons/fi";

import api from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/products/${id}`);

      setProduct(response.data.product);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load product"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const increaseQuantity = () => {
    if (product && quantity < Number(product.stock)) {
      setQuantity((current) => current + 1);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setAdding(true);
      setMessage("");
      setError("");

      await addToCart(product.id, quantity);

      setMessage("Product added to cart successfully.");
    } catch (error) {
      setError(error.message);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-muted">Loading product...</p>
      </main>
    );
  }

  if (error && !product) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
          <h1 className="text-xl font-semibold text-red-600">
            Product not found
          </h1>

          <p className="mt-2 text-sm text-red-500">
            {error}
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-dark"
          >
            <FiArrowLeft size={18} />
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  const stock = Number(product.stock);
  const price = Number(product.price);

  return (
    <main>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Back */}
          <Link
            to="/products"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-primary"
          >
            <FiArrowLeft size={17} />
            Back to Products
          </Link>

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">

            {/* Product Image */}
            <div className="overflow-hidden rounded-3xl bg-surface">
              <img
                src={product.image}
                alt={product.name}
                className="h-[420px] w-full object-cover sm:h-[520px]"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center">

              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                {product.category_name}
              </p>

              <h1 className="mt-3 text-3xl font-bold leading-tight text-text sm:text-4xl">
                {product.name}
              </h1>

              <p className="mt-6 text-3xl font-bold text-text">
                ₹{price.toLocaleString("en-IN")}
              </p>

              <div className="my-8 h-px bg-border" />

              <p className="leading-7 text-muted">
                {product.description}
              </p>

              {/* Stock */}
              <div className="mt-6">
                {stock > 0 ? (
                  <p className="text-sm font-medium text-success">
                    {stock} items available
                  </p>
                ) : (
                  <p className="text-sm font-medium text-danger">
                    Out of stock
                  </p>
                )}
              </div>

              {/* Quantity */}
              {stock > 0 && (
                <div className="mt-6">
                  <p className="mb-2 text-sm font-semibold text-text">
                    Quantity
                  </p>

                  <div className="flex w-fit items-center overflow-hidden rounded-lg border border-border">
                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="p-3 transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Decrease quantity"
                    >
                      <FiMinus size={17} />
                    </button>

                    <span className="min-w-12 text-center font-semibold">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={increaseQuantity}
                      disabled={quantity >= stock}
                      className="p-3 transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      <FiPlus size={17} />
                    </button>
                  </div>
                </div>
              )}

              {/* Messages */}
              {message && (
                <p className="mt-5 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-success">
                  {message}
                </p>
              )}

              {error && product && (
                <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-danger">
                  {error}
                </p>
              )}

              {/* Add to Cart */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={stock <= 0 || adding}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiShoppingCart size={19} />

                {stock <= 0
                  ? "Out of Stock"
                  : adding
                    ? "Adding..."
                    : "Add to Cart"}
              </button>

              {!isAuthenticated && stock > 0 && (
                <p className="mt-3 text-center text-sm text-muted">
                  You need to login before adding products to your cart.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;