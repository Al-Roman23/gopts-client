import { motion } from "framer-motion";

// Partner/Client Logos - Using Placeholder Brand Names
const partners = [
  { name: "FashionHub", logo: "FH" },
  { name: "TextilePro", logo: "TP" },
  { name: "GarmentCo", logo: "GC" },
  { name: "StyleWorks", logo: "SW" },
  { name: "ApparelMax", logo: "AM" },
  { name: "WearCraft", logo: "WC" },
  { name: "ThreadMaster", logo: "TM" },
  { name: "FabricFirst", logo: "FF" },
];

const PartnersSection = () => {
  return (
    <section className="py-16 md:py-20 bg-base-200/50 rounded-3xl">
      <div className="px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Our Partners
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 text-base-content">
            Trusted by Industry Leaders
          </h2>
          <p className="text-base-content/60 mt-3 max-w-2xl mx-auto">
            We&apos;re proud to work with some of the biggest names in the
            garment industry.
          </p>
        </motion.div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="group bg-base-100 rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center border border-base-200 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              {/* Logo Placeholder */}
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-3 group-hover:from-primary/20 group-hover:to-accent/20 transition-all">
                <span className="text-2xl md:text-3xl font-bold text-primary">
                  {partner.logo}
                </span>
              </div>
              <span className="text-sm md:text-base font-medium text-base-content/70 group-hover:text-base-content transition-colors">
                {partner.name}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4 md:gap-8 mt-12 pt-8 border-t border-base-300"
        >
          {[
            { value: "500+", label: "Partner Companies" },
            { value: "10+", label: "Years Experience" },
            { value: "50+", label: "Countries Served" },
          ].map((stat, index) => (
            <div key={index} className="text-center px-4">
              <p className="text-2xl md:text-3xl font-bold text-primary">
                {stat.value}
              </p>
              <p className="text-sm text-base-content/60">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PartnersSection;
