import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">CarMatch</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Find the perfect car for your lifestyle with our AI-powered recommendation engine.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 hover:text-white cursor-pointer" />
              <Twitter className="w-5 h-5 hover:text-white cursor-pointer" />
              <Instagram className="w-5 h-5 hover:text-white cursor-pointer" />
              <Mail className="w-5 h-5 hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/quiz" className="hover:text-white">Find My Car</Link></li>
              <li><Link to="/browse" className="hover:text-white">Browse Cars</Link></li>
              <li><Link to="/compare" className="hover:text-white">Compare Cars</Link></li>
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link to="/feedback" className="hover:text-white">Feedback</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link to="/cookies" className="hover:text-white">Cookie Policy</Link></li>
              <li><Link to="/disclaimer" className="hover:text-white">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 CarMatch. All rights reserved. | Made with ❤️ for car enthusiasts</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;