import { useEffect, useState } from 'react';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Animate loading progress
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative rounded-2xl overflow-hidden h-[70vh] max-h-[600px] min-h-[450px] mb-12 shadow-xl">
      {/* Background with parallax effect */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80"
          alt="Modern Classroom"
          className="w-full h-full object-cover filter brightness-[0.85] transform scale-110 motion-safe:animate-slow-zoom"
        />
      </div>
      
      {/* Color overlay with modern gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-purple-800/80 to-indigo-700/70 flex items-center">
        {/* Animated shapes for modern effect */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-[10%] right-[15%] w-64 h-64 rounded-full bg-purple-400/30 animate-float-slow"></div>
          <div className="absolute bottom-[20%] left-[10%] w-48 h-48 rounded-full bg-indigo-400/20 animate-float-medium"></div>
          <div className="absolute top-[40%] left-[25%] w-32 h-32 rounded-full bg-pink-400/20 animate-float-fast"></div>
        </div>
        
        <div className="container mx-auto px-6 md:px-12">
          <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} text-white max-w-2xl`}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200 animate-pulse-subtle">
              Welcome to CryptGen
            </h1>
            
            {/* Animated progress bar */}
            <div className="h-1.5 w-36 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 rounded-full mb-6 relative overflow-hidden">
              <div 
                className="absolute top-0 left-0 bottom-0 rounded-full bg-white/30"
                style={{ width: `${loadingProgress}%`, transition: 'width 0.5s ease-out' }}
              ></div>
            </div>
            
            <p className="text-base md:text-xl max-w-2xl mb-8 text-purple-100 leading-relaxed">
              A <span className="font-semibold text-white">collaborative community</span> of students dedicated to excellence and innovation in cryptography and generation of secure systems.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium rounded-full shadow-lg hover:shadow-purple-500/30 transition duration-300 transform hover:-translate-y-1 active:scale-95">
                <i className="fas fa-graduation-cap mr-2"></i>
                Explore Classes
              </button>
              <button className="px-8 py-4 bg-transparent border-2 border-purple-300/50 text-white font-medium rounded-full hover:bg-white/10 transition duration-300 backdrop-blur-sm active:scale-95">
                <i className="fas fa-users mr-2"></i>
                Join Community
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom gradient and animated wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="h-24 bg-gradient-to-t from-purple-900/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-12 opacity-30">
          <svg className="w-full h-full" viewBox="0 0 1440 54" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1440 27.4774C1352.73 19.8184 1122.41 49.0556 899.331 21.1953C620.48 -15.6821 347.497 38.2198 0 27.4803V54H1440V27.4774Z" fill="url(#paint0_linear)"/>
            <defs>
              <linearGradient id="paint0_linear" x1="720" y1="0" x2="720" y2="54" gradientUnits="userSpaceOnUse">
                <stop stopColor="white" stopOpacity="0.3"/>
                <stop offset="1" stopColor="white" stopOpacity="0"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
