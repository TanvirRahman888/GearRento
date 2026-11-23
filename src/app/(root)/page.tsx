import BecomeOwnerSection from "@/components/home/BecomeOwnerSection";
import CategorySection from "@/components/home/CategorySection";
import CustomerReviewsSection from "@/components/home/CustomerReviewsSection";
import FAQSection from "@/components/home/FAQSection";
import HeroSection from "@/components/home/HeroSection";
import PopularEquipmentSection from "@/components/home/PopularEquipmentSection";
import RecentlyAddedSection from "@/components/home/RecentlyAddedSection";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <CategorySection />
      <PopularEquipmentSection />
      <RecentlyAddedSection />
      <WhyChooseUsSection />
      <BecomeOwnerSection applyHref="/register" />
      <CustomerReviewsSection />
      <FAQSection />
    </div>
  );
};

export default HomePage;
