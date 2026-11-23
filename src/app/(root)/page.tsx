import CategorySection from '@/components/home/CategorySection';
import CustomerReviewsSection from '@/components/home/CustomerReviewsSection';
import HeroSection from '@/components/home/HeroSection';
import PopularEquipmentSection from '@/components/home/PopularEquipmentSection';
import RecentlyAddedSection from '@/components/home/RecentlyAddedSection';
import WhyChooseUsSection from '@/components/home/WhyChooseUsSection';

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <CategorySection />
      <PopularEquipmentSection />
      <RecentlyAddedSection />
      <WhyChooseUsSection />
      <CustomerReviewsSection />
    </div>
  );
};

export default HomePage;