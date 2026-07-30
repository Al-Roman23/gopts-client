// User Profile Page Component
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  FiUser,
  FiMail,
  FiShield,
  FiCalendar,
  FiAlertCircle,
  FiCheckCircle,
  FiLogOut,
  FiClock,
  FiMessageSquare,
  FiEdit3,
} from "react-icons/fi";
import useAuth from "../../../../hooks/useAuth";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useNavigate } from "react-router";

import PageTitle from "../../../../components/ui/PageTitle";

const Profile = () => {
  const { user: authUser, logOut } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch User Data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axiosSecure.get(`api/users/${authUser.uid}`);
        setUser(data);
      } catch (error) {
        console.error("Failed to load user:", error);
        Swal.fire("Error", "Failed to load profile information.", "error");
      } finally {
        setLoading(false);
      }
    };

    if (authUser?.uid) fetchUser();
  }, [authUser, axiosSecure]);

  // Handle Logout
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      confirmButtonColor: "#EF4444",
    });

    if (result.isConfirmed) {
      try {
        await logOut();
        navigate("/login");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  // Format Date
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get Role Color
  const getRoleColor = (role) => {
    const colors = {
      admin: "bg-red-500",
      manager: "bg-blue-500",
      buyer: "bg-green-500",
    };
    return colors[role?.toLowerCase()] || "bg-gray-500";
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  // User Not Found
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <FiUser className="w-16 h-16 text-base-content/20 mb-4" />
        <p className="text-base-content/60">User not found.</p>
      </div>
    );
  }

  return (
    <div className="p-2 max-w-3xl mx-auto">
      <PageTitle title="My Profile" />
      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-3xl border border-base-200 overflow-hidden mb-6"
      >
        {/* Cover Background */}
        <div className="h-32 bg-gradient-to-r from-primary to-secondary" />

        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-base-100 shadow-lg overflow-hidden bg-base-200">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10">
                    <FiUser className="w-16 h-16 text-primary" />
                  </div>
                )}
              </div>
              {/* Status Indicator */}
              <div
                className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-base-100 ${
                  user.status === "active" ? "bg-success" : "bg-error"
                }`}
              />
            </div>

            {/* Name And Email */}
            <div className="text-center sm:text-left flex-1 pb-2">
              <h1 className="text-2xl font-bold text-base-content">
                {user.name}
              </h1>
              <p className="text-base-content/60 flex items-center justify-center sm:justify-start gap-2">
                <FiMail className="w-4 h-4" />
                {user.email}
              </p>
            </div>

            {/* Role Badge */}
            <div className="flex items-center gap-2">
              <span
                className={`px-4 py-2 rounded-full text-white font-semibold capitalize ${getRoleColor(
                  user.role,
                )}`}
              >
                {user.role}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Account Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-base-100 rounded-2xl border border-base-200 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <FiShield className="w-5 h-5" />
            </div>
            <h2 className="font-semibold text-lg">Account Status</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-base-content/60">Status</span>
              <span
                className={`badge gap-1 ${
                  user.status === "active" ? "badge-success" : "badge-error"
                }`}
              >
                {user.status === "active" ? (
                  <FiCheckCircle className="w-3 h-3" />
                ) : (
                  <FiAlertCircle className="w-3 h-3" />
                )}
                {user.status || "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base-content/60">Role</span>
              <span className="badge badge-primary capitalize">
                {user.role}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Account Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-base-100 rounded-2xl border border-base-200 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-secondary/10 text-secondary">
              <FiCalendar className="w-5 h-5" />
            </div>
            <h2 className="font-semibold text-lg">Account Details</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-base-content/60">Member Since</span>
              <span className="font-medium">{formatDate(user.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base-content/60">User ID</span>
              <span className="font-mono text-xs text-base-content/50">
                {user.uid?.substring(0, 12)}...
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Suspension Warning Card */}
      {user.suspend?.isSuspended && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-error/10 rounded-2xl border border-error/20 p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-error/20 text-error">
              <FiAlertCircle className="w-5 h-5" />
            </div>
            <h2 className="font-semibold text-lg text-error">
              Account Suspended
            </h2>
          </div>
          <div className="space-y-3">
            {user.suspend.reason && (
              <div className="flex items-start gap-3">
                <FiClock className="w-5 h-5 text-error/60 mt-0.5" />
                <div>
                  <p className="text-sm text-error/60">Reason</p>
                  <p className="font-medium text-error">
                    {user.suspend.reason}
                  </p>
                </div>
              </div>
            )}
            {user.suspend.feedback && (
              <div className="flex items-start gap-3">
                <FiMessageSquare className="w-5 h-5 text-error/60 mt-0.5" />
                <div>
                  <p className="text-sm text-error/60">Feedback</p>
                  <p className="font-medium text-error">
                    {user.suspend.feedback}
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <button
          onClick={handleLogout}
          className="btn btn-error btn-outline flex-1"
        >
          <FiLogOut className="w-5 h-5" />
          Logout
        </button>
      </motion.div>
    </div>
  );
};

export default Profile;
