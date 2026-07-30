import { motion } from "framer-motion";
import { FiClipboard, FiCheckCircle, FiTruck, FiPackage } from "react-icons/fi";

const steps = [
  {
    icon: FiClipboard,
    title: "Place Order",
    description:
      "Browse products, select quantities, and submit your order with payment details.",
    step: "01",
  },
  {
    icon: FiCheckCircle,
    title: "Order Approved",
    description:
      "Our team reviews and approves your order, then production begins.",
    step: "02",
  },
  {
    icon: FiPackage,
    title: "Production",
    description:
      "Track cutting, sewing, finishing, and QC stages in real-time.",
    step: "03",
  },
  {
    icon: FiTruck,
    title: "Delivery",
    description:
      "Receive your order on time with complete tracking visibility.",
    step: "04",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 md:py-20">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <span className="text-primary font-semibold text-sm uppercase tracking-wider">
          Simple Process
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mt-2 text-base-content">
          How It Works
        </h2>
        <p className="text-base-content/60 mt-3 max-w-2xl mx-auto">
          From order to delivery in four simple steps!
        </p>
      </motion.div>

      {/* Steps */}
      <div className="relative grid gap-8 md:grid-cols-4">
        {/* Connecting Line - Desktop */}
        <div className="hidden md:block absolute top-16 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary via-accent to-secondary" />

        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="relative text-center"
          >
            {/* Step Number Badge */}
            <div className="relative inline-block mb-4">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-content text-sm font-bold flex items-center justify-center shadow-lg">
                {step.step}
              </span>
            </div>

            <h3 className="text-xl font-semibold text-base-content mb-2">
              {step.title}
            </h3>
            <p className="text-base-content/60 text-sm leading-relaxed max-w-xs mx-auto">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
