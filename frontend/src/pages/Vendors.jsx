import { useEffect, useState } from 'react';
import api from '../utils/api';
import VendorCard from '../components/VendorCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Search } from 'lucide-react';

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/api/vendors')
      .then(r => setVendors(r.data.vendors || r.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = vendors.filter(v =>
    !search || v.business_name?.toLowerCase().includes(search.toLowerCase()) ||
    v.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#FAFAF8]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest text-[#D4AF37] uppercase mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>Our Partners</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl text-[#1A1A1A]">Premium Vendors</h1>
          <div className="h-px w-20 bg-[#D4AF37] mt-3" />
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-10">
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search vendors..."
            className="w-full px-4 py-3 border border-[#E8E8E8] text-sm focus:outline-none focus:border-[#D4AF37] bg-white" />
          <Search className="absolute right-4 top-3.5 w-4 h-4 text-[#999]" />
        </div>

        {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🏪</div>
            <p className="text-[#5A5A5A]">No vendors found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(v => <VendorCard key={v.id} vendor={v} />)}
          </div>
        )}
      </div>
    </div>
  );
}
