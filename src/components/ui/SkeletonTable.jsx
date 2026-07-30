import { motion } from "framer-motion";

const SkeletonTable = ({ rows = 5, columns = 5, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`overflow-x-auto ${className}`}
    >
      <table className="table w-full">
        {/* Header */}
        <thead>
          <tr className="bg-base-200">
            {Array.from({ length: columns }).map((_, index) => (
              <th key={index} className="py-4">
                <div className="h-4 bg-base-300 rounded w-20 mx-auto skeleton-pulse">
                  <div className="h-full skeleton-shimmer rounded" />
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-b border-base-200">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="py-4">
                  <div
                    className={`h-4 bg-base-300 rounded mx-auto skeleton-pulse ${
                      colIndex === 0 ? "w-8" : "w-24"
                    }`}
                  >
                    <div className="h-full skeleton-shimmer rounded" />
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default SkeletonTable;
