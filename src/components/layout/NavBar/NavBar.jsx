import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiGrid,
  FiChevronDown,
} from "react-icons/fi";
import Logo from "../../Logo/Logo";
import ThemeToggle from "../../ui/ThemeToggle";
import useAuth from "../../../hooks/useAuth";
import userIcon from "../../../assets/user.png";

const NavBar = () => {
  const { user, logOut } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Handle Scroll For Sticky Navbar Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close Dropdowns On Location Change
  useEffect(() => {
    setIsMobileOpen(false);
    setIsProfileOpen(false);
  }, [location]);

  // Close Profile Dropdown On Outside Click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const links = useMemo(() => {
    const baseLinks = [
      { to: "/", label: "Home" },
      { to: "/all-products", label: "Products" },
      { to: "/track-order", label: "Track Order" },
    ];

    if (user) {
      baseLinks.push({ to: "/dashboard", label: "Dashboard" });
    } else {
      baseLinks.push(
        { to: "/about", label: "About" },
        { to: "/contact", label: "Contact" },
      );
    }

    return baseLinks;
  }, [user]);

  const handleLogOut = async () => {
    try {
      await logOut();
      setIsProfileOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const NavLinkItem = ({ to, label, mobile = false }) => (
    <NavLink
      to={to}
      onClick={() => mobile && setIsMobileOpen(false)}
      className={({ isActive }) =>
        `relative px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          isActive
            ? "text-primary"
            : "text-base-content/70 hover:text-base-content hover:bg-base-200"
        } ${mobile ? "block w-full text-left" : ""}`
      }
    >
      {({ isActive }) => (
        <>
          {label}
          {isActive && !mobile && (
            <motion.div
              layoutId="navbar-indicator"
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
            />
          )}
        </>
      )}
    </NavLink>
  );

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-base-100/80 backdrop-blur-lg shadow-lg"
          : "bg-base-100 shadow-sm"
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Logo size="text-xl" />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map((link) => (
              <NavLinkItem key={link.to} to={link.to} label={link.label} />
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {user ? (
              /* Profile Dropdown */
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-base-200 transition-colors"
                >
                  <img
                    src={user.photoURL || userIcon}
                    alt={user.name || user.email}
                    className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
                  />
                  <FiChevronDown
                    className={`w-4 h-4 hidden sm:block transition-transform duration-200 ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-base-100 rounded-xl shadow-xl border border-base-200 overflow-hidden z-50"
                    >
                      {/* User Info */}
                      <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-base-200">
                        <p className="font-semibold text-base-content truncate">
                          {user.name || "User"}
                        </p>
                        <p className="text-sm text-base-content/60 truncate">
                          {user.email}
                        </p>
                        <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary rounded-full capitalize">
                          {user.role}
                        </span>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        <NavLink
                          to="/dashboard/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-base-200 transition-colors"
                        >
                          <FiUser className="w-4 h-4" />
                          <span>My Profile</span>
                        </NavLink>
                        <NavLink
                          to="/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-base-200 transition-colors"
                        >
                          <FiGrid className="w-4 h-4" />
                          <span>Dashboard</span>
                        </NavLink>
                        <hr className="my-2 border-base-200" />
                        <button
                          onClick={handleLogOut}
                          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-error hover:bg-error/10 transition-colors"
                        >
                          <FiLogOut className="w-4 h-4" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Auth Buttons */
              <div className="hidden sm:flex items-center gap-2">
                <NavLink to="/login" className="btn btn-ghost btn-sm">
                  Login
                </NavLink>
                <NavLink to="/register" className="btn btn-primary btn-sm">
                  Register
                </NavLink>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden btn btn-ghost btn-sm btn-square"
              aria-label="Toggle menu"
            >
              {isMobileOpen ? (
                <FiX className="w-5 h-5" />
              ) : (
                <FiMenu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden border-t border-base-200"
            >
              <div className="py-4 space-y-1">
                {links.map((link) => (
                  <NavLinkItem
                    key={link.to}
                    to={link.to}
                    label={link.label}
                    mobile
                  />
                ))}

                {!user && (
                  <div className="pt-4 flex gap-2">
                    <NavLink
                      to="/login"
                      onClick={() => setIsMobileOpen(false)}
                      className="btn btn-outline btn-sm flex-1"
                    >
                      Login
                    </NavLink>
                    <NavLink
                      to="/register"
                      onClick={() => setIsMobileOpen(false)}
                      className="btn btn-primary btn-sm flex-1"
                    >
                      Register
                    </NavLink>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default NavBar;
