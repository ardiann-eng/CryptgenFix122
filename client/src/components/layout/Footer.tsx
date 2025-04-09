import { Link } from 'wouter';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold mr-3">
                CG
              </div>
              <h3 className="text-xl font-bold">CryptGen</h3>
            </div>
            <p className="text-gray-400">A community of students dedicated to excellence and innovation in cryptography and technology.</p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/"><a className="text-gray-400 hover:text-white">Home</a></Link></li>
              <li><Link href="/announcements"><a className="text-gray-400 hover:text-white">Announcements</a></Link></li>
              <li><Link href="/finance"><a className="text-gray-400 hover:text-white">Finance</a></Link></li>
              <li><Link href="/contact"><a className="text-gray-400 hover:text-white">Contact</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Study Materials</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Academic Calendar</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Course Syllabus</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Faculty Directory</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for updates.</p>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="px-4 py-2 w-full rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                />
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-r-md">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} CryptGen Class. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
