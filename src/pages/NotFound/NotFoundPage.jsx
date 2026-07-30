import { motion } from "framer-motion";
import { Link } from "react-router";
import { FiHome, FiArrowLeft, FiSearch } from "react-icons/fi";

import PageTitle from "../../components/ui/PageTitle";

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12">
      <PageTitle title="404 - Not Found" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center px-4"
      >
        {/* 404 Illustration */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="relative inline-block mb-8"
        >
          <span className="text-[150px] md:text-[200px] font-bold text-base-200 select-none">
            404
          </span>
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <FiSearch className="w-16 h-16 md:w-24 md:h-24 text-primary" />
          </motion.div>
        </motion.div>

        {/* Content */}
        <h1 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-base-content/60 max-w-md mx-auto mb-8">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been
          moved. Let&apos;s get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn btn-primary gap-2">
            <FiHome className="w-5 h-5" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn btn-outline gap-2"
          >
            <FiArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-base-200">
          <p className="text-sm text-base-content/50 mb-4">
            Here are some helpful links:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/all-products"
              className="text-primary hover:underline text-sm"
            >
              Browse Products
            </Link>
            <Link
              to="/track-order"
              className="text-primary hover:underline text-sm"
            >
              Track Order
            </Link>
            <Link
              to="/contact"
              className="text-primary hover:underline text-sm"
            >
              Contact Support
            </Link>
            <Link to="/about" className="text-primary hover:underline text-sm">
              About Us
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
