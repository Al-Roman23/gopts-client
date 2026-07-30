import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff, FiMail, FiLock, FiZap } from "react-icons/fi";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import SocialLogin from "../SocialLogin/SocialLogin";

// Demo Credentials For Testing
const DEMO_CREDENTIALS = {
  email: "mizukiokada@gmail.com",
  password: "A12345a@",
};

const DEMO_CREDENTIALS2 = {
  email: "alroman@gmail.com",
  password: "A12345a@",
};

const DEMO_CREDENTIALS3 = {
  email: "mizukiokada1@gmail.com",
  password: "A12345a@",
};

import PageTitle from "../../../components/ui/PageTitle";

const Login = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const { signInUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const fillDemoCredentials = () => {
    setValue("email", DEMO_CREDENTIALS.email);
    setValue("password", DEMO_CREDENTIALS.password);
  };

  const fillDemoCredentials2 = () => {
    setValue("email", DEMO_CREDENTIALS2.email);
    setValue("password", DEMO_CREDENTIALS2.password);
  };

  const fillDemoCredentials3 = () => {
    setValue("email", DEMO_CREDENTIALS3.email);
    setValue("password", DEMO_CREDENTIALS3.password);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const userCredential = await signInUser(data.email, data.password);
      const user = userCredential.user;

      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: `Welcome Back ${user.displayName || user.email}`,
        timer: 1500,
        showConfirmButton: false,
      });

      navigate(location?.state?.from || "/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed!",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 py-10">
      <PageTitle title="Login" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-base-100 shadow-xl rounded-2xl p-8 border border-base-200">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-base-content">
              Welcome Back
            </h1>
            <p className="text-base-content/60 mt-2">
              Sign in to access your account!
            </p>
          </div>

          {/* Demo Login Button */}
          <motion.button
            type="button"
            onClick={fillDemoCredentials}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mb-6 py-3 px-4 rounded-xl bg-gradient-to-r from-accent/20 to-primary/20 border border-accent/30 flex items-center justify-center gap-2 hover:from-accent/30 hover:to-primary/30 transition-all"
          >
            <FiZap className="w-5 h-5 text-accent" />
            <span className="font-medium text-base-content">
              Fill Credentials Admin
            </span>
          </motion.button>

          <motion.button
            type="button"
            onClick={fillDemoCredentials2}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mb-6 py-3 px-4 rounded-xl bg-gradient-to-r from-accent/20 to-primary/20 border border-accent/30 flex items-center justify-center gap-2 hover:from-accent/30 hover:to-primary/30 transition-all"
          >
            <FiZap className="w-5 h-5 text-accent" />
            <span className="font-medium text-base-content">
              Fill Credentials Manager
            </span>
          </motion.button>

          <motion.button
            type="button"
            onClick={fillDemoCredentials3}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mb-6 py-3 px-4 rounded-xl bg-gradient-to-r from-accent/20 to-primary/20 border border-accent/30 flex items-center justify-center gap-2 hover:from-accent/30 hover:to-primary/30 transition-all"
          >
            <FiZap className="w-5 h-5 text-accent" />
            <span className="font-medium text-base-content">
              Fill Credentials Buyer
            </span>
          </motion.button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-base-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-base-100 px-4 text-base-content/50">
                or sign in with email
              </span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                  placeholder="Enter Your Email"
                  {...register("email", { required: "Email is required" })}
                />
              </div>
              {errors.email && (
                <p className="text-error text-sm mt-1">
                  {errors.email.message}
                </p>
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
                  placeholder="Enter Your Password"
                  {...register("password", {
                    required: "Password is required",
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
              className="btn btn-primary w-full"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Sign In"
              )}
            </button>

            {/* Register Link */}
            <p className="text-center text-base-content/70">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="text-primary font-medium hover:underline"
              >
                Register
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

export default Login;
