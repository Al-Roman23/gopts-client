// Booking Form Page - Modern Order Placement With Validation
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  FiPackage,
  FiUser,
  FiPhone,
  FiMapPin,
  FiFileText,
  FiShoppingCart,
  FiDollarSign,
  FiArrowLeft,
  FiAlertCircle,
  FiCheckCircle,
  FiCreditCard,
  FiMinus,
  FiPlus,
  FiInfo,
} from "react-icons/fi";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import useUserRole from "../../hooks/useUserRole";
import PageTitle from "../../components/ui/PageTitle";

const BookingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { role, isLoading: roleLoading } = useUserRole();

  const [submitting, setSubmitting] = useState(false);

  // Get Quantity From URL Params (from ProductDetails Page)
  const initialQuantity = Number(searchParams.get("quantity")) || 1;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const watchQuantity = watch("quantity", initialQuantity);

  // Fetch Product Data With React Query
  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/products/${id}`);
      return res.data;
    },
  });

  // Set Initial Values When Product Loads
  useEffect(() => {
    if (product) {
      setValue("quantity", initialQuantity);
      setValue("firstName", user?.displayName?.split(" ")[0] || "");
      setValue(
        "lastName",
        user?.displayName?.split(" ").slice(1).join(" ") || "",
      );
    }
  }, [product, user, initialQuantity, setValue]);

  // Handle Quantity Change With Validation
  const handleQuantityChange = (newQuantity) => {
    const minQty = product?.moq || 1;
    const maxQty = product?.quantity || 0;
    if (newQuantity >= minQty && newQuantity <= maxQty) {
      setValue("quantity", newQuantity);
    }
  };

  // Check If Booking Is Disabled
  const isBookingDisabled =
    !user ||
    ["admin", "manager"].includes(role) ||
    user.suspend?.isSuspended ||
    !product;

  // Handle Form Submission
  const onSubmit = async (data) => {
    if (isBookingDisabled) return;

    const quantity = Number(data.quantity);
    const totalPrice = quantity * product.price;

    const bookingData = {
      userId: user.uid,
      userName: `${data.firstName} ${data.lastName}`,
      userEmail: user.email,
      productId: product._id,
      productName: product.name,
      price: product.price,
      quantity: quantity,
      totalPrice: totalPrice,
      firstName: data.firstName,
      lastName: data.lastName,
      contactNumber: data.contactNumber,
      deliveryAddress: data.deliveryAddress,
      additionalNotes: data.additionalNotes || "",
      status: "pending",
      paymentOption: product.paymentOption,
      managerEmail: product.managerEmail,
    };

    try {
      setSubmitting(true);
      await axiosSecure.post("/api/orders", bookingData);
      toast.success("Order placed successfully! Awaiting manager approval.");
      navigate("/dashboard/my-orders");
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading State With Skeleton
  if (isLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-base-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-base-100 rounded-2xl p-6 mb-6">
            <div className="h-8 bg-base-300 rounded animate-pulse mb-4" />
            <div className="h-4 bg-base-300 rounded animate-pulse w-3/4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-base-100 rounded-2xl p-6">
                  <div className="h-4 bg-base-300 rounded animate-pulse mb-3" />
                  <div className="h-10 bg-base-300 rounded animate-pulse" />
                </div>
              ))}
            </div>
            <div className="bg-base-100 rounded-2xl p-6">
              <div className="h-6 bg-base-300 rounded animate-pulse mb-4" />
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-4 bg-base-300 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !product) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-base-100 rounded-2xl p-8 text-center max-w-md"
        >
          <FiAlertCircle className="w-16 h-16 text-error mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-base-content mb-2">
            Product Not Found
          </h2>
          <p className="text-base-content/60 mb-6">
            The product you're trying to book doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/all-products")}
            className="btn btn-primary"
          >
            Browse Products
          </button>
        </motion.div>
      </div>
    );
  }

  // Calculate Total Price
  const totalPrice = (watchQuantity || 0) * product.price;

  return (
    <div className="min-h-screen bg-base-200">
      <PageTitle title={`Order ${product?.name || "Product"}`} />
      <div className="max-w-4xl mx-auto p-4">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-sm gap-2 mb-6"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Product
        </motion.button>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-base-100 rounded-2xl p-6 mb-6 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <FiShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-base-content">
                Place Your Order
              </h1>
              <p className="text-base-content/60">
                Complete your booking for {product.name}
              </p>
            </div>
          </div>

          {/* Product Summary */}
          <div className="bg-base-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <p className="font-semibold text-base-content">
                    {product.name}
                  </p>
                  <p className="text-sm text-base-content/60">
                    {product.category}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-primary">
                  ৳{product.price?.toLocaleString()}
                </p>
                <p className="text-sm text-base-content/60">Per Unit</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Personal Information */}
            <div className="bg-base-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
                  <FiUser className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold">Personal Information</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text font-medium">First Name *</span>
                  </label>
                  <input
                    type="text"
                    {...register("firstName", {
                      required: "First name is required",
                    })}
                    className={`input input-bordered w-full ${
                      errors.firstName ? "input-error" : ""
                    }`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.firstName.message}
                      </span>
                    </label>
                  )}
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-medium">Last Name *</span>
                  </label>
                  <input
                    type="text"
                    {...register("lastName", {
                      required: "Last name is required",
                    })}
                    className={`input input-bordered w-full ${
                      errors.lastName ? "input-error" : ""
                    }`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.lastName.message}
                      </span>
                    </label>
                  )}
                </div>
              </div>

              {/* Email (Read-only) */}
              <div className="mt-4">
                <label className="label">
                  <span className="label-text font-medium">Email Address</span>
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="input input-bordered w-full bg-base-200"
                />
              </div>
            </div>

            {/* Contact & Delivery */}
            <div className="bg-base-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-info/10 text-info">
                  <FiPhone className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold">Contact & Delivery</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="label">
                    <span className="label-text font-medium">
                      Contact Number *
                    </span>
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                    <input
                      type="tel"
                      {...register("contactNumber", {
                        required: "Contact number is required",
                      })}
                      className={`input input-bordered w-full pl-10 ${
                        errors.contactNumber ? "input-error" : ""
                      }`}
                      placeholder="+880 1XX XXX XXXX"
                    />
                  </div>
                  {errors.contactNumber && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.contactNumber.message}
                      </span>
                    </label>
                  )}
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-medium">
                      Delivery Address *
                    </span>
                  </label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-3 w-5 h-5 text-base-content/40" />
                    <textarea
                      {...register("deliveryAddress", {
                        required: "Delivery address is required",
                      })}
                      className={`textarea textarea-bordered w-full pl-10 h-24 ${
                        errors.deliveryAddress ? "textarea-error" : ""
                      }`}
                      placeholder="Enter complete delivery address!"
                    />
                  </div>
                  {errors.deliveryAddress && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.deliveryAddress.message}
                      </span>
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="bg-base-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-accent/10 text-accent">
                  <FiFileText className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold">Additional Notes</h2>
              </div>

              <textarea
                {...register("additionalNotes")}
                className="textarea textarea-bordered w-full h-24"
                placeholder="Any special instructions or notes for your order..."
              />
            </div>
          </motion.div>

          {/* Order Summary & Quantity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Quantity Selector */}
            <div className="bg-base-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-base-content mb-4">
                Order Quantity
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-base-300 rounded-lg">
                    <button
                      type="button"
                      onClick={() =>
                        handleQuantityChange((watchQuantity || 0) - 1)
                      }
                      disabled={(watchQuantity || 0) <= (product.moq || 1)}
                      className="btn btn-ghost btn-sm btn-square"
                    >
                      <FiMinus className="w-4 h-4" />
                    </button>

                    <input
                      type="number"
                      {...register("quantity", {
                        required: "Quantity is required",
                        min: {
                          value: product.moq || 1,
                          message: `Minimum ${product.moq || 1} units`,
                        },
                        max: {
                          value: product.quantity,
                          message: `Maximum ${product.quantity} units`,
                        },
                      })}
                      onChange={(e) =>
                        handleQuantityChange(Number(e.target.value))
                      }
                      className="input input-ghost text-center w-20 focus:outline-none"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        handleQuantityChange((watchQuantity || 0) + 1)
                      }
                      disabled={(watchQuantity || 0) >= product.quantity}
                      className="btn btn-ghost btn-sm btn-square"
                    >
                      <FiPlus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-sm text-base-content/60">
                    Min: {product.moq} | Max: {product.quantity}
                  </div>
                </div>

                {errors.quantity && (
                  <div className="text-error text-sm">
                    {errors.quantity.message}
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-base-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-base-content mb-4">
                Order Summary
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-base-content/70">Unit Price</span>
                  <span className="font-medium">
                    ৳{product.price?.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-base-content/70">Quantity</span>
                  <span className="font-medium">
                    {watchQuantity || 0} units
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-base-content/70">Payment Method</span>
                  <span className="font-medium flex items-center gap-1">
                    <FiCreditCard className="w-4 h-4" />
                    {product.paymentOption === "COD"
                      ? "Cash on Delivery"
                      : "Pay First"}
                  </span>
                </div>

                <div className="divider my-2" />

                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-primary">
                    ৳{totalPrice?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Process Info */}
            <div className="bg-info/10 border border-info/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <FiInfo className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-info font-medium mb-1">Order Process</p>
                  <p className="text-base-content/70">
                    Your order will be reviewed by our managers before
                    confirmation. You'll receive email updates and can track
                    your order status in your dashboard.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            {isBookingDisabled ? (
              <div className="space-y-4">
                <button
                  disabled
                  className="btn btn-primary btn-lg w-full gap-2 opacity-50 cursor-not-allowed"
                >
                  <FiShoppingCart className="w-5 h-5" />
                  {["admin", "manager"].includes(role)
                    ? "Administrative Access Only"
                    : user?.suspend?.isSuspended
                      ? "Account Suspended"
                      : "Login Required"}
                </button>

                <div className="bg-warning/10 border border-warning/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <FiAlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      {["admin", "manager"].includes(role) ? (
                        <p className="text-warning">
                          As a {role}, you have administrative privileges and
                          should manage orders through your dashboard.
                        </p>
                      ) : user?.suspend?.isSuspended ? (
                        <p className="text-warning">
                          Your account is currently suspended. Please contact
                          support to reactivate your account.
                        </p>
                      ) : (
                        <p className="text-warning">
                          Please log in with a buyer account to place orders.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                onClick={handleSubmit(onSubmit)}
                disabled={submitting}
                className="btn btn-primary btn-lg w-full gap-2"
              >
                {submitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <FiShoppingCart className="w-5 h-5" />
                    Place Order (৳{totalPrice?.toLocaleString()})
                  </>
                )}
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
