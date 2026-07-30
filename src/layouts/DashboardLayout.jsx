// Dashboard Layout
import { NavLink, Outlet } from "react-router";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiPackage,
  FiClipboard,
  FiPlusSquare,
  FiCheckCircle,
  FiUser,
  FiShoppingCart,
  FiMapPin,
  FiHome,
  FiMenu,
  FiX,
  FiGrid,
  FiClock,
} from "react-icons/fi";
import { useState } from "react";
import useUserRole from "../hooks/useUserRole";
import Logo from "../components/Logo/Logo";
import ThemeToggle from "../components/ui/ThemeToggle";
import useAuth from "../hooks/useAuth";

const SidebarLink = ({ to, icon: Icon, label, onClick }) => (
  <li>
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
          isActive
            ? "bg-primary text-primary-content shadow-md"
            : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
        }`
      }
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </NavLink>
  </li>
);

const DashboardLayout = () => {
  const { role, isLoading } = useUserRole();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  const roleLinks = {
    admin: [
      { to: "/dashboard/manage-users", icon: FiUsers, label: "Manage Users" },
      { to: "/dashboard/all-products", icon: FiPackage, label: "All Products" },
      { to: "/dashboard/pending-products", icon: FiClock, label: "Pending Products" },
      { to: "/dashboard/all-orders", icon: FiClipboard, label: "All Orders" },
    ],
    manager: [
      {
        to: "/dashboard/add-product",
        icon: FiPlusSquare,
        label: "Add Product",
      },
      {
        to: "/dashboard/manage-products",
        icon: FiPackage,
        label: "My Products",
      },
      {
        to: "/dashboard/pending-orders",
        icon: FiClipboard,
        label: "Pending Orders",
      },
      {
        to: "/dashboard/approved-orders",
        icon: FiCheckCircle,
        label: "Approved Orders",
      },
      { to: "/dashboard/profile", icon: FiUser, label: "My Profile" },
    ],
    buyer: [
      { to: "/dashboard/my-orders", icon: FiShoppingCart, label: "My Orders" },
      { to: "/dashboard/track-order", icon: FiMapPin, label: "Track Order" },
      { to: "/dashboard/profile", icon: FiUser, label: "My Profile" },
    ],
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-base-200">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-base-100 border-r border-base-200 transform transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-base-200">
            <div className="flex items-center justify-between">
            <Logo size="text-lg" />
            <button
              onClick={closeSidebar}
              className="btn btn-ghost btn-sm btn-square lg:hidden"
            >
              <FiX className="w-5 h-5" />
            </button>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-base-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-base-content truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-base-content/60 truncate">
                  {user?.email}
                </p>
                <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full capitalize">
                  {role}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              <SidebarLink
                to="/dashboard"
                icon={FiGrid}
                label="Dashboard"
                onClick={closeSidebar}
              />
              {roleLinks[role]?.map((link) => (
                <SidebarLink
                  key={link.to}
                  to={link.to}
                  icon={link.icon}
                  label={link.label}
                  onClick={closeSidebar}
                />
              ))}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-base-200">
            <NavLink
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-base-content/70 hover:bg-base-200 transition-colors"
            >
              <FiHome className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </NavLink>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-base-100 border-b border-base-200">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="btn btn-ghost btn-sm btn-square lg:hidden"
              >
                <FiMenu className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-semibold text-base-content hidden sm:block">
                {role === "admin" && "Admin Dashboard"}
                {role === "manager" && "Manager Dashboard"}
                {role === "buyer" && "My Dashboard"}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
