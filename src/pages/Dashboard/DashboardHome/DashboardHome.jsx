// Dashboard Home Component - Role Based Dashboard Views
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FiPackage,
  FiShoppingCart,
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { Link } from "react-router";
import useUserRole from "../../../hooks/useUserRole";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import StatsCard from "../../../components/ui/StatsCard";

import PageTitle from "../../../components/ui/PageTitle";

const DashboardHome = () => {
  const { role, isLoading: roleLoading } = useUserRole();
  const axiosSecure = useAxiosSecure();

  const dashboardTitle = role === "admin" 
    ? "Admin Dashboard" 
    : role === "manager" 
      ? "Manager Dashboard" 
      : "Buyer Dashboard";

  // Admin Statistics Query
  const { data: adminStats, isLoading: adminStatsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/stats/admin");
      return res.data;
    },
    enabled: role === "admin",
  });

  // Admin Order Chart Data Query
  const { data: orderChartData = [] } = useQuery({
    queryKey: ["admin-order-chart"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/stats/admin/orders-chart");
      return res.data;
    },
    enabled: role === "admin",
  });

  // Admin Status Distribution Query
  const { data: statusDistribution = [] } = useQuery({
    queryKey: ["admin-status-distribution"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/stats/admin/status-distribution");
      return res.data;
    },
    enabled: role === "admin",
  });

  // Admin Recent Orders Query
  const { data: recentOrders = [] } = useQuery({
    queryKey: ["admin-recent-orders"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        "/api/stats/admin/recent-orders?limit=5",
      );
      return res.data;
    },
    enabled: role === "admin",
  });

  // Manager Statistics Query
  const { data: managerStats, isLoading: managerStatsLoading } = useQuery({
    queryKey: ["manager-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/stats/manager");
      return res.data;
    },
    enabled: role === "manager",
  });

  // Buyer Statistics Query
  const { data: buyerStats, isLoading: buyerStatsLoading } = useQuery({
    queryKey: ["buyer-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/stats/buyer");
      return res.data;
    },
    enabled: role === "buyer",
  });

  // Get Status Badge Color
  const getStatusColor = (status) => {
    const colors = {
      pending: "badge-warning",
      approved: "badge-success",
      completed: "badge-info",
      rejected: "badge-error",
      canceled: "badge-ghost",
    };
    return colors[status?.toLowerCase()] || "badge-ghost";
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

  // Admin Dashboard Component
  const AdminDashboard = () => {
    if (adminStatsLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      );
    }

    return (
      <>
        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCard
            title="Total Orders"
            value={adminStats?.totalOrders || 0}
            icon={FiShoppingCart}
            color="primary"
          />
          <StatsCard
            title="Total Products"
            value={adminStats?.totalProducts || 0}
            icon={FiPackage}
            color="secondary"
          />
          <StatsCard
            title="Total Users"
            value={adminStats?.totalUsers || 0}
            icon={FiUsers}
            color="accent"
          />
          <StatsCard
            title="Revenue"
            value={`৳${(adminStats?.totalRevenue || 0).toLocaleString()}`}
            icon={FiDollarSign}
            color="success"
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Orders Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-200"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FiTrendingUp className="text-primary" />
              Orders Overview
            </h3>
            {orderChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={orderChartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-base-300"
                  />
                  <XAxis dataKey="month" className="text-base-content" />
                  <YAxis className="text-base-content" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--fallback-b1,oklch(var(--b1)))",
                      border: "1px solid var(--fallback-b3,oklch(var(--b3)))",
                      borderRadius: "0.5rem",
                      color: "var(--fallback-bc,oklch(var(--bc)))",
                    }}
                  />
                  <Bar dataKey="orders" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-base-content/50">
                No Order Data Available Yet
              </div>
            )}
          </motion.div>

          {/* Order Status Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-200"
          >
            <h3 className="text-lg font-semibold mb-4">
              Order Status Distribution
            </h3>
            {statusDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-base-content/50">
                No Status Data Available Yet
              </div>
            )}
          </motion.div>
        </div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-200 mb-8"
        >
          <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
          {orderChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={orderChartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-base-300"
                />
                <XAxis dataKey="month" className="text-base-content" />
                <YAxis className="text-base-content" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--fallback-b1,oklch(var(--b1)))",
                    border: "1px solid var(--fallback-b3,oklch(var(--b3)))",
                    borderRadius: "0.5rem",
                    color: "var(--fallback-bc,oklch(var(--bc)))",
                  }}
                  formatter={(value) => [
                    `৳${value.toLocaleString()}`,
                    "Revenue",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  dot={{ fill: "#F59E0B", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-base-content/50">
              No Revenue Data Available Yet
            </div>
          )}
        </motion.div>

        {/* Recent Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-base-100 rounded-2xl shadow-sm border border-base-200 overflow-hidden"
        >
          <div className="p-6 border-b border-base-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Orders</h3>
            <Link
              to="/dashboard/all-orders"
              className="btn btn-sm btn-ghost text-primary"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="bg-base-200">
                <tr>
                  <th>Tracking ID</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr
                      key={order._id || order.trackingId}
                      className="hover:bg-base-50"
                    >
                      <td className="font-mono text-sm">{order.trackingId}</td>
                      <td className="font-medium">{order.productName}</td>
                      <td>{order.quantity}</td>
                      <td className="font-medium">
                        ৳{(order.totalPrice || 0).toLocaleString()}
                      </td>
                      <td>
                        <span
                          className={`badge ${getStatusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="text-base-content/60">
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-8 text-base-content/50"
                    >
                      No Recent Orders Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </>
    );
  };

  // Manager Dashboard Component
  const ManagerDashboard = () => {
    if (managerStatsLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      );
    }

    return (
      <>
        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCard
            title="My Products"
            value={managerStats?.totalProducts || 0}
            icon={FiPackage}
            color="primary"
          />
          <StatsCard
            title="Pending Orders"
            value={managerStats?.pendingOrders || 0}
            icon={FiClock}
            color="warning"
          />
          <StatsCard
            title="Approved Orders"
            value={managerStats?.approvedOrders || 0}
            icon={FiCheckCircle}
            color="success"
          />
          <StatsCard
            title="Total Revenue"
            value={`৳${(managerStats?.totalRevenue || 0).toLocaleString()}`}
            icon={FiDollarSign}
            color="info"
          />
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-200 mb-8"
        >
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link to="/dashboard/add-product" className="btn btn-primary">
              <FiPackage className="w-5 h-5" />
              Add New Product
            </Link>
            <Link
              to="/dashboard/manage-products"
              className="btn btn-outline btn-primary"
            >
              <FiPackage className="w-5 h-5" />
              Manage Products
            </Link>
            <Link
              to="/dashboard/pending-orders"
              className="btn btn-outline btn-warning"
            >
              <FiClock className="w-5 h-5" />
              Pending Orders
            </Link>
            <Link
              to="/dashboard/approved-orders"
              className="btn btn-outline btn-success"
            >
              <FiCheckCircle className="w-5 h-5" />
              Approved Orders
            </Link>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20"
          >
            <h3 className="text-lg font-semibold mb-4 text-primary">
              Product Performance
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-base-content/70">Active Products</span>
                <span className="text-2xl font-bold text-base-content">
                  {managerStats?.totalProducts || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base-content/70">
                  Total Orders Received
                </span>
                <span className="text-2xl font-bold text-base-content">
                  {(managerStats?.pendingOrders || 0) +
                    (managerStats?.approvedOrders || 0) +
                    (managerStats?.completedOrders || 0)}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-success/10 to-success/5 rounded-2xl p-6 border border-success/20"
          >
            <h3 className="text-lg font-semibold mb-4 text-success">
              Revenue Overview
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-base-content/70">Total Earnings</span>
                <span className="text-2xl font-bold text-base-content">
                  ৳{(managerStats?.totalRevenue || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base-content/70">Completed Orders</span>
                <span className="text-2xl font-bold text-base-content">
                  {managerStats?.completedOrders || 0}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </>
    );
  };

  // Buyer Dashboard Component
  const BuyerDashboard = () => {
    if (buyerStatsLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      );
    }

    return (
      <>
        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCard
            title="Total Orders"
            value={buyerStats?.totalOrders || 0}
            icon={FiShoppingCart}
            color="primary"
          />
          <StatsCard
            title="Pending Orders"
            value={buyerStats?.pendingOrders || 0}
            icon={FiClock}
            color="warning"
          />
          <StatsCard
            title="Approved Orders"
            value={buyerStats?.approvedOrders || 0}
            icon={FiCheckCircle}
            color="success"
          />
          <StatsCard
            title="Total Spent"
            value={`৳${(buyerStats?.totalSpent || 0).toLocaleString()}`}
            icon={FiDollarSign}
            color="info"
          />
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-200 mb-8"
        >
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link to="/all-products" className="btn btn-primary">
              <FiPackage className="w-5 h-5" />
              Browse Products
            </Link>
            <Link
              to="/dashboard/my-orders"
              className="btn btn-outline btn-primary"
            >
              <FiShoppingCart className="w-5 h-5" />
              View My Orders
            </Link>
            <Link
              to="/dashboard/track-order"
              className="btn btn-outline btn-info"
            >
              <FiAlertCircle className="w-5 h-5" />
              Track Orders
            </Link>
          </div>
        </motion.div>

        {/* Order Summary */}
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20"
          >
            <h3 className="text-lg font-semibold mb-4 text-primary">
              Order Summary
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-base-content/70">Pending</span>
                <span className="text-xl font-bold text-warning">
                  {buyerStats?.pendingOrders || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base-content/70">Approved</span>
                <span className="text-xl font-bold text-success">
                  {buyerStats?.approvedOrders || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base-content/70">Completed</span>
                <span className="text-xl font-bold text-info">
                  {buyerStats?.completedOrders || 0}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-success/10 to-success/5 rounded-2xl p-6 border border-success/20"
          >
            <h3 className="text-lg font-semibold mb-4 text-success">
              Spending Overview
            </h3>
            <div className="flex flex-col items-center justify-center h-32">
              <span className="text-base-content/70 text-sm mb-2">
                Total Amount Spent
              </span>
              <span className="text-4xl font-bold text-base-content">
                ৳{(buyerStats?.totalSpent || 0).toLocaleString()}
              </span>
            </div>
          </motion.div>
        </div>
      </>
    );
  };

  // Loading State
  if (roleLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="p-2">
      <PageTitle title={dashboardTitle} />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-base-content">
          Welcome to Dashboard
        </h1>
        <p className="text-base-content/60 mt-1">
          Here&apos;s what&apos;s happening with your{" "}
          {role === "admin"
            ? "platform"
            : role === "manager"
              ? "products"
              : "orders"}{" "}
          today.
        </p>
      </div>

      {role === "admin" && <AdminDashboard />}
      {role === "manager" && <ManagerDashboard />}
      {role === "buyer" && <BuyerDashboard />}
    </div>
  );
};

export default DashboardHome;
