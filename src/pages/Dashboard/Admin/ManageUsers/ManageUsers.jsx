// Manage Users Page - Admin User Management Component
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  FiUsers,
  FiUser,
  FiMail,
  FiShield,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiFilter,
  FiMoreVertical,
  FiEdit3,
  FiUserCheck,
  FiUserX,
} from "react-icons/fi";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";
import PageTitle from "../../../../components/ui/PageTitle";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Fetch All Users From API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axiosSecure.get("/api/users");
      setUsers(Array.isArray(data) ? data : []);
      setFilteredUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed To Fetch Users!", "error");
    } finally {
      setLoading(false);
    }
  };

  // Initial Fetch
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter Users Based On Search And Filters
  useEffect(() => {
    let result = [...users];

    // Search Filter
    if (searchTerm) {
      result = result.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Role Filter
    if (roleFilter) {
      result = result.filter((user) => user.role === roleFilter);
    }

    // Status Filter
    if (statusFilter) {
      result = result.filter((user) => user.status === statusFilter);
    }

    setFilteredUsers(result);
  }, [searchTerm, roleFilter, statusFilter, users]);

  // Handle Role Change
  const handleRoleChange = async (userId, newRole, userName) => {
    const confirm = await Swal.fire({
      title: "Change User Role?",
      html: `
        <p class="text-base-content/70">You are about to change the role of</p>
        <p class="font-bold text-lg mt-2">${userName}</p>
        <p class="text-base-content/70 mt-2">New role: <span class="badge badge-primary">${newRole}</span></p>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Change Role",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#10B981",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.patch(`/api/users/${userId}/role`, { role: newRole });
      Swal.fire({
        title: "Success!",
        text: "User role has been updated successfully.",
        icon: "success",
        confirmButtonColor: "#10B981",
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update user role!", "error");
    }
  };

  // Handle Status Change
  const handleStatusChange = async (user) => {
    if (user.uid === currentUser.uid) {
      Swal.fire({
        title: "Action Not Allowed",
        text: "You cannot change your own status!",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
      return;
    }

    let reason = "";
    let feedback = "";

    // If Suspending, Ask For Reason
    if (user.status === "active") {
      const { value: formValues } = await Swal.fire({
        title: "Suspend User",
        html: `
          <div class="space-y-4 text-left">
            <div>
              <label class="block text-sm font-medium mb-2">Reason for Suspension</label>
              <input id="swal-reason" class="input input-bordered w-full" placeholder="Enter reason...">
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Feedback (Optional)</label>
              <textarea id="swal-feedback" class="textarea textarea-bordered w-full" placeholder="Additional feedback..."></textarea>
            </div>
          </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Suspend User",
        confirmButtonColor: "#EF4444",
        preConfirm: () => [
          document.getElementById("swal-reason").value,
          document.getElementById("swal-feedback").value,
        ],
      });

      if (!formValues) return;
      [reason, feedback] = formValues;

      if (!reason.trim()) {
        Swal.fire("Error", "Please provide a reason for suspension!", "error");
        return;
      }
    }

    const newStatus = user.status === "active" ? "suspended" : "active";

    const confirm = await Swal.fire({
      title: `${newStatus === "suspended" ? "Suspend" : "Activate"} User?`,
      html: `
        <p class="text-base-content/70">You are about to ${
          newStatus === "suspended" ? "suspend" : "activate"
        }</p>
        <p class="font-bold text-lg mt-2">${user.name}</p>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${
        newStatus === "suspended" ? "Suspend" : "Activate"
      }`,
      confirmButtonColor: newStatus === "suspended" ? "#EF4444" : "#10B981",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.patch(`/api/users/${user._id}/status`, {
        status: newStatus,
        reason,
        feedback,
      });
      Swal.fire({
        title: "Success!",
        text: `User has been ${
          newStatus === "suspended" ? "suspended" : "activated"
        } successfully.`,
        icon: "success",
        confirmButtonColor: "#10B981",
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update user status!", "error");
    }
  };

  // Get Role Badge Color
  const getRoleBadge = (role) => {
    const badges = {
      admin: "badge-error",
      manager: "badge-warning",
      buyer: "badge-info",
    };
    return badges[role] || "badge-ghost";
  };

  // Get Status Badge Color
  const getStatusBadge = (status) => {
    const badges = {
      active: "badge-success",
      suspended: "badge-error",
      pending: "badge-warning",
    };
    return badges[status] || "badge-ghost";
  };

  // Statistics
  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    managers: users.filter((u) => u.role === "manager").length,
    buyers: users.filter((u) => u.role === "buyer").length,
    active: users.filter((u) => u.status === "active").length,
    suspended: users.filter((u) => u.status === "suspended").length,
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="p-2">
      <PageTitle title="Manage Users" />
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <FiUsers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-base-content">
              Manage Users
            </h1>
            <p className="text-base-content/60">
              View and manage all platform users!
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-base-100 rounded-xl border border-base-200 p-4 text-center"
        >
          <p className="text-2xl font-bold text-base-content">{stats.total}</p>
          <p className="text-sm text-base-content/60">Total Users</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-error/10 rounded-xl border border-error/20 p-4 text-center"
        >
          <p className="text-2xl font-bold text-error">{stats.admins}</p>
          <p className="text-sm text-error/70">Admins</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-warning/10 rounded-xl border border-warning/20 p-4 text-center"
        >
          <p className="text-2xl font-bold text-warning">{stats.managers}</p>
          <p className="text-sm text-warning/70">Managers</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-info/10 rounded-xl border border-info/20 p-4 text-center"
        >
          <p className="text-2xl font-bold text-info">{stats.buyers}</p>
          <p className="text-sm text-info/70">Buyers</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-success/10 rounded-xl border border-success/20 p-4 text-center"
        >
          <p className="text-2xl font-bold text-success">{stats.active}</p>
          <p className="text-sm text-success/70">Active</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-error/10 rounded-xl border border-error/20 p-4 text-center"
        >
          <p className="text-2xl font-bold text-error">{stats.suspended}</p>
          <p className="text-sm text-error/70">Suspended</p>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-base-100 rounded-2xl border border-base-200 p-4 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full pl-10"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="select select-bordered w-full md:w-40"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="buyer">Buyer</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select select-bordered w-full md:w-40"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </motion.div>

      {/* Users Table - Desktop */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="hidden md:block bg-base-100 rounded-2xl border border-base-200 shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="bg-base-200">
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-8 text-base-content/50"
                  >
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr key={user._id} className="hover:bg-base-50">
                    <td className="font-medium">{index + 1}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                          {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          {user.uid === currentUser.uid && (
                            <span className="text-xs text-primary">(You)</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="text-base-content/70">{user.email}</td>
                    <td>
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value, user.name)
                        }
                        className={`select select-sm select-bordered ${getRoleBadge(
                          user.role,
                        )}`}
                        disabled={user.uid === currentUser.uid}
                      >
                        <option value="buyer">Buyer</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <span
                        className={`badge ${getStatusBadge(user.status)} gap-1`}
                      >
                        {user.status === "active" ? (
                          <FiCheckCircle className="w-3 h-3" />
                        ) : (
                          <FiXCircle className="w-3 h-3" />
                        )}
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleStatusChange(user)}
                        className={`btn btn-sm ${
                          user.status === "active" ? "btn-error" : "btn-success"
                        }`}
                        disabled={user.uid === currentUser.uid}
                      >
                        {user.status === "active" ? (
                          <>
                            <FiUserX className="w-4 h-4" />
                            Suspend
                          </>
                        ) : (
                          <>
                            <FiUserCheck className="w-4 h-4" />
                            Activate
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Users Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {filteredUsers.length === 0 ? (
          <div className="bg-base-100 rounded-2xl border border-base-200 p-8 text-center">
            <FiUsers className="w-12 h-12 text-base-content/20 mx-auto mb-3" />
            <p className="text-base-content/50">No users found.</p>
          </div>
        ) : (
          filteredUsers.map((user, index) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-base-100 rounded-2xl border border-base-200 shadow-sm overflow-hidden"
            >
              <div className="p-4">
                {/* User Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-base-content">
                      {user.name}
                      {user.uid === currentUser.uid && (
                        <span className="text-xs text-primary ml-2">(You)</span>
                      )}
                    </p>
                    <p className="text-sm text-base-content/60">{user.email}</p>
                  </div>
                  <span className={`badge ${getStatusBadge(user.status)}`}>
                    {user.status}
                  </span>
                </div>

                {/* Role Selection */}
                <div className="mb-4">
                  <label className="text-sm text-base-content/60 mb-1 block">
                    Role
                  </label>
                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(user._id, e.target.value, user.name)
                    }
                    className="select select-bordered w-full"
                    disabled={user.uid === currentUser.uid}
                  >
                    <option value="buyer">Buyer</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleStatusChange(user)}
                  className={`btn btn-block ${
                    user.status === "active" ? "btn-error" : "btn-success"
                  }`}
                  disabled={user.uid === currentUser.uid}
                >
                  {user.status === "active" ? (
                    <>
                      <FiUserX className="w-5 h-5" />
                      Suspend User
                    </>
                  ) : (
                    <>
                      <FiUserCheck className="w-5 h-5" />
                      Activate User
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Results Summary */}
      <div className="mt-4 text-center text-sm text-base-content/50">
        Showing {filteredUsers.length} of {users.length} users
      </div>
    </div>
  );
};

export default ManageUsers;
