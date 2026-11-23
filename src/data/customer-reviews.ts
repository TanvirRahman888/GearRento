
export interface CustomerReview {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
  initials: string;
}

// Example reviews for UI development.
// Replace with genuine customer feedback before launch.

export const customerReviews: CustomerReview[] = [
  {
    id: 1,
    name: "Tanvir Ahmed",
    location: "Dhaka, Bangladesh",
    rating: 5,
    initials: "TA",
    comment:
      "I rented a DSLR camera for a photography project. The booking process was simple, and I could easily find equipment that matched my budget.",
  },
  {
    id: 2,
    name: "Nusrat Jahan",
    location: "Chattogram, Bangladesh",
    rating: 5,
    initials: "NJ",
    comment:
      "GearRento made it convenient to explore event equipment. I really liked the clear rental pricing and the variety of available options.",
  },
  {
    id: 3,
    name: "Rakib Hasan",
    location: "Khulna, Bangladesh",
    rating: 4,
    initials: "RH",
    comment:
      "Finding power tools for my home renovation project was straightforward. The equipment listings provided useful information before booking.",
  },
  {
    id: 4,
    name: "Sadia Islam",
    location: "Rajshahi, Bangladesh",
    rating: 5,
    initials: "SI",
    comment:
      "A very useful platform for students and content creators. Renting equipment instead of purchasing expensive gear is a great option.",
  },
  {
    id: 5,
    name: "Mehedi Rahman",
    location: "Sylhet, Bangladesh",
    rating: 4,
    initials: "MR",
    comment:
      "I explored camping equipment for a weekend trip. The category filters made finding the right products much easier.",
  },
  {
    id: 6,
    name: "Farzana Akter",
    location: "Barishal, Bangladesh",
    rating: 5,
    initials: "FA",
    comment:
      "The interface is clean and easy to use. I especially liked being able to compare daily rental prices across different equipment.",
  },
];
