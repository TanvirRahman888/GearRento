
export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    id: 1,
    question: "What is GearRento?",
    answer:
      "GearRento is an online equipment rental marketplace that connects equipment owners with people who need to rent tools, cameras, construction equipment, camping gear, electronics, and more.",
  },
  {
    id: 2,
    question: "How can I rent equipment on GearRento?",
    answer:
      "Browse available equipment, choose a product that meets your needs, and sign in to view its details. Follow the booking steps to select your rental period and complete your reservation.",
  },
  {
    id: 3,
    question: "Do I need an account to rent equipment?",
    answer:
      "You can explore equipment listings and categories without an account. However, you need to sign in or create an account to access protected equipment details and complete rental bookings.",
  },
  {
    id: 4,
    question: "How is the equipment rental price calculated?",
    answer:
      "Each equipment listing displays a daily rental price in Bangladeshi Taka (BDT). The total rental cost depends on your selected rental duration and any applicable charges shown during checkout.",
  },
  {
    id: 5,
    question: "How do I check equipment availability?",
    answer:
      "Equipment listings show inventory availability where applicable. Actual availability for your requested rental dates should be checked during the booking process.",
  },
  {
    id: 6,
    question: "Which locations does GearRento support?",
    answer:
      "GearRento allows equipment owners to list their products across Bangladesh's eight divisions: Dhaka, Chattogram, Rajshahi, Khulna, Barishal, Sylhet, Rangpur, and Mymensingh. Available equipment depends on active listings in each location.",
  },
  {
    id: 7,
    question: "Can I list my own equipment for rent?",
    answer:
      "Yes! You can apply to become an equipment owner on GearRento. After your owner account is approved, you can submit equipment listings with photos, descriptions, rental prices, and availability information.",
  },
  {
    id: 8,
    question: "Are equipment listings reviewed before publication?",
    answer:
      "Yes. Equipment listings go through an administrative review process before appearing publicly on GearRento. Approval helps maintain listing quality, but renters should still review the equipment details before booking.",
  },
];
