// Add Product Page - Manager Product Creation Component
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  FiPackage,
  FiImage,
  FiDollarSign,
  FiTag,
  FiVideo,
  FiCreditCard,
  FiHome,
  FiPlus,
  FiX,
  FiAlertCircle,
} from "react-icons/fi";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { uploadToImgBB } from "../../../../utils/uploadToImgBB";
import useAuth from "../../../../hooks/useAuth";

const AddProduct = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const watchImages = watch("images");

  // Preview Images Effect
  useEffect(() => {
    if (watchImages && watchImages.length > 0) {
      setPreviewImages(
        Array.from(watchImages).map((file) => URL.createObjectURL(file)),
      );
    } else {
      setPreviewImages([]);
    }
  }, [watchImages]);

  // Account Status Check
  if (user.status === "pending" || user.suspend?.isSuspended) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto p-6"
      >
        <div className="bg-warning/10 border border-warning/20 rounded-2xl p-8 text-center">
          <FiAlertCircle className="w-16 h-16 text-warning mx-auto mb-4" />
          <h2 className="text-xl font-bold text-warning mb-2">
            Access Restricted
          </h2>
          <p className="text-base-content/70">
            {user.status === "pending"
              ? "Your account is pending approval. You cannot add products."
              : "Your account is suspended. You cannot add products."}
          </p>
        </div>
      </motion.div>
    );
  }

  // Form Submit Handler
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const imageUrls = await uploadToImgBB(data.images);

      const productData = {
        name: data.name,
        description: data.description,
        category: data.category,
        price: Number(data.price),
        quantity: Number(data.availableQty),
        moq: Number(data.moq),
        images: imageUrls,
        videoLink: data.demoVideo || "",
        paymentOption: data.paymentOption,
        managerShowOnHome: Boolean(data.showOnHome),
        managerEmail: user.email,
      };

      await axiosSecure.post("/api/products", productData);
      toast.success("Product added successfully!");
      reset();
      setPreviewImages([]);
    } catch {
      toast.error("Failed to add product!");
    } finally {
      setLoading(false);
    }
  };

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
            <FiPlus className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-base-content">
              Add New Product
            </h1>
            <p className="text-base-content/60">
              Create a new product listing!
            </p>
          </div>
        </div>
        
        {/* Approval Warning */}
        <div className="alert alert-info shadow-sm mt-4">
          <FiAlertCircle className="w-5 h-5" />
          <div>
            <h3 className="font-bold">Approval Required</h3>
            <div className="text-xs">New products will remain pending until approved by an Admin.</div>
          </div>
        </div>
      </motion.div>

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
                placeholder="Enter product name!"
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
                  required: "Description is required!",
                })}
                className={`textarea textarea-bordered w-full h-32 ${
                  errors.description ? "textarea-error" : ""
                }`}
                placeholder="Enter product description!"
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
                <option value="Clothing">Clothing</option>
              </select>
              {errors.category && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.category.message}
                  </span>
                </label>
              )}
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
                    required: "Price is required!",
                    min: { value: 0, message: "Price must be positive!" },
                  })}
                  className={`input input-bordered w-full pl-8 ${
                    errors.price ? "input-error" : ""
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.price && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.price.message}
                  </span>
                </label>
              )}
            </div>

            {/* Available Quantity */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Available Qty *</span>
              </label>
              <input
                type="number"
                {...register("availableQty", {
                  required: "Available quantity is required!",
                  min: 0,
                })}
                className={`input input-bordered w-full ${
                  errors.availableQty ? "input-error" : ""
                }`}
                placeholder="0"
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
            <div>
              <label className="label">
                <span className="label-text font-medium">MOQ *</span>
              </label>
              <input
                type="number"
                {...register("moq", { required: "MOQ is required!", min: 1 })}
                className={`input input-bordered w-full ${
                  errors.moq ? "input-error" : ""
                }`}
                placeholder="1"
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

          <div>
            <label className="label">
              <span className="label-text font-medium">Upload Images *</span>
            </label>
            <div className="border-2 border-dashed border-base-300 rounded-xl p-6 text-center hover:border-primary transition-colors">
              <FiImage className="w-12 h-12 text-base-content/30 mx-auto mb-3" />
              <p className="text-base-content/60 mb-3">
                Click or drag images here!
              </p>
              <input
                type="file"
                {...register("images", {
                  required: "At least one image is required!",
                })}
                multiple
                accept="image/*"
                className="file-input file-input-bordered file-input-primary w-full max-w-xs"
              />
            </div>
            {errors.images && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.images.message}
                </span>
              </label>
            )}

            {/* Image Previews */}
            {previewImages.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {previewImages.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={img}
                      alt={`Preview ${idx + 1}`}
                      className="w-24 h-24 object-cover rounded-xl border border-base-200"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="btn btn-primary btn-lg w-full gap-2"
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm" />
              Adding Product!
            </>
          ) : (
            <>
              <FiPlus className="w-5 h-5" />
              Add Product
            </>
          )}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default AddProduct;
