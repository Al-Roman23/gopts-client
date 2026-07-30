import { motion } from "framer-motion";
import { Link } from "react-router";
import { FiUsers, FiTarget, FiAward, FiHeart } from "react-icons/fi";

const values = [
  {
    icon: FiTarget,
    title: "Quality First",
    description:
      "We never compromise on the quality of our products and services.",
  },
  {
    icon: FiUsers,
    title: "Customer Focus",
    description:
      "Your success is our success. We're dedicated to helping you grow.",
  },
  {
    icon: FiAward,
    title: "Excellence",
    description:
      "We strive for excellence in everything we do, every single day.",
  },
  {
    icon: FiHeart,
    title: "Integrity",
    description:
      "Honest, transparent, and ethical business practices guide us.",
  },
];

const team = [
  { name: "Mizuki Okada", role: "Founder & CEO", initials: "MO" },
  { name: "Purnota Molla", role: "Operations Director", initials: "PM" },
  { name: "Al-Roman", role: "Head of Technology", initials: "AR" },
  { name: "Kaniz Fatima", role: "Customer Success Lead", initials: "KF" },
];

import PageTitle from "../../components/ui/PageTitle";

const AboutPage = () => {
  return (
    <div className="py-8">
      <PageTitle title="About Us" />
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-16 px-4 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 mb-12"
      >
        <span className="text-primary font-semibold text-sm uppercase tracking-wider">
          About Us
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-base-content mt-3 mb-4">
          We&apos;re on a Mission to Transform{" "}
          <span className="text-primary">Garment Production</span>
        </h1>
        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
          GOPTS was founded in 2020 with a simple goal: make garment production
          management accessible, efficient, and transparent for businesses of
          all sizes.
        </p>
      </motion.section>

      {/* Our Story */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid md:grid-cols-2 gap-12 items-center mb-20"
      >
        <div>
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Our Story
          </span>
          <h2 className="text-3xl font-bold text-base-content mt-2 mb-4">
            From Small Idea to Industry Solution
          </h2>
          <p className="text-base-content/70 mb-4 leading-relaxed">
            It all started in a small garment factory in Dhaka, where our
            founders witnessed firsthand the chaos of managing orders through
            spreadsheets and phone calls. They knew there had to be a better
            way.
          </p>
          <p className="text-base-content/70 mb-6 leading-relaxed">
            Today, GOPTS serves over 500 businesses across 50+ countries,
            helping them track orders, manage production, and deliver on time.
            Our platform has processed over 10,000 orders and continues to grow
            every day.
          </p>
          <Link to="/contact" className="btn btn-primary">
            Get in Touch
          </Link>
        </div>
        <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl h-80 flex items-center justify-center">
          <span className="text-6xl font-bold text-primary/30">GOPTS</span>
        </div>
      </motion.section>

      {/* Our Values */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Our Values
          </span>
          <h2 className="text-3xl font-bold text-base-content mt-2">
            What Drives Us Forward
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-base-100 rounded-2xl p-6 border border-base-200 text-center"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <value.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-base-content mb-2">
                {value.title}
              </h3>
              <p className="text-sm text-base-content/60">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Our Team
          </span>
          <h2 className="text-3xl font-bold text-base-content mt-2">
            Meet the People Behind GOPTS
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">
                  {member.initials}
                </span>
              </div>
              <h3 className="font-semibold text-base-content">{member.name}</h3>
              <p className="text-sm text-base-content/60">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-secondary rounded-3xl p-8 md:p-12 text-center"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Ready to Work With Us?
        </h2>
        <p className="text-white/70 mb-6 max-w-xl mx-auto">
          Join hundreds of satisfied businesses already using GOPTS.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="btn btn-primary">
            Get Started
          </Link>
          <Link
            to="/contact"
            className="btn btn-outline border-white/30 text-white hover:bg-white/10"
          >
            Contact Sales
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutPage;
