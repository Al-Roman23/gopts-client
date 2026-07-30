import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import NavBar from "../components/layout/NavBar/NavBar";
import Footer from "../components/layout/Footer/Footer";

const RootLayout = () => {
  const location = useLocation();
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll Progress Indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll To Top On Route Change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary z-[60]"
        style={{ width: `${scrollProgress}%` }}
      />

      <header>
        <NavBar />
      </header>

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 md:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default RootLayout;
