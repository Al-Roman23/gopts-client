import { motion } from "framer-motion";

const SkeletonCard = ({ className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`bg-base-200 rounded-2xl overflow-hidden shadow-md ${className}`}
    >
      {/* Image Placeholder */}
      <div className="relative h-48 bg-base-300 skeleton-pulse">
        <div className="absolute inset-0 skeleton-shimmer" />
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Title */}
        <div className="h-6 bg-base-300 rounded-lg w-3/4 skeleton-pulse">
          <div className="h-full skeleton-shimmer rounded-lg" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-base-300 rounded w-full skeleton-pulse">
            <div className="h-full skeleton-shimmer rounded" />
          </div>
          <div className="h-4 bg-base-300 rounded w-5/6 skeleton-pulse">
            <div className="h-full skeleton-shimmer rounded" />
          </div>
        </div>

        {/* Price and Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="h-6 bg-base-300 rounded w-20 skeleton-pulse">
            <div className="h-full skeleton-shimmer rounded" />
          </div>
          <div className="h-8 bg-base-300 rounded-lg w-24 skeleton-pulse">
            <div className="h-full skeleton-shimmer rounded-lg" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Grid Of Skeleton Cards
export const SkeletonCardGrid = ({ count = 6, columns = "lg:grid-cols-3" }) => {
  return (
    <div className={`grid gap-6 sm:grid-cols-2 ${columns}`}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

export default SkeletonCard;
