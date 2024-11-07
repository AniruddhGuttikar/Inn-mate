import { Facebook, Twitter, Instagram, Mail, Phone } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 px-4">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo and Introduction */}
        <div>
          <h2 className="text-2xl font-bold text-white">InnMate</h2>
          <p className="mt-2 text-gray-400">
            Experience comfort and luxury at InnMate, where every stay is tailored for your ultimate satisfaction.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-white">About Us</a></li>
            <li><a href="/" className="hover:text-white">Rooms & Suites</a></li>
            <li><a href="/" className="hover:text-white">Services</a></li>
            <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
          </ul>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Contact Us</h3>
          <div className="flex items-center space-x-2">
            <Mail className="text-white" />
            <span>contact@innmate.com</span>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <Phone className="text-white" />
            <span>+1 234 567 890</span>
          </div>
          <div className="flex space-x-4 mt-4">
            <a href="https://facebook.com" className="hover:text-white"><Facebook /></a>
            <a href="https://twitter.com" className="hover:text-white"><Twitter /></a>
            <a href="https://instagram.com" className="hover:text-white"><Instagram /></a>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} InnMate. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
