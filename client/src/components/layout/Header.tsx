import { useState, useEffect } from 'react';
import { Link } from 'wouter';

interface HeaderProps {
  currentPath: string;
}

const Header = ({ currentPath }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/announcements', label: 'Announcements' },
    { path: '/finance', label: 'Finance' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-purple-700/95 backdrop-blur-sm shadow-lg py-2' 
        : 'bg-purple-700 py-3'
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center text-purple-700 font-bold mr-3 shadow-md transition-all ${
                scrolled ? 'scale-90' : 'scale-100'
              }`}>
                CG
              </div>
              <h1 className={`font-bold text-white transition-all ${
                scrolled ? 'text-xl' : 'text-2xl'
              }`}>CryptGen</h1>
            </div>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-1">
          {navLinks.map((link) => (
            <Link key={link.path} href={link.path}>
              <div className={`font-medium cursor-pointer transition-all duration-200 px-4 py-2 rounded-full ${
                currentPath === link.path 
                  ? 'bg-white text-purple-700 shadow-md'
                  : 'text-white hover:bg-purple-600/50'
              }`}>
                {link.label}
              </div>
            </Link>
          ))}
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white bg-purple-600 hover:bg-purple-500 p-2 rounded-full transition-colors"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>
      
      {/* Mobile Navigation */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        mobileMenuOpen 
          ? 'max-h-64 opacity-100' 
          : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="px-4 py-3 space-y-2 bg-purple-800 border-t border-purple-600">
          {navLinks.map((link) => (
            <Link key={link.path} href={link.path}>
              <div 
                className={`block w-full text-left py-2 px-3 rounded-full font-medium cursor-pointer transition-colors ${
                  currentPath === link.path 
                    ? 'bg-white text-purple-700'
                    : 'text-white hover:bg-purple-600/50'
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
