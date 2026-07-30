// Manage Products Page
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import {
  FiPackage,
  FiSearch,
  FiFilter,
  FiEdit3,
  FiTrash2,
  FiGrid,
  FiList,
  FiDollarSign,
  FiCreditCard,
  FiTag,
} from "react-icons/fi";

const ManageProducts = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  // Fetch Products
  const { data = [], isLoading } = useQuery({
    queryKey: ["my-products", searchTerm, categoryFilter],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/products/manager/my-products", {
        params: { category: categoryFilter },
      });
      return res.data.products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) =>
      await axiosSecure.delete(`/api/products/manager/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["my-products"]);
      toast.success("Product deleted successfully!");
    },
    onError: () => toast.error("Failed to delete product."),
  });

  // Handle Delete
  const handleDelete = (product) => {
    Swal.fire({
      title: "Delete Product?",
      html: `
        <p class="text-base-content/70">You are about to delete</p>
        <p class="font-bold text-lg mt-2">${product.name}</p>
        <p class="text-error text-sm mt-2">This action cannot be undone!</p>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      confirmButtonText: "Yes, Delete",
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(product._id);
    });
  };

  // Get Status Badge
  const getStatusBadge = (status) => {
    const badges = {
      approved: "badge-success",
      pending: "badge-warning",
      rejected: "badge-error",
    };
    return badges[status?.toLowerCase()] || "badge-ghost";
  };

  // Loading State
  if (isLoading) {
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
              Manage Products
            </h1>
            <p className="text-base-content/60">
              Manage your product inventory!
            </p>
          </div>
        </div>
      </div>

      {/* Filters And Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-base-100 rounded-2xl border border-base-200 p-4 mb-6"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
              <input
                type="text"
                placeholder="Search products..."
                className="input input-bordered w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-3">
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
              <select
                className="select select-bordered pl-10"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Shirt">Shirt</option>
                <option value="Pant">Pant</option>
                <option value="Jacket">Jacket</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            {/* View Toggle */}
            <div className="btn-group">
              <button
                onClick={() => setViewMode("grid")}
                className={`btn btn-sm ${
                  viewMode === "grid" ? "btn-primary" : "btn-ghost"
                }`}
              >
                <FiGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`btn btn-sm ${
                  viewMode === "list" ? "btn-primary" : "btn-ghost"
                }`}
              >
                <FiList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* No Products */}
      {data.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-base-100 rounded-2xl border border-base-200 p-12 text-center"
        >
          <FiPackage className="w-16 h-16 text-base-content/20 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-base-content mb-2">
            No Products Found!
          </h3>
          <p className="text-base-content/60 mb-6">
            {searchTerm || categoryFilter
              ? "Try adjusting your search or filter."
              : "Start by adding your first product."}
          </p>
          <button
            onClick={() => navigate("/dashboard/add-product")}
            className="btn btn-primary"
          >
            Add Product
          </button>
        </motion.div>
      ) : viewMode === "grid" ? (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-base-100 rounded-2xl border border-base-200 shadow-sm overflow-hidden group"
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.images?.[0] || "/placeholder.png"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span
                  className={`absolute top-3 right-3 badge ${getStatusBadge(
                    product.approvalStatus,
                  )} capitalize`}
                >
                  {product.approvalStatus}
                </span>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-base-content mb-2 line-clamp-1">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-primary">
                    ৳{product.price?.toLocaleString()}
                  </span>
                  <span className="badge badge-ghost text-xs">
                    {product.paymentOption}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      navigate(`/dashboard/update-product/${product._id}`)
                    }
                    className="btn btn-sm btn-warning flex-1 gap-1"
                  >
                    <FiEdit3 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    className="btn btn-sm btn-error gap-1"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* List View */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-base-100 rounded-2xl border border-base-200 shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="bg-base-200">
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((product, index) => (
                  <tr key={product._id} className="hover:bg-base-50">
                    <td>{index + 1}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img src={product.images?.[0]} alt={product.name} />
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-base-content/50">
                            {product.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="font-bold text-primary">
                      ৳{product.price?.toLocaleString()}
                    </td>
                    <td>{product.paymentOption}</td>
                    <td>
                      <span
                        className={`badge ${getStatusBadge(
                          product.approvalStatus,
                        )} capitalize`}
                      >
                        {product.approvalStatus}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            navigate(`/dashboard/update-product/${product._id}`)
                          }
                          className="btn btn-sm btn-warning gap-1"
                        >
                          <FiEdit3 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="btn btn-sm btn-error gap-1"
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

      {/* Products Count */}
      {data.length > 0 && (
        <div className="mt-4 text-center text-sm text-base-content/50">
          Showing {data.length} Product{data.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
