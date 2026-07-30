// Approved Orders Page - Manager Order Tracking Component
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  FiCheckCircle,
  FiPlus,
  FiEye,
  FiPackage,
  FiUser,
  FiCalendar,
  FiHash,
  FiTruck,
  FiMapPin,
} from "react-icons/fi";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useNavigate } from "react-router";

// Allowed Status Options For Tracking
const allowedStatuses = [
  "Cutting Completed!",
  "Sewing Started!",
  "Finishing!",
  "QC Checked!",
  "Packed!",
  "Shipped!",
  "Out For Delivery!",
  "Delivered!",
];

const ApprovedOrders = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch Approved Orders
  const { data, isLoading, isError } = useQuery({
    queryKey: ["manager-approved-orders"],
    queryFn: async () => {
      const res = await axiosSecure.get("api/orders/manager/approved");
      return res.data;
    },
  });

  // Add Tracking Mutation
  const addTrackingMutation = useMutation({
    mutationFn: async ({ id, status, location, note }) => {
      return axiosSecure.post(`/api/orders/manager/${id}/tracking`, {
        status,
        location,
        note,
      });
    },
    onSuccess: () => {
      Swal.fire({
        title: "Success!",
        text: "Tracking log added successfully!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      queryClient.invalidateQueries(["manager-approved-orders"]);
    },
    onError: (err) => {
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Something went wrong!",
        "error",
      );
    },
  });

  // Handle Add Tracking
  const handleAddTracking = (order) => {
    Swal.fire({
      title: "Add Tracking Log",
      html: `
        <div class="text-left mb-4">
          <p class="text-sm text-gray-500">Product: <span class="font-semibold text-gray-700">${
            order.productName
          }</span></p>
          <p class="text-sm text-gray-500">Tracking ID: <span class="font-mono font-semibold text-gray-700">${
            order.trackingId
          }</span></p>
        </div>
        <select id="status" class="swal2-select">
          <option value="" disabled selected>Select status</option>
          ${allowedStatuses
            .map((s) => `<option value="${s}">${s}</option>`)
            .join("")}
        </select>
        <input id="location" class="swal2-input" placeholder="Location (e.g., Dhaka Warehouse)">
        <textarea id="note" class="swal2-textarea" placeholder="Note (optional)"></textarea>
      `,
      showCancelButton: true,
      confirmButtonText: "Add Tracking",
      confirmButtonColor: "#10B981",
      preConfirm: () => {
        const status = document.getElementById("status").value;
        const location = document.getElementById("location").value;
        const note = document.getElementById("note").value;
        if (!status || !location) {
          Swal.showValidationMessage("Status and Location are required!");
          return false;
        }
        return { status, location, note };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        addTrackingMutation.mutate({ id: order._id, ...result.value });
      }
    });
  };

  // Handle View Tracking
  const viewTracking = (trackingId) =>
    navigate(`/track-order?id=${trackingId}`);

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

  // Error State
  if (isError || !data?.orders) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <FiPackage className="w-16 h-16 text-error mb-4" />
        <p className="text-error">Failed to load approved orders.</p>
      </div>
    );
  }

  const orders = data.orders;

  return (
    <div className="p-2">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-success/10 text-success">
            <FiCheckCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-base-content">
              Approved Orders
            </h1>
            <p className="text-base-content/60">
              Manage tracking for approved orders!
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
            No Approved Orders
          </h3>
          <p className="text-base-content/60">
            There are no approved orders to manage.
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
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Status</th>
                    <th>Approved Date</th>
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
                      <td className="font-medium">{order.userName}</td>
                      <td>{order.productName}</td>
                      <td>
                        <span className="badge badge-success capitalize">
                          {order.status}
                        </span>
                      </td>
                      <td>{formatDate(order.approvedAt)}</td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddTracking(order)}
                            disabled={addTrackingMutation.isPending}
                            className="btn btn-sm btn-success gap-1"
                          >
                            <FiPlus className="w-4 h-4" />
                            Add Tracking
                          </button>
                          <button
                            onClick={() => viewTracking(order.trackingId)}
                            className="btn btn-sm btn-info gap-1"
                          >
                            <FiEye className="w-4 h-4" />
                            View
                          </button>
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
                    <span className="badge badge-success gap-1">
                      <FiCheckCircle className="w-3 h-3" />
                      Approved
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  {/* Product */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <FiPackage className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{order.productName}</p>
                      <p className="text-sm text-base-content/50">
                        Status: {order.status}
                      </p>
                    </div>
                  </div>

                  {/* Customer And Date */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-base-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 text-base-content/60 mb-1">
                        <FiUser className="w-4 h-4" />
                        <span className="text-xs">Customer</span>
                      </div>
                      <p className="font-medium text-sm">{order.userName}</p>
                    </div>
                    <div className="bg-base-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 text-base-content/60 mb-1">
                        <FiCalendar className="w-4 h-4" />
                        <span className="text-xs">Approved</span>
                      </div>
                      <p className="font-medium text-sm">
                        {formatDate(order.approvedAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 border-t border-base-200 bg-base-50 space-y-2">
                  <button
                    onClick={() => handleAddTracking(order)}
                    disabled={addTrackingMutation.isPending}
                    className="btn btn-sm btn-success btn-block gap-1"
                  >
                    <FiPlus className="w-4 h-4" />
                    Add Tracking Log
                  </button>
                  <button
                    onClick={() => viewTracking(order.trackingId)}
                    className="btn btn-sm btn-outline btn-info btn-block gap-1"
                  >
                    <FiTruck className="w-4 h-4" />
                    View Tracking
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
          {orders.length} approved order{orders.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
};

export default ApprovedOrders;
