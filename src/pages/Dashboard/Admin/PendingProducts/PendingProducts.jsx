// Pending Products Page
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  FiClock,
  FiCheck,
  FiX,
  FiEye,
  FiAlertCircle,
  FiPackage,
  FiDollarSign,
  FiUser,
} from "react-icons/fi";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const PendingProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const fetchPendingProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axiosSecure.get("/api/products/admin/pending");
      setProducts(data || []);
    } catch {
      Swal.fire("Error", "Failed to fetch pending products!", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  const handleApprove = async (product) => {
    const confirm = await Swal.fire({
      title: "Approve Product?",
      text: `Approve "${product.name}"? It will need visibility toggles enabled to appear on site.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Approve",
      confirmButtonColor: "#10B981",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.patch(`/api/products/${product._id}`, {
        approvalStatus: "approved",
      });
      setProducts((prev) => prev.filter((p) => p._id !== product._id));
      Swal.fire("Approved!", "Product has been approved.", "success");
    } catch {
      Swal.fire("Error", "Failed to approve product!", "error");
    }
  };

  const handleReject = async (product) => {
    const { value: reason } = await Swal.fire({
      title: "Reject Product",
      input: "text",
      inputLabel: "Reason for rejection",
      inputPlaceholder: "Enter reason...",
      showCancelButton: true,
      confirmButtonText: "Reject",
      confirmButtonColor: "#EF4444",
      inputValidator: (value) => {
        if (!value) return "You need to write a reason!";
      },
    });

    if (!reason) return;

    try {
      await axiosSecure.patch(`/api/products/${product._id}`, {
        approvalStatus: "rejected",
        rejectionReason: reason,
      });
      setProducts((prev) => prev.filter((p) => p._id !== product._id));
      Swal.fire("Rejected!", "Product has been rejected.", "success");
    } catch {
      Swal.fire("Error", "Failed to reject product!", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FiClock className="text-warning" />
          Pending Products
        </h1>
        <p className="text-base-content/60">
          Review and approve products submitted by managers!
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 bg-base-100 rounded-xl border border-base-200">
          <FiCheck className="w-12 h-12 mx-auto text-success mb-3" />
          <h3 className="text-lg font-semibold">All Caught Up!</h3>
          <p className="text-base-content/60">No pending products to review.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {products.map((product) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-base-100 p-4 rounded-xl border border-base-200 shadow-sm flex flex-col md:flex-row gap-4 items-center"
            >
              <div className="w-20 h-20 bg-base-200 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={product.images?.[0] || "/placeholder.png"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 text-center md:text-left">
                <h3 className="font-bold text-lg">{product.name}</h3>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-base-content/70 mt-1">
                  <span className="flex items-center gap-1">
                    <FiDollarSign /> {product.price}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiPackage /> {product.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiUser /> {product.createdBy}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                 <button
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="btn btn-sm btn-ghost"
                  title="View Details"
                >
                  <FiEye />
                </button>
                <button
                  onClick={() => handleApprove(product)}
                  className="btn btn-sm btn-success text-white"
                >
                  <FiCheck className="mr-1" /> Approve
                </button>
                <button
                  onClick={() => handleReject(product)}
                  className="btn btn-sm btn-error text-white"
                >
                  <FiX className="mr-1" /> Reject
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingProducts;
