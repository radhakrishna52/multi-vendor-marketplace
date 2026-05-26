import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-[#FAFAF8] mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF37] to-[#B76E79] rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">✦</span>
              </div>
              <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-semibold tracking-wide text-[#D4AF37]">DreamCart</span>
            </div>
            <p className="text-sm text-[#999] leading-relaxed">
              A curated multi-vendor marketplace for luxury goods from verified premium sellers worldwide.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase mb-5 text-[#D4AF37]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Shop</h4>
            <ul className="space-y-3">
              {[['All Products', '/products'], ['Jewelry', '/products?category=Jewelry'], ['Couture', '/products?category=Couture'], ['Horology', '/products?category=Horology']].map(([label, path]) => (
                <li key={label}><Link to={path} className="text-sm text-[#999] hover:text-[#D4AF37] transition">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Vendors */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase mb-5 text-[#D4AF37]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Vendors</h4>
            <ul className="space-y-3">
              {[['All Vendors', '/vendors'], ['Become a Vendor', '/register'], ['Seller Dashboard', '/seller']].map(([label, path]) => (
                <li key={label}><Link to={path} className="text-sm text-[#999] hover:text-[#D4AF37] transition">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase mb-5 text-[#D4AF37]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Account</h4>
            <ul className="space-y-3">
              {[['Login', '/login'], ['Register', '/register'], ['Cart', '/cart']].map(([label, path]) => (
                <li key={label}><Link to={path} className="text-sm text-[#999] hover:text-[#D4AF37] transition">{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent my-10" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#666]">© {new Date().getFullYear()} DreamCart. All rights reserved.</p>
          <p className="text-xs text-[#666]">Crafted with ♦ for luxury connoisseurs</p>
        </div>
      </div>
    </footer>
  );
}
