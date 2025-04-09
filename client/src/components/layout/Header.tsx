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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest('.mobile-menu') && !target.closest('.menu-button')) {
          setMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: 'fa-home' },
    { path: '/announcements', label: 'Announcements', icon: 'fa-bullhorn' },
    { path: '/finance', label: 'Finance', icon: 'fa-chart-line' },
    { path: '/contact', label: 'Contact', icon: 'fa-envelope' },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-gradient-to-r from-purple-800 to-purple-600 backdrop-blur-sm shadow-lg py-2' 
        : 'bg-gradient-to-r from-purple-900 to-purple-700 py-4'
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <div className="flex items-center cursor-pointer group">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-white to-purple-100 flex items-center justify-center text-transparent bg-clip-text bg-gradient-to-br from-purple-700 to-purple-500 font-bold mr-3 shadow-md transition-all group-hover:shadow-purple-300/30 ${
                scrolled ? 'scale-90' : 'scale-100'
              }`}>
                CG
              </div>
              <h1 className={`font-bold transition-all bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200 ${
                scrolled ? 'text-xl' : 'text-2xl'
              }`}>CryptGen</h1>
            </div>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-2">
          {navLinks.map((link) => (
            <Link key={link.path} href={link.path}>
              <div className={`font-medium cursor-pointer transition-all duration-200 px-5 py-2 rounded-full ${
                currentPath === link.path 
                  ? 'bg-white text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-purple-600 shadow-md'
                  : 'text-white hover:bg-white/10 hover:shadow-inner'
              }`}>
                <i className={`fas ${link.icon} mr-2 ${currentPath !== link.path ? 'opacity-70' : ''}`}></i>
                <span className="inline-block transform transition-transform duration-300 hover:translate-x-1">{link.label}</span>
              </div>
            </Link>
          ))}
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="menu-button md:hidden text-white bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-600 hover:to-purple-400 p-3 rounded-full transition-all shadow-md hover:shadow-lg active:scale-95"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>
      
      {/* Mobile Navigation - Full Screen Overlay */}
      <div className={`fixed inset-0 bg-gradient-to-b from-purple-900/95 to-purple-800/95 backdrop-blur-sm z-50 md:hidden transition-all duration-300 mobile-menu ${
        mobileMenuOpen 
          ? 'opacity-100 pointer-events-auto' 
          : 'opacity-0 pointer-events-none'
      }`}>
        <div className="flex flex-col h-full px-6 py-24 items-center justify-center space-y-6">
          {navLinks.map((link) => (
            <Link key={link.path} href={link.path}>
              <div 
                className={`text-center py-4 px-10 rounded-2xl font-medium text-lg w-full max-w-xs cursor-pointer transition-all transform hover:scale-105 ${
                  currentPath === link.path 
                    ? 'bg-gradient-to-r from-white to-purple-100 text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-purple-600 shadow-lg'
                    : 'text-white border border-purple-500/30 hover:bg-white/10'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <i className={`fas ${link.icon} text-xl mb-2 block`}></i>
                {link.label}
              </div>
            </Link>
          ))}
        </div>
        <button 
          className="absolute top-6 right-6 text-white bg-purple-700/80 p-3 rounded-full"
          onClick={() => setMobileMenuOpen(false)}
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;
