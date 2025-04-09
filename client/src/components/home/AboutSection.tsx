const AboutSection = () => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">About Our Class</h2>
      <div className="bg-white rounded-xl shadow-sm p-6 mb-10">
        <p className="text-gray-700 mb-6">
          CryptGen is a dynamic class focused on exploring cryptography and next-generation technologies. 
          Our community consists of 41 dedicated students working together to achieve academic excellence 
          and personal growth.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-purple-50 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-purple-700 mb-3">Our Mission</h3>
            <p className="text-gray-700">
              To create a supportive learning environment where students can develop their skills, 
              collaborate effectively, and prepare for future challenges in technology and innovation.
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-purple-700 mb-3">Class Activities</h3>
            <p className="text-gray-700">
              Regular study sessions, collaborative projects, community outreach programs, 
              and networking events with industry professionals.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
