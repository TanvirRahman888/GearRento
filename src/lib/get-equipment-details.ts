
import type { PublicEquipment } from "@/lib/equipment";

export type PublicEquipmentDetails =
  PublicEquipment & {
    descriptionHtml: string;
  };

type EquipmentDetailsResponse = {
  success: boolean;
  equipment?: PublicEquipmentDetails;
  error?: string;
};

export async function getPublicEquipmentDetails(
  id: string
): Promise<PublicEquipmentDetails | null> {
  // Invalid equipment ID
  if (!/^[a-f0-9]{24}$/i.test(id)) {
    return null;
  }

  const apiURL =
    process.env.EQUIPMENT_API_URL ||
    process.env.NEXT_PUBLIC_API_URL;

  if (!apiURL) {
    throw new Error(
      "Equipment API URL is not configured."
    );
  }

  const response = await fetch(
    `${apiURL.replace(/\/+$/, "")}/equipment/${id}`,
    {
      cache: "no-store",
    }
  );

  // Equipment does not exist or is not approved
  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      "Unable to load equipment details."
    );
  }

  const result =
    (await response.json()) as EquipmentDetailsResponse;

  if (!result.success || !result.equipment) {
    throw new Error(
      result.error || "Invalid equipment response."
    );
  }

  return result.equipment;
}
