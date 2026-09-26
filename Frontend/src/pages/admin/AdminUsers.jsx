import { useEffect, useMemo, useState } from "react";
import {
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiUser,
  FiUsers,
  FiUserCheck,
} from "react-icons/fi";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function AdminUsers() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] =
    useState("all");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);

  const [updatingId, setUpdatingId] =
    useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --------------------------------
  // Fetch Users
  // --------------------------------

  const fetchUsers = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get(
        "/users/admin"
      );

      setUsers(response.data.users || []);
    } catch (error) {
      console.error(
        "Failed to fetch users",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load users"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --------------------------------
  // Filter users
  // --------------------------------

  const filteredUsers = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name
          ?.toLowerCase()
          .includes(query) ||
        user.email
          ?.toLowerCase()
          .includes(query);

      const matchesRole =
        roleFilter === "all" ||
        user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  // --------------------------------
  // Statistics
  // --------------------------------

  const totalUsers = users.length;

  const totalCustomers = users.filter(
    (user) => user.role === "customer"
  ).length;

  const totalAdmins = users.filter(
    (user) => user.role === "admin"
  ).length;

  // --------------------------------
  // Role change
  // --------------------------------

  const handleRoleChange = async (
    selectedUser,
    newRole
  ) => {
    const isCurrentUser =
      Number(selectedUser.id) ===
      Number(currentUser?.id);

    // Never allow the current admin
    // to change their own role.
    if (isCurrentUser) {
      setError(
        "You cannot change your own administrator role."
      );

      setSuccess("");
      return;
    }

    if (selectedUser.role === newRole) {
      return;
    }

    const roleLabel =
      newRole === "admin"
        ? "Administrator"
        : "Customer";

    const confirmed = window.confirm(
      `Change ${selectedUser.name}'s role to ${roleLabel}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingId(selectedUser.id);
      setError("");
      setSuccess("");

      await api.put(
        `/users/admin/${selectedUser.id}/role`,
        {
          role: newRole,
        }
      );

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                role: newRole,
              }
            : user
        )
      );

      setSuccess(
        `${selectedUser.name}'s role was changed to ${roleLabel}.`
      );
    } catch (error) {
      console.error(
        "Failed to update user role",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update user role"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // --------------------------------
  // Helpers
  // --------------------------------

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) =>
        part.charAt(0).toUpperCase()
      )
      .join("");
  };

  // --------------------------------
  // Loading
  // --------------------------------

  if (loading) {
    return (
      <main className="min-h-screen bg-surface px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-primary" />

              <p className="mt-4 text-sm text-muted">
                Loading users...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Store Management
            </p>

            <h1 className="mt-1 text-3xl font-bold text-text">
              Users
            </h1>

            <p className="mt-2 text-sm text-muted">
              Manage customers and administrator access.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchUsers(true)}
            disabled={refreshing}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiRefreshCw
              size={17}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="mt-7 grid gap-4 sm:grid-cols-3">

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-muted">
                  Total Users
                </p>

                <p className="mt-2 text-2xl font-bold text-text">
                  {totalUsers}
                </p>
              </div>

              <div className="rounded-lg bg-teal-50 p-3 text-primary">
                <FiUsers size={21} />
              </div>

            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-muted">
                  Customers
                </p>

                <p className="mt-2 text-2xl font-bold text-text">
                  {totalCustomers}
                </p>
              </div>

              <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                <FiUserCheck size={21} />
              </div>

            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-muted">
                  Administrators
                </p>

                <p className="mt-2 text-2xl font-bold text-text">
                  {totalAdmins}
                </p>
              </div>

              <div className="rounded-lg bg-purple-50 p-3 text-purple-600">
                <FiShield size={21} />
              </div>

            </div>
          </div>

        </div>

        {/* Messages */}
        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3.5 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Filters */}
        <section className="mt-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">

          <div className="flex flex-col gap-3 lg:flex-row">

            <div className="relative flex-1">
              <FiSearch
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setError("");
                }}
                placeholder="Search by name or email..."
                className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(e.target.value)
              }
              className="h-11 rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 lg:w-48"
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

          </div>
        </section>

        {/* Users Table */}
        <section className="mt-5 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

          {filteredUsers.length === 0 ? (
            <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">

              <div className="rounded-full bg-gray-100 p-4 text-gray-400">
                <FiUsers size={30} />
              </div>

              <h3 className="mt-4 font-semibold text-text">
                No users found
              </h3>

              <p className="mt-1 max-w-sm text-sm text-muted">
                Try changing your search or role filter.
              </p>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px]">

                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70 text-left">

                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      User
                    </th>

                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Email
                    </th>

                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Role
                    </th>

                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Joined
                    </th>

                    <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Access
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">

                  {filteredUsers.map((user) => {
                    const isCurrentUser =
                      Number(user.id) ===
                      Number(currentUser?.id);

                    const isUpdating =
                      updatingId === user.id;

                    return (
                      <tr
                        key={user.id}
                        className="transition hover:bg-gray-50/70"
                      >

                        {/* User */}
                        <td className="px-6 py-4">

                          <div className="flex items-center gap-3">

                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                user.role ===
                                "admin"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-teal-50 text-primary"
                              }`}
                            >
                              {getInitials(
                                user.name
                              )}
                            </div>

                            <div>
                              <div className="flex items-center gap-2">

                                <p className="text-sm font-semibold text-text">
                                  {user.name ||
                                    "Unnamed User"}
                                </p>

                                {isCurrentUser && (
                                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
                                    You
                                  </span>
                                )}

                              </div>

                              <p className="mt-0.5 text-xs text-muted">
                                User #{user.id}
                              </p>
                            </div>

                          </div>

                        </td>

                        {/* Email */}
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">
                            {user.email}
                          </span>
                        </td>

                        {/* Current Role */}
                        <td className="px-6 py-4">

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                              user.role ===
                              "admin"
                                ? "bg-purple-50 text-purple-700"
                                : "bg-blue-50 text-blue-700"
                            }`}
                          >
                            {user.role ===
                            "admin" ? (
                              <FiShield
                                size={13}
                              />
                            ) : (
                              <FiUser
                                size={13}
                              />
                            )}

                            {user.role ===
                            "admin"
                              ? "Administrator"
                              : "Customer"}
                          </span>

                        </td>

                        {/* Joined */}
                        <td className="px-6 py-4 text-sm text-muted">
                          {formatDate(
                            user.created_at
                          )}
                        </td>

                        {/* Role Control */}
                        <td className="px-6 py-4">

                          {isCurrentUser ? (
                            <div className="flex justify-end">
                              <span className="text-xs font-medium text-gray-400">
                                Your account
                              </span>
                            </div>
                          ) : (
                            <div className="flex justify-end">

                              <select
                                value={
                                  user.role
                                }
                                disabled={
                                  isUpdating
                                }
                                onChange={(e) =>
                                  handleRoleChange(
                                    user,
                                    e.target
                                      .value
                                  )
                                }
                                className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <option value="customer">
                                  Customer
                                </option>

                                <option value="admin">
                                  Administrator
                                </option>
                              </select>

                            </div>
                          )}

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>
          )}

        </section>

        {/* Footer info */}
        {filteredUsers.length > 0 && (
          <div className="mt-4 flex flex-col gap-1 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">

            <span>
              Showing {filteredUsers.length} of{" "}
              {totalUsers} users
            </span>

            <span className="text-xs">
              Administrator access should only be assigned to trusted accounts.
            </span>

          </div>
        )}

      </div>
    </main>
  );
}

export default AdminUsers;