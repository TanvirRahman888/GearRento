
import type { Metadata } from "next";

import { BookingPaymentStatus } from "@/components/equipment/booking-payment-status";

export const metadata: Metadata = {
  title: "Booking Payment | GearRento",
};

type PageProps = {
  searchParams: Promise<{
    session_id?: string | string[];
  }>;
};

export default async function BookingSuccessPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  const sessionId =
    typeof params.session_id === "string"
      ? params.session_id
      : "";

  return (
    <BookingPaymentStatus
      sessionId={sessionId}
    />
  );
}
