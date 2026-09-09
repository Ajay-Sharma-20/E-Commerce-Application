import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
  FiPackage,
  FiSettings,
} from "react-icons/fi";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white">
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link to="/" className="shrink-0">
          <img
            src="/BrandLogo.png"
            alt="Cartika"
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="font-medium text-text transition hover:text-primary"
          >
            Home
          </Link>

          <Link
            to="/products"
            className="font-medium text-text transition hover:text-primary"
          >
            Products
          </Link>

          <Link
            to="/categories"
            className="font-medium text-text transition hover:text-primary"
          >
            Categories
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 md:flex">

          {/* Search */}
          <button
            type="button"
            className="rounded-full p-2.5 text-text transition hover:bg-surface hover:text-primary"
            aria-label="Search"
          >
            <FiSearch size={21} />
          </button>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative rounded-full p-2.5 text-text transition hover:bg-surface hover:text-primary"
            aria-label="Shopping cart"
          >
            <FiShoppingCart size={21} />

            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
              {cartCount}
            </span>
          </Link>

          {/* Authentication */}
          {!isAuthenticated ? (
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 font-medium text-text transition hover:border-primary hover:text-primary"
            >
              <FiUser size={18} />
              Login
            </Link>
          ) : (
            <div className="relative">

              {/* User Button */}
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 font-medium text-text transition hover:border-primary hover:text-primary"
              >
                <FiUser size={18} />

                <span className="max-w-24 truncate">
                  {user?.name}
                </span>
              </button>

              {/* Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-border bg-white shadow-lg">

                  {/* Profile */}
                  <Link
                    to="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm transition hover:bg-surface hover:text-primary"
                  >
                    <FiUser size={17} />
                    Profile
                  </Link>

                  {/* Orders */}
                  <Link
                    to="/orders"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm transition hover:bg-surface hover:text-primary"
                  >
                    <FiPackage size={17} />
                    My Orders
                  </Link>

                  {/* Admin */}
                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm transition hover:bg-surface hover:text-primary"
                    >
                      <FiSettings size={17} />
                      Admin Dashboard
                    </Link>
                  )}

                  <div className="border-t border-border" />

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 transition hover:bg-red-50"
                  >
                    <FiLogOut size={17} />
                    Logout
                  </button>

                </div>
              )}

            </div>
          )}

        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-text hover:bg-surface md:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

      </nav>


      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-white md:hidden">

          <div className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6">

            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-3 font-medium hover:bg-surface hover:text-primary"
            >
              Home
            </Link>

            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-3 font-medium hover:bg-surface hover:text-primary"
            >
              Products
            </Link>

            <Link
              to="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-3 font-medium hover:bg-surface hover:text-primary"
            >
              Categories
            </Link>

            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-lg px-3 py-3 font-medium hover:bg-surface hover:text-primary"
            >
              <span>Cart</span>

              <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-white">
                {cartCount}
              </span>
            </Link>

            {!isAuthenticated ? (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-medium text-white transition hover:bg-primary-dark"
              >
                <FiUser size={18} />
                Login
              </Link>
            ) : (
              <>
                <div className="mt-3 rounded-lg bg-surface px-3 py-3">
                  <p className="text-sm text-muted">
                    Signed in as
                  </p>

                  <p className="font-semibold text-text">
                    {user?.name}
                  </p>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-2 rounded-lg px-3 py-3 font-medium hover:bg-surface hover:text-primary"
                >
                  Profile
                </Link>

                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-3 font-medium hover:bg-surface hover:text-primary"
                >
                  My Orders
                </Link>

                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg px-3 py-3 font-medium hover:bg-surface hover:text-primary"
                  >
                    Admin Dashboard
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-2 flex items-center gap-2 rounded-lg px-3 py-3 font-medium text-red-600 hover:bg-red-50"
                >
                  <FiLogOut size={18} />
                  Logout
                </button>
              </>
            )}

          </div>
        </div>
      )}

    </header>
  );
}

export default Navbar;