
import type { Metadata } from "next";

import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { auth } from "@/lib/auth";

import { getPublicEquipmentDetails } from "@/lib/get-equipment-details";

import { EquipmentDetails } from "@/components/equipment/equipment-details";

export const metadata: Metadata = {
  title: "Equipment Details | GearRento",
  description:
    "View equipment details and book rental equipment.",
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EquipmentDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  // Fetch only approved equipment
  const equipment = await getPublicEquipmentDetails(id);

  if (!equipment) {
    notFound();
  }

  // Read the logged-in user on the server
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const viewerRole = session?.user?.role ?? null;
  const isLoggedIn = Boolean(session?.user);

  return (
    <EquipmentDetails
      equipment={equipment}
      viewerRole={viewerRole}
      isLoggedIn={isLoggedIn}
    />
  );
}
