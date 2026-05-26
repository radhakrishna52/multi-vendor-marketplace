import { Link } from 'react-router-dom';

export default function VendorCard({ vendor }) {
  return (
    <div className="group bg-white border border-[#E8E8E8] rounded-sm p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      {/* Logo */}
      <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37]/20 to-[#B76E79]/20 rounded-sm mb-5 flex items-center justify-center border border-[#E8E8E8]">
        <span className="text-2xl">🏪</span>
      </div>

      {/* Verified Badge */}
      {vendor.verified && (
        <div className="mb-3">
          <span className="px-2 py-0.5 text-xs font-semibold tracking-widest uppercase bg-[#D4AF37] text-[#1A1A1A]"
            style={{ fontFamily: "'Montserrat', sans-serif" }}>✦ Verified</span>
        </div>
      )}

      <h3 className="font-bold text-[#1A1A1A] text-lg mb-2 group-hover:text-[#D4AF37] transition"
        style={{ fontFamily: "'Montserrat', sans-serif" }}>{vendor.business_name}</h3>
      <p className="text-sm text-[#5A5A5A] mb-4 line-clamp-2 leading-relaxed">{vendor.description}</p>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-5">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-sm ${i < Math.round(vendor.rating || 0) ? 'text-[#D4AF37]' : 'text-[#ddd]'}`}>★</span>
        ))}
        <span className="text-xs text-[#999] ml-1 font-medium">{vendor.rating?.toFixed(1)}</span>
      </div>

      <Link
        to={`/vendors/${vendor.id}`}
        className="block w-full py-2.5 text-center text-xs font-semibold tracking-widest uppercase border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1A1A1A] transition-all duration-300"
        style={{ fontFamily: "'Montserrat', sans-serif" }}>
        View Store
      </Link>
    </div>
  );
}
