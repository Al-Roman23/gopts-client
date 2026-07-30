// Dashboard Track Order Page Component
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiExternalLink,
  FiMapPin,
  FiDollarSign,
  FiCalendar,
} from "react-icons/fi";
import useAuth from "../../../../hooks/useAuth";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import PageTitle from "../../../../components/ui/PageTitle";

const TrackOrder = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Paid Orders For Current User
  useEffect(() => {
    const fetchPaidOrders = async () => {
      try {
        const res = await axiosSecure.get(`/api/orders/user/${user.uid}`);
        const paidOrders = res.data.orders.filter(
          (order) => order.paymentStatus === "paid",
        );
        setOrders(paidOrders);
      } catch (error) {
        console.error("Failed to fetch paid orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.uid) {
      fetchPaidOrders();
    }
  }, [user?.uid, axiosSecure]);

  // Navigate To Public Track Order Page
  const handleTrack = (trackingId) => {
    navigate(`/track-order?id=${trackingId}`);
  };

  // Get Status Badge Color
  const getStatusColor = (status) => {
    const colors = {
      pending: "badge-warning",
      approved: "badge-success",
      completed: "badge-info",
      rejected: "badge-error",
    };
    return colors[status?.toLowerCase()] || "badge-ghost";
  };

  // Get Status Icon
  const getStatusIcon = (status) => {
    const icons = {
      pending: FiClock,
      approved: FiCheckCircle,
      completed: FiTruck,
    };
    const Icon = icons[status?.toLowerCase()] || FiPackage;
    return <Icon className="w-4 h-4" />;
  };

  // Format Date For Display
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
      <PageTitle title="Track Orders" />
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <FiTruck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-base-content">
              Track Orders
            </h1>
            <p className="text-base-content/60">View and track your orders!</p>
          </div>
        </div>
      </div>

      {/* No Orders State */}
      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-base-100 rounded-2xl border border-base-200 p-12 text-center"
        >
          <FiPackage className="w-16 h-16 text-base-content/20 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-base-content mb-2">
            No Paid Orders Found
          </h3>
          <p className="text-base-content/60 max-w-md mx-auto mb-6">
            You don't have any paid orders to track yet. Complete a payment to
            start tracking your orders.
          </p>
          <button
            onClick={() => navigate("/all-products")}
            className="btn btn-primary"
          >
            <FiPackage className="w-5 h-5" />
            Browse Products
          </button>
        </motion.div>
      ) : (
        <>
          {/* Orders Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-base-100 rounded-2xl border border-base-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-4 border-b border-base-200 bg-base-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FiPackage className="w-5 h-5 text-primary" />
                      <span className="font-mono text-sm font-medium">
                        {order.trackingId}
                      </span>
                    </div>
                    <span
                      className={`badge ${getStatusColor(order.status)} gap-1`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  {/* Product Name */}
                  <div>
                    <p className="text-sm text-base-content/60">Product</p>
                    <p className="font-semibold text-base-content truncate">
                      {order.productName}
                    </p>
                  </div>

                  {/* Order Details Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-base-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-base-content/60 mb-1">
                        <FiPackage className="w-4 h-4" />
                        <span className="text-xs">Quantity</span>
                      </div>
                      <p className="font-semibold">{order.quantity} units</p>
                    </div>
                    <div className="bg-base-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-base-content/60 mb-1">
                        <FiDollarSign className="w-4 h-4" />
                        <span className="text-xs">Total</span>
                      </div>
                      <p className="font-semibold text-primary">
                        ৳{order.totalPrice?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className="flex items-center justify-between bg-success/10 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <FiCheckCircle className="w-5 h-5 text-success" />
                      <span className="font-medium text-success">
                        Payment Confirmed
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 border-t border-base-200 bg-base-50">
                  <button
                    onClick={() => handleTrack(order.trackingId)}
                    className="btn btn-primary btn-block"
                  >
                    <FiMapPin className="w-5 h-5" />
                    Track This Order
                    <FiExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Orders Table For Larger Screens */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden xl:block mt-8 bg-base-100 rounded-2xl border border-base-200 shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-base-200">
              <h3 className="text-lg font-semibold">All Paid Orders</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="bg-base-200">
                  <tr>
                    <th>Tracking ID</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
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
                      <td className="font-medium">{order.productName}</td>
                      <td>{order.quantity}</td>
                      <td className="font-medium text-primary">
                        ৳{order.totalPrice?.toLocaleString()}
                      </td>
                      <td>
                        <span
                          className={`badge ${getStatusColor(
                            order.status,
                          )} gap-1`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </td>
                      <td className="text-base-content/60">
                        {formatDate(order.createdAt)}
                      </td>
                      <td>
                        <button
                          onClick={() => handleTrack(order.trackingId)}
                          className="btn btn-sm btn-primary"
                        >
                          <FiMapPin className="w-4 h-4" />
                          Track
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default TrackOrder;
