import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  TrendingUp, 
  CreditCard, 
  Box, 
  Zap, 
  Users, 
  Check, 
  ArrowRight, 
  Database, 
  Layers, 
  ShoppingBag, 
  BarChart3, 
  ChevronRight,
  Settings,
  ShieldCheck,
  RefreshCw,
  Tag,
  Briefcase
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Landing() {
  const [activeTab, setActiveTab] = useState('shopper'); // 'shopper', 'vendor', 'admin'
  const [selectedVariant, setSelectedVariant] = useState('Gold');
  const [selectedSize, setSelectedSize] = useState('M');

  // Hero Telemetry Dynamic States
  const [latency, setLatency] = useState('12.4 ms');
  const [dbStatus, setDbStatus] = useState('OPTIMAL');
  const [logs, setLogs] = useState([
    '[INFO] Crawling DummyJSON endpoint for Luxury Accessories...',
    '[INFO] Syncing 181 products across 6 key categories.'
  ]);
  const [chartPath, setChartPath] = useState("M0,25 Q15,10 30,20 T60,5 T90,15 L100,5 L100,30 L0,30 Z");
  const [isFlushing, setIsFlushing] = useState(false);
  const [isPinged, setIsPinged] = useState(false);

  const handlePingAPI = () => {
    setIsPinged(true);
    setLatency('...');
    setTimeout(() => {
      const newLat = (Math.random() * 4 + 2).toFixed(1);
      setLatency(`${newLat} ms`);
      setLogs(prev => [
        ...prev,
        `[API] Ping resolved. Sync latency: ${newLat}ms. Connection SLA optimal.`
      ]);
      // Update chart to show a nice active spike
      setChartPath("M0,25 Q15,5 30,12 T60,18 T90,3 L100,10 L100,30 L0,30 Z");
      setIsPinged(false);
    }, 600);
  };

  const handleFlushCache = () => {
    setIsFlushing(true);
    setDbStatus('FLUSHING...');
    setTimeout(() => {
      setDbStatus('SYNCHRONIZED');
      setLogs(prev => [
        ...prev,
        `[CACHE] Purged 181 memory database index cache entries successfully.`
      ]);
      // Reset chart to steady state
      setChartPath("M0,25 Q15,15 30,18 T60,20 T90,15 L100,20 L100,30 L0,30 Z");
      setIsFlushing(false);
      setTimeout(() => setDbStatus('OPTIMAL'), 2000);
    }, 950);
  };

  const features = [
    { 
      icon: <Users className="w-6 h-6" />, 
      title: "Multi-Vendor Ecosystem", 
      desc: "Start your own luxury storefront instantly. Set custom pricing, manage localized inventories, and track client metrics from a unified backend." 
    },
    { 
      icon: <Shield className="w-6 h-6" />, 
      title: "Bank-Grade Protections", 
      desc: "End-to-end payment escrow with advanced fraud screening. Bulletproof security for vendors and premium buyers on every checkout." 
    },
    { 
      icon: <TrendingUp className="w-6 h-6" />, 
      title: "Real-Time Telemetry", 
      desc: "Advanced sales analytics, customer retention rates, and catalog views powered by dynamic client-side reporting engines." 
    },
    { 
      icon: <Zap className="w-6 h-6" />, 
      title: "Lightning Sync Engine", 
      desc: "Automated cron synchronizers that pull from DummyJSON and vendor inventories to ensure global stock levels match to the millisecond." 
    },
    { 
      icon: <Layers className="w-6 h-6" />, 
      title: "Granular SKU Variants", 
      desc: "Deep variants management. Configure, customize, and price complex size, color, material, and packaging matrices effortlessly." 
    },
    { 
      icon: <Database className="w-6 h-6" />, 
      title: "Role-Switching Portal", 
      desc: "Instantly cycle roles (Admin, Seller, and Buyer) with an Instagram-inspired profile drawer to preview changes from every perspective." 
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 text-black dark:text-white">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden border-b border-gray-150 dark:border-gray-800">
        {/* Background Grids & Gradients */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-tr from-white via-white/80 to-transparent dark:from-gray-900 dark:via-gray-900/90" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 text-left space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-semibold uppercase tracking-widest text-gray-600 dark:text-gray-300"
            >
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              Enterprise Luxury Platform v2.4
            </motion.div>
            
            <div className="space-y-4">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight font-display text-gray-900 dark:text-white leading-[1.05]"
              >
                The Luxury Multi-Vendor <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-yellow-500 to-amber-700 dark:from-yellow-400 dark:to-amber-500">
                  E-Commerce Engine.
                </span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-gray-600 dark:text-gray-300 font-light max-w-2xl leading-relaxed"
              >
                A high-performance hybrid marketplace engineered for scale. Sync global product APIs, switch profiles seamlessly, and track active business analytics with stunning aesthetics.
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Link to="/signup" className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-widest hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-lg flex items-center justify-center gap-3">
                Become a Vendor <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/login" className="px-8 py-4 border border-black dark:border-white text-black dark:text-white text-xs font-bold uppercase tracking-widest hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all flex items-center justify-center">
                Explore Storefront
              </Link>
            </motion.div>

            {/* Micro Trust Indicators */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center gap-6 md:gap-10 pt-8 border-t border-gray-200 dark:border-gray-850 max-w-xl"
            >
              <div>
                <p className="text-2xl font-bold font-display text-gray-900 dark:text-white">₹1,000 Cr+</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Volume Processed</p>
              </div>
              <div className="w-[1px] h-8 bg-gray-200 dark:bg-gray-800 hidden sm:block" />
              <div>
                <p className="text-2xl font-bold font-display text-gray-900 dark:text-white">150k+</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Luxury Products</p>
              </div>
              <div className="w-[1px] h-8 bg-gray-200 dark:bg-gray-800 hidden sm:block" />
              <div>
                <p className="text-2xl font-bold font-display text-gray-900 dark:text-white">99.99%</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Sync SLA</p>
              </div>
            </motion.div>
          </div>

          {/* Hero Right Visual: The Interactive Telemetry Dashboard Mock */}
          <div id="telemetry" className="lg:col-span-5 relative">
            {/* Soft Ambient Glow Halo behind the card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-tr from-yellow-500/10 via-amber-500/5 to-transparent blur-3xl -z-10 pointer-events-none" />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative bg-gray-50/90 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 shadow-2xl overflow-hidden backdrop-blur-md"
            >
              {/* Glass Header */}
              <div className="flex items-center justify-between mb-6 border-b border-gray-200 dark:border-gray-700/60 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-[10px] font-mono text-gray-400 ml-2">api_engine_status.log</span>
                </div>
                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 rounded text-[9px] font-bold tracking-widest uppercase">
                  Connected
                </span>
              </div>

              {/* Console Sync Metrics */}
              <div className="space-y-4 font-mono text-xs text-gray-600 dark:text-gray-300">
                <div className="bg-white dark:bg-gray-900 p-3 border border-gray-200 dark:border-gray-800 rounded-xl">
                  <div className="flex items-center justify-between text-[10px] text-yellow-500 font-bold uppercase mb-2 pb-1 border-b border-gray-100 dark:border-gray-800">
                    <span>Synchronizer Status</span>
                    <span className="text-green-500">100% active</span>
                  </div>
                  
                  {/* Dynamic scrolling console logs */}
                  <div className="max-h-24 overflow-y-auto space-y-1.5 scrollbar-hide text-[10px] leading-relaxed select-none">
                    {logs.map((log, index) => (
                      <p key={index} className="text-gray-500 dark:text-gray-400 transition-all duration-300">
                        {log}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-900 p-3 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:border-yellow-500/40 transition-colors">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">API Sync latency</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white mt-1 min-h-[28px]">
                      {latency}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-900 p-3 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:border-yellow-500/40 transition-colors">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Db Health Status</p>
                    <p className={`text-lg font-bold mt-1 min-h-[28px] ${
                      dbStatus === 'OPTIMAL' ? 'text-green-500' :
                      dbStatus === 'FLUSHING...' ? 'text-yellow-500 animate-pulse' :
                      'text-blue-500'
                    }`}>
                      {dbStatus}
                    </p>
                  </div>
                </div>

                {/* Animated Line SVG simulating dashboard active trends */}
                <div className="bg-white dark:bg-gray-900 p-3 border border-gray-200 dark:border-gray-800 rounded-xl">
                  <p className="text-[10px] text-gray-400 uppercase font-bold mb-2">Live Throughput Index</p>
                  <div className="h-20 w-full flex items-end">
                    <svg className="w-full h-full text-yellow-500" viewBox="0 0 100 30" preserveAspectRatio="none">
                      <motion.path 
                        animate={{ d: chartPath }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        fill="url(#gradient)" 
                        stroke="currentColor" 
                        strokeWidth="1.5" 
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgba(212,175,55,0.4)" />
                          <stop offset="100%" stopColor="rgba(212,175,55,0.0)" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>

                {/* Live Simulated Controls Box */}
                <div className="flex gap-3 pt-2 border-t border-gray-200 dark:border-gray-700/60">
                  <button 
                    onClick={handlePingAPI}
                    disabled={isPinged}
                    className={`flex-1 py-3 border border-gray-200 dark:border-gray-800 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-sm ${
                      isPinged 
                        ? 'bg-yellow-50 dark:bg-yellow-950/20 text-yellow-600 border-yellow-300' 
                        : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-yellow-500 dark:hover:border-yellow-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    {isPinged ? 'Pinging...' : 'Ping API'}
                  </button>
                  <button 
                    onClick={handleFlushCache}
                    disabled={isFlushing}
                    className={`flex-1 py-3 border border-gray-200 dark:border-gray-800 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-sm ${
                      isFlushing 
                        ? 'bg-yellow-50 dark:bg-yellow-950/20 text-yellow-600 border-yellow-300' 
                        : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-yellow-500 dark:hover:border-yellow-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    {isFlushing ? 'Flushing...' : 'Flush Cache'}
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. DUAL INTERACTIVE EXPERIENCE SHOWCASE - REDESIGNED TO 3 CURATED PORTAL LAUNCH PAGES */}
      <section id="about" className="py-24 bg-gray-50 dark:bg-gray-850/40 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
            <h2 className="text-xs font-bold tracking-[0.25em] uppercase text-yellow-600 dark:text-yellow-400">Curated Role Previews</h2>
            <h3 className="text-3xl md:text-5xl font-display font-bold text-gray-955 dark:text-white">Three Distinct Launch Gateways</h3>
            <p className="text-gray-500 dark:text-gray-400 font-light">
              Cycle through the 3 distinct roles below to see why platform operators, professional merchants, and luxury buyers prefer DreamCart.
            </p>
            
            {/* 3-Way Dynamic Role Selector Tab Bar */}
            <div className="inline-flex p-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full shadow-inner mt-4 flex-wrap justify-center">
              <button 
                onClick={() => setActiveTab('shopper')}
                className={`px-5 py-3 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                  activeTab === 'shopper' 
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                1. Luxury Shopper (Buyer)
              </button>
              
              <button 
                onClick={() => setActiveTab('vendor')}
                className={`px-5 py-3 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                  activeTab === 'vendor' 
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                2. Premium Merchant (Seller)
              </button>

              <button 
                onClick={() => setActiveTab('admin')}
                className={`px-5 py-3 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                  activeTab === 'admin' 
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                3. Platform Controller (Admin)
              </button>
            </div>
          </div>

          {/* Dynamic Switch Output for the 3 Launch Gateways */}
          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'shopper' && (
                <motion.div 
                  key="shopper"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-xl"
                >
                  {/* Left: Shopper Launch gateway pitch ("Why choose this") */}
                  <div className="lg:col-span-5 space-y-6 flex flex-col justify-center">
                    <div className="w-12 h-12 bg-pink-50 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400 rounded-2xl flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] text-pink-600 dark:text-pink-400 uppercase font-bold tracking-widest block mb-1">Premium Client Portal</span>
                      <h3 className="text-2xl md:text-3xl font-bold font-display">Why Shop on DreamCart?</h3>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-light">
                      Access a curated gallery of high-fashion and premium goods listed by verified, independent brand vendors. Enjoy glassmorphic browsing, rapid product searches, and secure transactional escrows.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="w-6 h-6 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-full flex items-center justify-center text-green-600 shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">Curated Authenticity</p>
                          <p className="text-[11px] text-gray-450 mt-0.5">Every registered merchant undergoes background quality and identity audit checks before publishing.</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-6 h-6 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-full flex items-center justify-center text-green-600 shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">Bespoke Size & Color Variants</p>
                          <p className="text-[11px] text-gray-450 mt-0.5">Test, preview, and purchase granular sizes, custom materials, and localized currency rates in real-time.</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-6 h-6 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-full flex items-center justify-center text-green-600 shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">Escrow Secured Escrow Checkouts</p>
                          <p className="text-[11px] text-gray-450 mt-0.5">Your funds remain safely locked until items are successfully delivered and catalog records are synchronized.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-2 flex gap-4">
                      <Link to="/login" className="px-6 py-3 bg-pink-500 text-white text-xs font-bold uppercase tracking-widest hover:bg-pink-600 transition shadow flex items-center gap-2">
                        Start Shopping <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Right: Interactive Product Card Simulator */}
                  <div className="lg:col-span-7 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/80 rounded-2xl p-6 flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl p-4 shadow-lg max-w-sm w-full">
                      <div className="relative aspect-[4/5] bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden mb-4">
                        <img 
                          src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800" 
                          alt="Luxury Swiss Chronograph"
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                        <span className="absolute top-3 left-3 px-2 py-0.5 bg-black text-white text-[9px] font-bold uppercase tracking-widest">
                          Curated Luxury
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-base text-gray-900 dark:text-white">Swiss Chronograph</h4>
                            <p className="text-xs text-gray-400">by ChronoSwiss Genéve</p>
                          </div>
                          <span className="text-base font-bold text-gray-900 dark:text-white">₹7,18,250</span>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-800">
                          <div>
                            <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1.5">Accent Color</span>
                            <div className="flex gap-2">
                              {['Gold', 'Silver', 'Black'].map(v => (
                                <button 
                                  key={v}
                                  onClick={() => setSelectedVariant(v)}
                                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                                    v === 'Gold' ? 'bg-amber-450 border-amber-600' :
                                    v === 'Silver' ? 'bg-gray-300 border-gray-400' :
                                    'bg-black border-gray-850'
                                  } ${selectedVariant === v ? 'ring-2 ring-yellow-500 scale-110' : 'opacity-60 hover:opacity-100'}`}
                                  title={v}
                                />
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1.5">Size</span>
                            <div className="flex gap-1.5">
                              {['S', 'M', 'L'].map(s => (
                                <button 
                                  key={s}
                                  onClick={() => setSelectedSize(s)}
                                  className={`w-6 h-6 text-[10px] font-bold border rounded flex items-center justify-center transition-all ${
                                    selectedSize === s 
                                      ? 'bg-black border-black text-white dark:bg-white dark:border-white dark:text-black font-extrabold' 
                                      : 'border-gray-200 dark:border-gray-850 text-gray-450 hover:bg-gray-50'
                                  }`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <Link to="/login" className="w-full block text-center py-3 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider rounded-lg mt-2 hover:opacity-90 transition-opacity">
                          Add To Shopping Bag
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'vendor' && (
                <motion.div 
                  key="vendor"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-xl"
                >
                  {/* Left: Seller Launch gateway pitch ("Why choose this") */}
                  <div className="lg:col-span-5 space-y-6 flex flex-col justify-center">
                    <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 uppercase font-bold tracking-widest block mb-1">Independent Merchant Gateway</span>
                      <h3 className="text-2xl md:text-3xl font-bold font-display">Why Scale on DreamCart?</h3>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-light">
                      Deploy your catalog, set pricing variations, offer customized discount codes, and analyze active sales telemetry. Get access to thousands of luxury shoppers without technical overhead.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="w-6 h-6 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-full flex items-center justify-center text-green-600 shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">0% Commision Entry SLA</p>
                          <p className="text-[11px] text-gray-450 mt-0.5">Begin building your storefront. Keep 100% of your initial transactions for the first three months of onboarding.</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-6 h-6 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-full flex items-center justify-center text-green-600 shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">Weekly Visual Dashboard Analytics</p>
                          <p className="text-[11px] text-gray-450 mt-0.5">Review gross revenues, track buyer cancellation ratios, and forecast customer behaviors with charts.</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-6 h-6 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-full flex items-center justify-center text-green-600 shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">API Inventory Synchronization</p>
                          <p className="text-[11px] text-gray-450 mt-0.5">Sync products seamlessly from third-party inventory endpoints. Let our sync engine manage stock counts automatically.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-2 flex gap-4">
                      <Link to="/signup" className="px-6 py-3 bg-amber-500 text-white text-xs font-bold uppercase tracking-widest hover:bg-amber-600 transition shadow flex items-center gap-2">
                        Create Seller Account <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: Simulated Vendor Dashboard Dashboard Card Mockup */}
                  <div className="lg:col-span-7 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/80 rounded-2xl p-6 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Store Performance</p>
                        <h4 className="text-lg font-bold">Weekly Telemetry Overview</h4>
                      </div>
                      <span className="px-3 py-1 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900 rounded-full text-[10px] font-bold uppercase tracking-wide">
                        Active Seller Mode
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-white dark:bg-gray-900 p-4 border border-gray-150 dark:border-gray-800 rounded-xl shadow-sm">
                        <p className="text-[9px] text-gray-400 uppercase font-semibold">Weekly Gross</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">₹12,11,165</p>
                        <span className="text-[8px] text-green-500 font-bold">+18.2% vs last week</span>
                      </div>
                      <div className="bg-white dark:bg-gray-900 p-4 border border-gray-150 dark:border-gray-800 rounded-xl shadow-sm">
                        <p className="text-[9px] text-gray-400 uppercase font-semibold">Active Orders</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">42</p>
                        <span className="text-[8px] text-yellow-500 font-bold">3 pending sync</span>
                      </div>
                      <div className="bg-white dark:bg-gray-900 p-4 border border-gray-150 dark:border-gray-800 rounded-xl shadow-sm">
                        <p className="text-[9px] text-gray-400 uppercase font-semibold">Return rate</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">0.4%</p>
                        <span className="text-[8px] text-blue-500 font-bold">Excellent SLA</span>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 p-4 border border-gray-150 dark:border-gray-800 rounded-xl shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] text-gray-450 font-bold uppercase">Weekly Revenue Trend</span>
                        <div className="flex gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-black dark:bg-white" />
                          <span className="text-[9px] text-gray-450 uppercase">Current Month</span>
                        </div>
                      </div>
                      <div className="h-32 w-full flex items-end justify-between gap-1 pt-4">
                        {[40, 20, 60, 80, 50, 90, 70].map((val, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-t-sm h-24 relative flex items-end">
                              <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${val}%` }}
                                transition={{ duration: 1, delay: i * 0.05 }}
                                className="w-full bg-gradient-to-t from-yellow-600 to-yellow-500 rounded-t-sm"
                              />
                            </div>
                            <span className="text-[9px] text-gray-450 font-mono">Day {i+1}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'admin' && (
                <motion.div 
                  key="admin"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-xl"
                >
                  {/* Left: Admin Launch gateway pitch ("Why choose this") */}
                  <div className="lg:col-span-5 space-y-6 flex flex-col justify-center">
                    <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center">
                      <Settings className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] text-purple-600 dark:text-purple-400 uppercase font-bold tracking-widest block mb-1">Platform Control Room</span>
                      <h3 className="text-2xl md:text-3xl font-bold font-display">Why Govern with DreamCart?</h3>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-light">
                      The core operational dashboard. Control global database seed operations, audit vendor catalogs, examine user ledgers, and trigger manual synchronization crons instantly.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="w-6 h-6 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-full flex items-center justify-center text-green-600 shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">Manual API Sync Override</p>
                          <p className="text-[11px] text-gray-450 mt-0.5">Execute complete data pulls from external API hosts with instant visual feedback on catalog additions.</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-6 h-6 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-full flex items-center justify-center text-green-600 shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">Active User deep-dives</p>
                          <p className="text-[11px] text-gray-450 mt-0.5">Examine individual merchant catalogues, inspect order ledgers, and audit account states within a secure drawer UI.</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-6 h-6 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-full flex items-center justify-center text-green-600 shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">Escrow Ledger Monitoring</p>
                          <p className="text-[11px] text-gray-450 mt-0.5">Track global platform throughput, review active coupons, and govern user registration states.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-2 flex gap-4">
                      <Link to="/login" className="px-6 py-3 bg-purple-500 text-white text-xs font-bold uppercase tracking-widest hover:bg-purple-600 transition shadow flex items-center gap-2">
                        Manage Platform Core <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Right: Simulated Admin Control Dashboard Dashboard Card Mockup */}
                  <div className="lg:col-span-7 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/80 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <p className="text-[10px] text-gray-405 uppercase tracking-widest font-bold">Governance Dashboard</p>
                          <h4 className="text-lg font-bold">Admin Operations Panel</h4>
                        </div>
                        <span className="px-3 py-1 bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900 rounded-full text-[10px] font-bold uppercase tracking-wide">
                          System Master Admin
                        </span>
                      </div>

                      {/* Sync telemetry console */}
                      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-xl shadow-sm mb-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Active API Sync Engine</span>
                          <span className="flex items-center gap-1.5 text-[10px] text-green-500 font-bold uppercase">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Standby
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="text-[9px] text-gray-400 uppercase font-semibold">Synced Items</p>
                            <p className="font-bold text-gray-900 dark:text-white mt-0.5">154 Products</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-gray-400 uppercase font-semibold">Sync Fallbacks</p>
                            <p className="font-bold text-gray-900 dark:text-white mt-0.5">0 errors (100% OK)</p>
                          </div>
                        </div>

                        {/* Seed Telemetry simulation controls */}
                        <div className="flex items-center justify-between gap-3 bg-gray-55/65 dark:bg-gray-950 p-2.5 rounded-lg border border-gray-150 dark:border-gray-800">
                          <div className="flex items-center gap-2">
                            <RefreshCw className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-spin" />
                            <span className="text-[10px] text-gray-450 font-mono">DummyJSON Feed Standby...</span>
                          </div>
                          <button className="px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded text-[9px] font-bold uppercase tracking-widest hover:opacity-90">
                            Force Seeding
                          </button>
                        </div>
                      </div>

                      {/* Dynamic user deep-dive ledger snippet */}
                      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-xl shadow-sm">
                        <p className="text-[10px] font-bold text-gray-405 uppercase tracking-wide mb-3 flex items-center gap-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
                          Security Audit Logs
                        </p>
                        <div className="space-y-2.5 font-mono text-[9px] text-gray-450">
                          <p className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-1">
                            <span>[09:12:44] Seller apiseller@dreamcart.com Sync Completed</span>
                            <span className="text-green-500">SUCCESS</span>
                          </p>
                          <p className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-1">
                            <span>[09:14:18] Buyer fashionista@test.com created Wishlist Folder</span>
                            <span className="text-blue-500">INFO</span>
                          </p>
                          <p className="flex justify-between">
                            <span>[09:16:32] Admin arjun@admin.in generated COUPON [LUX50]</span>
                            <span className="text-yellow-500">AUDIT</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* 3. PLATFORM CAPABILITIES GRID */}
      <section className="py-24 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-xs font-bold tracking-[0.25em] uppercase text-yellow-600 dark:text-yellow-400">Technical Foundation</h2>
            <h3 className="text-4xl md:text-5xl font-display font-bold text-gray-950 dark:text-white">Engineered for Maximum Reliability</h3>
            <p className="text-gray-550 dark:text-gray-400 font-light max-w-2xl mx-auto">
              Our micro-architecture balances fast response metrics with localized database reliability to create a seamless luxury ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="bg-gray-50 dark:bg-gray-800/40 p-8 border border-gray-150 dark:border-gray-800 rounded-3xl hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-shadow group"
              >
                <div className="w-12 h-12 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700/60 flex items-center justify-center text-gray-900 dark:text-white rounded-xl shadow-sm mb-6 group-hover:scale-105 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-bold mb-3 text-gray-900 dark:text-white font-heading">{feature.title}</h4>
                <p className="text-gray-550 dark:text-gray-400 leading-relaxed text-xs">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. TRUSTED CATEGORIES SLIDER */}
      <section className="py-24 overflow-hidden bg-gray-50 dark:bg-gray-800/40 transition-colors duration-300 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 mb-12">
          <h2 className="text-xs font-bold tracking-[0.25em] uppercase text-yellow-600 dark:text-yellow-400 mb-2">Infinite Catalog</h2>
          <h3 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Signature Luxury Categories</h3>
        </div>
        
        {/* Infinite Loop Category Track */}
        <div className="relative flex whitespace-nowrap">
          <motion.div 
            animate={{ x: [0, -2000] }}
            transition={{ repeat: Infinity, duration: 38, ease: "linear" }}
            className="flex gap-8 px-4"
          >
            {[
              { cat: "Men Wear", img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600" },
              { cat: "Women Wear", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600" },
              { cat: "Watches", img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600" },
              { cat: "Beauty Products", img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600" },
              { cat: "Home Accessories", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600" },
              { cat: "Office Accessories", img: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600" },
              // Duplicate tracks for perfect loop
              { cat: "Men Wear", img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600" },
              { cat: "Women Wear", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600" },
              { cat: "Watches", img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600" }
            ].map((item, i) => (
              <div key={i} className="relative w-80 h-[380px] shrink-0 group overflow-hidden bg-gray-150 dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
                <img src={item.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={item.cat} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end p-8">
                  <div>
                    <span className="text-[9px] font-bold text-yellow-500 uppercase tracking-widest block mb-1">Premium Collection</span>
                    <h3 className="text-white text-2xl font-bold tracking-wide font-display">{item.cat}</h3>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. CALL TO ACTION SECTION */}
      <section className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300 relative">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 text-center relative z-10">
          <div className="bg-gradient-to-tr from-gray-950 to-gray-900 dark:from-gray-900 dark:to-gray-850 p-12 md:p-20 rounded-[3rem] shadow-2xl border border-gray-800 text-white space-y-8 relative overflow-hidden">
            
            {/* Ambient background glow */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-yellow-500/10 rounded-full blur-[100px]" />
            
            <div className="max-w-2xl mx-auto space-y-4">
              <h2 className="text-xs font-bold tracking-[0.25em] uppercase text-yellow-500">Deploy Instantly</h2>
              <h3 className="text-3xl md:text-5xl font-display font-semibold leading-tight">
                Empower your Brand on the Ultimate Market Network
              </h3>
              <p className="text-gray-400 font-light text-sm md:text-base leading-relaxed">
                Unlock high-performance multi-vendor tools, localized pricing overrides, auto-synchronized item feeds, and escrow client protection guarantees.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link to="/signup" className="w-full sm:w-auto px-10 py-4 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-gray-150 transition-colors flex items-center justify-center gap-3">
                Register Storefront <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/login" className="w-full sm:w-auto px-10 py-4 border border-white text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                Shop the Showcase
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LUXURY FOOTER */}
      <footer className="py-12 bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-900 transition-colors duration-300 text-gray-500 dark:text-gray-400">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold tracking-widest text-gray-900 dark:text-white uppercase font-heading">DREAMCART</span>
            <span className="text-xs border-l border-gray-300 dark:border-gray-800 pl-4">Luxury Multi-Vendor Network</span>
          </div>
          <p className="text-[11px] font-mono">
            &copy; {new Date().getFullYear()} DreamCart Inc. All global synchronizations resolved.
          </p>
        </div>
      </footer>

    </div>
  );
}
