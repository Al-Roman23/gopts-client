import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiMinus } from "react-icons/fi";

const faqs = [
  {
    question: "How do I place a bulk order?",
    answer:
      "To place a bulk order, first browse our products and click 'View Details' on your chosen item. Then click the 'Order / Booking' button, fill in the required details including quantity (must meet minimum order requirement), and submit. Our team will process your order promptly.",
  },
  {
    question: "What are the payment options available?",
    answer:
      "We offer multiple payment options including Cash on Delivery (COD) and online payment through secure payment gateways. You can select your preferred payment method during the checkout process.",
  },
  {
    question: "How can I track my order?",
    answer:
      "You can track your order in two ways: 1) Log into your dashboard and navigate to 'My Orders' to see all your orders and their current status. 2) Use our 'Track Order' feature with your order ID to see real-time production updates.",
  },
  {
    question: "What is the minimum order quantity (MOQ)?",
    answer:
      "The minimum order quantity varies by product and is displayed on each product's detail page. MOQ is set to ensure cost-effective production while maintaining quality standards.",
  },
  {
    question: "How long does production take?",
    answer:
      "Production time depends on order size and complexity. Typical orders are completed within 7-14 business days. You can track each production stage (Cutting, Sewing, Finishing, QC, Packing) in real-time through your dashboard.",
  },
  {
    question: "Can I cancel or modify my order?",
    answer:
      "You can cancel orders that are still in 'Pending' status through your dashboard. Once an order moves to 'Approved' status and production begins, modifications may not be possible. Please contact support for special requests.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Got Questions?
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 text-base-content">
            Frequently Asked Questions
          </h2>
          <p className="text-base-content/60 mt-3 max-w-2xl mx-auto">
            Find answers to common questions about our platform and services.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-base-100 rounded-2xl border border-base-200 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-base-50 transition-colors"
              >
                <span className="font-semibold text-base-content pr-4">
                  {faq.question}
                </span>
                <span
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    openIndex === index
                      ? "bg-primary text-primary-content"
                      : "bg-base-200"
                  }`}
                >
                  {openIndex === index ? (
                    <FiMinus className="w-4 h-4" />
                  ) : (
                    <FiPlus className="w-4 h-4" />
                  )}
                </span>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-0">
                      <p className="text-base-content/70 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
