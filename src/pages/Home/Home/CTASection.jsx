import { motion } from "framer-motion";
import { Link } from "react-router";
import { FiArrowRight } from "react-icons/fi";

const CTASection = () => {
  return (
    <section className="py-16 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-base-200 p-8 md:p-12"
      >
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
            Ready to Streamline Your Production?
          </h2>
          <p className="text-lg text-base-content/70 mb-8 max-w-2xl mx-auto">
            Join hundreds of garment businesses already using GOPTS to manage
            their orders and production efficiently.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn btn-primary btn-lg gap-2 group">
              Get Started Free
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/contact" className="btn btn-outline btn-lg">
              Contact Sales
            </Link>
          </div>

          <p className="text-sm text-base-content/50 mt-6">
            No Credit Card Required • Free Tier Available
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default CTASection;
