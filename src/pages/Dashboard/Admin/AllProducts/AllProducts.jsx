// All Products Page - Admin Product Management Component
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  FiPackage,
  FiSearch,
  FiFilter,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiHome,
  FiDollarSign,
  FiGrid,
  FiList,
  FiAlertCircle,
} from "react-icons/fi";
import useAuth from "../../../../hooks/useAuth";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [isSuspended, setIsSuspended] = useState(false);

  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // Fetch All Products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axiosSecure.get("/api/products/admin/all-products");
      setProducts(data || []);
      setFilteredProducts(data || []);
    } catch {
      Swal.fire("Error", "Failed to fetch products!", "error");
    } finally {
      setLoading(false);
    }
  };

  // Check If User Is Suspended
  const checkSuspension = async () => {
    try {
      const res = await axiosSecure.get("/api/users/me/status");
      setIsSuspended(res.data?.status === "suspended");
    } catch {
      setIsSuspended(false);
    }
  };

  // Initial Fetch
  useEffect(() => {
    fetchProducts();
    checkSuspension();
  }, [user]);

  // Filter Products Based On Search And Category
  useEffect(() => {
    let result = [...products];

    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (categoryFilter) {
      result = result.filter((product) => product.category === categoryFilter);
    }

    setFilteredProducts(result);
  }, [searchTerm, categoryFilter, products]);

  // Get Unique Categories
  const categories = [
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  // Handle Admin Show On Home Toggle
  const handleAdminShowOnHome = async (productId, show) => {
    if (isSuspended) return Swal.fire("Blocked", "Account suspended!", "error");
    try {
      await axiosSecure.patch(`/api/products/${productId}/toggle-admin-home`, { show });
      setProducts((prev) => prev.map((p) => (p._id === productId ? { ...p, adminShowOnHome: show } : p)));
      Swal.fire({ title: "Updated!", text: "Home visibility updated.", icon: "success", timer: 1000, showConfirmButton: false });
    } catch {
      Swal.fire("Error", "Failed to update!", "error");
    }
  };

  // Handle Admin Show On All Products Page Toggle
  const handleIsVisibleInAllProducts = async (productId, show) => {
    if (isSuspended) return Swal.fire("Blocked", "Account suspended!", "error");
    try {
      await axiosSecure.patch(`/api/products/${productId}/toggle-all-products`, { show });
      setProducts((prev) => prev.map((p) => (p._id === productId ? { ...p, isVisibleInAllProducts: show } : p)));
      Swal.fire({ title: "Updated!", text: "All Products visibility updated.", icon: "success", timer: 1000, showConfirmButton: false });
    } catch {
      Swal.fire("Error", "Failed to update!", "error");
    }
  };

  // Handle Delete Product
  const handleDelete = async (productId, productName) => {
    if (isSuspended) {
      Swal.fire("Action Blocked", "Your account is suspended!", "error");
      return;
    }

    const confirm = await Swal.fire({
      title: "Delete Product?",
      html: `
        <p class="text-base-content/70">You are about to delete</p>
        <p class="font-bold text-lg mt-2">${productName}</p>
        <p class="text-error text-sm mt-2">This action cannot be undone!</p>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      confirmButtonColor: "#EF4444",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.delete(`/api/products/${productId}`);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      Swal.fire({
        title: "Deleted!",
        text: "Product has been deleted successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire("Error", "Failed to delete product!", "error");
    }
  };

  // Format Price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
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
            <FiPackage className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-base-content">
              All Products
            </h1>
            <p className="text-base-content/60">
              Manage all products in the platform!
            </p>
          </div>
        </div>
      </div>

      {/* Suspension Alert */}
      {isSuspended && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-error/10 border border-error/30 rounded-2xl p-4 mb-6 flex items-center gap-3"
        >
          <FiAlertCircle className="w-6 h-6 text-error flex-shrink-0" />
          <div>
            <p className="font-semibold text-error">Account Suspended</p>
            <p className="text-sm text-error/70">
              Your account is suspended. You cannot modify products until your
              account is reactivated.
            </p>
          </div>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-base-100 rounded-xl border border-base-200 p-4"
        >
          <p className="text-2xl font-bold text-base-content">
            {products.length}
          </p>
          <p className="text-sm text-base-content/60">Total Products</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-success/10 rounded-xl border border-success/20 p-4"
        >
          <p className="text-2xl font-bold text-success">
            {products.filter((p) => p.showOnHome).length}
          </p>
          <p className="text-sm text-success/70">On Homepage</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-primary/10 rounded-xl border border-primary/20 p-4"
        >
          <p className="text-2xl font-bold text-primary">{categories.length}</p>
          <p className="text-sm text-primary/70">Categories</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-accent/10 rounded-xl border border-accent/20 p-4"
        >
          <p className="text-2xl font-bold text-accent">
            {products.filter((p) => !p.showOnHome).length}
          </p>
          <p className="text-sm text-accent/70">Hidden</p>
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
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full pl-10"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="select select-bordered w-full md:w-48"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="btn-group">
            <button
              className={`btn ${
                viewMode === "grid" ? "btn-primary" : "btn-ghost"
              }`}
              onClick={() => setViewMode("grid")}
            >
              <FiGrid className="w-5 h-5" />
            </button>
            <button
              className={`btn ${
                viewMode === "list" ? "btn-primary" : "btn-ghost"
              }`}
              onClick={() => setViewMode("list")}
            >
              <FiList className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* No Products */}
      {filteredProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-base-100 rounded-2xl border border-base-200 p-12 text-center"
        >
          <FiPackage className="w-16 h-16 text-base-content/20 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-base-content mb-2">
            No Products Found
          </h3>
          <p className="text-base-content/60">
            {searchTerm || categoryFilter
              ? "Try adjusting your search or filter criteria."
              : "No products have been added yet."}
          </p>
        </motion.div>
      ) : (
        <>
          {/* Grid View */}
          {viewMode === "grid" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-base-100 rounded-2xl border border-base-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Product Image */}
                  <div className="aspect-square bg-base-200 relative">
                    <img
                      src={product.images?.[0] || "/placeholder.png"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                     {/* Status Badge */}
                     <div className={`absolute top-3 left-3 badge ${product.approvalStatus === 'approved' ? 'badge-success' : 'badge-warning'} gap-1`}>
                        {product.approvalStatus === 'approved' ? 'Approved' : 'Pending'}
                      </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-base-content truncate mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-base-content/60 mb-2">
                      {product.category}
                    </p>
                    <p className="text-lg font-bold text-primary">
                      {formatPrice(product.price)}
                    </p>
                    <p className="text-xs text-base-content/50 mt-2 truncate">
                      By: {product.createdBy}
                    </p>

                    {/* Admin Toggles */}
                    <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-base-200">
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-xs font-semibold">Home (Admin)</span>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary toggle-sm"
                          checked={product.adminShowOnHome || false}
                          onChange={(e) => handleAdminShowOnHome(product._id, e.target.checked)}
                          disabled={isSuspended}
                        />
                      </label>
                       <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-xs font-semibold">All (Admin)</span>
                        <input
                          type="checkbox"
                          className="toggle toggle-secondary toggle-sm"
                          checked={product.isVisibleInAllProducts || false}
                          onChange={(e) => handleIsVisibleInAllProducts(product._id, e.target.checked)}
                          disabled={isSuspended}
                        />
                      </label>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() =>
                          navigate(
                            `/dashboard/admin/update-product/${product._id}`,
                          )
                        }
                        className="btn btn-sm btn-outline btn-primary flex-1"
                        disabled={isSuspended}
                      >
                        <FiEdit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id, product.name)}
                        className="btn btn-sm btn-outline btn-error flex-1"
                        disabled={isSuspended}
                      >
                        <FiTrash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-base-100 rounded-2xl border border-base-200 shadow-sm overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="table">
                  <thead className="bg-base-200">
                    <tr>
                      <th>Product</th>
                      <th>Status</th>
                      <th>Price</th>
                      <th>Home (Admin)</th>
                      <th>All (Admin)</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product._id} className="hover:bg-base-50">
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-base-200 overflow-hidden">
                              <img
                                src={product.images?.[0] || "/placeholder.png"}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{product.name}</p>
                              <p className="text-xs text-base-content/50">{product.createdBy}</p>
                            </div>
                          </div>
                        </td>
                         <td>
                          <span className={`badge badge-sm ${product.approvalStatus === 'approved' ? 'badge-success' : 'badge-warning'}`}>
                            {product.approvalStatus || 'Pending'}
                          </span>
                        </td>
                        <td className="font-semibold text-primary text-sm">
                          {formatPrice(product.price)}
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            className="toggle toggle-primary toggle-sm"
                            checked={product.adminShowOnHome || false}
                            onChange={(e) => handleAdminShowOnHome(product._id, e.target.checked)}
                            disabled={isSuspended}
                          />
                        </td>
                         <td>
                          <input
                            type="checkbox"
                            className="toggle toggle-secondary toggle-sm"
                            checked={product.isVisibleInAllProducts || false}
                            onChange={(e) => handleIsVisibleInAllProducts(product._id, e.target.checked)}
                            disabled={isSuspended}
                          />
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                navigate(
                                  `/dashboard/admin/update-product/${product._id}`,
                                )
                              }
                              className="btn btn-sm btn-ghost text-primary"
                              disabled={isSuspended}
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleDelete(product._id, product.name)
                              }
                              className="btn btn-sm btn-ghost text-error"
                              disabled={isSuspended}
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* Results Summary */}
      <div className="mt-4 text-center text-sm text-base-content/50">
        Showing {filteredProducts.length} of {products.length} Products
      </div>
    </div>
  );
};

export default AllProducts;
