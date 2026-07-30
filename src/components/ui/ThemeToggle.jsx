import { motion } from "framer-motion";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeContext";

const ThemeToggle = ({ className = "" }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative w-14 h-7 rounded-full p-1 transition-colors duration-300 ${
        isDark ? "bg-slate-700" : "bg-amber-200"
      } ${className}`}
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Background Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-1.5">
        <FiSun
          className={`w-4 h-4 transition-opacity duration-300 ${
            isDark ? "opacity-30 text-slate-500" : "opacity-100 text-amber-600"
          }`}
        />
        <FiMoon
          className={`w-4 h-4 transition-opacity duration-300 ${
            isDark ? "opacity-100 text-blue-300" : "opacity-30 text-slate-400"
          }`}
        />
      </div>

      {/* Toggle Circle */}
      <motion.div
        className={`w-5 h-5 rounded-full shadow-md flex items-center justify-center ${
          isDark ? "bg-slate-800" : "bg-white"
        }`}
        initial={false}
        animate={{
          x: isDark ? 28 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      >
        {isDark ? (
          <FiMoon className="w-3 h-3 text-blue-300" />
        ) : (
          <FiSun className="w-3 h-3 text-amber-500" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
