
import {
  Camera,
  Wrench,
  Tent,
  Video,
  PartyPopper,
  Dumbbell,
  Boxes,
  HardHat,
  Flower2,
  Laptop,
  WashingMachine,
  Music2,
  HeartPulse,
  CarFront,
  type LucideIcon,
} from "lucide-react";

export interface EquipmentCategory {
  name: string;
  description: string;
  icon: LucideIcon;
}

export const equipmentCategories: EquipmentCategory[] = [
  {
    name: "Photography",
    description: "Cameras, lenses & more",
    icon: Camera,
  },
  {
    name: "Power Tools",
    description: "Tools for every job",
    icon: Wrench,
  },
  {
    name: "Camping",
    description: "Outdoor adventure gear",
    icon: Tent,
  },
  {
    name: "Audio & Video",
    description: "Recording & production",
    icon: Video,
  },
  {
    name: "Events",
    description: "Event & party essentials",
    icon: PartyPopper,
  },
  {
    name: "Sports",
    description: "Sports & fitness gear",
    icon: Dumbbell,
  },
  {
    name: "Other",
    description: "Explore more equipment",
    icon: Boxes,
  },
  {
    name: "Construction Equipment",
    description: "Heavy-duty machinery",
    icon: HardHat,
  },
  {
    name: "Gardening",
    description: "Garden & lawn tools",
    icon: Flower2,
  },
  {
    name: "Computers & IT",
    description: "Laptops & tech gear",
    icon: Laptop,
  },
  {
    name: "Home Appliances",
    description: "Everyday home essentials",
    icon: WashingMachine,
  },
  {
    name: "Musical Instruments",
    description: "Instruments & accessories",
    icon: Music2,
  },
  {
    name: "Medical Equipment",
    description: "Healthcare equipment",
    icon: HeartPulse,
  },
  {
    name: "Automotive",
    description: "Vehicle tools & gear",
    icon: CarFront,
  },
];
