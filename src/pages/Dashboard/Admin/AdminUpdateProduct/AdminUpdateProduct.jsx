import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  FiPackage,
  FiEdit3,
  FiUpload,
  FiX,
  FiSave,
  FiArrowLeft,
  FiImage,
  FiVideo,
  FiDollarSign,
  FiHash,
  FiSettings,
} from "react-icons/fi";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { uploadToImgBB } from "../../../../utils/uploadToImgBB";

const AdminUpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

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

  const { data: product, isLoading } = useQuery({
    queryKey: ["admin-product", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/products/${id}`);
      return res.data;
    },
  });

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
        showOnHome: product.showOnHome,
      });
      setPreviewImages(product.images);
    }
  }, [product, reset]);

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

  const updateMutation = useMutation({
    mutationFn: async (updatedData) =>
      await axiosSecure.patch(`/api/products/${id}`, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-products"]);
      toast.success("Product updated successfully!");
      navigate("/dashboard/all-products");
    },
    onError: () => toast.error("Failed to update product!"),
  });

  const onSubmit = async (data) => {
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
        showOnHome: Boolean(data.showOnHome),
        updatedAt: new Date(),
      };

      await updateMutation.mutateAsync(updatedProduct);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = (url) => {
    setPreviewImages((prev) => prev.filter((img) => img !== url));
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <FiPackage className="w-16 h-16 text-base-content/20 mb-4" />
        <p className="text-base-content/60">Product not found!</p>
      </div>
    );
  }

  return (
    <div className="p-2 max-w-4xl mx-auto">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <FiEdit3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-base-content">
              Update Product
            </h1>
            <p className="text-base-content/60">
              Modify product details and settings!
            </p>
          </div>
        </div>
      </motion.div>

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate("/dashboard/all-products")}
        className="btn btn-ghost btn-sm gap-2 mb-6"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to Products
      </motion.button>

      {/* Main Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-base-100 rounded-2xl border border-base-200 shadow-sm overflow-hidden"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-base-content flex items-center gap-2">
              <FiPackage className="text-primary" />
              Basic Information
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Product Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Product Name *</span>
                </label>
                <input
                  type="text"
                  {...register("name", {
                    required: "Product Name is required",
                  })}
                  className="input input-bordered focus:input-primary"
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

              {/* Category */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Category *</span>
                </label>
                <select
                  {...register("category", {
                    required: "Category is required",
                  })}
                  className="select select-bordered focus:select-primary"
                >
                  <option value="">Select Category</option>
                  <option value="Shirt">Shirt</option>
                  <option value="Pant">Pant</option>
                  <option value="Jacket">Jacket</option>
                  <option value="Accessories">Accessories</option>
                </select>
                {errors.category && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.category.message}
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Description *</span>
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                className="textarea textarea-bordered focus:textarea-primary h-24"
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
          </div>

          {/* Pricing & Quantity Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-base-content flex items-center gap-2">
              <FiDollarSign className="text-primary" />
              Pricing & Quantity
            </h3>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Price */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Price (৳) *</span>
                </label>
                <input
                  type="number"
                  {...register("price", {
                    required: "Price is required",
                    min: 0,
                  })}
                  className="input input-bordered focus:input-primary"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
                {errors.price && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.price.message}
                    </span>
                  </label>
                )}
              </div>

              {/* Available Quantity */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Available Quantity *
                  </span>
                </label>
                <input
                  type="number"
                  {...register("availableQty", {
                    required: "Quantity is required",
                    min: 0,
                  })}
                  className="input input-bordered focus:input-primary"
                  placeholder="0"
                  min="0"
                />
                {errors.availableQty && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.availableQty.message}
                    </span>
                  </label>
                )}
              </div>

              {/* MOQ */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Minimum Order Qty *
                  </span>
                </label>
                <input
                  type="number"
                  {...register("moq", { required: "MOQ is required", min: 1 })}
                  className="input input-bordered focus:input-primary"
                  placeholder="1"
                  min="1"
                />
                {errors.moq && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.moq.message}
                    </span>
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Media & Settings Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-base-content flex items-center gap-2">
              <FiSettings className="text-primary" />
              Media & Settings
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Demo Video Link */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <FiVideo className="w-4 h-4" />
                    Demo Video Link
                  </span>
                </label>
                <input
                  type="url"
                  {...register("demoVideo")}
                  className="input input-bordered focus:input-primary"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              {/* Payment Option */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Payment Option *
                  </span>
                </label>
                <select
                  {...register("paymentOption", { required: true })}
                  className="select select-bordered focus:select-primary"
                >
                  <option value="COD">Cash on Delivery</option>
                  <option value="PayFirst">Pay First</option>
                </select>
              </div>
            </div>

            {/* Show on Home Checkbox */}
            <div className="form-control">
              <label className="label cursor-pointer">
                <input
                  type="checkbox"
                  {...register("showOnHome")}
                  className="checkbox checkbox-primary"
                />
                <span className="label-text ml-2 font-medium">
                  Show on Home Page
                </span>
              </label>
            </div>
          </div>

          {/* Images Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-base-content flex items-center gap-2">
              <FiImage className="text-primary" />
              Product Images
            </h3>

            {/* Upload New Images */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Upload New Images
                </span>
              </label>
              <input
                type="file"
                {...register("images")}
                multiple
                accept="image/*"
                className="file-input file-input-bordered file-input-primary w-full"
              />
            </div>

            {/* Image Preview Grid */}
            {(previewImages.length > 0 || newImages.length > 0) && (
              <div className="space-y-3">
                {/* Existing Images */}
                {previewImages.length > 0 && (
                  <div>
                    <h4 className="font-medium text-base-content/70 mb-2">
                      Existing Images
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {previewImages.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={img}
                            alt={`Product ${idx + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-base-300"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(img)}
                            className="absolute -top-2 -right-2 btn btn-circle btn-xs btn-error opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FiX className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Images */}
                {newImages.length > 0 && (
                  <div>
                    <h4 className="font-medium text-base-content/70 mb-2">
                      New Images
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {newImages.map((img, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={img}
                            alt={`New ${idx + 1}`}
                            className="w-full h-24 object-cover rounded-lg border-2 border-dashed border-primary/50"
                          />
                          <div className="absolute inset-0 bg-primary/10 rounded-lg flex items-center justify-center">
                            <FiUpload className="w-6 h-6 text-primary" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t border-base-200">
            <button
              type="submit"
              className="btn btn-primary btn-lg gap-2"
              disabled={loading || updateMutation.isPending}
            >
              {loading || updateMutation.isPending ? (
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
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminUpdateProduct;
