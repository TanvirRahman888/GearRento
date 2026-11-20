
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "All Equipment", href: "/equipment" },
  { label: "How It Works", href: "/#how-it-works" },
];

export function Navbar() {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);

  const lastScrollY = useRef(0);

  // References for outside click detection
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // =====================================
  // Hide navbar on scroll down
  // Show navbar on scroll up
  // =====================================
  useEffect(() => {
    lastScrollY.current = window.scrollY;

    function handleScroll() {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 80 || menuOpen) {
        setShowNavbar(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      const difference = currentScrollY - lastScrollY.current;

      if (Math.abs(difference) < 8) return;

      setShowNavbar(difference < 0);

      lastScrollY.current = currentScrollY;
    }

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [menuOpen]);

  // =====================================
  // Close mobile menu on outside click
  // =====================================
  useEffect(() => {
    if (!menuOpen) return;

    function handleOutsideClick(event: PointerEvent) {
      const target = event.target as Node;

      // Don't close when clicking inside the menu
      if (menuRef.current?.contains(target)) return;

      // Let the menu button handle its own click
      if (menuButtonRef.current?.contains(target)) return;

      setMenuOpen(false);
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "pointerdown",
        handleOutsideClick
      );
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`
          fixed inset-x-3 top-2.5 z-50
          mx-auto max-w-7xl
          transform-gpu transition-transform
          duration-500 ease-out
          motion-reduce:transition-none
          sm:inset-x-6 sm:top-3
          ${
            showNavbar
              ? "translate-y-0"
              : "translate-y-[-160%]"
          }
        `}
      >
        {/* Glass Navbar */}
        <div
          className="
            overflow-hidden
            rounded-2xl
            border border-white/35
            bg-white/45
            shadow-[0_8px_30px_rgba(9,24,33,0.08)]
            backdrop-blur-2xl
            backdrop-saturate-150

            dark:border-white/10
            dark:bg-[#102733]/45
            dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)]
          "
        >
          {/* Navbar Row */}
          <div
            className="
              flex h-14 items-center
              justify-between gap-2
              px-3 sm:px-4
              lg:h-15 lg:px-5
            "
          >
            {/* Logo */}
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="flex shrink-0 items-center"
            >
              <Image
                src="/GearRentoLogo.png"
                alt="GearRento Logo"
                width={180}
                height={60}
                priority
                className="
                  h-10 w-35.5 object-contain
                  sm:w-38.75
                  lg:w-41.25
                "
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-6 lg:flex">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      text-sm font-medium
                      transition-colors duration-200
                      hover:text-primary
                      ${
                        isActive
                          ? "text-primary"
                          : "text-foreground/80"
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              <ThemeToggle />

              {/* Desktop Auth Links */}
              <div className="hidden items-center gap-3 lg:flex">
                <Link
                  href="/login"
                  className="
                    text-sm font-medium
                    transition-colors
                    hover:text-primary
                  "
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="
                    rounded-full
                    bg-cta px-4 py-2
                    text-sm font-semibold
                    text-cta-foreground
                    transition-all duration-300
                    hover:bg-cta/90
                    hover:shadow-md
                  "
                >
                  Get Started
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                ref={menuButtonRef}
                type="button"
                aria-label={
                  menuOpen ? "Close menu" : "Open menu"
                }
                aria-expanded={menuOpen}
                aria-controls="mobile-navigation"
                onClick={() => setMenuOpen(!menuOpen)}
                className="
                  flex size-10 items-center
                  justify-center rounded-full
                  border border-border/50
                  bg-background/30
                  transition-colors
                  hover:bg-accent/60
                  lg:hidden
                "
              >
                {menuOpen ? (
                  <X size={20} />
                ) : (
                  <Menu size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div
            ref={menuRef}
            id="mobile-navigation"
            className={
              menuOpen ? "block lg:hidden" : "hidden"
            }
          >
            <nav
              className="
                flex flex-col gap-1
                border-t border-border/40
                px-3 py-3
              "
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="
                    rounded-xl px-3 py-3
                    text-sm font-medium
                    text-foreground/90
                    transition-colors
                    hover:bg-accent/60
                    hover:text-primary
                  "
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Auth Buttons */}
              <div
                className="
                  mt-2 flex items-center gap-3
                  border-t border-border/40 pt-3
                "
              >
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="
                    flex-1 rounded-full
                    border border-border
                    px-4 py-2.5
                    text-center text-sm font-medium
                  "
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="
                    flex-1 rounded-full
                    bg-cta px-4 py-2.5
                    text-center text-sm font-semibold
                    text-cta-foreground
                  "
                >
                  Register
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Space for Fixed Navbar */}
      <div
        className="h-18.5 lg:h-19.5"
        aria-hidden="true"
      />
    </>
  );
}
