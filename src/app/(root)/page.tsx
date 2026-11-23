import CategorySection from '@/components/home/CategorySection';
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
    </div>
  );
};

export default HomePage;