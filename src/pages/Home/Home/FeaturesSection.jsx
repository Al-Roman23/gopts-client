import { motion } from "framer-motion";
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiShield,
  FiClock,
  FiHeadphones,
} from "react-icons/fi";

const features = [
  {
    icon: FiPackage,
    title: "Order Management",
    description:
      "Track orders from placement to delivery with real-time updates and notifications.",
    color: "primary",
  },
  {
    icon: FiTruck,
    title: "Production Tracking",
    description:
      "Monitor every stage from cutting to finishing with detailed progress tracking.",
    color: "secondary",
  },
  {
    icon: FiCheckCircle,
    title: "Quality Control",
    description:
      "Ensure product quality with built-in QC checkpoints throughout production.",
    color: "accent",
  },
  {
    icon: FiShield,
    title: "Secure Payments",
    description:
      "Multiple payment options with secure transaction processing and verification.",
    color: "success",
  },
  {
    icon: FiClock,
    title: "On-Time Delivery",
    description:
      "Meet deadlines consistently with automated scheduling and alerts.",
    color: "warning",
  },
  {
    icon: FiHeadphones,
    title: "24/7 Support",
    description:
      "Get assistance anytime with our dedicated customer support team.",
    color: "info",
  },
];

const FeaturesSection = () => {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    accent: "bg-accent/10 text-accent",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    info: "bg-info/10 text-info",
  };

  return (
    <section className="py-16 md:py-20 bg-base-200/50 rounded-3xl">
      <div className="px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 text-base-content">
            Powerful Features for Your Business
          </h2>
          <p className="text-base-content/60 mt-3 max-w-2xl mx-auto">
            Everything you need to manage your garment production efficiently
            and effectively.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-base-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-base-200"
            >
              <div
                className={`w-14 h-14 rounded-xl ${
                  colorClasses[feature.color]
                } flex items-center justify-center mb-4`}
              >
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-2">
                {feature.title}
              </h3>
              <p className="text-base-content/60 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
