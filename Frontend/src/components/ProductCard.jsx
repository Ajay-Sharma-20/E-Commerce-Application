import { useState } from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setMessage("Please login first");
      return;
    }

    try {
      setAdding(true);
      setMessage("");

      await addToCart(product.id);

      setMessage("Added to cart");

      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link
        to={`/products/${product.id}`}
        className="block overflow-hidden bg-surface"
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-64 w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </Link>

      <div className="p-5">
        <p className="mb-1 text-sm font-medium text-primary">
          {product.category_name}
        </p>

        <Link to={`/products/${product.id}`}>
          <h3 className="line-clamp-2 text-lg font-semibold text-text transition hover:text-primary">
            {product.name}
          </h3>
        </Link>

        <p className="mt-2 line-clamp-2 text-sm text-muted">
          {product.description}
        </p>

        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="text-xl font-bold text-text">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </span>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={adding || product.stock <= 0}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiShoppingCart size={17} />

            {product.stock <= 0
              ? "Out of Stock"
              : adding
                ? "Adding..."
                : "Add"}
          </button>
        </div>

        {message && (
          <p className="mt-3 text-sm font-medium text-primary">
            {message}
          </p>
        )}
      </div>
    </article>
  );
}

export default ProductCard;