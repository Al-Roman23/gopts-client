// Order Details Page - Complete Order Information
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  FiPackage,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiHash,
  FiDollarSign,
  FiCreditCard,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiTruck,
  FiFileText,
  FiArrowLeft,
  FiShoppingBag,
  FiMessageSquare,
} from "react-icons/fi";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useUserRole from "../../../../hooks/useUserRole";

const OrderDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { role, isLoading: roleLoading } = useUserRole();

  // Fetch Order Data
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        let res;
        if (role === "admin") {
          res = await axiosSecure.get(`/api/orders/${id}`);
        } else if (role === "manager") {
          res = await axiosSecure.get(
            `/api/orders/manager/order-details/${id}`,
          );
        }
        setOrder(res.data);
      } catch (error) {
        Swal.fire("Error", "Failed to fetch order details!", "error");
      } finally {
        setLoading(false);
      }
    };
    if (!roleLoading) {
      fetchOrder();
    }
  }, [id, role, roleLoading, axiosSecure]);

  // Format Date
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get Status Badge
  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: "badge-warning", icon: FiClock },
      approved: { color: "badge-success", icon: FiCheckCircle },
      completed: { color: "badge-info", icon: FiCheckCircle },
      rejected: { color: "badge-error", icon: FiXCircle },
      canceled: { color: "badge-error", icon: FiXCircle },
    };
    return (
      badges[status?.toLowerCase()] || { color: "badge-ghost", icon: FiPackage }
    );
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  // Order Not Found
  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <FiPackage className="w-16 h-16 text-base-content/20 mb-4" />
        <p className="text-base-content/60 mb-4">Order not found!</p>
        <Link to="/dashboard/all-orders" className="btn btn-primary">
          <FiArrowLeft className="w-5 h-5" />
          Back to Orders
        </Link>
      </div>
    );
  }

  const statusBadge = getStatusBadge(order.status);
  const StatusIcon = statusBadge.icon;

  return (
    <div className="p-2 max-w-5xl mx-auto">
      {/* Back Button And Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Link
          to="/dashboard/all-orders"
          className="btn btn-ghost btn-sm gap-2 mb-4"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <FiPackage className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-base-content">
                Order Details
              </h1>
              <p className="text-base-content/60 font-mono">
                #{order.trackingId}
              </p>
            </div>
          </div>
          <span
            className={`badge ${statusBadge.color} badge-lg gap-2 capitalize`}
          >
            <StatusIcon className="w-4 h-4" />
            {order.status}
          </span>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-base-100 rounded-2xl border border-base-200 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
                <FiFileText className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold">General Information</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-base-50 rounded-xl">
                <FiHash className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-base-content/50">Tracking ID</p>
                  <p className="font-mono font-semibold">{order.trackingId}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-base-50 rounded-xl">
                <FiCalendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-base-content/50">Order Date</p>
                  <p className="font-medium">{formatDate(order.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-base-50 rounded-xl">
                <FiCreditCard className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-base-content/50">Payment Method</p>
                  <p className="font-medium">{order.paymentOption}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-base-50 rounded-xl">
                <FiDollarSign className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-base-content/50">Payment Status</p>
                  <span
                    className={`badge badge-sm ${
                      order.paymentStatus === "paid"
                        ? "badge-success"
                        : "badge-warning"
                    }`}
                  >
                    {order.paymentStatus === "paid" ? (
                      <FiCheckCircle className="w-3 h-3 mr-1" />
                    ) : (
                      <FiClock className="w-3 h-3 mr-1" />
                    )}
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Customer Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-base-100 rounded-2xl border border-base-200 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-accent/10 text-accent">
                <FiUser className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold">Customer Information</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <FiUser className="w-5 h-5 text-base-content/40" />
                <div>
                  <p className="text-xs text-base-content/50">Full Name</p>
                  <p className="font-medium">
                    {order.firstName} {order.lastName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiMail className="w-5 h-5 text-base-content/40" />
                <div>
                  <p className="text-xs text-base-content/50">Email</p>
                  <p className="font-medium">{order.userEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiPhone className="w-5 h-5 text-base-content/40" />
                <div>
                  <p className="text-xs text-base-content/50">Contact Number</p>
                  <p className="font-medium">{order.contactNumber}</p>
                </div>
              </div>
              {order.managerEmail && (
                <div className="flex items-center gap-3">
                  <FiMail className="w-5 h-5 text-base-content/40" />
                  <div>
                    <p className="text-xs text-base-content/50">
                      Manager Email
                    </p>
                    <p className="font-medium">{order.managerEmail}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Delivery Address */}
            {order.deliveryAddress && (
              <div className="mt-4 pt-4 border-t border-base-200">
                <div className="flex items-start gap-3">
                  <FiMapPin className="w-5 h-5 text-base-content/40 mt-0.5" />
                  <div>
                    <p className="text-xs text-base-content/50">
                      Delivery Address
                    </p>
                    <p className="font-medium">{order.deliveryAddress}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Notes */}
            {order.additionalNotes && (
              <div className="mt-4 pt-4 border-t border-base-200">
                <div className="flex items-start gap-3">
                  <FiMessageSquare className="w-5 h-5 text-base-content/40 mt-0.5" />
                  <div>
                    <p className="text-xs text-base-content/50">
                      Additional Notes
                    </p>
                    <p className="font-medium">{order.additionalNotes}</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Tracking Logs Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-base-100 rounded-2xl border border-base-200 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-info/10 text-info">
                <FiTruck className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold">Tracking History</h2>
            </div>

            {Array.isArray(order.trackingLogs) &&
            order.trackingLogs.length > 0 ? (
              <div className="space-y-4">
                {order.trackingLogs.map((log, idx) => (
                  <div
                    key={log.trackingId || idx}
                    className="relative pl-6 pb-4 border-l-2 border-primary/20 last:border-l-transparent"
                  >
                    {/* Timeline Dot */}
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary" />

                    <div className="bg-base-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`badge ${
                            getStatusBadge(log.status).color
                          } capitalize`}
                        >
                          {log.status}
                        </span>
                        <span className="text-xs text-base-content/50">
                          {formatDate(log.createdAt)}
                        </span>
                      </div>
                      <p className="font-medium text-base-content mb-2">
                        {log.message}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-base-content/60">
                        {log.location && (
                          <span className="flex items-center gap-1">
                            <FiMapPin className="w-4 h-4" />
                            {typeof log.location === "object"
                              ? log.location?.name ||
                                log.location?.city ||
                                "N/A"
                              : log.location}
                          </span>
                        )}
                        {log.by && (
                          <span className="flex items-center gap-1">
                            <FiUser className="w-4 h-4" />
                            {typeof log.by === "object"
                              ? log.by?.name || log.by?.email || "System"
                              : log.by}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiTruck className="w-12 h-12 text-base-content/20 mx-auto mb-3" />
                <p className="text-base-content/60">No tracking logs yet.</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-base-100 rounded-2xl border border-base-200 p-6 sticky top-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-success/10 text-success">
                <FiShoppingBag className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold">Order Summary</h2>
            </div>

            {/* Product Info */}
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-base-50 rounded-xl">
                <h3 className="font-semibold text-base-content mb-2">
                  {order.productName}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-base-content/60">Quantity</span>
                    <span className="font-medium">{order.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/60">Unit Price</span>
                    <span className="font-medium">
                      ৳{Number(order.price || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 pt-4 border-t border-base-200">
              <div className="flex justify-between text-sm">
                <span className="text-base-content/60">Subtotal</span>
                <span>৳{Number(order.totalPrice || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-base-content/60">Shipping</span>
                <span className="text-success">Free</span>
              </div>
              <div className="divider my-2" />
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold text-primary">
                  ৳{Number(order.totalPrice || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Payment Badge */}
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10">
              <div className="flex items-center justify-between">
                <span className="text-sm text-base-content/70">Payment</span>
                {order.paymentStatus === "paid" ? (
                  <span className="badge badge-success gap-1">
                    <FiCheckCircle className="w-3 h-3" />
                    Paid
                  </span>
                ) : (
                  <span className="badge badge-warning gap-1">
                    <FiClock className="w-3 h-3" />
                    Unpaid
                  </span>
                )}
              </div>
              {order.transactionId && (
                <p className="text-xs text-base-content/50 mt-2 font-mono">
                  TXN: {order.transactionId}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
