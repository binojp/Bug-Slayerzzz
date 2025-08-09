import { NavLink } from "react-router-dom";
import { useState } from "react";

// The navigation links and auth buttons are now separated into sub-components for clarity.
const navLinks = [
  { href: "/heatmap", label: "Heatmap" },
  { href: "/uploadimg", label: "Report" },
  { href: "/leaderboard", label: "Leaderboard" },
];

// Helper component for the desktop navigation and auth buttons
const DesktopNav = () => (
  <div className="hidden md:flex items-center space-x-6">
    {/* Desktop navigation links */}
    <nav className="flex items-center space-x-6">
      {navLinks.map(({ href, label }) => (
        <NavLink
          key={href}
          to={href}
          className={({ isActive }) =>
            isActive
              ? "text-green-700 font-semibold"
              : "text-green-600 hover:text-green-800 transition-colors"
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
    {/* Desktop auth buttons */}
    <div className="flex items-center space-x-3">
      <NavLink
        to="/login"
        className="px-4 py-2 border border-green-500 text-green-600 rounded hover:bg-green-50 transition"
      >
        Log In
      </NavLink>
      <NavLink
        to="/register"
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
      >
        Sign Up
      </NavLink>
    </div>
  </div>
);

// Helper component for the mobile navigation links and buttons
const MobileNav = ({ navLinks, mobileOpen, setMobileOpen }) => (
  <div
    className={`md:hidden bg-white border-t border-green-200 ${
      mobileOpen ? "" : "hidden"
    }`}
  >
    <nav className="flex flex-col space-y-2 p-4">
      {/* Mobile navigation links with padding and rounded corners */}
      {navLinks.map(({ href, label }) => (
        <NavLink
          key={href}
          to={href}
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            `px-4 py-2 rounded-md transition-colors ${
              isActive
                ? "bg-green-100 text-green-700 font-semibold"
                : "text-green-600 hover:bg-green-50 hover:text-green-800"
            }`
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
    {/* Mobile auth buttons, visually separated by a border and extra padding */}
    <div className="flex flex-col space-y-2 p-4 border-t border-green-200">
      <NavLink
        to="/login"
        onClick={() => setMobileOpen(false)}
        className="px-4 py-2 text-center border border-green-500 text-green-600 rounded-md hover:bg-green-50 transition"
      >
        Log In
      </NavLink>
      <NavLink
        to="/register"
        onClick={() => setMobileOpen(false)}
        className="px-4 py-2 text-center bg-green-500 text-white rounded-md hover:bg-green-600 transition"
      >
        Sign Up
      </NavLink>
    </div>
  </div>
);

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-white border-b border-green-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-green-700">
                CleanSweep
              </span>
            </NavLink>
          </div>

          {/* Desktop Nav and Auth buttons are now in a separate component */}
          <DesktopNav />

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-md text-green-700 hover:bg-green-100 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* The mobile menu is also a separate component now */}
      <MobileNav
        navLinks={navLinks}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
    </header>
  );
}
