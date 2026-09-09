import { useEffect, useState } from "react";
import { FiArrowRight, FiFolder } from "react-icons/fi";
import { Link } from "react-router-dom";

import api from "../services/api";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <main>
      {/* Page Header */}
      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Explore
          </p>

          <h1 className="mt-2 text-4xl font-bold text-text">
            Shop by Category
          </h1>

          <p className="mt-4 max-w-2xl text-muted">
            Browse our product categories and discover
            something that's right for you.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Loading */}
          {loading && (
            <div className="py-20 text-center">
              <p className="text-muted">
                Loading categories...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
              <p className="font-medium text-danger">
                {error}
              </p>

              <button
                type="button"
                onClick={fetchCategories}
                className="mt-5 rounded-lg bg-primary px-5 py-2.5 font-semibold text-white transition hover:bg-primary-dark"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading &&
            !error &&
            categories.length === 0 && (
              <div className="rounded-2xl border border-border bg-surface p-16 text-center">
                <FiFolder
                  size={40}
                  className="mx-auto text-muted"
                />

                <h2 className="mt-4 text-xl font-semibold text-text">
                  No categories available
                </h2>

                <p className="mt-2 text-muted">
                  Categories will appear here once they are
                  added.
                </p>
              </div>
            )}

          {/* Category Grid */}
          {!loading &&
            !error &&
            categories.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/products?category=${category.id}`}
                    className="group rounded-2xl border border-border bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-lg"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
                      <FiFolder size={23} />
                    </div>

                    <h2 className="mt-5 text-xl font-semibold text-text transition group-hover:text-primary">
                      {category.name}
                    </h2>

                    <div className="mt-5 flex items-center gap-2 text-sm font-medium text-muted transition group-hover:text-primary">
                      View Products
                      <FiArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            )}
        </div>
      </section>
    </main>
  );
}

export default Categories;