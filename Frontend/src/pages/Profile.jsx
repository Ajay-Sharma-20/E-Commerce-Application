import { useEffect, useState } from "react";
import { FiMail, FiPackage, FiShield, FiShoppingBag, FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, loading: authLoading } = useAuth();

  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/users/profile");

      console.log("PROFILE API RESPONSE:", response.data);
      
      setProfile(response.data.user);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchProfile();
    }
  }, [authLoading]);

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-surface py-20 text-center">
        <p className="text-muted">Loading profile...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-surface px-4 py-20">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
          <h1 className="text-xl font-bold text-danger">
            Unable to load profile
          </h1>

          <p className="mt-2 text-sm text-danger">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchProfile}
            className="mt-6 rounded-lg bg-primary px-5 py-2.5 font-semibold text-white transition hover:bg-primary-dark"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Account
          </p>

          <h1 className="mt-2 text-4xl font-bold text-text">
            My Profile
          </h1>

          <p className="mt-3 text-muted">
            Manage and view your account information.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">

          {/* Profile Card */}
          <section className="h-fit rounded-2xl border border-border bg-white p-6 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FiUser size={40} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-text">
              {profile?.name} 
            </h2>

            <p className="mt-1 break-all text-sm text-muted">
              {profile?.email}
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold capitalize text-primary">
              <FiShield size={14} />
              {profile?.role}
            </div>
          </section>

          {/* Account Information */}
          <div className="space-y-6">

            <section className="rounded-2xl border border-border bg-white p-6 sm:p-8">
              <h2 className="text-xl font-bold text-text">
                Account Information
              </h2>

              <div className="mt-7 grid gap-6 sm:grid-cols-2">

                {/* Name */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Full Name
                  </p>

                  <div className="mt-2 flex items-center gap-3 rounded-lg bg-surface px-4 py-3">
                    <FiUser
                      size={18}
                      className="shrink-0 text-primary"
                    />

                    <span className="font-medium text-text">
                      {profile?.name}
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Email Address
                  </p>

                  <div className="mt-2 flex items-center gap-3 rounded-lg bg-surface px-4 py-3">
                    <FiMail
                      size={18}
                      className="shrink-0 text-primary"
                    />

                    <span className="break-all font-medium text-text">
                      {profile?.email}
                    </span>
                  </div>
                </div>

                {/* Role */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Account Type
                  </p>

                  <div className="mt-2 flex items-center gap-3 rounded-lg bg-surface px-4 py-3">
                    <FiShield
                      size={18}
                      className="shrink-0 text-primary"
                    />

                    <span className="font-medium capitalize text-text">
                      {profile?.role}
                    </span>
                  </div>
                </div>

                {/* User ID */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Account ID
                  </p>

                  <div className="mt-2 flex items-center gap-3 rounded-lg bg-surface px-4 py-3">
                    <FiUser
                      size={18}
                      className="shrink-0 text-primary"
                    />

                    <span className="font-medium text-text">
                      #{profile?.id}
                    </span>
                  </div>
                </div>

              </div>
            </section>

            {/* Quick Actions */}
            <section className="rounded-2xl border border-border bg-white p-6 sm:p-8">
              <h2 className="text-xl font-bold text-text">
                Quick Actions
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                <Link
                  to="/orders"
                  className="group flex items-center gap-4 rounded-xl border border-border p-4 transition hover:border-primary hover:bg-primary/5"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FiPackage size={21} />
                  </div>

                  <div>
                    <p className="font-semibold text-text group-hover:text-primary">
                      My Orders
                    </p>

                    <p className="mt-1 text-sm text-muted">
                      View your order history
                    </p>
                  </div>
                </Link>

                <Link
                  to="/products"
                  className="group flex items-center gap-4 rounded-xl border border-border p-4 transition hover:border-primary hover:bg-primary/5"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FiShoppingBag size={21} />
                  </div>

                  <div>
                    <p className="font-semibold text-text group-hover:text-primary">
                      Continue Shopping
                    </p>

                    <p className="mt-1 text-sm text-muted">
                      Browse our products
                    </p>
                  </div>
                </Link>

              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}

export default Profile;