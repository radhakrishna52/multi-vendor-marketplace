import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { PageSpinner } from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { ShoppingBag, ChevronLeft, Star, Send, CheckCircle } from 'lucide-react';

function StarRating({ value, onChange, size = 'lg' }) {
  const [hovered, setHovered] = useState(0);
  const sz = size === 'lg' ? 'w-8 h-8' : 'w-5 h-5';
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange && onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className={`${sz} transition-all duration-150 ${onChange ? 'cursor-pointer' : 'cursor-default'}`}
        >
          <Star
            className={`${sz} transition-colors ${
              star <= (hovered || value)
                ? 'fill-[#D4AF37] text-[#D4AF37]'
                : 'fill-transparent text-[#D4AF37]/30'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore(s => s.addItem);
  const { user } = useAuthStore();

  // Review form state
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fetchReviews = () =>
    api.get(`/api/products/${id}/reviews`).then(r => setReviews(r.data || [])).catch(() => {});

  useEffect(() => {
    api.get(`/api/products/${id}`)
      .then(r => {
        setProduct(r.data);
        return Promise.all([
          api.get(`/api/vendors/${r.data.vendor_id}`).catch(() => null),
          api.get(`/api/products/${id}/reviews`).catch(() => ({ data: [] })),
        ]);
      })
      .then(([v, rev]) => {
        if (v) setVendor(v.data);
        setReviews(rev.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageSpinner />;
  if (!product) return (
    <div className="pt-28 text-center min-h-screen bg-[#FAFAF8]">
      <p className="text-[#5A5A5A] text-lg">Product not found.</p>
      <Link to="/products" className="mt-4 inline-block text-sm text-[#D4AF37] hover:underline">Back to Products</Link>
    </div>
  );

  const handleAdd = () => {
    addItem(product, qty);
    toast.success(`${product.name} added to cart`, { icon: '✦' });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (myRating === 0) {
      toast.error('Please select a star rating before submitting.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/api/reviews', {
        product_id: id,
        rating: myRating,
        comment: myComment
      });
      toast.success('Your review was submitted! ✦');
      setSubmitted(true);
      setMyRating(0);
      setMyComment('');
      await fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#FAFAF8] dark:bg-gray-950 transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        {/* Breadcrumb */}
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-[#999] hover:text-[#D4AF37] transition mb-8">
          <ChevronLeft className="w-4 h-4" /> Back to Products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="bg-[#F5F1E8] dark:bg-gray-900 rounded-sm overflow-hidden aspect-square">
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {/* Info */}
          <div>
            <span className="inline-block px-3 py-1 text-xs font-semibold tracking-widest uppercase bg-[#D4AF37] text-[#1A1A1A] mb-4">{product.category}</span>
            <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl text-[#1A1A1A] dark:text-white leading-tight mb-4">{product.name}</h1>

            {/* Aggregate Rating Display */}
            <div className="flex items-center gap-3 mb-4">
              <StarRating value={Math.round(product.rating || 0)} size="sm" />
              <span className="text-sm font-bold text-[#1A1A1A] dark:text-white">
                {product.rating ? product.rating.toFixed(1) : '—'}
              </span>
              <span className="text-sm text-[#999]">
                ({product.reviews_count || reviews.length} {(product.reviews_count || reviews.length) === 1 ? 'review' : 'reviews'})
              </span>
            </div>

            <div className="h-px bg-[#E8E8E8] dark:bg-gray-800 my-5" />

            <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl text-[#D4AF37] font-semibold mb-5">
              ₹{product.price?.toLocaleString('en-IN')}
            </p>

            <p className="text-[#5A5A5A] dark:text-gray-400 leading-relaxed mb-6">{product.description}</p>

            <div className="mb-6">
              <p className="text-xs font-semibold tracking-widest uppercase text-[#999] mb-2">
                SKU: {product.sku || 'N/A'} &nbsp;|&nbsp; Stock: {product.stock}
              </p>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#5A5A5A] dark:text-gray-400">Qty</span>
              <div className="flex border border-[#E8E8E8] dark:border-gray-700">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-2 text-[#5A5A5A] hover:text-[#1A1A1A] dark:text-gray-300 dark:hover:text-white text-lg">−</button>
                <span className="px-5 py-2 border-x border-[#E8E8E8] dark:border-gray-700 font-semibold dark:text-white">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="px-4 py-2 text-[#5A5A5A] hover:text-[#1A1A1A] dark:text-gray-300 dark:hover:text-white text-lg">+</button>
              </div>
            </div>

            {/* Add to Cart */}
            <button onClick={handleAdd} disabled={product.stock === 0}
              className="w-full flex items-center justify-center gap-3 py-4 bg-[#D4AF37] text-[#1A1A1A] font-semibold tracking-widest uppercase text-sm hover:bg-[#c4a032] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed">
              <ShoppingBag className="w-5 h-5" />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>

            {/* Vendor */}
            {vendor && (
              <div className="mt-8 p-5 bg-white dark:bg-gray-900 border border-[#E8E8E8] dark:border-gray-800 rounded-sm">
                <p className="text-xs font-semibold tracking-widest uppercase text-[#999] mb-2">Sold by</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[#1A1A1A] dark:text-white">{vendor.business_name}</p>
                    {vendor.verified && <span className="text-xs text-[#D4AF37]">✦ Verified Vendor</span>}
                  </div>
                  <Link to={`/vendors/${vendor.id}`} className="text-xs font-semibold tracking-widest uppercase text-[#D4AF37] hover:underline">View Store →</Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── Reviews Section ─── */}
        <div className="mt-20">
          <div className="flex items-end gap-4 mb-2">
            <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl text-[#1A1A1A] dark:text-white">Customer Reviews</h2>
            {avgRating && (
              <span className="text-sm text-[#999] mb-0.5">
                Avg: <strong className="text-[#D4AF37]">{avgRating} ★</strong> from {reviews.length} reviews
              </span>
            )}
          </div>
          <div className="h-px bg-gradient-to-r from-[#D4AF37] to-transparent mb-8" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Leave a Review — buyer only */}
            <div className="lg:col-span-1">
              {user && user.role === 'buyer' ? (
                <div className="bg-white dark:bg-gray-900 border border-[#E8E8E8] dark:border-gray-800 p-6 rounded-sm shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-4">Rate This Product</h3>

                  {submitted ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center gap-3">
                      <CheckCircle className="w-10 h-10 text-emerald-500" />
                      <p className="font-bold text-[#1A1A1A] dark:text-white">Review Submitted!</p>
                      <p className="text-xs text-gray-500">Thank you for your feedback.</p>
                      <button onClick={() => setSubmitted(false)} className="text-xs text-[#D4AF37] underline mt-2">Write Another</button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div>
                        <p className="text-[9px] font-bold tracking-wider uppercase text-gray-400 mb-2">Your Rating</p>
                        <StarRating value={myRating} onChange={setMyRating} size="lg" />
                        {myRating > 0 && (
                          <p className="text-xs text-[#D4AF37] mt-1 font-semibold">
                            {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][myRating]}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-[9px] font-bold tracking-wider uppercase text-gray-400 mb-2">Your Review <span className="text-gray-300">(optional)</span></p>
                        <textarea
                          value={myComment}
                          onChange={e => setMyComment(e.target.value)}
                          placeholder="Share your experience with this product..."
                          rows={4}
                          className="w-full p-3 border border-[#E8E8E8] dark:border-gray-700 bg-transparent text-sm text-[#1A1A1A] dark:text-white focus:border-[#D4AF37] outline-none resize-none transition-colors placeholder-gray-400"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={submitting || myRating === 0}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-[#D4AF37] text-[#1A1A1A] text-xs font-bold uppercase tracking-widest hover:bg-[#c4a032] transition disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Send className="w-3.5 h-3.5" />
                        {submitting ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-900 border border-[#E8E8E8] dark:border-gray-800 p-6 rounded-sm text-center">
                  <Star className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
                  <p className="text-sm font-bold text-[#1A1A1A] dark:text-white mb-1">Have this product?</p>
                  <p className="text-xs text-gray-400 mb-4">Sign in as a buyer to leave a review.</p>
                  <Link to="/login?role=buyer" className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] underline">Sign In to Review</Link>
                </div>
              )}
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-4">
              {reviews.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 border border-[#E8E8E8] dark:border-gray-800 p-10 text-center rounded-sm">
                  <p className="text-[#999] text-sm">No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                reviews.map(r => (
                  <div key={r.id} className="bg-white dark:bg-gray-900 border border-[#E8E8E8] dark:border-gray-800 p-5 rounded-sm hover:border-[#D4AF37]/40 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-sm text-[#1A1A1A] dark:text-white">{r.reviewer_name}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <StarRating value={r.rating} size="sm" />
                          <span className="text-xs text-[#999]">
                            {new Date(r.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${
                        r.rating >= 4 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' :
                        r.rating === 3 ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400' :
                        'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400'
                      }`}>
                        {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][r.rating]}
                      </span>
                    </div>
                    {r.comment && <p className="text-sm text-[#5A5A5A] dark:text-gray-400 leading-relaxed mt-2">{r.comment}</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
