
"use client";

import { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";

type PublicSettingsResponse = {
  success: boolean;
  settings?: {
    announcementEnabled: boolean;
    announcementText: string;
  };
};

export function PlatformAnnouncement() {
  const [message, setMessage] =
    useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) return;

    async function loadAnnouncement() {
      const response = await fetch(
        `${apiUrl!.replace(/\/+$/, "")}/platform-settings`,
        {
          cache: "no-store",
          signal: controller.signal,
        }
      );

      if (!response.ok) {
        throw new Error("Unable to load announcement.");
      }

      return (await response.json()) as
        PublicSettingsResponse;
    }

    void loadAnnouncement()
      .then((result) => {
        if (controller.signal.aborted) return;

        const settings = result.settings;

        if (
          result.success &&
          settings?.announcementEnabled &&
          settings.announcementText.trim()
        ) {
          setMessage(settings.announcementText);
        } else {
          setMessage(null);
        }
      })
      .catch(() => {
        // An unavailable announcement service
        // should not break the public website.
      });

    return () => controller.abort();
  }, []);

  if (!message) return null;

  return (
    <div
      role="status"
      className="border-b border-primary/15 bg-primary/10 px-4 py-3 text-center"
    >
      <div className="mx-auto flex max-w-7xl items-start justify-center gap-2">
        <Megaphone
          size={17}
          className="mt-0.5 shrink-0 text-primary"
        />

        <p className="whitespace-pre-wrap wrap-break-word text-sm font-medium">
          {message}
        </p>
      </div>
    </div>
  );
}
