import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { FiPackage, FiUsers, FiTruck, FiStar } from "react-icons/fi";

const stats = [
  { icon: FiPackage, value: 10000, suffix: "+", label: "Orders Delivered" },
  { icon: FiUsers, value: 500, suffix: "+", label: "Happy Clients" },
  { icon: FiTruck, value: 99, suffix: "%", label: "On-Time Delivery" },
  { icon: FiStar, value: 4.9, suffix: "/5", label: "Customer Rating" },
];

// Animated Counter Component
const AnimatedCounter = ({ value, suffix = "", duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime;
    const startValue = 0;
    const endValue = value;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      // Easing Function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + (endValue - startValue) * easeOutQuart;

      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  // Format Number Based On Type
  const displayValue = Number.isInteger(value)
    ? Math.round(count).toLocaleString()
    : count.toFixed(1);

  return (
    <span ref={ref}>
      {displayValue}
      {suffix}
    </span>
  );
};

const StatisticsSection = () => {
  return (
    <section className="py-16 md:py-20">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-secondary via-secondary/95 to-primary/30 rounded-3xl p-8 md:p-12"
      >
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 mb-4">
                <stat.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </h3>
              <p className="text-white/70 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default StatisticsSection;
