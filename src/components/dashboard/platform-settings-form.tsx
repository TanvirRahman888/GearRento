
"use client";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  CalendarDays,
  Globe2,
  Headphones,
  Loader2,
  LockKeyhole,
  Megaphone,
  RefreshCw,
  Save,
  Settings2,
} from "lucide-react";

import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

// ======================================
// Types
// ======================================

type PlatformSettings = {
  platformName: string;
  supportEmail: string;
  supportPhone: string;
  announcementEnabled: boolean;
  announcementText: string;
  bookingsEnabled: boolean;
  maxRentalDays: number;
  updatedAt: string | null;
};

type EditableSettings = Omit<
  PlatformSettings,
  "updatedAt"
>;

type SettingsResponse = {
  success: boolean;
  settings?: PlatformSettings;
  permissions?: {
    canEdit: boolean;
  };
  message?: string;
  error?: string;
};

// ======================================
// Helpers
// ======================================

function getApiUrl() {
  const url = process.env.NEXT_PUBLIC_API_URL;

  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not configured."
    );
  }

  return url.replace(/\/+$/, "");
}

async function getAccessToken() {
  const result = await authClient.token();
  const token = result.data?.token;

  if (!token) {
    throw new Error(
      "Your session has expired. Please sign in again."
    );
  }

  return token;
}

function toEditable(
  settings: PlatformSettings
): EditableSettings {
  return {
    platformName: settings.platformName,
    supportEmail: settings.supportEmail,
    supportPhone: settings.supportPhone,
    announcementEnabled:
      settings.announcementEnabled,
    announcementText: settings.announcementText,
    bookingsEnabled: settings.bookingsEnabled,
    maxRentalDays: settings.maxRentalDays,
  };
}

function formatUpdatedDate(
  value: string | null
) {
  if (!value) return "Not updated yet";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleString("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Dhaka",
  });
}

// ======================================
// Main Component
// ======================================

export function PlatformSettingsForm() {
  const [settings, setSettings] =
    useState<PlatformSettings | null>(null);

  const [form, setForm] =
    useState<EditableSettings | null>(null);

  const [canEdit, setCanEdit] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [refreshKey, setRefreshKey] =
    useState(0);

  // ====================================
  // Load Settings
  // ====================================

  useEffect(() => {
    const controller = new AbortController();

    async function loadSettings():
      Promise<SettingsResponse> {
      const token = await getAccessToken();

      if (controller.signal.aborted) {
        throw new Error("Request cancelled.");
      }

      const response = await fetch(
        `${getApiUrl()}/admin/platform-settings`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
          signal: controller.signal,
        }
      );

      const result =
        (await response.json()) as SettingsResponse;

      if (
        !response.ok ||
        !result.success ||
        !result.settings
      ) {
        throw new Error(
          result.error ||
            "Unable to load platform settings."
        );
      }

      return result;
    }

    void loadSettings()
      .then((result) => {
        if (
          controller.signal.aborted ||
          !result.settings
        ) {
          return;
        }

        setSettings(result.settings);
        setForm(toEditable(result.settings));

        setCanEdit(
          result.permissions?.canEdit === true
        );

        setError("");
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load settings."
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [refreshKey]);

  // ====================================
  // Update Form Field
  // ====================================

  function updateField<K extends keyof EditableSettings>(
    field: K,
    value: EditableSettings[K]
  ) {
    setForm((current) =>
      current
        ? { ...current, [field]: value }
        : current
    );
  }

  // ====================================
  // Refresh
  // ====================================

  function handleRefresh() {
    if (saving) return;

    setLoading(true);
    setError("");
    setRefreshKey((value) => value + 1);
  }

  // ====================================
  // Save Settings
  // ====================================

  async function handleSave(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!form || !canEdit || saving) {
      return;
    }

    if (
      !Number.isInteger(form.maxRentalDays) ||
      form.maxRentalDays < 1 ||
      form.maxRentalDays > 30
    ) {
      toast.error(
        "Maximum rental days must be between 1 and 30."
      );
      return;
    }

    if (
      form.announcementEnabled &&
      !form.announcementText.trim()
    ) {
      toast.error(
        "Enter an announcement before enabling it."
      );
      return;
    }

    setSaving(true);

    try {
      const token = await getAccessToken();

      const response = await fetch(
        `${getApiUrl()}/admin/platform-settings`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const result = (await response
        .json()
        .catch(() => null)) as
        | SettingsResponse
        | null;

      if (
        !response.ok ||
        !result?.success ||
        !result.settings
      ) {
        throw new Error(
          result?.error ||
            `Unable to save settings (HTTP ${response.status}).`
        );
      }

      setSettings(result.settings);
      setForm(toEditable(result.settings));

      toast.success(
        result.message ||
          "Platform settings updated."
      );
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Unable to save platform settings."
      );
    } finally {
      setSaving(false);
    }
  }

  const isDirty =
    settings !== null &&
    form !== null &&
    JSON.stringify(form) !==
      JSON.stringify(toEditable(settings));

  // ====================================
  // UI
  // ====================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Settings2
              size={22}
              className="text-primary"
            />
            Marketplace Configuration
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage GearRento information and booking
            rules.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading || saving}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-accent disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={
              loading ? "animate-spin" : ""
            }
          />
          Refresh
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex min-h-64 items-center justify-center rounded-2xl border border-border bg-card">
          <Loader2
            size={28}
            className="animate-spin text-primary"
          />
          <span className="ml-3 text-sm text-muted-foreground">
            Loading platform settings...
          </span>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div
          role="alert"
          className="rounded-2xl border border-destructive/30 bg-card p-6"
        >
          <h3 className="font-semibold text-destructive">
            Unable to Load Settings
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            {error}
          </p>

          <button
            type="button"
            onClick={handleRefresh}
            className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Settings Form */}
      {!loading && !error && form && (
        <form
          onSubmit={(event) =>
            void handleSave(event)
          }
          className="space-y-6"
        >
          {!canEdit && (
            <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/50 p-4">
              <LockKeyhole
                size={19}
                className="mt-0.5 shrink-0 text-primary"
              />
              <p className="text-sm text-muted-foreground">
                Only the Main Admin can change
                platform settings. Your access is
                read-only.
              </p>
            </div>
          )}

          <fieldset
            disabled={!canEdit || saving}
            className="space-y-6 disabled:opacity-75"
          >
            {/* General Information */}
            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-2">
                <Globe2
                  size={20}
                  className="text-primary"
                />
                <h3 className="text-lg font-semibold">
                  General Information
                </h3>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="platform-name"
                  className="text-sm font-medium"
                >
                  Platform Name
                </label>

                <input
                  id="platform-name"
                  type="text"
                  required
                  minLength={2}
                  maxLength={60}
                  value={form.platformName}
                  onChange={(event) =>
                    updateField(
                      "platformName",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />

                <p className="text-xs text-muted-foreground">
                  Public-facing marketplace name.
                </p>
              </div>
            </section>

            {/* Support Information */}
            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-2">
                <Headphones
                  size={20}
                  className="text-primary"
                />
                <h3 className="text-lg font-semibold">
                  Customer Support
                </h3>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="support-email"
                    className="text-sm font-medium"
                  >
                    Support Email
                  </label>

                  <input
                    id="support-email"
                    type="email"
                    maxLength={254}
                    value={form.supportEmail}
                    onChange={(event) =>
                      updateField(
                        "supportEmail",
                        event.target.value
                      )
                    }
                    placeholder="support@example.com"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="support-phone"
                    className="text-sm font-medium"
                  >
                    Support Phone
                  </label>

                  <input
                    id="support-phone"
                    type="tel"
                    maxLength={30}
                    value={form.supportPhone}
                    onChange={(event) =>
                      updateField(
                        "supportPhone",
                        event.target.value
                      )
                    }
                    placeholder="+880..."
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>
            </section>

            {/* Announcement */}
            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-2">
                <Megaphone
                  size={20}
                  className="text-primary"
                />
                <h3 className="text-lg font-semibold">
                  Marketplace Announcement
                </h3>
              </div>

              <label className="flex items-start gap-3 rounded-xl bg-muted/50 p-4">
                <input
                  type="checkbox"
                  checked={form.announcementEnabled}
                  onChange={(event) =>
                    updateField(
                      "announcementEnabled",
                      event.target.checked
                    )
                  }
                  className="mt-1 size-4 accent-primary"
                />

                <span>
                  <span className="block text-sm font-semibold">
                    Enable Announcement
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    Publish a notice through the
                    public settings endpoint.
                  </span>
                </span>
              </label>

              <div className="mt-5 space-y-2">
                <label
                  htmlFor="announcement-text"
                  className="text-sm font-medium"
                >
                  Announcement Message
                </label>

                <textarea
                  id="announcement-text"
                  rows={3}
                  maxLength={280}
                  value={form.announcementText}
                  onChange={(event) =>
                    updateField(
                      "announcementText",
                      event.target.value
                    )
                  }
                  placeholder="Write a marketplace announcement..."
                  className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />

                <p className="text-right text-xs text-muted-foreground">
                  {form.announcementText.length}/280
                </p>
              </div>

              {form.announcementEnabled &&
                form.announcementText.trim() && (
                  <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <p className="text-xs font-semibold text-primary">
                      Announcement Preview
                    </p>

                    <p className="mt-2 whitespace-pre-wrap wrap-break-word text-sm">
                      {form.announcementText}
                    </p>
                  </div>
                )}
            </section>

            {/* Booking Rules */}
            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-2">
                <CalendarDays
                  size={20}
                  className="text-primary"
                />
                <h3 className="text-lg font-semibold">
                  Rental & Booking Rules
                </h3>
              </div>

              <label className="flex items-start gap-3 rounded-xl bg-muted/50 p-4">
                <input
                  type="checkbox"
                  checked={form.bookingsEnabled}
                  onChange={(event) =>
                    updateField(
                      "bookingsEnabled",
                      event.target.checked
                    )
                  }
                  className="mt-1 size-4 accent-primary"
                />

                <span>
                  <span className="block text-sm font-semibold">
                    Accept New Bookings
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                    When disabled, Express rejects new
                    Checkout requests. Existing
                    confirmed rentals remain unchanged.
                  </span>
                </span>
              </label>

              {!form.bookingsEnabled && (
                <div className="mt-3 rounded-xl border border-amber-200 p-4 text-sm text-amber-700 dark:border-amber-900 dark:text-amber-300">
                  New booking requests will be paused
                  after these settings are saved.
                </div>
              )}

              <div className="mt-5 max-w-xs space-y-2">
                <label
                  htmlFor="max-rental-days"
                  className="text-sm font-medium"
                >
                  Maximum Rental Duration
                </label>

                <div className="flex items-center gap-3">
                  <input
                    id="max-rental-days"
                    type="number"
                    min={1}
                    max={30}
                    step={1}
                    value={form.maxRentalDays}
                    onChange={(event) =>
                      updateField(
                        "maxRentalDays",
                        Number(event.target.value)
                      )
                    }
                    className="w-28 rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  />

                  <span className="text-sm text-muted-foreground">
                    days
                  </span>
                </div>

                <p className="text-xs text-muted-foreground">
                  Allowed range: 1–30 days.
                </p>
              </div>
            </section>
          </fieldset>

          {/* Save Footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5">
            <div className="space-y-1">
              <p className="text-sm font-semibold">
                {isDirty
                  ? "Unsaved changes"
                  : "Settings are up to date"}
              </p>

              <p className="text-xs text-muted-foreground">
                Last updated:{" "}
                {formatUpdatedDate(
                  settings?.updatedAt || null
                )}
              </p>
            </div>

            <button
              type="submit"
              disabled={
                !canEdit ||
                saving ||
                !isDirty
              }
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Save size={17} />
              )}

              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
