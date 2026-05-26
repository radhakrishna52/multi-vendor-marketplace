import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, Menu, X, User, Search, LogOut, Moon, Sun, 
  LayoutDashboard, PlusCircle, BarChart3, Eye, Settings, 
  ShieldAlert, Award, Heart, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useThemeStore } from '../store/themeStore';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, logout, user } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items) || [];
  const { isDarkMode, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (searchQuery.trim()) {
        navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
        setSearchQuery('');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const categories = [
    { name: "Women Fashion", path: "/products?category=Women%20Fashion" },
    { name: "Men Fashion", path: "/products?category=Men%20Fashion" },
    { name: "Kids Fashion", path: "/products?category=Kids%20Fashion" },
    { name: "Beauty & Care", path: "/products?category=Beauty%20%26%20Care" },
    { name: "Home & Living", path: "/products?category=Home%20%26%20Living" },
    { name: "Accessories", path: "/products?category=Accessories" }
  ];

  // ==========================================
  // 1. ELITE ADMIN / VENDOR SELLER NAVBAR
  // ==========================================
  if (location.pathname.includes('/seller') || location.pathname.includes('/admin')) {
    const isAdmin = user?.role === 'admin';
    
    return (
      <nav className="fixed w-full top-0 z-50 bg-[#0F172A] text-slate-100 border-b border-slate-800 shadow-xl transition-all duration-300">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Left Brand and Badges */}
            <div className="flex items-center gap-4">
              <Link to={isAdmin ? '/admin' : '/seller'} className="flex items-center gap-3">
                <span className="text-xl md:text-2xl font-black tracking-[0.2em] text-white font-serif uppercase">DREAMCART</span>
              </Link>
              
              <div className="h-6 w-px bg-slate-800 hidden md:block" />
              
              {isAdmin ? (
                <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-purple-900/40 text-purple-300 border border-purple-800/60">
                  <ShieldAlert className="w-3 h-3 text-purple-400" /> SYSTEM ROOT
                </span>
              ) : (
                <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <Award className="w-3 h-3 text-amber-500" /> MERCHANT PARTNER
                </span>
              )}
            </div>

            {/* Center Specific Role Navigation Options */}
            <div className="hidden lg:flex items-center gap-6">
              {isAdmin ? (
                <>
                  <Link to="/admin?tab=dashboard" className={`flex items-center gap-2 text-xs uppercase tracking-widest font-bold transition-colors py-2 px-3 rounded-lg ${location.search.includes('tab=dashboard') || !location.search ? 'bg-purple-900/30 text-white border-b-2 border-purple-500' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'}`}>
                    <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                  </Link>
                  <Link to="/admin?tab=users" className={`flex items-center gap-2 text-xs uppercase tracking-widest font-bold transition-colors py-2 px-3 rounded-lg ${location.search.includes('tab=users') ? 'bg-purple-900/30 text-white border-b-2 border-purple-500' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'}`}>
                    <User className="w-3.5 h-3.5" /> Users
                  </Link>
                  <Link to="/admin?tab=products" className={`flex items-center gap-2 text-xs uppercase tracking-widest font-bold transition-colors py-2 px-3 rounded-lg ${location.search.includes('tab=products') ? 'bg-purple-900/30 text-white border-b-2 border-purple-500' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'}`}>
                    <ShoppingBag className="w-3.5 h-3.5" /> Products
                  </Link>
                  <Link to="/admin?tab=orders" className={`flex items-center gap-2 text-xs uppercase tracking-widest font-bold transition-colors py-2 px-3 rounded-lg ${location.search.includes('tab=orders') ? 'bg-purple-900/30 text-white border-b-2 border-purple-500' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'}`}>
                    <LayoutDashboard className="w-3.5 h-3.5" /> Orders
                  </Link>
                  <Link to="/admin?tab=coupons" className={`flex items-center gap-2 text-xs uppercase tracking-widest font-bold transition-colors py-2 px-3 rounded-lg ${location.search.includes('tab=coupons') ? 'bg-purple-900/30 text-white border-b-2 border-purple-500' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'}`}>
                    <Settings className="w-3.5 h-3.5" /> Coupons
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/seller" className={`flex items-center gap-2 text-xs uppercase tracking-widest font-bold transition-colors py-2 px-3 rounded-lg ${!location.search ? 'bg-amber-500/10 text-white border-b-2 border-amber-500' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'}`}>
                    <LayoutDashboard className="w-3.5 h-3.5" /> Overview
                  </Link>
                  <Link to="/seller?action=add-product" className={`flex items-center gap-2 text-xs uppercase tracking-widest font-bold transition-colors py-2 px-3 rounded-lg ${location.search.includes('action=add-product') ? 'bg-amber-500/10 text-white border-b-2 border-amber-500' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'}`}>
                    <PlusCircle className="w-3.5 h-3.5" /> Add Listing
                  </Link>
                  <a href="#stats" className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-slate-800/40">
                    <BarChart3 className="w-3.5 h-3.5" /> Revenue Analytics
                  </a>
                  <a href="#catalog" className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-slate-800/40">
                    <ShoppingBag className="w-3.5 h-3.5" /> Catalog
                  </a>
                </>
              )}
              
              <Link to="/" className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-white hover:bg-slate-800/40 py-2 px-3 rounded-lg transition-colors">
                <Eye className="w-3.5 h-3.5" /> Preview Shop
              </Link>
            </div>

            {/* Right System Info and User Details */}
            <div className="flex items-center gap-6">
              {isAdmin && (
                <div className="hidden xl:flex items-center gap-2 text-[10px] tracking-wider text-green-400 uppercase font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping inline-block" />
                  Engine Online
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-xs font-black uppercase text-amber-400">
                  {user?.name?.[0] || 'M'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-white line-clamp-1">{user?.name || 'Administrator'}</p>
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest">{user?.role}</p>
                </div>
              </div>

              <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-white transition-colors border border-slate-800 hover:border-slate-700 rounded-xl px-4 py-2.5"
              >
                <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // ==========================================
  // 2. PRE-LOGIN LAUNCH NAVBAR (Landing Page)
  // ==========================================
  if (!isAuthenticated) {
    const isLaunch = location.pathname === '/';
    const launchNavClasses = isLaunch 
      ? (scrolled ? 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-900 text-black dark:text-white shadow-sm' : 'bg-transparent text-white border-b border-white/20')
      : 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-900 text-black dark:text-white shadow-sm';
    const launchIconColor = isLaunch && !scrolled ? 'text-white' : 'text-black dark:text-white';

    return (
      <nav className={`fixed w-full top-0 z-50 transition-all duration-500 ${launchNavClasses}`}>
        {/* Luxury Escrow Notice Banner */}
        <div className="bg-[#1A1A1A] text-white text-[9px] font-black uppercase tracking-[0.25em] text-center py-2 flex items-center justify-center gap-2 select-none border-b border-white/10">
          <span>👑 BIJOUX & APPAREL MULTI-VENDOR COUTURE</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">100% BUYER ESCROW SATISFACTION GUARANTEED</span>
        </div>

        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Brand Logo */}
            <div className="flex-1 flex justify-start">
              <Link to="/" className="flex items-center">
                <span className={`text-xl md:text-2xl font-black tracking-[0.2em] uppercase transition-colors ${launchIconColor}`} style={{ fontFamily: 'Inter, sans-serif' }}>DREAMCART</span>
              </Link>
            </div>

            {/* Quick Informational Options */}
            <div className="hidden lg:flex items-center justify-center gap-8 flex-1">
              <Link to="/products" className={`text-xs font-bold uppercase tracking-widest transition-colors ${isLaunch && !scrolled ? 'text-white/80 hover:text-white' : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white'}`}>Couture Catalog</Link>
              <a href="#about" className={`text-xs font-bold uppercase tracking-widest transition-colors ${isLaunch && !scrolled ? 'text-white/80 hover:text-white' : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white'}`}>Why Choose Us</a>
              <a href="#telemetry" className={`text-xs font-bold uppercase tracking-widest transition-colors ${isLaunch && !scrolled ? 'text-white/80 hover:text-white' : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white'}`}>Live SLA Metrics</a>
            </div>

            {/* Right Auth Links */}
            <div className="flex-1 flex items-center justify-end gap-6">
              <button onClick={toggleTheme} className={`p-2 rounded-full transition-colors ${launchIconColor} hover:bg-gray-100 dark:hover:bg-gray-800`}>
                {isDarkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
              </button>
              <Link to="/login" className={`text-xs font-bold tracking-widest uppercase hover:underline transition-colors ${launchIconColor}`}>Login</Link>
              <Link to="/signup" className={`border px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition-colors rounded-sm ${isLaunch && !scrolled ? 'border-white text-white hover:bg-white hover:text-black' : 'border-black dark:border-white text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black'}`}>Join Couture</Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // ==========================================
  // 3. POST-LOGIN USER NAVBAR (Customer Storefront)
  // ==========================================
  return (
    <header className="fixed w-full top-0 z-50 transition-all duration-300">
      {/* Premium escrows header notification */}
      <div className="bg-[#111] text-white text-[9px] font-bold uppercase tracking-[0.25em] text-center py-2 relative z-50 flex items-center justify-center gap-1 border-b border-gray-850">
        <span>✨ SECURED ROYAL DISPATCH | FREE INTRACITY LOGISTICS ACROSS INDIA</span>
      </div>

      <nav className={`w-full bg-white/95 dark:bg-gray-950/95 backdrop-blur-md text-black dark:text-white shadow-sm border-b border-gray-100 dark:border-gray-900 transition-all duration-300 ${scrolled ? 'py-1' : 'py-3'}`}>
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Left: Mobile menu triggers and Inline Category Links */}
            <div className="flex-1 flex items-center gap-4">
              <button 
                className="lg:hidden text-black dark:text-white p-1 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              
              <div className="hidden lg:flex items-center gap-6">
                <Link to="/products" className="group relative text-[11px] font-bold tracking-widest uppercase text-black dark:text-white hover:text-[#D4AF37] transition-colors duration-300">
                  Shop All
                  <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
                </Link>
                
                {categories.map(cat => (
                  <Link 
                    key={cat.name}
                    to={cat.path} 
                    className="group relative text-[11px] font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-300"
                  >
                    {cat.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-black dark:bg-white transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Center: Brand Logo */}
            <div className="flex-shrink-0 flex justify-center px-4">
              <Link to="/" className="flex items-center">
                <span className="text-xl md:text-2xl font-black tracking-[0.25em] text-black dark:text-white font-serif uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>
                  DREAMCART
                </span>
              </Link>
            </div>

            {/* Right Side Tools & Icons */}
            <div className="flex-1 flex items-center justify-end gap-4 md:gap-5">
              {/* Dark mode */}
              <button 
                onClick={toggleTheme} 
                className="hidden sm:flex p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300 transition-colors"
                title="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Dynamic search bar */}
              <div className="hidden xl:flex items-center relative group">
                <input
                  type="text"
                  placeholder="Search dynamic catalog..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  className="w-40 xl:w-56 px-0 py-1 bg-transparent border-b border-gray-200 dark:border-gray-800 focus:outline-none focus:border-black dark:focus:border-white transition-all text-xs text-black dark:text-white placeholder-gray-400"
                />
                <button onClick={handleSearch} className="absolute right-0 top-1 p-0.5">
                  <Search className="w-3.5 h-3.5 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                </button>
              </div>

              {/* Wishlist */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/wishlist" className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition flex items-center justify-center">
                  <Heart className="w-4 h-4 text-black dark:text-white" />
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#D4AF37] text-white dark:text-black text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-sm">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>
              </motion.div>
              
              {/* Cart */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-black dark:text-white" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-black dark:bg-white text-white dark:text-black text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-sm">
                      {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                    </span>
                  )}
                </Link>
              </motion.div>
              
              {/* User Profiles */}
              <div className="flex items-center gap-2 md:gap-3 border-l border-gray-200 dark:border-gray-800 pl-3 md:pl-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/profile" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition flex items-center justify-center" title="My Account">
                    <User className="w-4 h-4 text-black dark:text-white" />
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <button 
                    onClick={handleLogout} 
                    className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-950/20 text-gray-400 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </motion.div>
              </div>

            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-100 dark:border-gray-900 bg-white dark:bg-gray-950 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                {/* Search in Mobile */}
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => { handleSearch(e); if(e.key === 'Enter') setIsOpen(false); }}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-transparent rounded-sm focus:outline-none focus:border-[#D4AF37] text-sm text-black dark:text-white placeholder-gray-400 transition"
                  />
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col gap-2">
                  <Link 
                    to="/products" 
                    onClick={() => setIsOpen(false)} 
                    className="block py-2.5 px-3 rounded-lg text-sm font-bold uppercase tracking-wider text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                  >
                    🛍️ Couture Catalog
                  </Link>
                  
                  {categories.map(cat => (
                    <Link 
                      key={cat.name}
                      to={cat.path} 
                      onClick={() => setIsOpen(false)} 
                      className="block py-2 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-900 my-2" />

                {/* Mobile controls */}
                <div className="flex items-center justify-between px-3">
                  <button 
                    onClick={() => { toggleTheme(); setIsOpen(false); }}
                    className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300"
                  >
                    {isDarkMode ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4" />} Mode Switcher
                  </button>

                  <button 
                    onClick={() => { handleLogout(); setIsOpen(false); }} 
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-500"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
