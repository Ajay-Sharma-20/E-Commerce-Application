import { useEffect, useState } from "react";
import {
  FiEdit2,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiUser,
} from "react-icons/fi";
import { Link } from "react-router-dom";

import api from "../../services/api";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  // ========================================
  // FETCH USERS
  // ========================================

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        limit: 100,
        role,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      const response = await api.get("/users/admin", {
        params,
      });

      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Failed to fetch users");

      setError(
        error.response?.data?.message ||
          "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // FETCH WHEN FILTER CHANGES
  // ========================================

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, role]);

  // ========================================
  // CHANGE ROLE
  // ========================================

  const handleRoleChange = async (user) => {
    const newRole =
      user.role === "admin"
        ? "customer"
        : "admin";

    const confirmed = window.confirm(
      `Are you sure you want to change "${user.name}" role from ${user.role} to ${newRole}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingId(user.id);
      setError("");

      await api.put(
        `/users/admin/${user.id}/role`,
        {
          role: newRole,
        }
      );

      // Update local state
      setUsers((currentUsers) =>
        currentUsers.map((item) =>
          item.id === user.id
            ? {
                ...item,
                role: newRole,
              }
            : item
        )
      );
    } catch (error) {
      console.error("Failed to update user role");

      setError(
        error.response?.data?.message ||
          "Failed to update user role"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-surface py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <Link
              to="/admin"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-primary"
            >
              ← Back to Dashboard
            </Link>

            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Administration
            </p>

            <h1 className="mt-2 text-4xl font-bold text-text">
              Users
            </h1>

            <p className="mt-3 text-muted">
              Manage customer and administrator accounts.
            </p>
          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-danger">
            {error}
          </div>
        )}

        {/* Filters */}
        <section className="mt-8 rounded-2xl border border-border bg-white p-5">
          <div className="grid gap-4 md:grid-cols-[1fr_220px_auto]">

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
                placeholder="Search by name or email..."
                className="w-full rounded-lg border border-border py-3 pl-10 pr-4 outline-none transition focus:border-primary"
              />
            </div>

            {/* Role */}
            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
              className="rounded-lg border border-border bg-white px-4 py-3 outline-none transition focus:border-primary"
            >
              <option value="all">
                All Roles
              </option>

              <option value="customer">
                Customers
              </option>

              <option value="admin">
                Administrators
              </option>
            </select>

            {/* Refresh */}
            <button
              type="button"
              onClick={fetchUsers}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-5 py-3 font-medium text-text transition hover:border-primary hover:text-primary disabled:opacity-50"
            >
              <FiRefreshCw
                size={17}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>

          </div>
        </section>

        {/* Users Table */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-white">

          {loading ? (
            <div className="py-20 text-center">
              <p className="text-muted">
                Loading users...
              </p>
            </div>
          ) : users.length === 0 ? (
            <div className="py-20 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FiUser size={25} />
              </div>

              <h2 className="mt-5 text-xl font-semibold text-text">
                No users found
              </h2>

              <p className="mt-2 text-muted">
                Try changing your search or role filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">

                <thead>
                  <tr className="border-b border-border bg-surface text-sm text-muted">

                    <th className="px-5 py-4 font-semibold">
                      User
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Email
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Role
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Joined
                    </th>

                    <th className="px-5 py-4 text-right font-semibold">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => {
                    const isUpdating =
                      updatingId === user.id;

                    const isAdmin =
                      user.role === "admin";

                    return (
                      <tr
                        key={user.id}
                        className="border-b border-border last:border-0 hover:bg-surface/50"
                      >

                        {/* User */}
                        <td className="px-5 py-5">
                          <div className="flex items-center gap-4">

                            <div
                              className={
                                isAdmin
                                  ? "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
                                  : "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary"
                              }
                            >
                              {isAdmin ? (
                                <FiShield size={20} />
                              ) : (
                                <FiUser size={20} />
                              )}
                            </div>

                            <div>
                              <p className="font-semibold text-text">
                                {user.name}
                              </p>

                              <p className="mt-1 text-xs text-muted">
                                ID: #{user.id}
                              </p>
                            </div>

                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-5 py-5 text-sm text-muted">
                          {user.email}
                        </td>

                        {/* Role */}
                        <td className="px-5 py-5">
                          {isAdmin ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                              <FiShield size={13} />
                              Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                              <FiUser size={13} />
                              Customer
                            </span>
                          )}
                        </td>

                        {/* Joined */}
                        <td className="px-5 py-5 text-sm text-muted">
                          {new Date(
                            user.created_at
                          ).toLocaleDateString(
                            "en-IN"
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-5">
                          <div className="flex justify-end">

                            <button
                              type="button"
                              onClick={() =>
                                handleRoleChange(user)
                              }
                              disabled={isUpdating}
                              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted transition hover:border-primary hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                              title="Change user role"
                            >
                              <FiEdit2 size={16} />

                              {isUpdating
                                ? "Updating..."
                                : isAdmin
                                  ? "Make Customer"
                                  : "Make Admin"}
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>

              </table>
            </div>
          )}

        </section>

        {/* Count */}
        {!loading && users.length > 0 && (
          <p className="mt-4 text-sm text-muted">
            Showing {users.length} user
            {users.length !== 1 ? "s" : ""}
          </p>
        )}

      </div>
    </main>
  );
}

export default AdminUsers;