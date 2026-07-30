// My Orders Page Component
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  FiShoppingCart,
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiDollarSign,
  FiCreditCard,
  FiTrash2,
  FiCalendar,
  FiHash,
} from "react-icons/fi";
import useAuth from "../../../../hooks/useAuth";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import PageTitle from "../../../../components/ui/PageTitle";

const MyOrders = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch User Orders Query
  const { data, isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/orders/user/${user.uid}`);
      return res.data;
    },
  });

  // Delete Order Mutation
  const deleteMutation = useMutation({
    mutationFn: (orderId) => axiosSecure.delete(`/api/orders/${orderId}`),
    onSuccess: () => {
      Swal.fire({
        title: "Order Canceled!",
        text: "Your order has been canceled successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      queryClient.invalidateQueries(["my-orders"]);
    },
    onError: () => {
      Swal.fire("Error", "Failed to cancel order!", "error");
    },
  });

  // Handle Cancel Order
  const handleCancel = (orderId, productName) => {
    Swal.fire({
      title: "Cancel Order?",
      html: `
        <p class="text-base-content/70">You are about to cancel your order for</p>
        <p class="font-bold text-lg mt-2">${productName}</p>
        <p class="text-error text-sm mt-2">This action cannot be undone!</p>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel Order",
      confirmButtonColor: "#EF4444",
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(orderId);
    });
  };

  // Handle Pay For Order
  const handlePay = async (trackingId) => {
    try {
      const res = await axiosSecure.post(`/api/payments/create-session`, {
        trackingId,
      });
      window.location.href = res.data.url;
    } catch (error) {
      Swal.fire(
        "Error",
        "Payment initiation failed. Please try again.",
        "error",
      );
    }
  };

  // Handle Payment Confirmation On Page Load
  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get(
      "session_id",
    );
    if (!sessionId) return;

    const confirmPayment = async () => {
      try {
        await axiosSecure.patch(
          `/api/payments/payment-success?session_id=${sessionId}`,
        );
        queryClient.invalidateQueries(["my-orders"]);
        window.history.replaceState({}, document.title, "/dashboard/my-orders");
        Swal.fire({
          title: "Payment Successful!",
          text: "Your payment has been confirmed.",
          icon: "success",
          confirmButtonColor: "#10B981",
        });
      } catch {
        Swal.fire(
          "Error",
          "Payment confirmation failed. Please contact support.",
          "error",
        );
      }
    };

    confirmPayment();
  }, [axiosSecure, queryClient]);

  // Get Status Badge Color
  const getStatusBadge = (status) => {
    const badges = {
      pending: "badge-warning",
      approved: "badge-success",
      completed: "badge-info",
      rejected: "badge-error",
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
    };
    const Icon = icons[status?.toLowerCase()] || FiPackage;
    return <Icon className="w-4 h-4" />;
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

  // Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  const orders = data?.orders || [];

  return (
    <div className="p-2">
      <PageTitle title="My Orders" />
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <FiShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-base-content">My Orders</h1>
            <p className="text-base-content/60">View and manage your orders!</p>
          </div>
        </div>
      </div>

      {/* No Orders */}
      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-base-100 rounded-2xl border border-base-200 p-12 text-center"
        >
          <FiShoppingCart className="w-16 h-16 text-base-content/20 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-base-content mb-2">
            No Orders Yet
          </h3>
          <p className="text-base-content/60 mb-6">
            You haven't placed any orders yet. Start browsing our products!
          </p>
          <a href="/all-products" className="btn btn-primary">
            <FiPackage className="w-5 h-5" />
            Browse Products
          </a>
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
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
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
                      <td className="font-medium">{order.productName}</td>
                      <td>{order.quantity}</td>
                      <td className="font-semibold text-primary">
                        ৳{order.totalPrice?.toLocaleString()}
                      </td>
                      <td>
                        {order.paymentOption === "COD" ? (
                          <span className="badge badge-ghost">
                            Cash on Delivery
                          </span>
                        ) : order.paymentStatus === "paid" ? (
                          <div className="flex flex-col gap-1">
                            <span className="badge badge-success gap-1">
                              <FiCheckCircle className="w-3 h-3" />
                              Paid
                            </span>
                            {order.transactionId && (
                              <span className="text-xs text-base-content/50 font-mono">
                                {order.transactionId.substring(0, 12)}...
                              </span>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => handlePay(order.trackingId)}
                            className="btn btn-sm btn-success gap-1"
                          >
                            <FiCreditCard className="w-4 h-4" />
                            Pay Now
                          </button>
                        )}
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
                      <td>
                        {order.status === "pending" && (
                          <button
                            onClick={() =>
                              handleCancel(order._id, order.productName)
                            }
                            className="btn btn-sm btn-error"
                            disabled={deleteMutation.isPending}
                          >
                            <FiTrash2 className="w-4 h-4" />
                            Cancel
                          </button>
                        )}
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
                transition={{ delay: index * 0.05 }}
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
                <div className="p-4 space-y-4">
                  {/* Product Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <FiPackage className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{order.productName}</p>
                      <p className="text-sm text-base-content/50">
                        Quantity: {order.quantity}
                      </p>
                    </div>
                  </div>

                  {/* Price And Payment */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-base-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 text-base-content/60 mb-1">
                        <FiDollarSign className="w-4 h-4" />
                        <span className="text-xs">Total Price</span>
                      </div>
                      <p className="font-bold text-primary text-lg">
                        ৳{order.totalPrice?.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-base-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 text-base-content/60 mb-1">
                        <FiCreditCard className="w-4 h-4" />
                        <span className="text-xs">Payment</span>
                      </div>
                      {order.paymentStatus === "paid" ? (
                        <span className="badge badge-success gap-1">
                          <FiCheckCircle className="w-3 h-3" />
                          Paid
                        </span>
                      ) : (
                        <span className="badge badge-warning">Unpaid</span>
                      )}
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm text-base-content/50">
                    <FiCalendar className="w-4 h-4" />
                    <span>Ordered on {formatDate(order.createdAt)}</span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 border-t border-base-200 bg-base-50 space-y-2">
                  {/* Pay Button */}
                  {order.paymentOption !== "COD" &&
                    order.paymentStatus !== "paid" && (
                      <button
                        onClick={() => handlePay(order.trackingId)}
                        className="btn btn-success btn-block"
                      >
                        <FiCreditCard className="w-5 h-5" />
                        Pay Now
                      </button>
                    )}

                  {/* Cancel Button */}
                  {order.status === "pending" && (
                    <button
                      onClick={() => handleCancel(order._id, order.productName)}
                      className="btn btn-error btn-outline btn-block"
                      disabled={deleteMutation.isPending}
                    >
                      <FiTrash2 className="w-5 h-5" />
                      Cancel Order
                    </button>
                  )}

                  {/* Transaction ID */}
                  {order.paymentStatus === "paid" && order.transactionId && (
                    <div className="text-center text-xs text-base-content/50">
                      Transaction ID: {order.transactionId}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Orders Summary */}
      {orders.length > 0 && (
        <div className="mt-4 text-center text-sm text-base-content/50">
          Showing {orders.length} order{orders.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
