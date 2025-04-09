import { Link } from 'wouter';

const Footer = () => {
  return (
    <footer className="bg-purple-900 text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-purple-700 font-bold mr-3 shadow-md">
                CG
              </div>
              <h3 className="text-xl font-bold">CryptGen</h3>
            </div>
            <p className="text-purple-200">A community of students dedicated to excellence and innovation in cryptography and technology.</p>
            <div className="mt-4 flex space-x-3">
              <div className="w-8 h-8 rounded-full bg-purple-800 hover:bg-purple-700 flex items-center justify-center transition-colors">
                <i className="fab fa-facebook-f text-white text-sm"></i>
              </div>
              <div className="w-8 h-8 rounded-full bg-purple-800 hover:bg-purple-700 flex items-center justify-center transition-colors">
                <i className="fab fa-instagram text-white text-sm"></i>
              </div>
              <div className="w-8 h-8 rounded-full bg-purple-800 hover:bg-purple-700 flex items-center justify-center transition-colors">
                <i className="fab fa-twitter text-white text-sm"></i>
              </div>
              <div className="w-8 h-8 rounded-full bg-purple-800 hover:bg-purple-700 flex items-center justify-center transition-colors">
                <i className="fab fa-youtube text-white text-sm"></i>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <div className="text-purple-200 hover:text-white cursor-pointer transition">Home</div>
                </Link>
              </li>
              <li>
                <Link href="/announcements">
                  <div className="text-purple-200 hover:text-white cursor-pointer transition">Announcements</div>
                </Link>
              </li>
              <li>
                <Link href="/finance">
                  <div className="text-purple-200 hover:text-white cursor-pointer transition">Finance</div>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <div className="text-purple-200 hover:text-white cursor-pointer transition">Contact</div>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Resources</h4>
            <ul className="space-y-2">
              <li><div className="text-purple-200 hover:text-white cursor-pointer transition">Study Materials</div></li>
              <li><div className="text-purple-200 hover:text-white cursor-pointer transition">Academic Calendar</div></li>
              <li><div className="text-purple-200 hover:text-white cursor-pointer transition">Course Syllabus</div></li>
              <li><div className="text-purple-200 hover:text-white cursor-pointer transition">Faculty Directory</div></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Newsletter</h4>
            <p className="text-purple-200 mb-4">Subscribe to our newsletter for updates.</p>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="px-4 py-2 w-full rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-900 bg-white"
                />
                <button type="submit" className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-r-md transition-colors">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="border-t border-purple-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-purple-300 text-sm">© {new Date().getFullYear()} CryptGen Class. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <div className="bg-purple-800 px-4 py-2 rounded-md text-sm">
              <span className="text-purple-300">Made with</span> <i className="fas fa-heart text-red-400 mx-1"></i> <span className="text-purple-300">by CryptGen Team</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
