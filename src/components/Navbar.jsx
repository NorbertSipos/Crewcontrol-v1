import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      // Trigger the glass effect after 20px of scrolling
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle scroll to section when hash is present in URL
  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const hash = location.hash.substring(1); // Remove the # symbol
      // Use a longer delay to account for ScrollToTop component and page render
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          const offset = 80; // Account for navbar height
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 300); // Delay to ensure DOM is ready and ScrollToTop has finished
    }
  }, [location.pathname, location.hash]);

  const handleHomeClick = (e) => {
    if (location.pathname === '/') {
      // Already on home page, check if scrolled down
      if (window.scrollY > 0) {
        e.preventDefault();
        // Clear hash from URL
        window.history.replaceState(null, '', '/');
        // Scroll to top smoothly
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
      // If already at top, let the default Link behavior work (just updates URL)
    }
    // If not on home page, let the default Link navigation work
    // Close mobile menu if open
    setIsMenuOpen(false);
  };

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    
    if (location.pathname === '/') {
      // Already on home page, just scroll
      const element = document.getElementById(targetId);
      if (element) {
        const offset = 80; // Account for navbar height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
      // Update URL hash
      window.history.replaceState(null, '', `#${targetId}`);
    } else {
      // Navigate to home with hash, useEffect will handle scrolling
      navigate(`/#${targetId}`);
    }
    
    // Close mobile menu if open
    setIsMenuOpen(false);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 border-b ${
        scrolled 
          ? "bg-indigo-950/40 backdrop-blur-xl border-white/10 py-3 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]" 
          : "bg-transparent border-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          
          {/* Logo Area */}
          <div className="flex items-center">
            <Link to="/" onClick={handleHomeClick} className="flex items-center gap-2 cursor-pointer group">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-all duration-300">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white group-hover:text-purple-100 transition-colors">
                CrewControl
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link
              to="/"
              onClick={handleHomeClick}
              className="text-sm font-medium text-purple-100 hover:text-white transition-colors cursor-pointer relative group/nav"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover/nav:w-full"></span>
            </Link>
            <a
              href="#features"
              onClick={(e) => handleNavClick(e, 'features')}
              className="text-sm font-medium text-purple-100 hover:text-white transition-colors cursor-pointer relative group/nav"
            >
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover/nav:w-full"></span>
            </a>
            <a
              href="#pricing"
              onClick={(e) => handleNavClick(e, 'pricing')}
              className="text-sm font-medium text-purple-100 hover:text-white transition-colors cursor-pointer relative group/nav"
            >
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover/nav:w-full"></span>
            </a>
            <a
              href="#faq"
              onClick={(e) => handleNavClick(e, 'faq')}
              className="text-sm font-medium text-purple-100 hover:text-white transition-colors cursor-pointer relative group/nav"
            >
              FAQ
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover/nav:w-full"></span>
            </a>
            <Link
              to="/contact"
              className="text-sm font-medium text-purple-100 hover:text-white transition-colors cursor-pointer relative group/nav"
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover/nav:w-full"></span>
            </Link>

            <div className="flex items-center gap-4 ml-4">
              <Link 
                to="/signin" 
                className="text-sm font-medium text-purple-100 hover:text-white transition-colors cursor-pointer relative group/nav"
              >
                Sign In
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover/nav:w-full"></span>
              </Link>
              <Link to="/pricing">
                <button className="bg-white text-purple-700 px-6 py-2.5 rounded-full font-bold hover:bg-purple-50 hover:-translate-y-1 active:scale-95 transition-all duration-300 shadow-lg shadow-purple-900/40 cursor-pointer flex items-center gap-2 text-sm">
                  Get Started <ArrowRight size={16} />
                </button>
              </Link>
            </div>
          </div>

          {/* Mobile button */}
          <div className="lg:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="text-white p-2 hover:bg-white/10 rounded-lg"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-indigo-950/95 backdrop-blur-xl border-b border-white/10 p-6 space-y-4 shadow-2xl">
          <Link
            to="/"
            className="block text-lg font-medium text-white"
            onClick={handleHomeClick}
          >
            Home
          </Link>
          <a
            href="#features"
            onClick={(e) => handleNavClick(e, 'features')}
            className="block text-lg font-medium text-white"
          >
            Features
          </a>
          <a
            href="#pricing"
            onClick={(e) => {
              handleNavClick(e, 'pricing');
              setIsMenuOpen(false);
            }}
            className="block text-lg font-medium text-white"
          >
            Pricing
          </a>
          <a
            href="#faq"
            onClick={(e) => handleNavClick(e, 'faq')}
            className="block text-lg font-medium text-white"
          >
            FAQ
          </a>
          <Link
            to="/contact"
            className="block text-lg font-medium text-white"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
          <Link to="/pricing" onClick={() => setIsMenuOpen(false)}>
            <button className="w-full bg-white text-purple-700 py-4 rounded-xl font-bold shadow-lg">
              Get Started
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;