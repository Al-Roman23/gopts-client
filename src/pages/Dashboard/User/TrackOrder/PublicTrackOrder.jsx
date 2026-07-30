// Public Track Order Page Component
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  FiSearch,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiUser,
  FiMail,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiHash,
} from "react-icons/fi";
import PageTitle from "../../../../components/ui/PageTitle";

// Create Axios Instance For Public API
const axiosPublic = axios.create({
  baseURL: "https://mygopts.vercel.app",
});

const PublicTrackOrder = () => {
  const [searchParams] = useSearchParams();
  const [trackingId, setTrackingId] = useState("");
  const [searchId, setSearchId] = useState("");

  // Auto-populate From URL Query Parameter On Mount
  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (idFromUrl) {
      setTrackingId(idFromUrl);
      setSearchId(idFromUrl);
    }
  }, [searchParams]);

  // Fetch Order Data Query
  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["track-order", searchId],
    queryFn: async () => {
      const res = await axiosPublic.get(`/api/orders/public/track/${searchId}`);
      return res.data;
    },
    enabled: !!searchId,
  });

  // Handle Search Form Submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (trackingId.trim()) {
      setSearchId(trackingId.trim());
    }
  };

  // Get Status Icon Based On Order Status
  const getStatusIcon = (status) => {
    const icons = {
      pending: FiClock,
      approved: FiCheckCircle,
      completed: FiCheckCircle,
      rejected: FiXCircle,
      canceled: FiXCircle,
    };
    return icons[status?.toLowerCase()] || FiPackage;
  };

  // Get Status Color Classes
  const getStatusColor = (status) => {
    const colors = {
      pending: "text-warning bg-warning/10 border-warning/30",
      approved: "text-success bg-success/10 border-success/30",
      completed: "text-info bg-info/10 border-info/30",
      rejected: "text-error bg-error/10 border-error/30",
      canceled: "text-base-content/50 bg-base-300/50 border-base-300",
    };
    return colors[status?.toLowerCase()] || "text-base-content bg-base-200";
  };

  // Format Date For Display
  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = date.$date || date;
    return new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get Tracking Step Status
  const getStepStatus = (currentStatus, stepStatus) => {
    const statusOrder = ["pending", "approved", "completed"];
    const currentIndex = statusOrder.indexOf(currentStatus?.toLowerCase());
    const stepIndex = statusOrder.indexOf(stepStatus);

    if (currentStatus === "rejected" || currentStatus === "canceled") {
      return stepStatus === "pending" ? "completed" : "inactive";
    }

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
    return "inactive";
  };

  const StatusIcon = order ? getStatusIcon(order.status) : FiPackage;

  return (
    <div className="min-h-[80vh] py-8 px-4">
      <PageTitle title="Track Order" />
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4">
            <FiTruck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-base-content mb-2">
            Track Your Order
          </h1>
          <p className="text-base-content/60 max-w-md mx-auto">
            Enter your tracking ID to get real-time updates on your order status
            and delivery progress.
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSearch}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter your tracking ID!"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="input input-bordered w-full pl-12 pr-4 h-14 text-lg rounded-xl focus:input-primary"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary h-14 px-8 rounded-xl text-base font-medium"
            >
              <FiSearch className="w-5 h-5" />
              Track Order
            </button>
          </div>
        </motion.form>

        {/* Loading State */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <span className="loading loading-spinner loading-lg text-primary" />
              <p className="mt-4 text-base-content/60">
                Searching for your order...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {isError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-error/10 border border-error/30 rounded-2xl p-6 text-center"
            >
              <FiXCircle className="w-12 h-12 text-error mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-error mb-2">
                Order Not Found
              </h3>
              <p className="text-base-content/60">
                {error?.response?.data?.message ||
                  "We couldn't find an order with that tracking ID. Please check and try again."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order Details */}
        <AnimatePresence>
          {!isLoading && !isError && order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Status Card */}
              <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-base-200">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-base-content/60 mb-1">
                        Tracking ID
                      </p>
                      <p className="text-xl font-mono font-bold text-base-content">
                        {order.trackingId}
                      </p>
                    </div>
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${getStatusColor(
                        order.status,
                      )}`}
                    >
                      <StatusIcon className="w-5 h-5" />
                      <span className="font-semibold capitalize">
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="p-6 bg-base-50">
                  <div className="flex items-center justify-between relative">
                    {/* Progress Line */}
                    <div className="absolute top-5 left-0 right-0 h-1 bg-base-300 rounded-full mx-12" />
                    <div
                      className="absolute top-5 left-0 h-1 bg-primary rounded-full mx-12 transition-all duration-500"
                      style={{
                        width:
                          order.status === "pending"
                            ? "0%"
                            : order.status === "approved"
                              ? "50%"
                              : order.status === "completed"
                                ? "100%"
                                : "0%",
                      }}
                    />

                    {/* Step: Order Placed */}
                    <div className="flex flex-col items-center z-10">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          getStepStatus(order.status, "pending") ===
                            "completed" ||
                          getStepStatus(order.status, "pending") === "active"
                            ? "bg-primary text-primary-content"
                            : "bg-base-300 text-base-content/40"
                        }`}
                      >
                        <FiPackage className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium mt-2 text-center">
                        Order Placed
                      </span>
                    </div>

                    {/* Step: Approved */}
                    <div className="flex flex-col items-center z-10">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          getStepStatus(order.status, "approved") ===
                            "completed" ||
                          getStepStatus(order.status, "approved") === "active"
                            ? "bg-primary text-primary-content"
                            : "bg-base-300 text-base-content/40"
                        }`}
                      >
                        <FiCheckCircle className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium mt-2 text-center">
                        Approved
                      </span>
                    </div>

                    {/* Step: Completed */}
                    <div className="flex flex-col items-center z-10">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          getStepStatus(order.status, "completed") ===
                            "completed" ||
                          getStepStatus(order.status, "completed") === "active"
                            ? "bg-primary text-primary-content"
                            : "bg-base-300 text-base-content/40"
                        }`}
                      >
                        <FiTruck className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium mt-2 text-center">
                        Completed
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Information Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Customer Details */}
                <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FiUser className="text-primary" />
                    Customer Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <FiUser className="w-5 h-5 text-base-content/40" />
                      <div>
                        <p className="text-sm text-base-content/60">Name</p>
                        <p className="font-medium">{order.userName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FiMail className="w-5 h-5 text-base-content/40" />
                      <div>
                        <p className="text-sm text-base-content/60">Email</p>
                        <p className="font-medium">{order.userEmail}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FiPackage className="text-primary" />
                    Order Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <FiPackage className="w-5 h-5 text-base-content/40" />
                      <div>
                        <p className="text-sm text-base-content/60">Product</p>
                        <p className="font-medium">{order.productName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FiHash className="w-5 h-5 text-base-content/40" />
                      <div>
                        <p className="text-sm text-base-content/60">Quantity</p>
                        <p className="font-medium">{order.quantity} units</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FiDollarSign className="w-5 h-5 text-base-content/40" />
                      <div>
                        <p className="text-sm text-base-content/60">
                          Total Price
                        </p>
                        <p className="font-medium text-primary">
                          ৳{order.totalPrice?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FiDollarSign className="text-primary" />
                  Payment Information
                </h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="bg-base-50 rounded-xl p-4">
                    <p className="text-sm text-base-content/60 mb-1">
                      Payment Method
                    </p>
                    <p className="font-semibold capitalize">
                      {order.paymentOption === "COD"
                        ? "Cash on Delivery"
                        : "Online Payment"}
                    </p>
                  </div>
                  <div className="bg-base-50 rounded-xl p-4">
                    <p className="text-sm text-base-content/60 mb-1">
                      Payment Status
                    </p>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        order.paymentStatus === "paid"
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning"
                      }`}
                    >
                      {order.paymentStatus?.charAt(0).toUpperCase() +
                        order.paymentStatus?.slice(1)}
                    </span>
                  </div>
                  {order.approvedAt && (
                    <div className="bg-base-50 rounded-xl p-4">
                      <p className="text-sm text-base-content/60 mb-1">
                        Approved At
                      </p>
                      <p className="font-medium text-sm">
                        {formatDate(order.approvedAt)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tracking Logs */}
              <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FiMapPin className="text-primary" />
                  Tracking History
                </h3>
                {order.trackingLogs?.length > 0 ? (
                  <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-base-300" />

                    {/* Timeline Items */}
                    <div className="space-y-4">
                      {order.trackingLogs.map((log, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="relative pl-10"
                        >
                          {/* Timeline Dot */}
                          <div className="absolute left-2 top-2 w-4 h-4 rounded-full bg-primary border-4 border-base-100" />

                          <div className="bg-base-50 rounded-xl p-4">
                            <div className="flex items-start justify-between mb-2">
                              <span className="font-semibold capitalize text-base-content">
                                {log.status}
                              </span>
                              <span className="text-sm text-base-content/50">
                                {formatDate(log.createdAt)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-base-content/70 mb-1">
                              <FiMapPin className="w-4 h-4" />
                              <span>{log.location}</span>
                            </div>
                            {log.note && (
                              <p className="text-sm text-base-content/60 mt-2">
                                {log.note}
                              </p>
                            )}
                            <p className="text-xs text-base-content/50 mt-2">
                              Updated by: {log.by?.role || "System"}{" "}
                              {log.by?.email ? `(${log.by.email})` : ""}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-base-content/50">
                    <FiClock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No tracking updates available yet.</p>
                    <p className="text-sm mt-1">
                      Check back later for updates on your order.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Initial State - No Search Yet */}
        {!searchId && !isLoading && !order && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <FiPackage className="w-16 h-16 text-base-content/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-base-content/60 mb-2">
              Enter Your Tracking ID
            </h3>
            <p className="text-base-content/40 max-w-md mx-auto">
              Your tracking ID can be found in your order confirmation email or
              in your dashboard under "My Orders".
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PublicTrackOrder;
