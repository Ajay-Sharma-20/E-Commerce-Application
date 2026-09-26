import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiBox,
  FiFolder,
  FiShoppingBag,
} from "react-icons/fi";

import api from "../services/api";
import ProductCard from "../components/ProductCard";

function Home() {
  const [categories, setCategories] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);

  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [loadingProducts, setLoadingProducts] =
    useState(true);

  const [error, setError] = useState("");

  // --------------------------------
  // Fetch categories
  // --------------------------------

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);

        const response = await api.get(
          "/categories"
        );

        setCategories(
          response.data.categories || []
        );
      } catch (error) {
        console.error(
          "Failed to fetch home categories",
          error
        );

        setError(
          "Some store information could not be loaded."
        );
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // --------------------------------
  // Fetch latest products
  // --------------------------------

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        setLoadingProducts(true);

        const response = await api.get(
          "/products",
          {
            params: {
              sort: "newest",
              page: 1,
              limit: 8,
            },
          }
        );

        setLatestProducts(
          response.data.products || []
        );
      } catch (error) {
        console.error(
          "Failed to fetch latest products",
          error
        );

        setError(
          "Some store information could not be loaded."
        );
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchLatestProducts();
  }, []);

  return (
    <main>

      {/* =====================================
          HERO
      ====================================== */}
      <section className="overflow-hidden bg-surface">
  <div className="mx-auto grid min-h-[600px] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">

    {/* Left Content */}
    <div className="max-w-2xl">
      {/* Badge */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-teal-50 px-4 py-2 text-sm font-semibold text-primary">
        <FiShoppingBag size={15} />
        Welcome to Cartika
      </div>

      {/* Heading */}
      <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-text sm:text-5xl lg:text-6xl">
        Shop smarter.
        <span className="block text-primary">
          Live better.
        </span>
      </h1>

      {/* Description */}
      <p className="mt-6 max-w-xl text-base leading-7 text-muted sm:text-lg">
        Discover quality products, great prices, and a seamless shopping
        experience — all in one place.
      </p>

      {/* Buttons */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark hover:shadow-md"
        >
          Shop Now
          <FiArrowRight size={17} />
        </Link>

        <Link
          to="/categories"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-6 py-3.5 text-sm font-semibold text-text transition hover:border-primary hover:text-primary"
        >
          Explore Categories
        </Link>
      </div>

      {/* Trust Points */}
      <div className="mt-10 grid max-w-xl grid-cols-1 gap-4 border-t border-border pt-7 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-text">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-primary">
              <FiShoppingBag size={15} />
            </span>
            Quality Products
          </div>
          <p className="mt-1 pl-10 text-xs text-muted">
            Carefully selected products
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-text">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-secondary">
              <FiBox size={15} />
            </span>
            Easy Ordering
          </div>
          <p className="mt-1 pl-10 text-xs text-muted">
            Simple & convenient shopping
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-text">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-600">
              ✓
            </span>
            Secure Shopping
          </div>
          <p className="mt-1 pl-10 text-xs text-muted">
            Safe and reliable experience
          </p>
        </div>
      </div>
    </div>

    {/* Right Banner */}
    <div className="relative">
      {/* Decorative background */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-teal-100/60 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-blue-100/50 blur-3xl" />

      <div className="relative overflow-hidden rounded-3xl border border-white bg-white shadow-xl">
        <div className="aspect-[4/3] w-full">
          <img
            src="/Banner.webp"
            alt="Cartika shopping"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Floating Card */}
        <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/60 bg-white/90 p-4 shadow-lg backdrop-blur-md sm:max-w-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-primary">
              <FiShoppingBag size={20} />
            </div>

            <div>
              <p className="text-sm font-bold text-text">
                Everything in one place
              </p>
              <p className="mt-0.5 text-xs text-muted">
                Explore our latest collection
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</section>


      {/* =====================================
          CATEGORIES
      ====================================== */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-8 flex items-end justify-between gap-4">

            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Explore
              </p>

              <h2 className="mt-2 text-3xl font-bold text-text">
                Shop by Category
              </h2>

              <p className="mt-2 text-sm text-muted">
                Find products that match what you're looking for.
              </p>
            </div>

            <Link
              to="/categories"
              className="hidden items-center gap-1.5 text-sm font-semibold text-primary transition hover:text-primary-dark sm:inline-flex"
            >
              View All
              <FiArrowRight size={16} />
            </Link>

          </div>

          {loadingCategories ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

              {[1, 2, 3, 4].map(
                (item) => (
                  <div
                    key={item}
                    className="h-32 animate-pulse rounded-2xl bg-gray-100"
                  />
                )
              )}

            </div>
          ) : categories.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-gray-50 px-6 py-12 text-center">
              <FiFolder
                size={30}
                className="mx-auto text-gray-400"
              />

              <p className="mt-3 text-sm text-muted">
                No categories available yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

              {categories
                .slice(0, 8)
                .map((category) => (
                  <Link
                    key={category.id}
                    to={`/products?category=${category.id}`}
                    className="group rounded-2xl border border-gray-100 bg-gray-50 p-5 transition hover:-translate-y-1 hover:border-primary/20 hover:bg-white hover:shadow-md"
                  >

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-primary transition group-hover:bg-primary group-hover:text-white">
                      <FiFolder size={22} />
                    </div>

                    <h3 className="mt-4 font-semibold text-text">
                      {category.name}
                    </h3>

                    <div className="mt-2 flex items-center justify-between">

                      <span className="text-xs text-muted">
                        {Number(
                          category.product_count || 0
                        )}{" "}
                        product
                        {Number(
                          category.product_count || 0
                        ) !== 1
                          ? "s"
                          : ""}
                      </span>

                      <FiArrowRight
                        size={15}
                        className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-primary"
                      />

                    </div>

                  </Link>
                ))}

            </div>
          )}

          <Link
            to="/categories"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary sm:hidden"
          >
            View All Categories
            <FiArrowRight size={16} />
          </Link>

        </div>
      </section>


      {/* =====================================
          LATEST PRODUCTS
      ====================================== */}
      <section className="bg-surface py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-8 flex items-end justify-between gap-4">

            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                New Arrivals
              </p>

              <h2 className="mt-2 text-3xl font-bold text-text">
                Latest Products
              </h2>

              <p className="mt-2 text-sm text-muted">
                Check out the newest products added to Cartika.
              </p>
            </div>

            <Link
              to="/products"
              className="hidden items-center gap-1.5 text-sm font-semibold text-primary transition hover:text-primary-dark sm:inline-flex"
            >
              View All
              <FiArrowRight size={16} />
            </Link>

          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

              {[1, 2, 3, 4].map(
                (item) => (
                  <div
                    key={item}
                    className="overflow-hidden rounded-2xl border border-gray-100 bg-white"
                  >
                    <div className="aspect-square animate-pulse bg-gray-100" />

                    <div className="space-y-3 p-4">
                      <div className="h-4 animate-pulse rounded bg-gray-100" />
                      <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
                      <div className="h-8 animate-pulse rounded bg-gray-100" />
                    </div>
                  </div>
                )
              )}

            </div>
          ) : latestProducts.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-white px-6 py-12 text-center">

              <FiBox
                size={30}
                className="mx-auto text-gray-400"
              />

              <p className="mt-3 text-sm text-muted">
                No products available yet.
              </p>

              <Link
                to="/products"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
              >
                Browse Products
                <FiArrowRight size={16} />
              </Link>

            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

              {latestProducts.map(
                (product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                )
              )}

            </div>
          )}

          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary sm:hidden"
          >
            View All Products
            <FiArrowRight size={16} />
          </Link>

        </div>
      </section>


      {/* =====================================
          PROMOTIONAL CTA
      ====================================== */}
      <section className="bg-primary py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white">
            <FiShoppingBag size={26} />
          </div>

          <h2 className="mt-6 text-3xl font-bold text-white sm:text-4xl">
            Find something you'll love.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/80">
            Browse our collection and discover products
            made for your everyday needs.
          </p>

          <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-primary shadow-sm transition hover:bg-gray-100"
          >
            Start Shopping
            <FiArrowRight size={17} />
          </Link>

        </div>
      </section>

    </main>
  );
}

export default Home;