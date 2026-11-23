import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  ArrowUpRight,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Heart,
} from "lucide-react";

import {
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa6";

import type { IconType } from "react-icons";

// ========================================
// Footer Navigation Links
// ========================================

const footerLinks = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "All Equipment", href: "/equipment" },
      {
        label: "Featured Equipment",
        href: "/equipment?sort=featured",
      },
      {
        label: "Latest Equipment",
        href: "/equipment?sort=newest",
      },
    ],
  },
  {
    title: "Quick Links",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact Us", href: "/contact" },
      { label: "How It Works", href: "/#how-it-works" },
      { label: "FAQs", href: "/#faq" },
    ],
  },
  {
    title: "My Account",
    links: [
      { label: "My Dashboard", href: "/dashboard" },
      { label: "My Bookings", href: "/dashboard/my-bookings" },
      { label: "My Equipment", href: "/dashboard/my-equipment" },
      { label: "Rental History", href: "/dashboard/rental-history" },
    ],
  },
];

// ========================================
// Social Media Links
// ========================================

// Demo links.
// Replace these URLs with actual GearRento
// social media profile links before launch.

interface SocialLink {
  name: string;
  href: string;
  icon: IconType;
}

const socialLinks: SocialLink[] = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/",
    icon: FaFacebookF,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/",
    icon: FaInstagram,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/",
    icon: FaLinkedinIn,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/",
    icon: FaYoutube,
  },
  {
    name: "GitHub",
    href: "https://github.com/",
    icon: FaGithub,
  },
];

// ========================================
// Demo Contact Information
// ========================================

// Replace these with your real business details.

const contactInfo = {
  email: "support@gearrento.example",
  phone: "+880 1700-000000",
  phoneHref: "+8801700000000",
  address: "Dhaka, Bangladesh",
};

// ========================================
// Footer Component
// ========================================

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-border bg-card text-card-foreground">
      {/* ====================================
          Top Accent Line
      ==================================== */}

      <div className="h-1 w-full bg-linear-to-r from-primary via-cta to-primary" />

      {/* ====================================
          Decorative Background
      ==================================== */}

      <div className="pointer-events-none absolute -left-32 top-20 size-80 rounded-full bg-primary/5 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-20 size-80 rounded-full bg-cta/5 blur-3xl" />

      {/* ====================================
          Main Footer Content
      ==================================== */}

      <div className="relative mx-auto max-w-7xl px-4 pt-14 pb-10 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* ====================================
              Brand Column
          ==================================== */}

          <div className="sm:col-span-2 lg:col-span-4 lg:pr-8">
            {/* Logo */}

            <Link
              href="/"
              aria-label="GearRento Home"
              className="inline-flex items-center gap-3"
            >
              <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-background p-1.5 shadow-sm">
                <Image
                  src="/GearRentoIcon.png"
                  alt=""
                  width={42}
                  height={42}
                  className="h-full w-full object-contain"
                />
              </div>

              <span className="text-2xl font-extrabold tracking-tight text-foreground">
                Gear<span className="text-primary">Rento</span>
              </span>
            </Link>

            {/* Description */}

            <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
              Your equipment rental marketplace. Discover quality cameras,
              tools, construction equipment, electronics, and more from
              equipment owners across Bangladesh.
            </p>

            {/* Brand Tagline */}

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-secondary px-3 py-2 text-xs font-semibold text-secondary-foreground">
              <ShieldCheck className="size-4" />
              Rent Smarter. Build Bigger.
            </div>

            {/* ====================================
                Social Media Icons
            ==================================== */}

            <div className="mt-7">
              <h3 className="mb-4 text-sm font-semibold text-foreground">
                Connect With Us
              </h3>

              <div className="flex flex-wrap items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;

                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      title={social.name}
                      className="group flex size-10 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-lg"
                    >
                      <Icon className="size-5 transition-transform duration-300 group-hover:scale-110" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ====================================
              Navigation Columns
          ==================================== */}

          {footerLinks.map((group) => (
            <div key={group.title} className="lg:col-span-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                {group.title}
              </h3>

              {/* Orange Underline */}

              <div className="mt-3 h-1 w-9 rounded-full bg-cta" />

              <ul className="mt-6 space-y-4">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
                    >
                      <ArrowRight className="size-3.5 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />

                      <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* ====================================
              Contact Information Column
          ==================================== */}

          <div className="sm:col-span-2 lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Contact Us
            </h3>

            <div className="mt-3 h-1 w-9 rounded-full bg-cta" />

            <div className="mt-6 space-y-5">
              {/* Address */}

              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                  <MapPin className="size-4.5" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground">
                    Our Location
                  </p>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {contactInfo.address}
                  </p>
                </div>
              </div>

              {/* Phone */}

              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Phone className="size-4.5" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground">
                    Call Us
                  </p>

                  <a
                    href={`tel:${contactInfo.phoneHref}`}
                    className="mt-1 block text-sm text-muted-foreground transition hover:text-primary"
                  >
                    {contactInfo.phone}
                  </a>
                </div>
              </div>

              {/* Email */}

              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Mail className="size-4.5" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground">
                    Email Us
                  </p>

                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="mt-1 block break-all text-sm text-muted-foreground transition hover:text-primary"
                  >
                    {contactInfo.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Page Link */}

            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3"
            >
              Get in Touch
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>

        {/* ====================================
            Footer Divider
        ==================================== */}

        <div className="mt-12 h-px bg-border sm:mt-16" />

        {/* ====================================
            Bottom Footer
        ==================================== */}

        <div className="flex flex-col items-center justify-between gap-5 py-6 text-center md:flex-row md:text-left">
          {/* Copyright */}

          <p className="text-xs leading-6 text-muted-foreground sm:text-sm">
            © {currentYear}{" "}
            <span className="font-semibold text-foreground">GearRento</span>.
            All rights reserved.
          </p>

          {/* Bottom Links */}

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link
              href="/about"
              className="text-xs text-muted-foreground transition hover:text-primary sm:text-sm"
            >
              About Us
            </Link>

            <Link
              href="/contact"
              className="text-xs text-muted-foreground transition hover:text-primary sm:text-sm"
            >
              Contact
            </Link>

            <Link
              href="/equipment"
              className="text-xs text-muted-foreground transition hover:text-primary sm:text-sm"
            >
              Equipment
            </Link>
          </div>

          {/* Made With Love */}

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
            Made with
            <Heart className="size-3.5 fill-rose-500 text-rose-500" />
            in Bangladesh
          </div>
        </div>
      </div>
    </footer>
  );
}
