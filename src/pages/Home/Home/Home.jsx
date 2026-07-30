import BannerSection from "./BannerSection";
import ProductsSection from "./ProductsSection";
import FeaturesSection from "./FeaturesSection";
import HowItWorks from "./HowItWorks";
import CustomerFeedback from "./CustomerFeedback";
import StatisticsSection from "./StatisticsSection";
import FAQSection from "./FAQSection";
import NewsletterSection from "./NewsletterSection";
import PartnersSection from "./PartnersSection";
import CTASection from "./CTASection";

import PageTitle from "../../../components/ui/PageTitle";

const Home = () => {
  return (
    <div className="space-y-8 md:space-y-12">
      <PageTitle title="Home" />
      {/* 1. Hero Banner */}
      <BannerSection />

      {/* 2. Featured Products */}
      <ProductsSection />

      {/* 3. Features/Why Choose Us */}
      <FeaturesSection />

      {/* 4. How It Works */}
      <HowItWorks />

      {/* 5. Statistics/Numbers */}
      <StatisticsSection />

      {/* 6. Customer Testimonials */}
      <CustomerFeedback />

      {/* 7. Partners/Clients */}
      <PartnersSection />

      {/* 8. FAQ */}
      <FAQSection />

      {/* 9. Newsletter */}
      <NewsletterSection />

      {/* 10. Call to Action */}
      <CTASection />
    </div>
  );
};

export default Home;
