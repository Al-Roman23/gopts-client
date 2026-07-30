// Update Product Page - Manager Product Editing Component
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  FiPackage,
  FiImage,
  FiDollarSign,
  FiVideo,
  FiCreditCard,
  FiHome,
  FiSave,
  FiX,
  FiAlertCircle,
  FiArrowLeft,
} from "react-icons/fi";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { uploadToImgBB } from "../../../../utils/uploadToImgBB";
import useAuth from "../../../../hooks/useAuth";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [previewImages, setPreviewImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const watchImages = watch("images");

  const isDisabled = user.status === "pending" || user.suspend?.isSuspended;

  // Fetch Product Data
  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/products/manager/${id}`);
      return res.data;
    },
  });

  // Populate Form With Product Data
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        availableQty: product.quantity,
        moq: product.moq,
        paymentOption: product.paymentOption,
        demoVideo: product.videoLink,
        showOnHome: product.managerShowOnHome !== undefined ? product.managerShowOnHome : product.showOnHome,
      });
      setPreviewImages(product.images || []);
    }
  }, [product, reset]);

  // Preview New Images
  useEffect(() => {
    if (watchImages && watchImages.length > 0) {
      const previews = Array.from(watchImages).map((file) =>
        URL.createObjectURL(file),
      );
      setNewImages(previews);
    } else {
      setNewImages([]);
    }
  }, [watchImages]);

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedData) =>
      await axiosSecure.patch(`/api/products/manager/${id}`, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries(["my-products"]);
      toast.success("Product updated! Status reset to pending.");
      navigate("/dashboard/manage-products");
    },
    onError: () => toast.error("Failed to update product!"),
  });

  // Form Submit Handler
  const onSubmit = async (data) => {
    if (isDisabled) {
      toast.error(
        user.status === "pending"
          ? "Your account is pending approval."
          : "Your account is suspended.",
      );
      return;
    }
    try {
      setLoading(true);
      let uploadedImages = previewImages;

      if (data.images && data.images.length > 0) {
        const newImageUrls = await uploadToImgBB(data.images);
        uploadedImages = [...previewImages, ...newImageUrls];
      }

      const updatedProduct = {
        name: data.name,
        description: data.description,
        category: data.category,
        price: Number(data.price),
        quantity: Number(data.availableQty),
        moq: Number(data.moq),
        images: uploadedImages,
        videoLink: data.demoVideo || "",
        paymentOption: data.paymentOption,
        managerShowOnHome: Boolean(data.showOnHome),
        updatedAt: new Date(),
      };

      await updateMutation.mutateAsync(updatedProduct);
    } catch {
      toast.error("Update failed!");
    } finally {
      setLoading(false);
    }
  };

  // Remove Image Handler
  const handleRemoveImage = (url) => {
    setPreviewImages((prev) => prev.filter((img) => img !== url));
  };

  // Loading State
  if (productLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  // Product Not Found
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <FiPackage className="w-16 h-16 text-base-content/20 mb-4" />
        <p className="text-base-content/60">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="p-2 max-w-4xl mx-auto">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => navigate("/dashboard/manage-products")}
          className="btn btn-ghost btn-sm gap-2 mb-4"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Products
        </button>
      </motion.div>

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-warning/10 text-warning">
            <FiPackage className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-base-content">
              Update Product
            </h1>
            <p className="text-base-content/60">Edit product details!</p>
          </div>
        </div>

        {/* Approval Warning */}
        <div className="alert alert-warning shadow-sm mt-4">
          <FiAlertCircle className="w-5 h-5" />
          <div>
            <h3 className="font-bold">Warning</h3>
            <div className="text-xs">Updating the product will reset its status to <strong>Pending</strong> and remove it from public view until re-approved.</div>
          </div>
        </div>
      </motion.div>

      {/* Account Status Warning */}
      {isDisabled && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-warning/10 border border-warning/20 rounded-2xl p-4 mb-6 flex items-center gap-3"
        >
          <FiAlertCircle className="w-6 h-6 text-warning flex-shrink-0" />
          <p className="text-warning">
            {user.status === "pending"
              ? "Your account is pending approval. You cannot update products."
              : "Your account is suspended. You cannot update products."}
          </p>
        </motion.div>
      )}

      {/* Rejection Notification */}
      {product?.approvalStatus === "rejected" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-error/10 border border-error/20 rounded-2xl p-4 mb-6"
        >
          <div className="flex items-start gap-3">
             <FiAlertCircle className="w-6 h-6 text-error flex-shrink-0 mt-0.5" />
             <div>
               <h3 className="font-bold text-error">Product Rejected</h3>
               <p className="text-base-content/80 mt-1">
                 <strong>Reason:</strong> {product.rejectionReason || "No reason provided."}
               </p>
               <p className="text-sm text-base-content/60 mt-2">
                 Please make the necessary changes and save to resubmit for approval.
               </p>
             </div>
          </div>
        </motion.div>
      )}

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Basic Information Card */}
        <div className="bg-base-100 rounded-2xl border border-base-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
              <FiPackage className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold">Basic Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Name */}
            <div className="md:col-span-2">
              <label className="label">
                <span className="label-text font-medium">Product Name *</span>
              </label>
              <input
                type="text"
                {...register("name", { required: "Product Name is required" })}
                className={`input input-bordered w-full ${
                  errors.name ? "input-error" : ""
                }`}
                placeholder="Enter product name"
              />
              {errors.name && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.name.message}
                  </span>
                </label>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="label">
                <span className="label-text font-medium">Description *</span>
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                className={`textarea textarea-bordered w-full h-32 ${
                  errors.description ? "textarea-error" : ""
                }`}
                placeholder="Enter product description"
              />
              {errors.description && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.description.message}
                  </span>
                </label>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Category *</span>
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className={`select select-bordered w-full ${
                  errors.category ? "select-error" : ""
                }`}
              >
                <option value="">Select Category</option>
                <option value="Shirt">Shirt</option>
                <option value="Pant">Pant</option>
                <option value="Jacket">Jacket</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            {/* Demo Video Link */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Demo Video Link</span>
              </label>
              <div className="relative">
                <FiVideo className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                <input
                  type="url"
                  {...register("demoVideo")}
                  className="input input-bordered w-full pl-10"
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="bg-base-100 rounded-2xl border border-base-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-success/10 text-success">
              <FiDollarSign className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold">Pricing & Inventory</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Price */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Price (৳) *</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60">
                  ৳
                </span>
                <input
                  type="number"
                  {...register("price", {
                    required: "Price is required",
                    min: 0,
                  })}
                  className={`input input-bordered w-full pl-8 ${
                    errors.price ? "input-error" : ""
                  }`}
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Available Quantity */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Available Qty *</span>
              </label>
              <input
                type="number"
                {...register("availableQty", {
                  required: "Quantity is required",
                  min: 0,
                })}
                className={`input input-bordered w-full ${
                  errors.availableQty ? "input-error" : ""
                }`}
                placeholder="0"
              />
            </div>

            {/* MOQ */}
            <div>
              <label className="label">
                <span className="label-text font-medium">MOQ *</span>
              </label>
              <input
                type="number"
                {...register("moq", { required: "MOQ is required", min: 1 })}
                className={`input input-bordered w-full ${
                  errors.moq ? "input-error" : ""
                }`}
                placeholder="1"
              />
            </div>
          </div>
        </div>

        {/* Settings Card */}
        <div className="bg-base-100 rounded-2xl border border-base-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-accent/10 text-accent">
              <FiCreditCard className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold">Payment & Display</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Payment Option */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Payment Option *</span>
              </label>
              <select
                {...register("paymentOption", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="COD">Cash on Delivery</option>
                <option value="PayFirst">PayFirst</option>
              </select>
            </div>

            {/* Show On Home */}
            <div className="flex items-center">
              <label className="label cursor-pointer gap-3">
                <input
                  type="checkbox"
                  {...register("showOnHome")}
                  className="checkbox checkbox-primary"
                />
                <span className="label-text font-medium flex items-center gap-2">
                  <FiHome className="w-4 h-4" />
                  Show On Home Page
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Images Card */}
        <div className="bg-base-100 rounded-2xl border border-base-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-info/10 text-info">
              <FiImage className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold">Product Images</h2>
          </div>

          {/* Current Images */}
          {previewImages.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-base-content/60 mb-3">
                Current Images (Click X to Remove)
              </p>
              <div className="flex flex-wrap gap-3">
                {previewImages.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={img}
                      alt={`Preview ${idx + 1}`}
                      className="w-24 h-24 object-cover rounded-xl border border-base-200"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img)}
                      className="absolute -top-2 -right-2 btn btn-circle btn-xs btn-error"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload New Images */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Add New Images</span>
            </label>
            <div className="border-2 border-dashed border-base-300 rounded-xl p-6 text-center hover:border-primary transition-colors">
              <FiImage className="w-12 h-12 text-base-content/30 mx-auto mb-3" />
              <p className="text-base-content/60 mb-3">
                Click or drag images here!
              </p>
              <input
                type="file"
                {...register("images")}
                multiple
                accept="image/*"
                className="file-input file-input-bordered file-input-primary w-full max-w-xs"
              />
            </div>

            {/* New Image Previews */}
            {newImages.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                <p className="w-full text-sm text-base-content/60 mb-2">
                  New Images to Add:
                </p>
                {newImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`New ${idx + 1}`}
                    className="w-24 h-24 object-cover rounded-xl border-2 border-primary border-dashed"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: isDisabled ? 1 : 1.02 }}
          whileTap={{ scale: isDisabled ? 1 : 0.98 }}
          type="submit"
          disabled={isDisabled || loading}
          className="btn btn-warning btn-lg w-full gap-2"
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm" />
              Updating Product...
            </>
          ) : (
            <>
              <FiSave className="w-5 h-5" />
              Update Product
            </>
          )}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default UpdateProduct;
