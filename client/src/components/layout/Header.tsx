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
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <a className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold mr-3">
                CG
              </div>
              <h1 className="text-2xl font-bold text-gray-800">CryptGen</h1>
            </a>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <Link key={link.path} href={link.path}>
              <a className={`font-medium ${
                currentPath === link.path 
                  ? 'text-purple-600'
                  : 'text-gray-700 hover:text-purple-600'
              }`}>
                {link.label}
              </a>
            </Link>
          ))}
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <i className="fas fa-bars text-xl"></i>
        </button>
      </div>
      
      {/* Mobile Navigation */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-4 py-3 space-y-3 bg-white border-t">
          {navLinks.map((link) => (
            <Link key={link.path} href={link.path}>
              <a 
                className={`block w-full text-left py-2 font-medium ${
                  currentPath === link.path 
                    ? 'text-purple-600'
                    : 'text-gray-700 hover:text-purple-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
