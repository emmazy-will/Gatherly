// components/UserProfile.js

import { useState, useEffect } from 'react';
import { useAuth } from '@/Contexts/AuthContext';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';

export default function UserProfile({ onGeneralSettings, onProfileSettings }) {
  const { currentUser, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userInitials, setUserInitials] = useState('');

  useEffect(() => {
    if (currentUser?.displayName) {
      // Generate initials from display name
      const names = currentUser.displayName.split(' ');
      const initials = names.length >= 2 
        ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
        : names[0] ? names[0][0].toUpperCase() : 'U';
      setUserInitials(initials);
    } else if (currentUser?.email) {
      // Generate initials from email
      setUserInitials(currentUser.email[0].toUpperCase());
    }
  }, [currentUser]);

  const handleClickOutside = (e) => {
    if (!e.target.closest('.user-profile-dropdown')) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isDropdownOpen]);

  if (!currentUser) return null;

  const displayName = currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
  const email = currentUser.email;

  return (
    <div className="relative user-profile-dropdown">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg p-2 pr-3 transition-all duration-200 border border-slate-600/30 hover:border-slate-500/50"
      >
        <div className="relative">
          {currentUser.photoURL ? (
            <img 
              src={currentUser.photoURL} 
              alt={displayName} 
              className="w-9 h-9 rounded-full border-2 border-slate-500/30 object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className={`w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm border-2 border-slate-500/30 ${currentUser.photoURL ? 'hidden' : 'flex'}`}
          >
            {userInitials}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-slate-800 rounded-full"></div>
        </div>
        
        <div className="hidden sm:block text-left">
          <p className="text-white font-medium text-sm leading-tight">
            {displayName}
          </p>
          <p className="text-slate-300 text-xs leading-tight">
            {email?.length > 20 ? `${email.substring(0, 20)}...` : email}
          </p>
        </div>
        
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800/90 backdrop-blur-xl rounded-xl border border-slate-700/50 shadow-2xl shadow-black/20 z-50 overflow-hidden">
          {/* User Info Header */}
          <div className="px-4 py-4 border-b border-slate-700/50 bg-slate-700/20">
            <div className="flex items-center space-x-3">
              <div className="relative">
                {currentUser.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt={displayName} 
                    className="w-12 h-12 rounded-full border-2 border-slate-500/30 object-cover"
                    onError={(e) => {
                      console.log('Dropdown image failed to load:', currentUser.photoURL);
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className={`w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold border-2 border-slate-500/30 ${currentUser.photoURL ? 'hidden' : 'flex'}`}
                >
                  {userInitials || 'U'}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 border-2 border-slate-800 rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm leading-tight">
                  {displayName}
                </p>
                <p className="text-slate-300 text-xs leading-tight truncate">
                  {email}
                </p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-xs text-green-400 font-medium">Online</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                onProfileSettings?.();
              }}
              className="w-full px-4 py-3 text-left text-white hover:bg-slate-700/50 transition-colors flex items-center space-x-3 group"
            >
              <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center group-hover:bg-slate-600/50 transition-colors">
                <User className="w-4 h-4 text-slate-300" />
              </div>
              <div>
                <span className="text-sm font-medium">Profile Settings</span>
                <p className="text-xs text-slate-400">Manage your account</p>
              </div>
            </button>
            
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                onGeneralSettings?.();
              }}
              className="w-full px-4 py-3 text-left text-white hover:bg-slate-700/50 transition-colors flex items-center space-x-3 group"
            >
              <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center group-hover:bg-slate-600/50 transition-colors">
                <Settings className="w-4 h-4 text-slate-300" />
              </div>
              <div>
                <span className="text-sm font-medium">Settings</span>
                <p className="text-xs text-slate-400">App preferences</p>
              </div>
            </button>
          </div>

          {/* Logout Section */}
          <div className="border-t border-slate-700/50 py-2">
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                logout();
              }}
              className="w-full px-4 py-3 text-left text-red-400 hover:bg-red-500/10 transition-colors flex items-center space-x-3 group"
            >
              <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                <LogOut className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <span className="text-sm font-medium">Sign Out</span>
                <p className="text-xs text-red-400/70">Exit your workspace</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 