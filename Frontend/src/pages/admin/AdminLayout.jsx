import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiBox,
  FiFolder,
  FiUsers,
  FiShoppingBag,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useState } from "react";

import { useAuth } from "../../context/AuthContext";
import Footer from "../../components/Footer.jsx";
import Navbar from "../../components/Navbar.jsx";


const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: FiGrid,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: FiBox,
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: FiFolder,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: FiUsers,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: FiShoppingBag,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================================
          Mobile Header
      ================================= */}
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-4 lg:hidden">

        <div className="flex items-center gap-3">

          <button
            onClick={() =>
              setSidebarOpen(true)
            }
            className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100"
          >
            <FiMenu size={22} />
          </button>

          <span className="text-lg font-bold text-primary">
            Cartika Admin
          </span>

        </div>

      </header>

      {/* ================================
          Mobile Overlay
      ================================= */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* ================================
          Sidebar
      ================================= */}
      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-64 flex-col
          border-r bg-white
          transition-transform duration-300
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
          lg:translate-x-0
        `}
      >

        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b px-5">

          <div>
            <h1 className="text-xl font-bold text-primary">
              Cartika
            </h1>

            <p className="text-xs text-gray-500">
              Admin Panel
            </p>
          </div>

          <button
            onClick={() =>
              setSidebarOpen(false)
            }
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 lg:hidden"
          >
            <FiX size={20} />
          </button>

        </div>

        {/* Admin Info */}
        <div className="border-b px-5 py-4">

          <p className="text-sm font-semibold text-gray-800">
            {user?.name || "Admin"}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {user?.email || "Administrator"}
          </p>

          <span className="mt-2 inline-block rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">
            Administrator
          </span>

        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">

          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Management
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                onClick={() =>
                  setSidebarOpen(false)
                }
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                <Icon size={19} />

                <span>
                  {item.name}
                </span>
              </NavLink>
            );
          })}

        </nav>

        {/* Bottom */}
        <div className="border-t p-4">

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <FiLogOut size={19} />

            Logout
          </button>

        </div>

      </aside>

      {/* ================================
          Main Application Area
      ================================= */}
      {/* Main Content */}
<div className="min-h-screen lg:ml-64 flex flex-col">
  <Navbar />
  <div className="flex-1 pt-16 lg:pt-0">
    <Outlet />
  </div>

  <Footer />

</div>

    </div>
  );
};

export default AdminLayout;