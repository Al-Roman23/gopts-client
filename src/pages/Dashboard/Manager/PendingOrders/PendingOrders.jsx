// Pending Orders Page - Manager Order Approval Component
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiPackage,
  FiCreditCard,
  FiHash,
  FiDollarSign,
  FiShoppingBag,
} from "react-icons/fi";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useNavigate } from "react-router";

const PendingOrders = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch Pending Orders
  const { data, isLoading, isError } = useQuery({
    queryKey: ["manager-pending-orders"],
    queryFn: async () => {
      const response = await axiosSecure.get("api/orders/manager/pending");
      return response.data;
    },
  });

  // Approve Mutation
  const approveMutation = useMutation({
    mutationFn: async (orderId) =>
      (await axiosSecure.patch(`api/orders/manager/${orderId}/approve`)).data,
    onSuccess: () => {
      Swal.fire({
        title: "Approved!",
        text: "Order approved successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      queryClient.invalidateQueries(["manager-pending-orders"]);
    },
    onError: (error) =>
      Swal.fire(
        "Error!",
        error?.response?.data?.message || "Something went wrong.",
        "error",
      ),
  });

  // Reject Mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ orderId, reason }) =>
      (
        await axiosSecure.patch(`api/orders/manager/${orderId}/reject`, {
          reason,
        })
      ).data,
    onSuccess: () => {
      Swal.fire({
        title: "Rejected!",
        text: "Order rejected successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      queryClient.invalidateQueries(["manager-pending-orders"]);
    },
    onError: (error) =>
      Swal.fire(
        "Error!",
        error?.response?.data?.message || "Something went wrong.",
        "error",
      ),
  });

  // Handle Approve
  const handleApprove = (orderId, productName) => {
    Swal.fire({
      title: "Approve Order?",
      html: `
        <p class="text-base-content/70">You are about to approve the order for</p>
        <p class="font-bold text-lg mt-2">${productName}</p>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Approve",
      confirmButtonColor: "#10B981",
    }).then((result) => {
      if (result.isConfirmed) approveMutation.mutate(orderId);
    });
  };

  // Handle Reject
  const handleReject = (orderId) => {
    Swal.fire({
      title: "Reject Order",
      input: "textarea",
      inputLabel: "Rejection Reason",
      inputPlaceholder: "Please provide a reason for rejection...",
      showCancelButton: true,
      confirmButtonText: "Reject Order",
      confirmButtonColor: "#EF4444",
      inputValidator: (value) => !value && "Rejection reason is required!",
    }).then((result) => {
      if (result.isConfirmed)
        rejectMutation.mutate({ orderId, reason: result.value });
    });
  };

  // Handle View
  const handleView = (orderId) =>
    navigate(`/dashboard/order-details/${orderId}`);

  // Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <FiXCircle className="w-16 h-16 text-error mb-4" />
        <p className="text-error">Failed to load pending orders.</p>
      </div>
    );
  }

  const orders = data?.orders || [];

  return (
    <div className="p-2">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-warning/10 text-warning">
            <FiClock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-base-content">
              Pending Orders
            </h1>
            <p className="text-base-content/60">
              Review and approve pending orders!
            </p>
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
          <FiPackage className="w-16 h-16 text-base-content/20 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-base-content mb-2">
            No Pending Orders
          </h3>
          <p className="text-base-content/60">
            All orders have been processed.
          </p>
        </motion.div>
      ) : (
        <>
          {/* Desktop Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden lg:block bg-base-100 rounded-2xl border border-base-200 shadow-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="bg-base-200">
                  <tr>
                    <th>Tracking ID</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Payment</th>
                    <th>Payment Status</th>
                    <th>Transaction ID</th>
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
                      <td>
                        <span className="badge badge-ghost">
                          {order.paymentOption === "COD"
                            ? "Cash on Delivery"
                            : "PayFirst"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            order.paymentStatus === "paid"
                              ? "badge-success"
                              : "badge-warning"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="font-mono text-xs">
                        {order.paymentOption === "COD"
                          ? "N/A"
                          : order.transactionId || "N/A"}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          {order.status === "pending" && (
                            <>
                              <button
                                onClick={() =>
                                  handleApprove(order._id, order.productName)
                                }
                                disabled={approveMutation.isPending}
                                className="btn btn-sm btn-success gap-1"
                              >
                                <FiCheckCircle className="w-4 h-4" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(order._id)}
                                disabled={rejectMutation.isPending}
                                className="btn btn-sm btn-error gap-1"
                              >
                                <FiXCircle className="w-4 h-4" />
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleView(order._id)}
                            className="btn btn-sm btn-info gap-1"
                          >
                            <FiEye className="w-4 h-4" />
                            View
                          </button>
                          {order.status === "approved" && (
                            <button
                              onClick={() =>
                                navigate(`/dashboard/order/${order._id}/next`)
                              }
                              className="btn btn-sm btn-warning"
                            >
                              Next Step
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
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
                    <span className="badge badge-warning gap-1">
                      <FiClock className="w-3 h-3" />
                      Pending
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-4">
                  {/* Product Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <FiShoppingBag className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{order.productName}</p>
                      <p className="text-sm text-base-content/50">
                        Quantity: {order.quantity}
                      </p>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-base-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 text-base-content/60 mb-1">
                        <FiCreditCard className="w-4 h-4" />
                        <span className="text-xs">Payment</span>
                      </div>
                      <p className="font-medium text-sm">
                        {order.paymentOption === "COD" ? "COD" : "PayFirst"}
                      </p>
                    </div>
                    <div className="bg-base-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 text-base-content/60 mb-1">
                        <FiDollarSign className="w-4 h-4" />
                        <span className="text-xs">Status</span>
                      </div>
                      <span
                        className={`badge badge-sm ${
                          order.paymentStatus === "paid"
                            ? "badge-success"
                            : "badge-warning"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 border-t border-base-200 bg-base-50 space-y-2">
                  <div className="flex gap-2">
                    {order.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleApprove(order._id, order.productName)
                          }
                          disabled={approveMutation.isPending}
                          className="btn btn-sm btn-success flex-1 gap-1"
                        >
                          <FiCheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(order._id)}
                          disabled={rejectMutation.isPending}
                          className="btn btn-sm btn-error flex-1 gap-1"
                        >
                          <FiXCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => handleView(order._id)}
                    className="btn btn-sm btn-outline btn-info btn-block gap-1"
                  >
                    <FiEye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Orders Count */}
      {orders.length > 0 && (
        <div className="mt-4 text-center text-sm text-base-content/50">
          {orders.length} pending order{orders.length !== 1 ? "s" : ""} awaiting
          review
        </div>
      )}
    </div>
  );
};

export default PendingOrders;
