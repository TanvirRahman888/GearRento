"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import {
  Menu,
  X,
  ChevronDown,
  UserRound,
  LayoutDashboard,
  LogOut,
  Loader2,
} from "lucide-react";

import { toast } from "sonner";

import { ThemeToggle } from "@/components/theme-toggle";
import { useSession, signOut } from "@/lib/auth-client";
import { getSafeRedirect } from "@/lib/safe-redirect";

// Navbar links
const navLinks = [
  { label: "Home", href: "/" },
  { label: "All Equipment", href: "/equipment" },
  { label: "How It Works", href: "/#how-it-works" },
];

type ProfileAvatarProps = {
  name?: string;
  image?: string | null;
  size?: "small" | "large";
};

function ProfileAvatar({ name, image, size = "small" }: ProfileAvatarProps) {
  const isLarge = size === "large";

  return (
    <div
      className={`
        relative flex shrink-0
        items-center justify-center
        overflow-hidden rounded-full
        bg-primary text-primary-foreground
        ${isLarge ? "size-12" : "size-9"}
      `}
    >
      {image ? (
        <Image
          src={image}
          alt={name || "Profile photo"}
          fill
          sizes={isLarge ? "48px" : "36px"}
          unoptimized
          className="object-cover"
        />
      ) : (
        <UserRound size={isLarge ? 24 : 20} />
      )}
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // Better Auth session
  const { data: session, isPending } = useSession();

  const user = session?.user;

  // Navbar states
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // References
  const lastScrollY = useRef(0);

  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // User role
  const roleLabel =
    user?.role === "admin"
      ? "Administrator"
      : user?.role === "owner"
        ? "Product Owner"
        : "Customer";

  // =========================================
  // 1. Navbar scroll behavior
  // =========================================

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    function handleScroll() {
      const currentScrollY = window.scrollY;

      // Keep navbar visible when menus are open
      if (currentScrollY < 80 || menuOpen || profileOpen) {
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
  }, [menuOpen, profileOpen]);

  // =========================================
  // 2. Close menus on outside click / Escape
  // =========================================

  useEffect(() => {
    if (!menuOpen && !profileOpen) return;

    function handleOutsideClick(event: PointerEvent) {
      const target = event.target as Node;

      // Close mobile menu
      if (
        menuOpen &&
        !menuRef.current?.contains(target) &&
        !menuButtonRef.current?.contains(target)
      ) {
        setMenuOpen(false);
      }

      // Close profile dropdown
      if (profileOpen && !profileRef.current?.contains(target)) {
        setProfileOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setProfileOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick);

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);

      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen, profileOpen]);

  // =========================================
  // 3. Logout function
  // =========================================

  async function handleLogout() {
    if (isSigningOut) return;

    setIsSigningOut(true);

    try {
      const { error } = await signOut();

      if (error) {
        toast.error(error.message || "Logout failed");
        return;
      }

      setMenuOpen(false);
      setProfileOpen(false);

      toast.success("Logged out successfully!");

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);

      toast.error("Unable to log out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  }

  // =========================================
  // 4. Login / Register previous-page redirect
  // =========================================

  function handleAuthNavigation(
    event: MouseEvent<HTMLAnchorElement>,
    page: "/login" | "/register",
  ) {
    // Allow normal browser shortcuts for new tabs
    if (
      event.defaultPrevented ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();

    const currentPath = window.location.pathname;

    const params = new URLSearchParams(window.location.search);

    let previousPage = "/";

    // Already on Login or Register?
    // Preserve the original next destination.
    if (currentPath === "/login" || currentPath === "/register") {
      previousPage = getSafeRedirect(params.get("next"));
    } else {
      // Capture pathname, search parameters, and hash
      previousPage = getSafeRedirect(
        currentPath + window.location.search + window.location.hash,
      );
    }

    // Close menus before navigating
    setMenuOpen(false);
    setProfileOpen(false);

    router.push(`${page}?next=${encodeURIComponent(previousPage)}`);
  }

  // =========================================
  // 5. Auth link fallback for new-tab navigation
  // =========================================

  function authHref(page: "/login" | "/register") {
    // JavaScript-enabled normal clicks use
    // handleAuthNavigation(), which also
    // captures query parameters and hash.
    const destination =
      pathname === "/login" || pathname === "/register" ? "/" : pathname;

    return `${page}?next=${encodeURIComponent(getSafeRedirect(destination))}`;
  }

  // =========================================
  // 6. Profile avatar
  // =========================================

  return (
    <>
      {/* =====================================
          NAVBAR HEADER
      ===================================== */}

      <header
        className={`
          fixed inset-x-3 top-2.5 z-50
          mx-auto max-w-7xl
          transform-gpu
          transition-transform duration-500 ease-out
          motion-reduce:transition-none
          sm:inset-x-6 sm:top-3
          ${showNavbar ? "translate-y-0" : "translate-y-[-160%]"}
        `}
      >
        {/* Glass Navbar Container */}
        <div
          className="
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
          {/* =====================================
              MAIN NAVBAR ROW
          ===================================== */}

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
              onClick={() => {
                setMenuOpen(false);
                setProfileOpen(false);
              }}
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

            {/* =====================================
                DESKTOP NAVIGATION
            ===================================== */}

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
                      ${isActive ? "text-primary" : "text-foreground/80"}
                    `}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* =====================================
                RIGHT SECTION
            ===================================== */}

            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* =====================================
                  AUTH SESSION LOADING
              ===================================== */}

              {isPending ? (
                <div
                  className="
                    size-9 animate-pulse
                    rounded-full bg-muted
                    sm:w-24
                  "
                />
              ) : user ? (
                /* =====================================
                    LOGGED-IN USER PROFILE
                ===================================== */

                <div ref={profileRef} className="relative">
                  {/* Profile Trigger Button */}
                  <button
                    type="button"
                    aria-label={`Profile menu for ${user.name}`}
                    aria-expanded={profileOpen}
                    aria-controls="profile-dropdown"
                    aria-haspopup="true"
                    onClick={() => {
                      setProfileOpen(!profileOpen);
                      setMenuOpen(false);
                    }}
                    className="
                      flex items-center gap-2
                      rounded-full
                      border border-border/60
                      bg-background/40
                      p-1 pr-1
                      transition-colors
                      hover:bg-accent/70
                      sm:pr-3
                    "
                  >
                    <ProfileAvatar name={user.name} image={user.image} />

                    <span
                      className="
                        hidden max-w-28 truncate
                        text-sm font-semibold
                        text-foreground
                        sm:block
                      "
                    >
                      {user.name}
                    </span>

                    <ChevronDown
                      size={16}
                      className={`
                        hidden text-muted-foreground
                        transition-transform duration-200
                        sm:block
                        ${profileOpen ? "rotate-180" : ""}
                      `}
                    />
                  </button>

                  {/* =====================================
                      PROFILE DROPDOWN
                  ===================================== */}

                  {profileOpen && (
                    <div
                      id="profile-dropdown"
                      className="
                        absolute right-0 top-full z-60
                        mt-3 w-[min(90vw,300px)]
                        overflow-hidden rounded-2xl
                        border border-border
                        bg-card/95 p-2
                        text-card-foreground
                        shadow-[0_15px_45px_rgba(0,0,0,0.15)]
                        backdrop-blur-xl
                      "
                    >
                      {/* User Information */}
                      <div className="p-3">
                        <div className="flex items-center gap-3">
                          <ProfileAvatar
                            name={user.name}
                            image={user.image}
                            size="large"
                          />

                          <div className="min-w-0">
                            <p
                              className="
                                truncate text-sm
                                font-semibold
                              "
                            >
                              {user.name}
                            </p>

                            <p
                              className="
                                truncate text-xs
                                text-muted-foreground
                              "
                              title={user.email}
                            >
                              {user.email}
                            </p>
                          </div>
                        </div>

                        {/* Role Badge */}
                        <div className="mt-3">
                          <span
                            className="
                              inline-flex rounded-full
                              bg-secondary
                              px-3 py-1
                              text-xs font-medium
                              text-secondary-foreground
                            "
                          >
                            {roleLabel}
                          </span>
                        </div>
                      </div>

                      <div className="my-1 border-t border-border" />

                      {/* Dashboard */}
                      <Link
                        href="/dashboard"
                        onClick={() => {
                          setProfileOpen(false);
                        }}
                        className="
                          flex items-center gap-3
                          rounded-xl px-3 py-3
                          text-sm font-medium
                          transition-colors
                          hover:bg-accent
                          hover:text-accent-foreground
                        "
                      >
                        <LayoutDashboard size={18} />
                        Dashboard
                      </Link>

                      <div className="my-1 border-t border-border" />

                      {/* Logout Button */}
                      <button
                        type="button"
                        disabled={isSigningOut}
                        onClick={handleLogout}
                        className="
                          flex w-full items-center gap-3
                          rounded-xl px-3 py-3
                          text-left text-sm font-medium
                          text-destructive
                          transition-colors
                          hover:bg-destructive/10
                          disabled:cursor-not-allowed
                          disabled:opacity-60
                        "
                      >
                        {isSigningOut ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <LogOut size={18} />
                        )}

                        {isSigningOut ? "Logging out..." : "Log Out"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* =====================================
                    GUEST DESKTOP AUTH LINKS
                ===================================== */

                <div className="hidden items-center gap-3 lg:flex">
                  {/* Desktop Login */}
                  <Link
                    href={authHref("/login")}
                    onClick={(event) => handleAuthNavigation(event, "/login")}
                    className="
                      text-sm font-medium
                      transition-colors
                      hover:text-primary
                    "
                  >
                    Login
                  </Link>

                  {/* Desktop Register */}
                  <Link
                    href={authHref("/register")}
                    onClick={(event) =>
                      handleAuthNavigation(event, "/register")
                    }
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
              )}

              {/* =====================================
                  MOBILE MENU BUTTON
              ===================================== */}

              <button
                ref={menuButtonRef}
                type="button"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                aria-controls="mobile-navigation"
                onClick={() => {
                  setMenuOpen(!menuOpen);
                  setProfileOpen(false);
                }}
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
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* =====================================
              MOBILE NAVIGATION
          ===================================== */}

          {menuOpen && (
            <div
              ref={menuRef}
              id="mobile-navigation"
              className="
                border-t border-border/40
                lg:hidden
              "
            >
              <nav className="flex flex-col gap-1 px-3 py-3">
                {/* Mobile Navigation Links */}
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

                {/* =====================================
                    GUEST MOBILE AUTH LINKS
                ===================================== */}

                {!isPending && !user && (
                  <div
                    className="
                      mt-2 flex items-center gap-3
                      border-t border-border/40
                      pt-3
                    "
                  >
                    {/* Mobile Login */}
                    <Link
                      href={authHref("/login")}
                      onClick={(event) => handleAuthNavigation(event, "/login")}
                      className="
                        flex-1 rounded-full
                        border border-border
                        px-4 py-2.5
                        text-center text-sm
                        font-medium
                        transition-colors
                        hover:bg-accent/60
                      "
                    >
                      Login
                    </Link>

                    {/* Mobile Register */}
                    <Link
                      href={authHref("/register")}
                      onClick={(event) =>
                        handleAuthNavigation(event, "/register")
                      }
                      className="
                        flex-1 rounded-full
                        bg-cta px-4 py-2.5
                        text-center text-sm
                        font-semibold
                        text-cta-foreground
                        transition-colors
                        hover:bg-cta/90
                      "
                    >
                      Register
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Space for fixed Navbar */}
      <div className="h-18.5 lg:h-19.5" aria-hidden="true" />
    </>
  );
}
