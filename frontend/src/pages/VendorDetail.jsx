import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { PageSpinner, LoadingSpinner } from '../components/LoadingSpinner';
import { ChevronLeft } from 'lucide-react';

export default function VendorDetail() {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prodLoading, setProdLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/vendors/${id}`)
      .then(r => { setVendor(r.data); setLoading(false); })
      .catch(console.error);

    api.get('/api/products', { params: { vendor_id: id, limit: 20 } })
      .then(r => setProducts(r.data.products || []))
      .catch(console.error)
      .finally(() => setProdLoading(false));
  }, [id]);

  if (loading) return <PageSpinner />;
  if (!vendor) return (
    <div className="pt-28 text-center min-h-screen bg-[#FAFAF8]">
      <p className="text-[#5A5A5A]">Vendor not found.</p>
    </div>
  );

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#FAFAF8]">
      <div className="max-w-7xl mx-auto px-6">
        <Link to="/vendors" className="inline-flex items-center gap-2 text-sm text-[#999] hover:text-[#D4AF37] transition mb-8">
          <ChevronLeft className="w-4 h-4" /> All Vendors
        </Link>

        {/* Vendor Header */}
        <div className="bg-white border border-[#E8E8E8] p-8 mb-12 flex flex-col sm:flex-row gap-8 items-center sm:items-start">
          <div className="w-24 h-24 bg-gradient-to-br from-[#D4AF37]/20 to-[#B76E79]/20 rounded-sm flex items-center justify-center text-4xl border border-[#E8E8E8] flex-shrink-0">
            🏪
          </div>
          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap gap-3 items-center justify-center sm:justify-start mb-2">
              <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl text-[#1A1A1A]">{vendor.business_name}</h1>
              {vendor.verified && (
                <span className="px-2 py-0.5 text-xs font-semibold tracking-widest uppercase bg-[#D4AF37] text-[#1A1A1A]"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}>✦ Verified</span>
              )}
            </div>
            <div className="flex items-center gap-1 justify-center sm:justify-start mb-3">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-lg ${i < Math.round(vendor.rating || 0) ? 'text-[#D4AF37]' : 'text-[#ddd]'}`}>★</span>
              ))}
              <span className="text-sm text-[#999] ml-1">{vendor.rating?.toFixed(1)}</span>
            </div>
            <p className="text-[#5A5A5A] leading-relaxed max-w-2xl">{vendor.description}</p>
          </div>
        </div>

        {/* Products */}
        <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl text-[#1A1A1A] mb-6">Products by {vendor.business_name}</h2>
        <div className="h-px bg-gradient-to-r from-[#D4AF37] to-transparent mb-8" />

        {prodLoading ? <LoadingSpinner /> : products.length === 0 ? (
          <p className="text-[#999] text-center py-12">No products from this vendor yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
