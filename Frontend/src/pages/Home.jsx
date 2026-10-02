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

    {/* Section Header */}
    <div className="mb-9 flex items-end justify-between gap-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Explore Collection
        </p>

        <h2 className="mt-2 text-3xl font-bold tracking-tight text-text sm:text-4xl">
          Shop by Category
        </h2>

        <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
          Explore our categories and find exactly what you're looking for.
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

    {/* Loading */}
    {loadingCategories ? (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-44 animate-pulse rounded-2xl bg-gray-100"
          />
        ))}
      </div>

    /* Empty State */
    ) : categories.length === 0 ? (
      <div className="rounded-2xl border border-gray-100 bg-gray-50 px-6 py-14 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-gray-400 shadow-sm">
          <FiFolder size={26} />
        </div>

        <p className="mt-4 text-sm font-medium text-text">
          No categories available yet.
        </p>

        <p className="mt-1 text-xs text-muted">
          Categories will appear here once they are added.
        </p>
      </div>

    /* Categories */
    ) : (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.slice(0, 8).map((category) => {
          const productCount = Number(category.product_count || 0);

          return (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/20 hover:bg-white hover:shadow-lg"
            >
              {/* Decorative Circle */}
              <div className="absolute -right-7 -top-7 h-24 w-24 rounded-full bg-teal-50 transition duration-300 group-hover:scale-125" />

              {/* Icon */}
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-primary shadow-sm transition duration-300 group-hover:bg-primary group-hover:text-white">
                <FiFolder size={24} />
              </div>

              {/* Content */}
              <div className="relative mt-5">
                <h3 className="truncate text-base font-bold text-text">
                  {category.name}
                </h3>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-muted">
                    {productCount}{" "}
                    {productCount === 1 ? "Product" : "Products"}
                  </span>

                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm transition duration-300 group-hover:bg-primary group-hover:text-white">
                    <FiArrowRight
                      size={14}
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    )}

    {/* Mobile View All */}
    <Link
      to="/categories"
      className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition hover:text-primary-dark sm:hidden"
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

    {/* Header */}
    <div className="mb-9 flex items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary" />

          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            New Arrivals
          </p>
        </div>

        <h2 className="mt-2 text-3xl font-bold tracking-tight text-text sm:text-4xl">
          Latest Products
        </h2>

        <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
          Fresh products recently added to our collection.
        </p>
      </div>

      {/* Desktop View All */}
      <Link
        to="/products"
        className="hidden items-center gap-2 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-semibold text-text transition hover:border-primary hover:text-primary sm:inline-flex"
      >
        View All Products
        <FiArrowRight size={16} />
      </Link>
    </div>

    {/* Loading State */}
    {loadingProducts ? (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="overflow-hidden rounded-2xl border border-border bg-white"
          >
            {/* Image Skeleton */}
            <div className="aspect-square animate-pulse bg-gray-100" />

            {/* Content Skeleton */}
            <div className="space-y-3 p-4">
              <div className="h-3 w-1/3 animate-pulse rounded bg-gray-100" />

              <div className="h-5 w-4/5 animate-pulse rounded bg-gray-100" />

              <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />

              <div className="mt-4 h-10 animate-pulse rounded-lg bg-gray-100" />
            </div>
          </div>
        ))}
      </div>

    /* Empty State */
    ) : latestProducts.length === 0 ? (
      <div className="rounded-2xl border border-border bg-white px-6 py-16 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-primary">
          <FiBox size={28} />
        </div>

        <h3 className="mt-5 text-lg font-semibold text-text">
          No products available
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          New products will appear here as soon as they are added
          to the store.
        </p>

        <Link
          to="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          Browse Products
          <FiArrowRight size={16} />
        </Link>
      </div>

    /* Products */
    ) : (
      <>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {latestProducts.map((product) => (
            <div
              key={product.id}
              className="group relative"
            >
              {/* New Badge */}
              <div className="pointer-events-none absolute left-3 top-3 z-10">
                <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm">
                  New
                </span>
              </div>

              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 flex justify-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-6 py-3 text-sm font-semibold text-text transition hover:border-primary hover:text-primary"
          >
            Explore All Products
            <FiArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </>
    )}

    {/* Mobile View All */}
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
    
    <section className="relative overflow-hidden bg-primary py-20">
  {/* Decorative Background */}
  <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
  <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

  <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-3xl text-center">

      {/* Icon */}
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20">
        <FiShoppingBag size={28} />
      </div>

      {/* Small Label */}
      <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
        Start Your Shopping Journey
      </p>

      {/* Heading */}
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
        Find something
        <span className="block text-white/90">
          you'll love.
        </span>
      </h2>

      {/* Description */}
      <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
        Explore our collection of quality products and discover
        something perfect for your everyday needs.
      </p>

      {/* CTA */}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-bold text-primary shadow-lg transition hover:-translate-y-0.5 hover:bg-gray-50"
        >
          Start Shopping
          <FiArrowRight size={17} />
        </Link>

        <Link
          to="/categories"
          className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
        >
          Explore Categories
        </Link>
      </div>

      {/* Trust Points */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-medium text-white/70">
        <span className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-white">
            ✓
          </span>
          Quality Products
        </span>

        <span className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-white">
            ✓
          </span>
          Easy Ordering
        </span>

        <span className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-white">
            ✓
          </span>
          Secure Shopping
        </span>
      </div>

    </div>
  </div>
</section>

    </main>
  );
}

export default Home;