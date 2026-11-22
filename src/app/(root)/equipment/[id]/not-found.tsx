
import Link from "next/link";

import {
  ArrowLeft,
  PackageSearch,
} from "lucide-react";

export default function EquipmentNotFound() {
  return (
    <section className="flex min-h-[65vh] items-center justify-center px-4 py-12">
      <div className="max-w-md text-center">

        <div className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-secondary text-primary">
          <PackageSearch size={40} />
        </div>

        <h1 className="mt-6 text-2xl font-bold">
          Equipment Not Found
        </h1>

        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          This equipment may not exist, may have
          been removed, or may not be approved yet.
        </p>

        <Link
          href="/equipment"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cta px-5 py-3 text-sm font-semibold text-cta-foreground hover:bg-cta/90"
        >
          <ArrowLeft size={17} />
          Browse Equipment
        </Link>
      </div>
    </section>
  );
}
