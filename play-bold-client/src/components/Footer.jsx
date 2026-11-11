import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-white/60 text-sm pt-12 pb-6 border-t border-white/10">
      <div className="container mx-auto px-6 lg:px-16">
        <div className="flex flex-col md:flex-row justify-between gap-8 border-b border-white/10 pb-8 mb-6">
          {/* Brand Column */}
          <div className="space-y-2">
            <span className="text-2xl font-black text-white">playbold<span className="text-red-500">shoes</span></span>
            <p className="text-xs text-white/40 max-w-xs leading-relaxed">
              Engineered for the fearless. Street, sport, speed.
            </p>
          </div>

          {/* Links Columns */}
          <div className="flex flex-wrap gap-10">
            <div>
              <h4 className="font-semibold text-white text-sm mb-3">Shop</h4>
              <ul className="space-y-1.5 text-xs">
                <li><Link to="/men/shoes" className="hover:text-white transition">Men</Link></li>
                <li><Link to="/women/shoes" className="hover:text-white transition">Women</Link></li>
                <li><Link to="/kids/shoes                                                       " className="hover:text-white transition">Kids</Link></li>
                <li><Link to="/sale" className="hover:text-white transition">Sale</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-3">Support</h4>
              <ul className="space-y-1.5 text-xs">
                <li><Link to="/shipping" className="hover:text-white transition">Shipping</Link></li>
                <li><Link to="/returns" className="hover:text-white transition">Returns</Link></li>
                <li><Link to="/size-guide" className="hover:text-white transition">Size Guide</Link></li>
                <li><Link to="/faq" className="hover:text-white transition">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-3">Company</h4>
              <ul className="space-y-1.5 text-xs">
                <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
                <li><Link to="/careers" className="hover:text-white transition">Careers</Link></li>
                <li><Link to="/press" className="hover:text-white transition">Press</Link></li>
                <li><Link to="/sustainability" className="hover:text-white transition">Sustainability</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Copyright with playboldshoes */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-[10px] text-white/30 uppercase tracking-wider">
          <span>© 2025 playboldshoes — All rights reserved. PUMA, NIKE, ADIDAS trademarks belong to their respective owners.</span>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-white transition">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;