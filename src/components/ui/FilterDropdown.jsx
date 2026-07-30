import { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiCheck } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const FilterDropdown = ({
  label = "Filter",
  options = [],
  value,
  onChange,
  multiple = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close Dropdown When Clicking Outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    if (multiple) {
      const currentValue = Array.isArray(value) ? value : [];
      const newValue = currentValue.includes(option.value)
        ? currentValue.filter((v) => v !== option.value)
        : [...currentValue, option.value];
      onChange?.(newValue);
    } else {
      onChange?.(option.value);
      setIsOpen(false);
    }
  };

  const getDisplayValue = () => {
    if (multiple) {
      const selectedCount = Array.isArray(value) ? value.length : 0;
      if (selectedCount === 0) return label;
      if (selectedCount === 1) {
        const selected = options.find((o) => o.value === value[0]);
        return selected?.label || label;
      }
      return `${selectedCount} selected`;
    }
    const selected = options.find((o) => o.value === value);
    return selected?.label || label;
  };

  const isSelected = (optionValue) => {
    if (multiple) {
      return Array.isArray(value) && value.includes(optionValue);
    }
    return value === optionValue;
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-outline gap-2 min-w-[140px] justify-between"
      >
        <span className="truncate">{getDisplayValue()}</span>
        <FiChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 w-full min-w-[180px] bg-base-100 border border-base-300 rounded-lg shadow-lg z-50 overflow-hidden"
          >
            <ul className="py-1 max-h-60 overflow-y-auto">
              {options.map((option) => (
                <li key={option.value}>
                  <button
                    onClick={() => handleSelect(option)}
                    className={`w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-base-200 transition-colors ${
                      isSelected(option.value)
                        ? "bg-primary/10 text-primary"
                        : ""
                    }`}
                  >
                    {multiple && (
                      <span
                        className={`w-4 h-4 border rounded flex items-center justify-center ${
                          isSelected(option.value)
                            ? "bg-primary border-primary"
                            : "border-base-300"
                        }`}
                      >
                        {isSelected(option.value) && (
                          <FiCheck className="w-3 h-3 text-primary-content" />
                        )}
                      </span>
                    )}
                    <span>{option.label}</span>
                    {!multiple && isSelected(option.value) && (
                      <FiCheck className="w-4 h-4 ml-auto text-primary" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterDropdown;
