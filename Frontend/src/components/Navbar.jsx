import { useEffect, useRef, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";

import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
  FiPackage,
  FiSettings,
  FiChevronDown,
} from "react-icons/fi";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const userMenuRef = useRef(null);

  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");


  const navigate = useNavigate();

  /* --------------------------------
     Scroll Effect
  -------------------------------- */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* --------------------------------
     Close Dropdown Outside
  -------------------------------- */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* --------------------------------
     Prevent Body Scroll Mobile Menu
  -------------------------------- */
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);



  const handleSearch = (e) => {
    e.preventDefault();

    const query = searchQuery.trim();

    if (!query) return;

    setSearchOpen(false);
    setSearchQuery("");
    setMobileMenuOpen(false);

    navigate(`/products?search=${encodeURIComponent(query)}`);
  };


  /* --------------------------------
     Logout
  -------------------------------- */
  const handleLogout = () => {
    logout();

    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  /* --------------------------------
     Close Mobile Menu
  -------------------------------- */
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  /* --------------------------------
     Desktop Nav Link Style
  -------------------------------- */
  const navLinkClass = ({ isActive }) =>
    `group relative py-2 text-sm font-semibold transition-colors duration-200 ${isActive
      ? "text-primary"
      : "text-text hover:text-primary"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 ${scrolled
          ? "border-b border-border/80 bg-white/95 shadow-sm backdrop-blur-md"
          : "border-b border-border bg-white"
        }`}
    >
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* ========================================
            LOGO
        ======================================== */}
        <Link
          to="/"
          className="group shrink-0"
          aria-label="Cartika Home"
        >
          <img
            src="/BrandLogo.png"
            alt="Cartika"
            className="h-11 w-auto object-contain transition duration-300 group-hover:scale-[1.03]"
          />
        </Link>

        {/* ========================================
            DESKTOP NAVIGATION
        ======================================== */}
        <div className="hidden items-center gap-8 md:flex">

          <NavLink
            to="/"
            end
            className={navLinkClass}
          >
            {({ isActive }) => (
              <>
                Home
                <span
                  className={`absolute bottom-0 left-0 h-0.5 w-full origin-left rounded-full bg-primary transition-transform duration-300 ${isActive
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                    }`}
                />
              </>
            )}
          </NavLink>

          <NavLink
            to="/products"
            className={navLinkClass}
          >
            {({ isActive }) => (
              <>
                Products

                <span
                  className={`absolute bottom-0 left-0 h-0.5 w-full origin-left rounded-full bg-primary transition-transform duration-300 ${isActive
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                    }`}
                />
              </>
            )}
          </NavLink>

          <NavLink
            to="/categories"
            className={navLinkClass}
          >
            {({ isActive }) => (
              <>
                Categories

                <span
                  className={`absolute bottom-0 left-0 h-0.5 w-full origin-left rounded-full bg-primary transition-transform duration-300 ${isActive
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                    }`}
                />
              </>
            )}
          </NavLink>
        </div>

        {/* ========================================
            DESKTOP ACTIONS
        ======================================== */}
        <div className="hidden items-center gap-2 md:flex">

          {/* Search */}
          <button
            type="button"
            onClick={() => setSearchOpen((current) => !current)}
            aria-label="Search products"
            className={`group rounded-xl p-2.5 transition-all duration-200 active:scale-95 ${searchOpen
              ? "bg-primary/10 text-primary"
              : "text-text hover:bg-surface hover:text-primary"
              }`}
          >
            <FiSearch
              size={20}
              className="transition-transform duration-200 group-hover:scale-110"
            />
          </button>

          {/* Cart */}
          <Link
            to="/cart"
            aria-label="Shopping cart"
            className="group relative rounded-xl p-2.5 text-text transition-all duration-200 hover:bg-surface hover:text-primary active:scale-95"
          >
            <FiShoppingCart
              size={20}
              className="transition-transform duration-200 group-hover:scale-110"
            />

            <span
              className={`absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white shadow-sm transition-transform duration-200 ${cartCount > 0
                ? "scale-100"
                : "scale-90 opacity-90"
                }`}
            >
              {cartCount}
            </span>
          </Link>

          {/* Divider */}
          <div className="mx-1 h-7 w-px bg-border" />

          {/* Authentication */}
          {!isAuthenticated ? (
            <Link
              to="/login"
              className="group ml-1 inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-text transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:text-primary active:scale-[0.98]"
            >
              <FiUser
                size={17}
                className="transition-transform duration-200 group-hover:scale-110"
              />
              Login
            </Link>
          ) : (
            <div
              ref={userMenuRef}
              className="relative ml-1"
            >
              {/* User Button */}
              <button
                type="button"
                onClick={() =>
                  setUserMenuOpen((current) => !current)
                }
                className={`group inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${userMenuOpen
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-text hover:border-primary hover:bg-primary/5 hover:text-primary"
                  }`}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
                  <FiUser size={15} />
                </span>

                <span className="max-w-24 truncate">
                  {user?.name || "Account"}
                </span>

                <FiChevronDown
                  size={15}
                  className={`transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {/* Dropdown */}
              <div
                className={`absolute right-0 top-full mt-2 w-56 origin-top-right overflow-hidden rounded-2xl border border-border bg-white shadow-xl transition-all duration-200 ${userMenuOpen
                  ? "visible translate-y-0 scale-100 opacity-100"
                  : "invisible -translate-y-2 scale-95 opacity-0"
                  }`}
              >
                {/* Account Header */}
                <div className="border-b border-border bg-surface px-4 py-3">
                  <p className="text-xs font-medium text-muted">
                    Signed in as
                  </p>

                  <p className="mt-1 truncate text-sm font-bold text-text">
                    {user?.name || "User"}
                  </p>

                  {user?.email && (
                    <p className="mt-0.5 truncate text-xs text-muted">
                      {user.email}
                    </p>
                  )}
                </div>

                {/* Profile */}
                <Link
                  to="/profile"
                  onClick={() => setUserMenuOpen(false)}
                  className="group flex items-center gap-3 px-4 py-3 text-sm font-medium text-text transition-colors hover:bg-surface hover:text-primary"
                >
                  <FiUser
                    size={17}
                    className="text-muted transition-colors group-hover:text-primary"
                  />
                  Profile
                </Link>

                {/* Orders */}
                <Link
                  to="/orders"
                  onClick={() => setUserMenuOpen(false)}
                  className="group flex items-center gap-3 px-4 py-3 text-sm font-medium text-text transition-colors hover:bg-surface hover:text-primary"
                >
                  <FiPackage
                    size={17}
                    className="text-muted transition-colors group-hover:text-primary"
                  />
                  My Orders
                </Link>

                {/* Admin */}
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setUserMenuOpen(false)}
                    className="group flex items-center gap-3 px-4 py-3 text-sm font-medium text-text transition-colors hover:bg-surface hover:text-primary"
                  >
                    <FiSettings
                      size={17}
                      className="text-muted transition-colors group-hover:text-primary"
                    />
                    Admin Dashboard
                  </Link>
                )}

                <div className="border-t border-border" />

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="group flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                >
                  <FiLogOut
                    size={17}
                    className="transition-transform duration-200 group-hover:-translate-x-0.5"
                  />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>



        {/* ========================================
    SEARCH PANEL
======================================== */}
        <div
          className={`absolute left-0 right-0 top-full border-b border-border bg-white shadow-lg transition-all duration-300 ${searchOpen
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-2 opacity-0"
            }`}
        >
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <form
              onSubmit={handleSearch}
              className="mx-auto flex max-w-2xl items-center gap-3"
            >
              <div className="relative flex-1">
                <FiSearch
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  autoFocus={searchOpen}
                  className="w-full rounded-xl border border-border bg-surface py-3 pl-10 pr-4 text-sm text-text outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <button
                type="submit"
                disabled={!searchQuery.trim()}
                className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                Search
              </button>
            </form>
          </div>
        </div>


        {/* ========================================
            MOBILE MENU BUTTON
        ======================================== */}
        <button
          type="button"
          onClick={() =>
            setMobileMenuOpen((current) => !current)
          }
          className="rounded-xl p-2.5 text-text transition-all duration-200 hover:bg-surface hover:text-primary active:scale-95 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <FiX
              size={23}
              className="rotate-0 transition-transform duration-200"
            />
          ) : (
            <FiMenu
              size={23}
              className="transition-transform duration-200"
            />
          )}
        </button>
      </nav>

      {/* ========================================
          MOBILE MENU
      ======================================== */}
      <div
        className={`overflow-hidden border-t border-border bg-white transition-all duration-300 md:hidden ${mobileMenuOpen
          ? "max-h-[700px] opacity-100"
          : "pointer-events-none max-h-0 opacity-0"
          }`}
      >
        <div className="mx-auto max-w-7xl px-4 pb-5 pt-3 sm:px-6">

          {/* Navigation Links */}
          <div className="space-y-1">

            <NavLink
              to="/"
              end
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `flex items-center rounded-xl px-3 py-3 text-sm font-semibold transition-all ${isActive
                  ? "bg-primary/10 text-primary"
                  : "text-text hover:bg-surface hover:text-primary"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/products"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `flex items-center rounded-xl px-3 py-3 text-sm font-semibold transition-all ${isActive
                  ? "bg-primary/10 text-primary"
                  : "text-text hover:bg-surface hover:text-primary"
                }`
              }
            >
              Products
            </NavLink>

            <NavLink
              to="/categories"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `flex items-center rounded-xl px-3 py-3 text-sm font-semibold transition-all ${isActive
                  ? "bg-primary/10 text-primary"
                  : "text-text hover:bg-surface hover:text-primary"
                }`
              }
            >
              Categories
            </NavLink>

            {/* Cart */}
            <Link
              to="/cart"
              onClick={closeMobileMenu}
              className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-text transition-all hover:bg-surface hover:text-primary"
            >
              <span className="flex items-center gap-3">
                <FiShoppingCart size={18} />
                Cart
              </span>

              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-2 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            </Link>
          </div>

          {/* Account */}
          {!isAuthenticated ? (
            <Link
              to="/login"
              onClick={closeMobileMenu}
              className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-primary-dark active:scale-[0.98]"
            >
              <FiUser size={18} />
              Login
            </Link>
          ) : (
            <div className="mt-4 border-t border-border pt-4">

              {/* User Info */}
              <div className="rounded-2xl bg-surface p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                    <FiUser size={18} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-muted">
                      Signed in as
                    </p>

                    <p className="truncate text-sm font-bold text-text">
                      {user?.name || "User"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Profile */}
              <Link
                to="/profile"
                onClick={closeMobileMenu}
                className="mt-2 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-text transition-colors hover:bg-surface hover:text-primary"
              >
                <FiUser size={18} />
                Profile
              </Link>

              {/* Orders */}
              <Link
                to="/orders"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-text transition-colors hover:bg-surface hover:text-primary"
              >
                <FiPackage size={18} />
                My Orders
              </Link>

              {/* Admin */}
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-text transition-colors hover:bg-surface hover:text-primary"
                >
                  <FiSettings size={18} />
                  Admin Dashboard
                </Link>
              )}

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
              >
                <FiLogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;