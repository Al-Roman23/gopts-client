// Home Products Section
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { SkeletonCardGrid } from "../../../components/ui/SkeletonCard";

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const fetchHomeProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axiosSecure.get("/api/products/home");
      setProducts(data.slice(0, 8));
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeProducts();
  }, []);

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
          Featured Collection
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mt-2 text-base-content">
          Our Products
        </h2>
        <p className="text-base-content/60 mt-3 max-w-2xl mx-auto">
          Discover our premium garment selection, crafted with quality materials
          and attention to detail.
        </p>
      </motion.div>

      {/* Loading State with Skeleton */}
      {loading && <SkeletonCardGrid count={8} columns="lg:grid-cols-4" />}

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-base-200 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-base-content/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-base-content mb-2">
            No Products Yet
          </h3>
          <p className="text-base-content/60">
            Check back soon for our latest collection.
          </p>
        </div>
      )}

      {/* Products Grid */}
      {!loading && products.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group bg-base-100 rounded-2xl shadow-md overflow-hidden border border-base-200 hover:shadow-xl transition-shadow duration-300"
            >
              {/* Image Container */}
              <div className="relative h-52 overflow-hidden bg-base-200">
                <img
                  src={product.images?.[0] || "/placeholder.png"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Category Badge */}
                <span className="absolute top-3 left-3 px-3 py-1 bg-base-100/90 backdrop-blur-sm text-xs font-medium rounded-full">
                  {product.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-semibold text-lg text-base-content line-clamp-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>

                <p className="text-sm text-base-content/60 mt-2 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-base-200">
                  <div>
                    <span className="text-2xl font-bold text-primary">
                      ৳{product.price?.toLocaleString()}
                    </span>
                    <span className="text-xs text-base-content/50 block">
                      MOQ: {product.moq} pcs
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

      {/* View All Button */}
      {!loading && products.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <button
            onClick={() => navigate("/all-products")}
            className="btn btn-outline btn-primary"
          >
            View All Products
          </button>
        </motion.div>
      )}
    </section>
  );
};

export default ProductsSection;
