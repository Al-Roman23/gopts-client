import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiStar } from "react-icons/fi";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Procurement Manager",
    company: "FashionHub Ltd.",
    image: null,
    content:
      "GOPTS has transformed how we manage our garment orders. The real-time tracking feature alone has saved us countless hours. Highly recommended for any serious garment business.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Operations Director",
    company: "TextilePro International",
    image: null,
    content:
      "The production tracking system is incredibly detailed. We can now monitor every stage from cutting to finishing, which has improved our quality control significantly.",
    rating: 5,
  },
  {
    id: 3,
    name: "Aisha Rahman",
    role: "Business Owner",
    company: "StyleWorks Bangladesh",
    image: null,
    content:
      "As a small business owner, GOPTS gave us enterprise-level tools at an affordable price. The order management system is intuitive and the support team is excellent.",
    rating: 5,
  },
  {
    id: 4,
    name: "David Miller",
    role: "Supply Chain Manager",
    company: "ApparelMax USA",
    image: null,
    content:
      "We've been using GOPTS for over a year now. Our on-time delivery rate has improved by 40% and customer complaints have dropped significantly.",
    rating: 5,
  },
];

const CustomerFeedback = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  // Auto-Advance Carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToPrev = () => {
    setDirection(-1);
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  const currentTestimonial = testimonials[currentIndex];

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
          Testimonials
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mt-2 text-base-content">
          What Our Clients Say
        </h2>
        <p className="text-base-content/60 mt-3 max-w-2xl mx-auto">
          Hear from businesses that trust GOPTS for their production management!
        </p>
      </motion.div>

      {/* Carousel Container */}
      <div className="relative max-w-4xl mx-auto">
        {/* Navigation Buttons */}
        <button
          onClick={goToPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 btn btn-circle btn-ghost bg-base-100 shadow-md hover:bg-base-200"
          aria-label="Previous testimonial"
        >
          <FiChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 btn btn-circle btn-ghost bg-base-100 shadow-md hover:bg-base-200"
          aria-label="Next testimonial"
        >
          <FiChevronRight className="w-6 h-6" />
        </button>

        {/* Testimonial Card */}
        <div className="overflow-hidden px-4">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="bg-base-100 rounded-3xl p-8 md:p-12 shadow-lg border border-base-200"
            >
              {/* Rating */}
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(currentTestimonial.rating)].map((_, i) => (
                  <FiStar
                    key={i}
                    className="w-5 h-5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-lg md:text-xl text-center text-base-content/80 leading-relaxed mb-8">
                &ldquo;{currentTestimonial.content}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl mb-3">
                  {currentTestimonial.name.charAt(0)}
                </div>
                <h4 className="font-semibold text-base-content">
                  {currentTestimonial.name}
                </h4>
                <p className="text-sm text-base-content/60">
                  {currentTestimonial.role}, {currentTestimonial.company}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-primary"
                  : "bg-base-300 hover:bg-base-content/30"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerFeedback;
