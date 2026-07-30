// Product Details Page Component - Display Only
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  FiPackage,
  FiDollarSign,
  FiShoppingCart,
  FiVideo,
  FiImage,
  FiArrowLeft,
  FiAlertCircle,
  FiCheckCircle,
  FiCreditCard,
  FiHome,
  FiTag,
} from "react-icons/fi";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import useUserRole from "../../hooks/useUserRole";
import PageTitle from "../../components/ui/PageTitle";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { role, isLoading: roleLoading } = useUserRole();

  const [selectedImage, setSelectedImage] = useState(0);

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

  // Check If Booking Is Disabled
  const isBookingDisabled =
    !user ||
    ["admin", "manager"].includes(role) ||
    user.suspend?.isSuspended ||
    !product;

  // Handle Booking Navigation - Navigate To Booking Form
  const handleBooking = () => {
    if (isBookingDisabled) return;
    navigate(`/booking/${product._id}`);
  };

  // Loading State With Skeleton
  if (isLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-base-200 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Skeleton */}
            <div className="bg-base-100 rounded-2xl p-6">
              <div className="aspect-square bg-base-300 rounded-xl animate-pulse mb-4" />
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-20 h-20 bg-base-300 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            </div>
            {/* Content Skeleton */}
            <div className="bg-base-100 rounded-2xl p-6 space-y-4">
              <div className="h-8 bg-base-300 rounded animate-pulse" />
              <div className="h-4 bg-base-300 rounded animate-pulse w-3/4" />
              <div className="h-6 bg-base-300 rounded animate-pulse w-1/2" />
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
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
            The product you're looking for doesn't exist or has been removed.
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

  // Get All Images (Product Images + Video Thumbnail If Available)
  const allImages = [...(product.images || [])];
  if (product.videoLink) {
    allImages.push(product.videoLink); // Add Video As Last Image
  }

  const renderDescription = (description) => {
    if (!description) return null;

    const sections = description.split("\n\n");

    return sections.map((section, idx) => {
      if (
        section.toLowerCase().startsWith("description") ||
        section.toLowerCase().startsWith("technical specs")
      ) {
        return (
          <h3
            key={idx}
            className="text-lg font-semibold text-base-content mt-4 mb-2"
          >
            {section.replace(":", "")}
          </h3>
        );
      }

      if (section.includes(":")) {
        return (
          <ul key={idx} className="space-y-2">
            {section.split("\n").map((line, i) => {
              const [label, value] = line.split(":");
              return (
                <li key={i} className="flex gap-2 text-base-content/80">
                  <span className="font-medium min-w-[90px]">{label}:</span>
                  <span>{value}</span>
                </li>
              );
            })}
          </ul>
        );
      }

      return (
        <p key={idx} className="text-base-content/80 leading-relaxed">
          {section}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-base-200">
      <PageTitle title={product?.name || "Product Details"} />
      <div className="max-w-7xl mx-auto p-4">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/all-products")}
          className="btn btn-ghost btn-sm gap-2 mb-6"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Products
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {/* Main Image Display */}
            <div className="bg-base-100 rounded-2xl p-6 shadow-sm">
              <div className="aspect-square rounded-xl overflow-hidden bg-base-300">
                {allImages[selectedImage]?.includes("video") ? (
                  <video
                    controls
                    className="w-full h-full object-cover"
                    poster={product.images?.[0]}
                  >
                    <source src={allImages[selectedImage]} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={allImages[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="bg-base-100 rounded-2xl p-4 shadow-sm">
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === idx
                          ? "border-primary shadow-md"
                          : "border-base-300 hover:border-base-content/20"
                      }`}
                    >
                      {img.includes("video") ? (
                        <div className="w-full h-full bg-base-300 flex items-center justify-center">
                          <FiVideo className="w-6 h-6 text-base-content/60" />
                        </div>
                      ) : (
                        <img
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Product Information Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Product Header */}
            <div className="bg-base-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-base-content mb-2">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="badge badge-secondary gap-1">
                      <FiTag className="w-3 h-3" />
                      {product.category}
                    </div>
                    {product.showOnHome && (
                      <div className="badge badge-accent gap-1">
                        <FiHome className="w-3 h-3" />
                        Featured
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    ৳{product.price?.toLocaleString()}
                  </div>
                  <div className="text-sm text-base-content/60">Per Unit</div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                {renderDescription(product.description)}
              </div>
            </div>

            {/* Product Details Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Stock Information */}
              <div className="bg-base-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-info/10 text-info">
                    <FiPackage className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-base-content/60">
                      Available Stock
                    </p>
                    <p className="font-semibold text-base-content">
                      {product.quantity?.toLocaleString()} units
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-base-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-success/10 text-success">
                    <FiCreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-base-content/60">Payment</p>
                    <p className="font-semibold text-base-content">
                      {product.paymentOption === "COD"
                        ? "Cash on Delivery"
                        : "Pay First"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Minimum Order */}
              <div className="bg-base-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-warning/10 text-warning">
                    <FiShoppingCart className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-base-content/60">
                      Minimum Order
                    </p>
                    <p className="font-semibold text-base-content">
                      {product.moq} units
                    </p>
                  </div>
                </div>
              </div>

              {/* Sample Price Calculator */}
              <div className="bg-base-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <FiDollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-base-content/60">Sample Price</p>
                    <p className="font-semibold text-base-content">
                      ৳{(product.price * product.moq)?.toLocaleString()}
                    </p>
                    <p className="text-xs text-base-content/50">
                      For {product.moq} units
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-base-100 rounded-2xl p-6 shadow-sm">
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

                  {/* Warning Messages */}
                  <div className="bg-warning/10 border border-warning/20 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <FiAlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        {["admin", "manager"].includes(role) ? (
                          <p className="text-warning">
                            As a {role}, you have administrative privileges and
                            can manage orders directly from your dashboard.
                          </p>
                        ) : user?.suspend?.isSuspended ? (
                          <p className="text-warning">
                            Your account is currently suspended. Please contact
                            support to reactivate your account.
                          </p>
                        ) : (
                          <p className="text-warning">
                            Please log in to place an order for this product.
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
                  onClick={handleBooking}
                  className="btn btn-primary btn-lg w-full gap-2"
                >
                  <FiShoppingCart className="w-5 h-5" />
                  Place Order
                </motion.button>
              )}

              {/* Additional Info For Buyers */}
              {role === "buyer" && !isBookingDisabled && (
                <div className="mt-4 bg-info/10 border border-info/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <FiCheckCircle className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-info font-medium mb-1">
                        Ready to Order!
                      </p>
                      <p className="text-base-content/70">
                        Click "Place Order" to proceed to the booking form where
                        you can select quantity and provide delivery details.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
