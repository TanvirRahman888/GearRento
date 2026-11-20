import Link from "next/link";
import { Settings } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        <div className="flex flex-col justify-between gap-8 md:flex-row">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Settings className="text-primary" size={26} />

              <span className="text-xl font-bold">
                Gear<span className="text-primary">Rento</span>
              </span>
            </Link>

            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Your trusted marketplace for equipment rentals.
              Rent smarter. Build bigger.
            </p>
          </div>

          {/* Footer Links */}
          <div>
            <h3 className="mb-4 font-semibold">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary">
                Home
              </Link>

              <Link href="/equipment" className="hover:text-primary">
                All Equipment
              </Link>

              <Link href="/#how-it-works" className="hover:text-primary">
                How It Works
              </Link>
            </div>
          </div>

        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} GearRento. All rights reserved.
        </div>

      </div>
    </footer>
  );
}