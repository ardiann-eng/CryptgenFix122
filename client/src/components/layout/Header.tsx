import { useState } from 'react';
import { Link } from 'wouter';

interface HeaderProps {
  currentPath: string;
}

const Header = ({ currentPath }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/announcements', label: 'Announcements & Schedule' },
    { path: '/finance', label: 'Finance' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <header className="bg-purple-700 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-purple-700 font-bold mr-3 shadow-md">
                CG
              </div>
              <h1 className="text-2xl font-bold text-white">CryptGen</h1>
            </div>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <Link key={link.path} href={link.path}>
              <div className={`font-medium cursor-pointer transition-all duration-200 px-3 py-1.5 rounded-md ${
                currentPath === link.path 
                  ? 'bg-white text-purple-700'
                  : 'text-white hover:bg-purple-600 hover:text-white'
              }`}>
                {link.label}
              </div>
            </Link>
          ))}
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white bg-purple-600 p-2 rounded-md"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>
      
      {/* Mobile Navigation */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-4 py-3 space-y-2 bg-purple-800 border-t border-purple-600">
          {navLinks.map((link) => (
            <Link key={link.path} href={link.path}>
              <div 
                className={`block w-full text-left py-2 px-3 rounded-md font-medium cursor-pointer ${
                  currentPath === link.path 
                    ? 'bg-white text-purple-700'
                    : 'text-white hover:bg-purple-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
