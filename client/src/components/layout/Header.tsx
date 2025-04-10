import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

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
    { path: '/', label: 'Home' },
    { path: '/announcements', label: 'Announcements' },
    { path: '/finance', label: 'Finance' },
    { path: '/contact', label: 'Contact' },
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
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link key={link.path} href={link.path}>
              <div className={`px-4 py-2 rounded-full font-medium transition-all duration-200 text-sm cursor-pointer ${
                currentPath === link.path 
                  ? 'bg-white/20 text-white shadow-inner'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}>
                {link.label}
              </div>
            </Link>
          ))}
        </nav>
        
        {/* Mobile Menu Button */}
        <Button 
          variant="ghost"
          size="icon"
          className="md:hidden menu-button text-white hover:bg-white/10"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
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
                className={`text-center py-3 px-8 rounded-lg font-medium text-lg w-full max-w-xs cursor-pointer transition-all ${
                  currentPath === link.path 
                    ? 'bg-white/20 text-white'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </div>
            </Link>
          ))}
        </div>
        <button 
          className="absolute top-6 right-6 text-white hover:bg-white/10 p-2 rounded-full"
          onClick={() => setMobileMenuOpen(false)}
        >
          ✕
        </button>
      </div>
    </header>
  );
};

export default Header;
