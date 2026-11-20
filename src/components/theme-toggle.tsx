
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration errors
  if (!mounted) {
    return (
      <button
        type="button"
        disabled
        aria-label="Loading theme"
        className="flex size-10 items-center justify-center rounded-full border border-border/60"
      >
        <Sun size={19} />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={
        isDark ? "Switch to light mode" : "Switch to dark mode"
      }
      title={
        isDark ? "Switch to light mode" : "Switch to dark mode"
      }
      className="
        flex size-10 shrink-0 items-center justify-center
        rounded-full border border-border/60
        bg-background/40 text-foreground
        transition-all duration-300
        hover:scale-105 hover:bg-accent
        active:scale-95
      "
    >
      {isDark ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
}
