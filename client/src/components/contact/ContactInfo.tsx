import React from 'react';

const ContactInfo = () => {
  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="p-2 bg-purple-100 rounded-md mr-4">
                <i className="fas fa-map-marker-alt text-purple-600"></i>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Location</h4>
                <p className="text-gray-600">Fakultas Ilmu pendidikan Jl. Pendidikan I No.27, Tidung, Kec. Rappocini, Kota Makassar, Sulawesi Selatan 90222</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="p-2 bg-purple-100 rounded-md mr-4">
                <i className="fas fa-envelope text-purple-600"></i>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Email</h4>
                <p className="text-gray-600">cryptgen23@gmail.com</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="p-2 bg-purple-100 rounded-md mr-4">
                <i className="fas fa-phone text-purple-600"></i>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Phone</h4>
                <p className="text-gray-600">0895393712762</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Follow Us</h3>
        </div>
        
        <div className="p-6">
          <div className="flex space-x-4">
            <a href="https://instagram.com/cryptgen.23" target="_blank" rel="noopener noreferrer" className="p-2 bg-pink-100 rounded-full text-pink-600 hover:bg-pink-200">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-600">Follow us on Instagram: <a href="https://instagram.com/cryptgen.23" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">@cryptgen.23</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
