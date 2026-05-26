import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Settings, User, Briefcase, Shield, X, Check } from 'lucide-react';

export default function FloatingProfileSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const switchProfile = (role, email) => {
    // Log out first to clear the session cleanly
    logout();
    
    // Redirect to the appropriate login page with prefilled query parameters
    const loginPath = role === 'admin' ? '/admin-login' : '/login';
    navigate(`${loginPath}?email=${encodeURIComponent(email)}&role=${role}`);
    setIsOpen(false);
  };

  const profiles = [
    { name: 'Arjun Buyer', email: 'arjun@buyer.in', role: 'buyer', label: 'Customer' },
    { name: 'Arjun Vendor', email: 'arjun@seller.in', role: 'seller', label: 'Vendor' },
    { name: 'System Overlord', email: 'arjun@admin.in', role: 'admin', label: 'Admin' }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-16 right-0 w-72 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-sm shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-150 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 flex justify-between items-center">
              <div>
                <p className="text-[9px] text-[#D4AF37] uppercase tracking-[0.2em] font-bold">Switch Account</p>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-[190px]">
                  {user ? user.email : 'No active session'}
                </p>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Account List */}
            <div className="p-2 space-y-1 max-h-[350px] overflow-y-auto">
              {profiles.map((p) => {
                const isActive = user?.email === p.email;
                
                return (
                  <button 
                    key={p.email}
                    onClick={() => switchProfile(p.role, p.email)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-sm transition-all text-left ${
                      isActive 
                        ? 'bg-amber-500/10 text-[#D4AF37] border-l-2 border-[#D4AF37]' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {p.role === 'buyer' && <User className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-gray-400'}`} />}
                      {p.role === 'seller' && <Briefcase className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-gray-400'}`} />}
                      {p.role === 'admin' && <Shield className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-gray-400'}`} />}
                      
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-xs">{p.name}</p>
                          <span className={`text-[8px] font-bold uppercase tracking-wider px-1 rounded-sm ${
                            p.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400' :
                            p.role === 'seller' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400' :
                            'bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400'
                          }`}>
                            {p.label}
                          </span>
                        </div>
                        <p className="text-[10px] opacity-75 font-mono leading-none mt-1">{p.email}</p>
                      </div>
                    </div>
                    {isActive && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Launcher Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black border border-gray-200 dark:border-gray-800 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all"
        aria-label="Account Switcher"
      >
        <Settings className="w-5 h-5 animate-spin-slow" />
      </motion.button>
    </div>
  );
}
