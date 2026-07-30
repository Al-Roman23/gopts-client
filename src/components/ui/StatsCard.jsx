import { motion } from "framer-motion";

const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = "primary",
  className = "",
}) => {
  const colorClasses = {
    primary: "from-primary/20 to-primary/5 text-primary",
    secondary: "from-secondary/20 to-secondary/5 text-secondary",
    accent: "from-accent/20 to-accent/5 text-accent",
    success: "from-success/20 to-success/5 text-success",
    warning: "from-warning/20 to-warning/5 text-warning",
    error: "from-error/20 to-error/5 text-error",
    info: "from-info/20 to-info/5 text-info",
  };

  const iconBgClasses = {
    primary: "bg-primary/10",
    secondary: "bg-secondary/10",
    accent: "bg-accent/10",
    success: "bg-success/10",
    warning: "bg-warning/10",
    error: "bg-error/10",
    info: "bg-info/10",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`bg-gradient-to-br ${colorClasses[color]} rounded-2xl p-6 shadow-md card-hover ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-base-content/70 mb-1">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-base-content">{value}</h3>

          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={`text-sm font-medium ${
                  trend === "up" ? "text-success" : "text-error"
                }`}
              >
                {trend === "up" ? "↑" : "↓"} {trendValue}
              </span>
              <span className="text-xs text-base-content/50">
                vs last month
              </span>
            </div>
          )}
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl ${iconBgClasses[color]}`}>
            <Icon className={`w-6 h-6 ${colorClasses[color].split(" ")[2]}`} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatsCard;
