import { Link } from "react-router-dom";
import Categories from "./Categories";




function Home() {

  

  return (
    <main>

      {/* Hero Section */}
      <section className="bg-surface">
        <div className="mx-auto grid min-h-[500px] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">

          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">
              Welcome to Cartika
            </p>

            <h1 className="max-w-xl text-4xl font-bold leading-tight text-text sm:text-5xl lg:text-6xl">
              Everything you need,
              <span className="text-primary"> all in one place.</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-muted">
              Discover quality products at great prices and enjoy a simple,
              secure shopping experience.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                className="rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-dark"
              >
                Shop Now
              </button>

              <Link
              to="/Categories"
              className="rounded-lg border border-border bg-white px-6 py-3 font-semibold text-text transition hover:border-primary hover:text-primary"
            >
              <FiUser size={18} />
              Explore Categories
            </Link>
            </div>
          </div>

          {/* Hero Image Placeholder */}
          <div className="hidden h-[400px] items-center justify-center rounded-3xl bg-white shadow-sm lg:flex">
            <span className="text-muted">
              Hero Banner
            </span>
          </div>

        </div>
      </section>


      {/* Categories Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Explore
            </p>

            <h2 className="mt-2 text-3xl font-bold text-text">
              Shop by Category
            </h2>
          </div>

          {/* Dynamic categories will come here */}
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <Categories/>
          </div>

        </div>
      </section>


      {/* Featured Products */}
      <section className="bg-surface py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Featured
              </p>

              <h2 className="mt-2 text-3xl font-bold text-text">
                Featured Products
              </h2>
            </div>
          </div>

          {/* ProductCard components will come here */}
          <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
            <p className="text-muted">
              Featured products will be loaded from the API.
            </p>
          </div>

        </div>
      </section>


      {/* Latest Products */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              New Arrivals
            </p>

            <h2 className="mt-2 text-3xl font-bold text-text">
              Latest Products
            </h2>
          </div>

          {/* ProductCard components will come here */}
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <p className="text-muted">
              Latest products will be loaded from the API.
            </p>
          </div>

        </div>
      </section>


      {/* Promotional Section */}
      <section className="bg-primary py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">

          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Find something you'll love.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            Browse our collection and discover products made for your everyday
            needs.
          </p>

          <button
            type="button"
            className="mt-8 rounded-lg bg-white px-6 py-3 font-semibold text-primary transition hover:bg-gray-100"
          >
            Start Shopping
          </button>

        </div>
      </section>

    </main>
  );
}

export default Home;