// All Orders Page - Admin Order Management Component
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { debounce } from "lodash";
import {
  FiClipboard,
  FiSearch,
  FiFilter,
  FiEye,
  FiPackage,
  FiUser,
  FiMail,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiChevronLeft,
  FiChevronRight,
  FiHash,
  FiCalendar,
} from "react-icons/fi";
import useUserRole from "../../../../hooks/useUserRole";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const navigate = useNavigate();
  const { role } = useUserRole();
  const axiosSecure = useAxiosSecure();

  // Fetch Orders From API
  const fetchOrders = useCallback(async () => {
    if (role !== "admin") return;
    setLoading(true);
    try {
      const { data } = await axiosSecure.get("/api/orders", {
        params: { status: statusFilter, search, page, limit },
      });
      setOrders(data.orders || []);
      setTotal(data.total || 0);
    } catch {
      Swal.fire("Error", "Failed to fetch orders!", "error");
    } finally {
      setLoading(false);
    }
  }, [axiosSecure, statusFilter, search, page, limit, role]);

  // Debounced Search Handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      setPage(1);
      setSearch(value);
    }, 500),
    [],
  );

  // Fetch On Mount And Filter Changes
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Navigate To Order Details
  const handleView = (id) => {
    navigate(`/dashboard/order-details/${id}`);
  };

  // Pagination Helpers
  const totalPages = Math.ceil(total / limit);
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  // Get Status Badge Color
  const getStatusBadge = (status) => {
    const badges = {
      pending: "badge-warning",
      approved: "badge-success",
      completed: "badge-info",
      rejected: "badge-error",
      canceled: "badge-ghost",
    };
    return badges[status?.toLowerCase()] || "badge-ghost";
  };

  // Get Status Icon
  const getStatusIcon = (status) => {
    const icons = {
      pending: FiClock,
      approved: FiCheckCircle,
      completed: FiCheckCircle,
      rejected: FiXCircle,
      canceled: FiXCircle,
    };
    const Icon = icons[status?.toLowerCase()] || FiClipboard;
    return <Icon className="w-4 h-4" />;
  };

  // Get Payment Badge Color
  const getPaymentBadge = (status) => {
    return status === "paid"
      ? "bg-success/10 text-success border-success/20"
      : "bg-error/10 text-error border-error/20";
  };

  // Format Date
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Statistics
  const stats = {
    total: total,
    pending: orders.filter((o) => o.status === "pending").length,
    approved: orders.filter((o) => o.status === "approved").length,
    paid: orders.filter((o) => o.paymentStatus === "paid").length,
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
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <FiClipboard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-base-content">All Orders</h1>
            <p className="text-base-content/60">
              View and manage all platform orders!
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-base-100 rounded-xl border border-base-200 p-4"
        >
          <p className="text-2xl font-bold text-base-content">{total}</p>
          <p className="text-sm text-base-content/60">Total Orders</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-warning/10 rounded-xl border border-warning/20 p-4"
        >
          <p className="text-2xl font-bold text-warning">{stats.pending}</p>
          <p className="text-sm text-warning/70">Pending</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-success/10 rounded-xl border border-success/20 p-4"
        >
          <p className="text-2xl font-bold text-success">{stats.approved}</p>
          <p className="text-sm text-success/70">Approved</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-info/10 rounded-xl border border-info/20 p-4"
        >
          <p className="text-2xl font-bold text-info">{stats.paid}</p>
          <p className="text-sm text-info/70">Paid</p>
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
              placeholder="Search by Tracking ID or Email..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="input input-bordered w-full pl-10"
            />
          </div>

          {/* Status Filter */}
          <select
            className="select select-bordered w-full md:w-40"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
            <option value="canceled">Canceled</option>
          </select>

          {/* Payment Filter */}
          <select
            className="select select-bordered w-full md:w-40"
            value={paymentFilter}
            onChange={(e) => {
              setPaymentFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Payments</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
      </motion.div>

      {/* No Orders */}
      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-base-100 rounded-2xl border border-base-200 p-12 text-center"
        >
          <FiClipboard className="w-16 h-16 text-base-content/20 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-base-content mb-2">
            No Orders Found
          </h3>
          <p className="text-base-content/60">
            {search || statusFilter
              ? "Try adjusting your search or filter criteria."
              : "No orders have been placed yet."}
          </p>
        </motion.div>
      ) : (
        <>
          {/* Orders Table - Desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden md:block bg-base-100 rounded-2xl border border-base-200 shadow-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="bg-base-200">
                  <tr>
                    <th>Tracking ID</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-base-50">
                      <td>
                        <span className="font-mono text-sm font-medium">
                          {order.trackingId}
                        </span>
                      </td>
                      <td>
                        <div>
                          <p className="font-medium">{order.userName}</p>
                          <p className="text-xs text-base-content/50">
                            {order.userEmail}
                          </p>
                        </div>
                      </td>
                      <td>
                        <p className="font-medium truncate max-w-[150px]">
                          {order.productName}
                        </p>
                      </td>
                      <td className="font-medium">{order.quantity}</td>
                      <td>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-base-content/50">
                            {order.paymentOption === "COD"
                              ? "Cash on Delivery"
                              : "Pay First"}
                          </span>
                          <span
                            className={`badge badge-sm ${getPaymentBadge(
                              order.paymentStatus,
                            )}`}
                          >
                            {order.paymentStatus?.toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge ${getStatusBadge(
                            order.status,
                          )} gap-1`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </td>
                      <td className="text-base-content/60 text-sm">
                        {formatDate(order.createdAt)}
                      </td>
                      <td>
                        <button
                          onClick={() => handleView(order._id)}
                          className="btn btn-sm btn-primary"
                        >
                          <FiEye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Orders Cards - Mobile */}
          <div className="md:hidden space-y-4">
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="bg-base-100 rounded-2xl border border-base-200 shadow-sm overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-4 border-b border-base-200 bg-base-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FiHash className="w-4 h-4 text-primary" />
                      <span className="font-mono text-sm font-medium">
                        {order.trackingId}
                      </span>
                    </div>
                    <span
                      className={`badge ${getStatusBadge(order.status)} gap-1`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  {/* Customer */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <FiUser className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{order.userName}</p>
                      <p className="text-xs text-base-content/50">
                        {order.userEmail}
                      </p>
                    </div>
                  </div>

                  {/* Product */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                      <FiPackage className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium">{order.productName}</p>
                      <p className="text-xs text-base-content/50">
                        Qty: {order.quantity}
                      </p>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-base-50 rounded-lg p-3">
                      <p className="text-xs text-base-content/50 mb-1">
                        Payment Method
                      </p>
                      <p className="font-medium text-sm">
                        {order.paymentOption === "COD"
                          ? "Cash on Delivery"
                          : "Pay First"}
                      </p>
                    </div>
                    <div className="bg-base-50 rounded-lg p-3">
                      <p className="text-xs text-base-content/50 mb-1">
                        Payment Status
                      </p>
                      <span
                        className={`badge badge-sm ${getPaymentBadge(
                          order.paymentStatus,
                        )}`}
                      >
                        {order.paymentStatus?.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm text-base-content/50">
                    <FiCalendar className="w-4 h-4" />
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 border-t border-base-200 bg-base-50">
                  <button
                    onClick={() => handleView(order._id)}
                    className="btn btn-primary btn-block"
                  >
                    <FiEye className="w-5 h-5" />
                    View Order Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center mt-6 gap-2"
            >
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                <FiChevronLeft className="w-5 h-5" />
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      className={`btn btn-sm ${
                        page === pageNum ? "btn-primary" : "btn-ghost"
                      }`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                className="btn btn-sm btn-ghost"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
              >
                Next
                <FiChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </>
      )}

      {/* Results Summary */}
      <div className="mt-4 text-center text-sm text-base-content/50">
        Showing {orders.length} of {total} Orders (Page {page} of{" "}
        {totalPages || 1})
      </div>
    </div>
  );
};

export default AllOrders;
