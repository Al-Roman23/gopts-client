import { useState, useCallback } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import debounce from "lodash/debounce";

const SearchBar = ({
  placeholder = "Search...",
  onSearch,
  debounceMs = 300,
  className = "",
}) => {
  const [value, setValue] = useState("");

  // Debounced Search Handler
  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      onSearch?.(searchValue);
    }, debounceMs),
    [onSearch, debounceMs],
  );

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedSearch(newValue);
  };

  const handleClear = () => {
    setValue("");
    onSearch?.("");
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FiSearch className="w-5 h-5 text-base-content/50" />
      </div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="input input-bordered w-full pl-10 pr-10 bg-base-100 focus:border-primary"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-error transition-colors"
          aria-label="Clear search"
        >
          <FiX className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
