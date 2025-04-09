const HeroSection = () => {
  return (
    <div className="relative rounded-xl overflow-hidden h-64 md:h-96 mb-8">
      <img
        src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80"
        alt="Modern Classroom"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-800/70 to-purple-600/40 flex items-center">
        <div className="px-6 md:px-12 text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Welcome to CryptGen</h1>
          <p className="text-lg md:text-xl max-w-2xl">
            A collaborative community of students dedicated to excellence and innovation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
