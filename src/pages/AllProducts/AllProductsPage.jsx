import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { FiGrid, FiList, FiFilter } from "react-icons/fi";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import SearchBar from "../../components/ui/SearchBar";
import FilterDropdown from "../../components/ui/FilterDropdown";
import Pagination from "../../components/ui/Pagination";
import { SkeletonCardGrid } from "../../components/ui/SkeletonCard";

const ITEMS_PER_PAGE = 12;

const categoryOptions = [
  { value: "", label: "All Categories" },
  { value: "shirt", label: "Shirt" },
  { value: "pant", label: "Pant" },
  { value: "jacket", label: "Jacket" },
  { value: "accessories", label: "Accessories" },
  { value: "clothing", label: "Clothing" },
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
];

const priceRangeOptions = [
  { value: "", label: "All Prices" },
  { value: "0-1000", label: "Under ৳1,000" },
  { value: "1000-5000", label: "৳1,000 - ৳5,000" },
  { value: "5000-10000", label: "৳5,000 - ৳10,000" },
  { value: "10000+", label: "Above ৳10,000" },
];

import PageTitle from "../../components/ui/PageTitle";

const AllProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axiosSecure.get("/api/products");
        setProducts(
          Array.isArray(res.data) ? res.data : res.data.products || [],
        );
      } catch (err) {
        console.error(err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [axiosSecure]);

  // Filter And Sort Products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query),
      );
    }

    // Category Filter
    if (category) {
      result = result.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase(),
      );
    }

    // Price Range Filter
    if (priceRange) {
      result = result.filter((p) => {
        const price = p.price || 0;
        switch (priceRange) {
          case "0-1000":
            return price < 1000;
          case "1000-5000":
            return price >= 1000 && price < 5000;
          case "5000-10000":
            return price >= 5000 && price < 10000;
          case "10000+":
            return price >= 10000;
          default:
            return true;
        }
      });
    }

    // Sorting
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "price-low":
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "name-asc":
        result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "name-desc":
        result.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
        break;
    }

    return result;
  }, [products, searchQuery, category, priceRange, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Reset Page When Filters Change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, category, priceRange, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setCategory("");
    setPriceRange("");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || category || priceRange;

  if (error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-error mb-2">Oops!</h2>
          <p className="text-base-content/60">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary mt-4"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <PageTitle title="All Products" />
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-base-content">
          All Products
        </h1>
        <p className="text-base-content/60 mt-2">
          Browse our collection of premium garments!
        </p>
      </div>

      {/* Toolbar */}
      <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <SearchBar
              placeholder="Search products..."
              onSearch={setSearchQuery}
              className="w-full"
            />
          </div>

          {/* Desktop Filters */}
          <div className="hidden lg:flex items-center gap-3">
            <FilterDropdown
              label="Category"
              options={categoryOptions}
              value={category}
              onChange={setCategory}
            />
            <FilterDropdown
              label="Price"
              options={priceRangeOptions}
              value={priceRange}
              onChange={setPriceRange}
            />
            <FilterDropdown
              label="Sort By"
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
            />

            {/* View Toggle */}
            <div className="btn-group">
              <button
                onClick={() => setViewMode("grid")}
                className={`btn btn-sm ${
                  viewMode === "grid" ? "btn-primary" : "btn-ghost"
                }`}
              >
                <FiGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`btn btn-sm ${
                  viewMode === "list" ? "btn-primary" : "btn-ghost"
                }`}
              >
                <FiList className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden btn btn-outline gap-2"
          >
            <FiFilter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="lg:hidden grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-base-200">
            <FilterDropdown
              label="Category"
              options={categoryOptions}
              value={category}
              onChange={setCategory}
              className="w-full"
            />
            <FilterDropdown
              label="Price"
              options={priceRangeOptions}
              value={priceRange}
              onChange={setPriceRange}
              className="w-full"
            />
            <FilterDropdown
              label="Sort By"
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
              className="col-span-2"
            />
          </div>
        )}

        {/* Active Filters & Results Count */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-4 border-t border-base-200">
          <p className="text-sm text-base-content/60">
            Showing {paginatedProducts.length} of {filteredProducts.length}{" "}
            products
          </p>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-primary hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && <SkeletonCardGrid count={12} columns="lg:grid-cols-4" />}

      {/* Empty State */}
      {!loading && filteredProducts.length === 0 && (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-base-200 flex items-center justify-center">
              <FiFilter className="w-12 h-12 text-base-content/30" />
            </div>
            <h3 className="text-xl font-semibold text-base-content mb-2">
              No Products Found
            </h3>
            <p className="text-base-content/60 mb-4">
              Try adjusting your filters or search query
            </p>
            <button onClick={clearFilters} className="btn btn-primary btn-sm">
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {!loading && paginatedProducts.length > 0 && (
        <div
          className={
            viewMode === "grid"
              ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
              : "space-y-4"
          }
        >
          {paginatedProducts.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: viewMode === "grid" ? -5 : 0 }}
              className={`group bg-base-100 rounded-2xl shadow-sm border border-base-200 overflow-hidden hover:shadow-lg transition-all ${
                viewMode === "list" ? "flex" : ""
              }`}
            >
              {/* Image */}
              <div
                className={`relative overflow-hidden bg-base-200 ${
                  viewMode === "list" ? "w-40 h-40 flex-shrink-0" : "h-52"
                }`}
              >
                <img
                  src={product.images?.[0] || "/placeholder.png"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2 py-1 bg-base-100/90 backdrop-blur-sm text-xs font-medium rounded-full">
                  {product.category}
                </span>
              </div>

              {/* Content */}
              <div
                className={`p-4 ${
                  viewMode === "list" ? "flex-1 flex flex-col" : ""
                }`}
              >
                <h3 className="font-semibold text-base-content line-clamp-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>

                {viewMode === "list" && (
                  <p className="text-sm text-base-content/60 mt-1 line-clamp-2">
                    {product.description}
                  </p>
                )}

                <div
                  className={`flex items-center justify-between ${
                    viewMode === "list" ? "mt-auto pt-3" : "mt-3"
                  }`}
                >
                  <div>
                    <span className="text-lg font-bold text-primary">
                      ৳{product.price?.toLocaleString()}
                    </span>
                    <span className="text-xs text-base-content/50 block">
                      {product.quantity} in stock
                    </span>
                  </div>
                  <button
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="btn btn-primary btn-sm"
                  >
                    Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default AllProductsPage;
