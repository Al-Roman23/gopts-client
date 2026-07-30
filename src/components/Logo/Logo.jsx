import React from "react";
import { Link } from "react-router";

const Logo = ({ size = "text-2xl", showText = true }) => {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className="relative">
        {/* SVG Logo Icon */}
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10 transition-transform duration-300 group-hover:scale-110"
        >
          <rect width="40" height="40" rx="10" fill="#1E293B" />
          <path
            d="M20 10C14.4772 10 10 14.4772 10 20C10 25.5228 14.4772 30 20 30C23.125 30 25.875 28.5 27.75 26.25"
            stroke="#10B981"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M30 20H20V25"
            stroke="#10B981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="20" cy="20" r="2.5" fill="#10B981" />
        </svg>
        {/* Subtle decorative element */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-base-100 animate-pulse" />
      </div>

      {showText && (
        <span className={`${size} font-black tracking-tighter text-base-content`}>
          GOP
          <span className="text-primary">TS</span>
        </span>
      )}
    </Link>
  );
};

export default Logo;
