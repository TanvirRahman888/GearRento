import CategorySection from '@/components/home/CategorySection';
import CustomerReviewsSection from '@/components/home/CustomerReviewsSection';
import HeroSection from '@/components/home/HeroSection';
import PopularEquipmentSection from '@/components/home/PopularEquipmentSection';
import WhyChooseUsSection from '@/components/home/WhyChooseUsSection';

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <CategorySection />
      <PopularEquipmentSection />
      <WhyChooseUsSection />
      <CustomerReviewsSection />
    </div>
  );
};

export default HomePage;