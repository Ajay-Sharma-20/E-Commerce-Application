
import { useEffect, useState } from "react";
import { FiSearch, FiSliders } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";

import api from "../services/api";
import ProductCard from "../components/ProductCard";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  const urlSearch = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "";

  const [category, setCategory] = useState(urlCategory);

  // ========================================
  // FETCH PRODUCTS
  // ========================================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      // Search
      if (search.trim()) {
        params.search = search.trim();
      }

      // Category
      if (category) {
        params.category = category;
      }

      // Sort
      if (sort) {
        params.sort = sort;
      }

      const response = await api.get("/products", {
        params,
      });

      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);

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

      setCategories(
        response.data.categories || []
      );
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  // ========================================
  // LOAD CATEGORIES ONCE
  // ========================================

  useEffect(() => {
    fetchCategories();
  }, []);

  // ========================================
  // SYNC URL SEARCH WITH SEARCH STATE
  // ========================================

  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  // ========================================
  // SYNC URL CATEGORY WITH CATEGORY STATE
  // ========================================

  useEffect(() => {
    setCategory(urlCategory);
  }, [urlCategory]);

  // ========================================
  // FETCH PRODUCTS WHEN FILTERS CHANGE
  // ========================================

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, category, sort]);

  // ========================================
  // HANDLE CATEGORY CHANGE
  // ========================================

  const handleCategoryChange = (value) => {
    setCategory(value);

    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("category", value);
    } else {
      params.delete("category");
    }

    setSearchParams(params);
  };

  return (
    <main>
      {/* Header */}
      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Our Collection
          </p>

          <h1 className="mt-2 text-4xl font-bold text-text">
            All Products
          </h1>

          <p className="mt-4 max-w-2xl text-muted">
            Discover products from our collection and find
            something you'll love.
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Filters */}
          <div className="mb-10 grid gap-4 rounded-2xl border border-border bg-white p-5 md:grid-cols-3">

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
            <div className="relative">
              <FiSliders
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />

              <select
                value={category}
                onChange={(e) =>
                  handleCategoryChange(e.target.value)
                }
                className="w-full appearance-none rounded-lg border border-border bg-white py-3 pl-10 pr-4 outline-none transition focus:border-primary"
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
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value)
              }
              className="w-full rounded-lg border border-border bg-white px-4 py-3 outline-none transition focus:border-primary"
            >
              <option value="">
                Sort by
              </option>

              <option value="price_asc">
                Price: Low to High
              </option>

              <option value="price_desc">
                Price: High to Low
              </option>

              <option value="name_asc">
                Name: A to Z
              </option>

              <option value="name_desc">
                Name: Z to A
              </option>
            </select>
          </div>

          {/* Result Count */}
          {!loading && !error && (
            <div className="mb-6">
              <p className="text-sm text-muted">
                {products.length} product
                {products.length !== 1 ? "s" : ""} found
              </p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="py-20 text-center">
              <p className="text-muted">
                Loading products...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
              <p className="font-medium text-red-600">
                {error}
              </p>
            </div>
          )}

          {/* Empty */}
          {!loading &&
            !error &&
            products.length === 0 && (
              <div className="rounded-2xl border border-border bg-surface p-16 text-center">
                <h2 className="text-xl font-semibold text-text">
                  No products found
                </h2>

                <p className="mt-2 text-muted">
                  Try changing your search or filter.
                </p>
              </div>
            )}

          {/* Product Grid */}
          {!loading &&
            !error &&
            products.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            )}

        </div>
      </section>
    </main>
  );
}

export default Products;
