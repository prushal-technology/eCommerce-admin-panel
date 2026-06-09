import FaqSection from '../components/FaqSection';
import FeatureSection from '../components/FeatureSection';
import HeroSection from '../components/HeroSection';
import SeoSection from '../components/SeoSection';
import WhyChooseSection from '../components/WhyChooseSection';

const HomeTab = () => {
  return (
    <>
      <HeroSection />
      <WhyChooseSection />
      <FeatureSection />
      <FaqSection />
      <SeoSection />
    </>
  );
};

export default HomeTab;