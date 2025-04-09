import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import CoreTeamSection from '@/components/home/CoreTeamSection';
import ClassMembersSection from '@/components/home/ClassMembersSection';

const Home = () => {
  return (
    <div className="animate-fade-in">
      <HeroSection />
      <AboutSection />
      <CoreTeamSection />
      <ClassMembersSection />
    </div>
  );
};

export default Home;
