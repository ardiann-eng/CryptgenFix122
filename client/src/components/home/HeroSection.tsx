import { useEffect, useState } from 'react';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative rounded-xl overflow-hidden h-72 md:h-[500px] mb-12 shadow-xl">
      <img
        src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80"
        alt="Modern Classroom"
        className="w-full h-full object-cover filter brightness-[0.85]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-purple-800/70 to-purple-600/60 flex items-center">
        <div className="container mx-auto px-6 md:px-12">
          <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} text-white max-w-2xl`}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
              Welcome to CryptGen
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded mb-6"></div>
            <p className="text-lg md:text-xl max-w-2xl mb-8 text-purple-100">
              A collaborative community of students dedicated to excellence and innovation in cryptography and generation of secure systems.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-white text-purple-700 font-medium rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
                Explore Classes
              </button>
              <button className="px-6 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition duration-300">
                Join Community
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-purple-900/30 to-transparent"></div>
    </div>
  );
};

export default HeroSection;
