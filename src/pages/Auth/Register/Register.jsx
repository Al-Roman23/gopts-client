import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiImage, FiUserPlus, FiBriefcase } from "react-icons/fi";
import Swal from "sweetalert2";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import SocialLogin from "../SocialLogin/SocialLogin";

import PageTitle from "../../../components/ui/PageTitle";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const { registerUser, updateUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const location = useLocation();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // 1. Upload Image To ImgBB
      const profileImg = data.image[0];
      const formData = new FormData();
      formData.append("image", profileImg);
      
      const imageApiUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`;
      const imageRes = await axios.post(imageApiUrl, formData);
      const imageUrl = imageRes.data.data.url;

      // 2. Create User In Firebase
      const result = await registerUser(data.email, data.password);
      
      // 3. Update Firebase Profile
      await updateUserProfile({
        displayName: data.name,
        photoURL: imageUrl,
      });

      // 4. Save User To Database
      const userPayload = {
        uid: result.user.uid,
        name: data.name,
        email: data.email,
        photoURL: imageUrl,
        role: data.role,
        status: "pending",
      };

      await axiosSecure.post("/api/users", userPayload);

      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Welcome to GOPTS! Your account has been created.",
        timer: 1600,
        showConfirmButton: false,
      });

      reset();
      navigate(location?.state || "/");
    } catch (error) {
      console.error("Registration Error:", error);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.response?.data?.message || error.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 py-10">
      <PageTitle title="Register" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-base-100 shadow-xl rounded-2xl p-8 border border-base-200">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-base-content">
              Create Account
            </h1>
            <p className="text-base-content/60 mt-2">
              Register to get started with GOPTS!
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Profile Image Upload */}
            <div className="flex justify-center mb-2">
              <label className="cursor-pointer group relative">
                <div className="relative">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-24 h-24 rounded-full object-cover border-4 border-primary/30"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-base-200 border-4 border-base-200 group-hover:border-primary/30 flex items-center justify-center transition-all">
                      <FiImage className="w-8 h-8 text-base-content/40 group-hover:text-primary transition-colors" />
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <FiUserPlus className="w-4 h-4 text-primary-content" />
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  {...register("image", { required: "Profile image is required" })}
                  onChange={(e) => {
                    register("image").onChange(e);
                    handleImageChange(e);
                  }}
                  className="hidden"
                />
              </label>
            </div>
            {errors.image && (
              <p className="text-error text-center text-sm">{errors.image.message}</p>
            )}

            {/* Name Field */}
            <div>
              <label className="block font-medium mb-2 text-base-content">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiUser className="w-5 h-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-11 ${
                    errors.name ? "input-error" : ""
                  }`}
                  placeholder="Your Full Name"
                  {...register("name", { required: "Name is required" })}
                />
              </div>
              {errors.name && (
                <p className="text-error text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block font-medium mb-2 text-base-content">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMail className="w-5 h-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-11 ${
                    errors.email ? "input-error" : ""
                  }`}
                  placeholder="you@example.com"
                  {...register("email", { required: "Email is required" })}
                />
              </div>
              {errors.email && (
                <p className="text-error text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Role Field */}
            <div>
              <label className="block font-medium mb-2 text-base-content">
                Select Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiBriefcase className="w-5 h-5 text-base-content/40" />
                </div>
                <select
                  className={`select select-bordered w-full pl-11 ${
                    errors.role ? "select-error" : ""
                  }`}
                  {...register("role", { required: "Role is required" })}
                >
                  <option value="">Choose Role</option>
                  <option value="buyer">Buyer</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              {errors.role && (
                <p className="text-error text-sm mt-1">{errors.role.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block font-medium mb-2 text-base-content">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className="w-5 h-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-11 pr-11 ${
                    errors.password ? "input-error" : ""
                  }`}
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Min 6 characters",
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])/,
                      message: "Must include uppercase & lowercase", 
                    },
                    validate: {
                        hasNumber: (value) => /\d/.test(value) || "Must include a number"
                    }
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? (
                    <FiEyeOff className="w-5 h-5 text-base-content/40 hover:text-base-content" />
                  ) : (
                    <FiEye className="w-5 h-5 text-base-content/40 hover:text-base-content" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-error text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full mt-2"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Login Link */}
            <p className="text-center text-base-content/70">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary font-medium hover:underline"
              >
                Login
              </Link>
            </p>
          </form>

          {/* Social Login */}
          <div className="mt-6">
            <SocialLogin />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
