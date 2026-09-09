import { Link } from "react-router-dom";
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";

function Footer() {
  return (
    <footer className="border-t border-border bg-gray-950 text-white">

      {/* Main Footer */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">

        {/* Brand */}
        <div>
          <Link to="/" className="inline-block">
            <img
              src="/BrandLogo.png"
              alt="Cartika"
              className="h-12 w-auto"
            />
          </Link>

          <p className="mt-5 max-w-xs text-sm leading-6 text-gray-400">
            A simple and reliable shopping experience with quality products
            at great prices.
          </p>

          {/* Social Links */}
          <div className="mt-6 flex gap-3">
            <a
              href="#"
              aria-label="Facebook"
              className="rounded-full border border-gray-700 p-2.5 text-gray-400 transition hover:border-primary hover:text-primary"
            >
              <FiFacebook size={18} />
            </a>

            <a
              href="#"
              aria-label="Instagram"
              className="rounded-full border border-gray-700 p-2.5 text-gray-400 transition hover:border-primary hover:text-primary"
            >
              <FiInstagram size={18} />
            </a>

            <a
              href="#"
              aria-label="Twitter"
              className="rounded-full border border-gray-700 p-2.5 text-gray-400 transition hover:border-primary hover:text-primary"
            >
              <FiTwitter size={18} />
            </a>
          </div>
        </div>


        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold">
            Quick Links
          </h3>

          <ul className="mt-5 space-y-3 text-sm text-gray-400">
            <li>
              <Link
                to="/"
                className="transition hover:text-primary"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/products"
                className="transition hover:text-primary"
              >
                Products
              </Link>
            </li>

            <li>
              <Link
                to="/categories"
                className="transition hover:text-primary"
              >
                Categories
              </Link>
            </li>

            <li>
              <Link
                to="/cart"
                className="transition hover:text-primary"
              >
                Cart
              </Link>
            </li>
          </ul>
        </div>


        {/* Customer */}
        <div>
          <h3 className="text-lg font-semibold">
            Customer
          </h3>

          <ul className="mt-5 space-y-3 text-sm text-gray-400">
            <li>
              <Link
                to="/login"
                className="transition hover:text-primary"
              >
                Login
              </Link>
            </li>

            <li>
              <Link
                to="/register"
                className="transition hover:text-primary"
              >
                Create Account
              </Link>
            </li>

            <li>
              <Link
                to="/orders"
                className="transition hover:text-primary"
              >
                My Orders
              </Link>
            </li>

            <li>
              <Link
                to="/profile"
                className="transition hover:text-primary"
              >
                My Profile
              </Link>
            </li>
          </ul>
        </div>


        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold">
            Contact Us
          </h3>

          <ul className="mt-5 space-y-4 text-sm text-gray-400">

            <li className="flex items-start gap-3">
              <FiMapPin
                className="mt-0.5 shrink-0 text-primary"
                size={18}
              />

              <span>
                India
              </span>
            </li>

            <li className="flex items-center gap-3">
              <FiPhone
                className="shrink-0 text-primary"
                size={18}
              />

              <span>
                +91 00000 00000
              </span>
            </li>

            <li className="flex items-center gap-3">
              <FiMail
                className="shrink-0 text-primary"
                size={18}
              />

              <span>
                support@cartika.com
              </span>
            </li>

          </ul>
        </div>

      </div>


      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-sm text-gray-500 sm:px-6 md:flex-row lg:px-8">

          <p>
            © {new Date().getFullYear()} Cartika. All rights reserved.
          </p>

          <div className="flex gap-5">
            <Link
              to="#"
              className="transition hover:text-primary"
            >
              Privacy Policy
            </Link>

            <Link
              to="#"
              className="transition hover:text-primary"
            >
              Terms & Conditions
            </Link>
          </div>

        </div>
      </div>

    </footer>
  );
}

export default Footer;