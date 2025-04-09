import { Link } from "wouter";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  MapPin, 
  Mail, 
  Phone 
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 font-sans">CryptGen</h3>
            <p className="text-gray-300 text-sm mb-4">
              A comprehensive portal for CryptGen class management and communication.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 font-sans">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/">
                  <a className="text-gray-300 hover:text-white transition">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/announcements">
                  <a className="text-gray-300 hover:text-white transition">Announcements</a>
                </Link>
              </li>
              <li>
                <Link href="/financial">
                  <a className="text-gray-300 hover:text-white transition">Financial Dashboard</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-gray-300 hover:text-white transition">Contact</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 font-sans">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-white transition">Study Materials</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Class Calendar</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Photo Gallery</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Help Center</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 font-sans">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5" />
                <span className="text-gray-300">Computer Science Building, University Campus, Jakarta 12345</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                <a href="mailto:cryptgen.class@example.com" className="text-gray-300 hover:text-white transition">
                  cryptgen.class@example.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                <span className="text-gray-300">+62 812 3456 7890</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-300">&copy; 2023 CryptGen Class. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-sm text-gray-300 hover:text-white transition">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-300 hover:text-white transition">Terms of Service</a>
            <a href="#" className="text-sm text-gray-300 hover:text-white transition">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
