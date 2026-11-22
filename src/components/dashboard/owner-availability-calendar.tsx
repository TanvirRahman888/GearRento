
"use client";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  AlertCircle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Loader2,
  LockKeyhole,
  Package,
  RefreshCw,
  UnlockKeyhole,
} from "lucide-react";

import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

// =====================================
// Types
// =====================================

type EquipmentItem = {
  id: string;
  name: string;
  status: string;
  imageUrl: string;
  quantity: number;
  availableQuantity: number;
};

type Reservation = {
  id: string;
  startDate: string;
  endDate: string;
  quantity: number;
  status: string;
  paymentStatus: string;
};

type EquipmentListResponse = {
  success: boolean;
  equipment: EquipmentItem[];
  total: number;
  hasMore: boolean;
  error?: string;
};

type CalendarResponse = {
  success: boolean;
  month: string;
  equipment: EquipmentItem;
  blockedDates: string[];
  reservations: Reservation[];
  error?: string;
};

type MutationResponse = {
  success: boolean;
  message?: string;
  error?: string;
};

type AvailabilityAction =
  | "block"
  | "unblock";

// =====================================
// Date Helpers
// =====================================

const DAY_MS = 86400000;

const WEEKDAYS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

function todayInBangladesh() {
  const parts = new Intl.DateTimeFormat(
    "en-GB",
    {
      timeZone: "Asia/Dhaka",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  ).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map((part) => [
      part.type,
      part.value,
    ])
  );

  return `${values.year}-${values.month}-${values.day}`;
}

function currentMonth() {
  return todayInBangladesh().slice(0, 7);
}

function changeMonth(
  month: string,
  offset: number
) {
  const [year, number] =
    month.split("-").map(Number);

  return new Date(
    Date.UTC(year, number - 1 + offset, 1)
  )
    .toISOString()
    .slice(0, 7);
}

function formatMonth(month: string) {
  return new Intl.DateTimeFormat("en-BD", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${month}-01T00:00:00Z`));
}

function getMaxDate(today: string) {
  const timestamp =
    Date.parse(`${today}T00:00:00Z`) +
    365 * DAY_MS;

  return new Date(timestamp)
    .toISOString()
    .slice(0, 10);
}

function countDays(
  startDate: string,
  endDate: string
) {
  if (
    !startDate ||
    !endDate ||
    endDate < startDate
  ) {
    return 0;
  }

  return (
    Math.round(
      (
        Date.parse(`${endDate}T00:00:00Z`) -
        Date.parse(`${startDate}T00:00:00Z`)
      ) / DAY_MS
    ) + 1
  );
}

function getMonthCells(month: string) {
  const [year, monthNumber] =
    month.split("-").map(Number);

  const firstWeekday = new Date(
    Date.UTC(year, monthNumber - 1, 1)
  ).getUTCDay();

  const daysInMonth = new Date(
    Date.UTC(year, monthNumber, 0)
  ).getUTCDate();

  const cells: Array<string | null> = [];

  for (let i = 0; i < firstWeekday; i++) {
    cells.push(null);
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {
    cells.push(
      `${month}-${String(day).padStart(2, "0")}`
    );
  }

  return cells;
}

// =====================================
// API Helpers
// =====================================

function getApiUrl() {
  const url = process.env.NEXT_PUBLIC_API_URL;

  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is missing."
    );
  }

  return url.replace(/\/+$/, "");
}

async function getAccessToken() {
  const result = await authClient.token();

  if (!result.data?.token) {
    throw new Error(
      "Your session has expired. Please sign in again."
    );
  }

  return result.data.token;
}

async function requestApi<
  T extends {
    success: boolean;
    error?: string;
  }
>(
  path: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(
    `${getApiUrl()}${path}`,
    {
      ...options,
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
        ...(options.body
          ? { "Content-Type": "application/json" }
          : {}),
      },
    }
  );

  const result = (await response
    .json()
    .catch(() => null)) as T | null;

  if (
    !response.ok ||
    !result?.success
  ) {
    throw new Error(
      result?.error ||
        `Request failed (HTTP ${response.status}).`
    );
  }

  return result;
}

// =====================================
// Owner Availability Calendar
// =====================================

export function OwnerAvailabilityCalendar() {
  const today = todayInBangladesh();
  const maximumDate = getMaxDate(today);

  const [equipment, setEquipment] =
    useState<EquipmentItem[]>([]);

  const [selectedId, setSelectedId] =
    useState("");

  const [equipmentLoading, setEquipmentLoading] =
    useState(true);

  const [equipmentError, setEquipmentError] =
    useState("");

  const [equipmentRefresh, setEquipmentRefresh] =
    useState(0);

  const [hasMoreEquipment, setHasMoreEquipment] =
    useState(false);

  const [month, setMonth] =
    useState(currentMonth);

  const [calendar, setCalendar] =
    useState<CalendarResponse | null>(null);

  const [calendarError, setCalendarError] =
    useState("");

  const [calendarRefresh, setCalendarRefresh] =
    useState(0);

  const [action, setAction] =
    useState<AvailabilityAction>("block");

  const [startDate, setStartDate] =
    useState(today);

  const [endDate, setEndDate] =
    useState(today);

  const [saving, setSaving] =
    useState(false);

  // ===================================
  // Load Owner Equipment
  // ===================================

  useEffect(() => {
    const controller =
      new AbortController();

    async function loadEquipment() {
      const token = await getAccessToken();

      return requestApi<EquipmentListResponse>(
        "/owner/availability/equipment",
        token,
        { signal: controller.signal }
      );
    }

    void loadEquipment()
      .then((result) => {
        if (controller.signal.aborted) return;

        setEquipment(result.equipment);
        setHasMoreEquipment(result.hasMore);

        setSelectedId((current) => {
          const exists = result.equipment.some(
            (item) => item.id === current
          );

          return exists
            ? current
            : result.equipment[0]?.id || "";
        });

        setEquipmentError("");
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;

        setEquipmentError(
          error instanceof Error
            ? error.message
            : "Unable to load equipment."
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setEquipmentLoading(false);
        }
      });

    return () => controller.abort();
  }, [equipmentRefresh]);

  // ===================================
  // Load Calendar
  // ===================================

  useEffect(() => {
    if (!selectedId) return;

    const controller =
      new AbortController();

    async function loadCalendar() {
      const token = await getAccessToken();

      return requestApi<CalendarResponse>(
        `/owner/availability/${encodeURIComponent(
          selectedId
        )}?month=${encodeURIComponent(month)}`,
        token,
        { signal: controller.signal }
      );
    }

    void loadCalendar()
      .then((result) => {
        if (controller.signal.aborted) return;

        setCalendar(result);
        setCalendarError("");
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;

        setCalendarError(
          error instanceof Error
            ? error.message
            : "Unable to load calendar."
        );
      });

    return () => controller.abort();
  }, [
    selectedId,
    month,
    calendarRefresh,
  ]);

  // Only display a calendar matching the
  // currently selected equipment/month.
  const activeCalendar =
    calendar?.equipment.id === selectedId &&
    calendar?.month === month
      ? calendar
      : null;

  const calendarLoading =
    Boolean(selectedId) &&
    !activeCalendar &&
    !calendarError;

  const selectedEquipment = equipment.find(
    (item) => item.id === selectedId
  );

  const blockedDates = new Set(
    activeCalendar?.blockedDates || []
  );

  const monthCells =
    getMonthCells(month);

  const rangeDays = countDays(
    startDate,
    endDate
  );

  const validRange =
    rangeDays >= 1 &&
    rangeDays <= 60 &&
    startDate >= today &&
    endDate <= maximumDate;

  // ===================================
  // Select Calendar Date
  // ===================================

  function selectDate(date: string) {
    if (
      date < today ||
      date > maximumDate
    ) {
      return;
    }

    setStartDate(date);
    setEndDate(date);

    setAction(
      blockedDates.has(date)
        ? "unblock"
        : "block"
    );
  }

  // ===================================
  // Save Blocked / Available Dates
  // ===================================

  async function handleSave(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      saving ||
      !selectedId ||
      !validRange
    ) {
      return;
    }

    setSaving(true);

    try {
      const token = await getAccessToken();

      const result =
        await requestApi<MutationResponse>(
          `/owner/availability/${encodeURIComponent(
            selectedId
          )}`,
          token,
          {
            method: "PATCH",
            body: JSON.stringify({
              action,
              startDate,
              endDate,
            }),
          }
        );

      toast.success(
        result.message ||
          "Availability updated."
      );

      // Invalidate the old calendar so
      // the refreshed state is displayed.
      setCalendar(null);
      setCalendarError("");

      setCalendarRefresh(
        (current) => current + 1
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update availability."
      );
    } finally {
      setSaving(false);
    }
  }

  // ===================================
  // Refresh
  // ===================================

  function refreshCalendar() {
    setCalendar(null);
    setCalendarError("");

    setCalendarRefresh(
      (current) => current + 1
    );
  }

  function refreshEquipment() {
    setEquipmentError("");
    setEquipmentLoading(true);

    setEquipmentRefresh(
      (current) => current + 1
    );
  }

  // ===================================
  // Daily Reservation Summary
  // ===================================

  function getDayInfo(day: string) {
    let confirmed = 0;
    let pending = 0;
    let completed = 0;

    for (
      const reservation of
      activeCalendar?.reservations || []
    ) {
      if (
        reservation.startDate > day ||
        reservation.endDate < day
      ) {
        continue;
      }

      if (
        reservation.status ===
        "checkout_pending"
      ) {
        pending += reservation.quantity;
      } else if (
        reservation.status === "confirmed"
      ) {
        confirmed += reservation.quantity;
      } else if (
        reservation.status === "completed"
      ) {
        completed += reservation.quantity;
      }
    }

    const blocked = blockedDates.has(day);

    const available = Math.max(
      0,
      (activeCalendar?.equipment
        .availableQuantity || 0) -
        confirmed -
        pending
    );

    return {
      blocked,
      confirmed,
      pending,
      completed,
      available,
    };
  }

  // ===================================
  // UI
  // ===================================

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <CalendarDays
              size={22}
              className="text-primary"
            />
            Equipment Availability
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage unavailable dates and inspect
            rental reservations.
          </p>
        </div>

        <button
          type="button"
          onClick={refreshCalendar}
          disabled={
            !selectedId ||
            saving ||
            calendarLoading
          }
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-accent disabled:opacity-50"
        >
          <RefreshCw size={16} />
          Refresh Calendar
        </button>
      </div>

      {/* Equipment Selector */}
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="flex items-center gap-2 font-semibold">
          <Package
            size={18}
            className="text-primary"
          />
          Select Your Equipment
        </h3>

        {equipmentLoading ? (
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2
              size={17}
              className="animate-spin"
            />
            Loading equipment...
          </div>
        ) : equipmentError ? (
          <div
            role="alert"
            className="mt-4 space-y-3 text-sm"
          >
            <p className="text-destructive">
              {equipmentError}
            </p>

            <button
              type="button"
              onClick={refreshEquipment}
              className="rounded-lg border px-3 py-2 font-medium"
            >
              Try Again
            </button>
          </div>
        ) : equipment.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            You have no equipment listings yet.
            Add equipment before managing
            availability.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            <select
              aria-label="Select equipment"
              value={selectedId}
              disabled={saving}
              onChange={(event) => {
                setSelectedId(
                  event.target.value
                );
                setCalendar(null);
                setCalendarError("");
              }}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            >
              {equipment.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.name} — {item.status}
                </option>
              ))}
            </select>

            {selectedEquipment && (
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="capitalize">
                  Status:{" "}
                  <strong className="text-foreground">
                    {selectedEquipment.status}
                  </strong>
                </span>

                <span>
                  Total Units:{" "}
                  <strong className="text-foreground">
                    {selectedEquipment.quantity}
                  </strong>
                </span>

                <span>
                  Listed Available Units:{" "}
                  <strong className="text-foreground">
                    {selectedEquipment.availableQuantity}
                  </strong>
                </span>
              </div>
            )}

            {hasMoreEquipment && (
              <p className="text-xs text-amber-700">
                Showing the newest 200 listings.
                Older equipment is not included
                in this selector.
              </p>
            )}
          </div>
        )}
      </section>

      {/* Calendar */}
      {selectedId && (
        <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">

          {/* Month Navigation */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold">
                {formatMonth(month)}
              </h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Select a future day to edit it.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous month"
                disabled={saving}
                onClick={() => {
                  setMonth(
                    changeMonth(month, -1)
                  );
                  setCalendar(null);
                  setCalendarError("");
                }}
                className="rounded-lg border border-border p-2 hover:bg-accent disabled:opacity-50"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={() => {
                  setMonth(currentMonth());
                  setCalendar(null);
                  setCalendarError("");
                }}
                className="rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:bg-accent disabled:opacity-50"
              >
                Today
              </button>

              <button
                type="button"
                aria-label="Next month"
                disabled={saving}
                onClick={() => {
                  setMonth(
                    changeMonth(month, 1)
                  );
                  setCalendar(null);
                  setCalendarError("");
                }}
                className="rounded-lg border border-border p-2 hover:bg-accent disabled:opacity-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Calendar Error */}
          {calendarError && (
            <div
              role="alert"
              className="mb-4 rounded-xl border border-destructive/30 p-4 text-sm text-destructive"
            >
              {calendarError}

              <button
                type="button"
                onClick={refreshCalendar}
                className="ml-3 font-semibold underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading */}
          {calendarLoading && (
            <div className="flex min-h-60 items-center justify-center gap-3">
              <Loader2
                size={24}
                className="animate-spin text-primary"
              />
              <span className="text-sm text-muted-foreground">
                Loading calendar...
              </span>
            </div>
          )}

          {/* Calendar Grid */}
          {activeCalendar &&
            !calendarError && (
              <>
                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {WEEKDAYS.map((day) => (
                    <div
                      key={day}
                      className="py-2 text-center text-xs font-semibold text-muted-foreground"
                    >
                      {day}
                    </div>
                  ))}

                  {monthCells.map((day, index) => {
                    if (!day) {
                      return (
                        <div
                          key={`empty-${index}`}
                          className="min-h-20"
                        />
                      );
                    }

                    const info = getDayInfo(day);

                    const isPast = day < today;
                    const tooFar =
                      day > maximumDate;

                    const selected =
                      day >= startDate &&
                      day <= endDate;

                    let label = "Available";
                    let appearance =
                      "border-border bg-background hover:bg-accent";

                    if (info.blocked) {
                      label = "Blocked";
                      appearance =
                        "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300";
                    } else if (
                      info.confirmed > 0
                    ) {
                      label =
                        `${info.confirmed} reserved`;
                      appearance =
                        "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300";
                    } else if (
                      info.pending > 0
                    ) {
                      label =
                        `${info.pending} held`;
                      appearance =
                        "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300";
                    } else if (
                      info.completed > 0
                    ) {
                      label = "Completed";
                      appearance =
                        "border-border bg-muted";
                    } else if (
                      info.available === 0
                    ) {
                      label = "No stock";
                      appearance =
                        "border-border bg-muted";
                    }

                    return (
                      <button
                        key={day}
                        type="button"
                        disabled={
                          isPast ||
                          tooFar ||
                          saving
                        }
                        onClick={() =>
                          selectDate(day)
                        }
                        aria-label={`${day}: ${label}`}
                        aria-pressed={selected}
                        className={`flex min-h-20 flex-col items-start justify-between rounded-lg border p-1.5 text-left transition-colors sm:min-h-24 sm:p-2.5 ${appearance} ${
                          selected
                            ? "ring-2 ring-primary ring-offset-1"
                            : ""
                        } ${
                          isPast || tooFar
                            ? "cursor-not-allowed opacity-40"
                            : ""
                        }`}
                      >
                        <span className="text-sm font-bold">
                          {Number(
                            day.slice(-2)
                          )}
                        </span>

                        <span className="break-words text-[10px] font-medium leading-3 sm:text-xs">
                          {label}
                        </span>

                        {(
                          info.confirmed > 0 ||
                          info.pending > 0
                        ) && (
                          <span className="text-[10px] leading-3">
                            {info.available} left
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                  <span>🟢 Available</span>
                  <span>🔵 Reserved</span>
                  <span>🟠 Checkout Hold</span>
                  <span>🔴 Blocked</span>
                </div>
              </>
            )}
        </section>
      )}

      {/* Edit Availability */}
      {selectedId && (
        <form
          onSubmit={handleSave}
          className="space-y-5 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
        >
          <div>
            <h3 className="text-lg font-bold">
              Update Availability
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Block dates when the equipment
              cannot be rented or reopen dates
              you previously blocked.
            </p>
          </div>

          {/* Action Selector */}
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={saving}
              onClick={() =>
                setAction("block")
              }
              className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${
                action === "block"
                  ? "border-red-300 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
                  : "border-border hover:bg-accent"
              }`}
            >
              <LockKeyhole size={17} />
              Block Dates
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() =>
                setAction("unblock")
              }
              className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${
                action === "unblock"
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300"
                  : "border-border hover:bg-accent"
              }`}
            >
              <UnlockKeyhole size={17} />
              Reopen Dates
            </button>
          </div>

          {/* Date Range */}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">
              Start Date

              <input
                type="date"
                required
                min={today}
                max={maximumDate}
                disabled={saving}
                value={startDate}
                onChange={(event) => {
                  const date =
                    event.target.value;

                  setStartDate(date);

                  if (
                    !endDate ||
                    endDate < date
                  ) {
                    setEndDate(date);
                  }
                }}
                className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 outline-none focus:border-primary"
              />
            </label>

            <label className="text-sm font-medium">
              End Date

              <input
                type="date"
                required
                min={startDate || today}
                max={maximumDate}
                disabled={saving}
                value={endDate}
                onChange={(event) =>
                  setEndDate(
                    event.target.value
                  )
                }
                className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 outline-none focus:border-primary"
              />
            </label>
          </div>

          {/* Validation */}
          <p className="text-xs text-muted-foreground">
            Selected duration: {rangeDays}{" "}
            {rangeDays === 1
              ? "day"
              : "days"}
            . You can manage up to 60 days
            at once, within the next year.
          </p>

          {!validRange && (
            <p
              role="alert"
              className="text-xs font-medium text-destructive"
            >
              Select a valid future date range
              of 1–60 days.
            </p>
          )}

          <div className="flex items-start gap-2 rounded-xl bg-muted/50 p-4">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0 text-primary"
            />

            <p className="text-xs leading-5 text-muted-foreground">
              Blocking dates prevents new
              rentals on those days. Existing
              confirmed rentals and active
              Checkout reservations cannot be
              overridden. Reopening dates
              removes only your manual blocks.
            </p>
          </div>

          <button
            type="submit"
            disabled={
              saving ||
              !validRange ||
              !activeCalendar ||
              Boolean(calendarError)
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving ? (
              <Loader2
                size={18}
                className="animate-spin"
              />
            ) : action === "block" ? (
              <LockKeyhole size={18} />
            ) : (
              <UnlockKeyhole size={18} />
            )}

            {saving
              ? "Saving Availability..."
              : action === "block"
                ? "Block Selected Dates"
                : "Reopen Selected Dates"}
          </button>
        </form>
      )}
    </div>
  );
}
