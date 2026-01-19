import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-20 px-6 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* BRAND INFO */}
          <div className="lg:col-span-2 space-y-4">
            <div className="text-2xl font-bold text-white tracking-tighter">CrewControl</div>
            <p className="text-sm leading-relaxed max-w-xs">
              Revolutionizing workforce management with privacy-first scheduling and enterprise-grade security.
            </p>
            {/* Social Media Links */}
            <div className="flex items-center gap-4 pt-4">
              <a 
                href="https://linkedin.com/company/crewcontrol" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-purple-500/20 hover:border-purple-500/30 hover:text-purple-400 transition-all duration-300 group"
                aria-label="Connect on LinkedIn"
              >
                <Linkedin size={18} className="group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
          
          {/* PRODUCT SECTION */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Product</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/changelog" className="hover:text-purple-400 transition-colors cursor-pointer">Changelog</Link></li>
              <li><Link to="/documentation" className="hover:text-purple-400 transition-colors cursor-pointer">Documentation</Link></li>
              <li><Link to="/api" className="hover:text-purple-400 transition-colors cursor-pointer">API Status</Link></li>
            </ul>
          </div>

          {/* RESOURCES SECTION */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Resources</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/blog" className="hover:text-purple-400 transition-colors cursor-pointer">Blog</Link></li>
              <li><Link to="/integrations" className="hover:text-purple-400 transition-colors cursor-pointer">Integrations</Link></li>
            </ul>
          </div>

          {/* COMPANY SECTION */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Company</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/about" className="hover:text-purple-400 transition-colors cursor-pointer">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-purple-400 transition-colors cursor-pointer">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* LEGAL SECTION */}
        <div className="pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-6 text-sm">
              <Link to="/privacy" className="hover:text-purple-400 transition-colors cursor-pointer">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-purple-400 transition-colors cursor-pointer">Terms of Service</Link>
              <Link to="/security" className="hover:text-purple-400 transition-colors cursor-pointer">Security</Link>
            </div>
            <div className="text-[10px] uppercase tracking-widest font-bold opacity-30">
              © 2026 CrewControl Inc. Built for the modern workforce.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;