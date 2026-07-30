import { useMemo } from "react";
import { NavLink } from "react-router";
import { motion } from "framer-motion";
import {
  FaXTwitter,
  FaYoutube,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa6";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import Logo from "../../Logo/Logo";

const Footer = () => {
  const year = new Date().getFullYear();

  const quickLinks = useMemo(
    () => [
      { to: "/", label: "Home" },
      { to: "/all-products", label: "Products" },
      { to: "/about", label: "About Us" },
      { to: "/contact", label: "Contact" },
    ],
    [],
  );

  const serviceLinks = useMemo(
    () => [
      { to: "/track-order", label: "Track Order" },
      { to: "/all-products", label: "Browse Products" },
      { to: "/dashboard", label: "Dashboard" },
      { to: "/register", label: "Create Account" },
    ],
    [],
  );

  const socialLinks = useMemo(
    () => [
      { href: "https://twitter.com", icon: FaXTwitter, label: "X (Twitter)" },
      { href: "https://facebook.com", icon: FaFacebook, label: "Facebook" },
      { href: "https://instagram.com", icon: FaInstagram, label: "Instagram" },
      { href: "https://linkedin.com", icon: FaLinkedin, label: "LinkedIn" },
      { href: "https://youtube.com", icon: FaYoutube, label: "YouTube" },
    ],
    [],
  );

  return (
    <footer className="bg-base-200 mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Logo size="text-2xl" />
            <p className="mt-4 text-base-content/70 text-sm leading-relaxed">
              Streamline your garment production and order management with ease.
              From placing orders to tracking production stages — we ensure
              timely delivery and complete visibility.
            </p>

            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center hover:bg-primary hover:text-primary-content transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-base-content">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className="text-base-content/70 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-base-content">
              Services
            </h3>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className="text-base-content/70 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-base-content">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FiMapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-base-content/70 text-sm">
                  123 Garment District, Industrial Area,
                  <br />
                  Dhaka 1205, Bangladesh
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href="tel:+8801234567890"
                  className="text-base-content/70 hover:text-primary transition-colors text-sm"
                >
                  +880 1319694957
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href="mailto:support@gopts.com"
                  className="text-base-content/70 hover:text-primary transition-colors text-sm"
                >
                  alroman12152004@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-base-300">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-base-content/60">
            <p>© 2025–{year} GOPTS Ltd. All rights reserved.</p>
            <div className="flex gap-6">
              <NavLink
                to="/privacy"
                className="hover:text-primary transition-colors"
              >
                Privacy Policy
              </NavLink>
              <NavLink
                to="/terms"
                className="hover:text-primary transition-colors"
              >
                Terms of Service
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
