import { useState } from "react";
import { motion } from "framer-motion";
import { FiSend, FiMail, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsSubmitting(true);

    // Simulate API Call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubscribed(true);
    setEmail("");
    toast.success("Successfully subscribed to newsletter!");

    // Reset After 3 Seconds
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <section className="py-16 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-accent/80 px-6 py-12 md:px-12 md:py-16"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <pattern
              id="newsletter-pattern"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" fill="currentColor" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#newsletter-pattern)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-6"
          >
            <FiMail className="w-8 h-8 text-white" />
          </motion.div>

          {/* Content */}
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
            Stay Updated with Latest Products
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Subscribe to our newsletter and be the first to know about new
            arrivals, exclusive offers, and industry insights.
          </p>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <div className="relative flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-5 py-3 rounded-xl bg-white/95 text-base-content placeholder:text-base-content/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                disabled={isSubmitting || isSubscribed}
              />
            </div>
            <motion.button
              type="submit"
              disabled={isSubmitting || isSubscribed}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                isSubscribed
                  ? "bg-success text-white"
                  : "bg-secondary text-white hover:bg-secondary/90"
              }`}
            >
              {isSubmitting ? (
                <span className="loading loading-spinner loading-sm" />
              ) : isSubscribed ? (
                <>
                  <FiCheck className="w-5 h-5" />
                  Subscribed!
                </>
              ) : (
                <>
                  Subscribe
                  <FiSend className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Privacy Note */}
          <p className="text-white/60 text-sm mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default NewsletterSection;
