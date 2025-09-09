import { useState, useEffect } from 'react';
import { useAuth } from '@/Contexts/AuthContext';
import QuickActions from '@/components/QuickActions';
import JoinMeetingModal from '@/components/JoinMeetingModal';
import AuthModal from '@/components/AuthModal';
import UserProfile from '@/components/userProfile';
import { Video, LogIn, UserPlus, Sparkles, Users, Calendar, Clock, Shield, Zap, Globe, Menu, X } from 'lucide-react';

export default function HomeClient({ searchParams }) {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [meetingId, setMeetingId] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { currentUser } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleJoinMeeting = () => {
    if (!currentUser) {
      setAuthMode('login');
      setIsAuthModalOpen(true);
      return;
    }
    setIsJoinModalOpen(true);
  };

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
    setIsMobileMenuOpen(false); // Close mobile menu when opening auth modal
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white overflow-hidden">
      {/* Professional animated background elements - responsive positioning */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-48 h-48 sm:w-96 sm:h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 sm:top-60 -left-20 sm:-left-40 w-48 h-48 sm:w-96 sm:h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 sm:bottom-40 right-1/4 sm:right-1/3 w-48 h-48 sm:w-96 sm:h-96 bg-slate-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Responsive Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/30' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo - responsive sizing */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur-sm opacity-60"></div>
                <div className="relative flex items-center space-x-1 sm:space-x-2 bg-slate-800/80 pl-2 sm:pl-3 pr-3 sm:pr-4 py-1.5 sm:py-2 rounded-lg border border-slate-700/50">
                  <Video className="w-5 h-5 sm:w-7 sm:h-7 text-blue-400" />
                  <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Gatherly</h1>
                </div>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {currentUser ? (
                <UserProfile />
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="flex items-center space-x-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200 border border-slate-700/50 hover:border-slate-600"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={() => openAuthModal('signup')}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-600/30"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Sign Up</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              {currentUser ? (
                <UserProfile />
              ) : (
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && !currentUser && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/30 px-3 py-4 space-y-3">
              <button
                onClick={() => openAuthModal('login')}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200 border border-slate-700/50"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => openAuthModal('signup')}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg transition-all duration-200"
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign Up</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content - Responsive spacing and typography */}
      <main className="relative pt-20 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          {/* Badge - responsive sizing */}
          <div className="inline-flex items-center space-x-2 bg-slate-800/40 backdrop-blur-lg rounded-full px-3 sm:px-5 py-1.5 sm:py-2 mb-6 sm:mb-8 border border-slate-700/50">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
            <span className="text-xs sm:text-sm text-slate-200 font-medium">Enterprise-grade video conferencing</span>
          </div>
          
          {/* Hero title - highly responsive typography */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 lg:mb-8 leading-tight px-2">
            <span className="bg-gradient-to-r from-white via-slate-100 to-blue-100 bg-clip-text text-transparent block sm:inline">Professional.</span>{' '}
            <span className="bg-gradient-to-r from-blue-100 via-indigo-100 to-slate-100 bg-clip-text text-transparent block sm:inline">Reliable.</span>{' '}
            <span className="bg-gradient-to-r from-indigo-100 via-blue-100 to-white bg-clip-text text-transparent block sm:inline">Secure.</span>
          </h1>
          
          {/* Hero description - responsive text sizing */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-4xl mx-auto mb-8 sm:mb-10 lg:mb-12 leading-relaxed px-4">
            Experience enterprise-grade video conferencing with military-level security, crystal-clear HD quality, and AI-powered productivity features designed for modern businesses.
          </p>

          {currentUser && (
            <div className="mt-8 sm:mt-12 lg:mt-16">
              <QuickActions onJoinMeeting={handleJoinMeeting} />
            </div>
          )}
        </div>

        {!currentUser && (
          <div className="flex flex-col items-center">
            {/* CTA Card - responsive width and spacing */}
            <div className="bg-slate-800/30 backdrop-blur-xl rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-slate-700/50 max-w-sm sm:max-w-md w-full mx-4 shadow-2xl shadow-blue-600/10">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 text-center">Get Started Today</h3>
              <p className="text-slate-300 mb-6 sm:mb-8 text-center text-sm sm:text-base">
                Join thousands of businesses using Gatherly for their video conferencing needs
              </p>
              <div className="space-y-3 sm:space-y-4">
                <button
                  onClick={() => openAuthModal('signup')}
                  className="w-full py-3 sm:py-4 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-blue-600/40 flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Start Free Trial</span>
                </button>
                <button
                  onClick={() => openAuthModal('login')}
                  className="w-full py-3 sm:py-4 px-4 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg transition-all duration-200 font-semibold border border-slate-600/50 hover:border-slate-500 flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Sign In</span>
                </button>
              </div>
            </div>

            {/* Feature cards - responsive grid and spacing */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-12 sm:mt-16 lg:mt-20 w-full max-w-6xl mx-auto px-4">
              <div className="bg-slate-800/20 backdrop-blur-lg rounded-lg sm:rounded-xl p-6 sm:p-8 border border-slate-700/40 hover:border-slate-600/60 transition-all duration-300 hover:bg-slate-800/30">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <Users className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" />
                </div>
                <h4 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-white">Enterprise Scale</h4>
                <p className="text-slate-300 leading-relaxed text-sm sm:text-base">Host meetings with up to 1000 participants with 4K video quality and advanced moderation controls.</p>
              </div>

              <div className="bg-slate-800/20 backdrop-blur-lg rounded-lg sm:rounded-xl p-6 sm:p-8 border border-slate-700/40 hover:border-slate-600/60 transition-all duration-300 hover:bg-slate-800/30">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-600/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-400" />
                </div>
                <h4 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-white">Bank-Level Security</h4>
                <p className="text-slate-300 leading-relaxed text-sm sm:text-base">End-to-end encryption, GDPR compliance, and enterprise-grade security protocols for peace of mind.</p>
              </div>

              <div className="bg-slate-800/20 backdrop-blur-lg rounded-lg sm:rounded-xl p-6 sm:p-8 border border-slate-700/40 hover:border-slate-600/60 transition-all duration-300 hover:bg-slate-800/30 lg:col-span-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-600/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-slate-400" />
                </div>
                <h4 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-white">AI-Powered Features</h4>
                <p className="text-slate-300 leading-relaxed text-sm sm:text-base">Real-time transcription, smart scheduling, and automated meeting summaries powered by advanced AI.</p>
              </div>
            </div>

            {/* Trust indicators - responsive layout */}
            <div className="mt-12 sm:mt-16 text-center px-4">
              <p className="text-slate-400 text-xs sm:text-sm mb-4 sm:mb-6 font-medium">Trusted by 10,000+ businesses worldwide</p>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8 opacity-60">
                <div className="text-slate-500 text-xs font-semibold">ISO 27001</div>
                <div className="text-slate-500 text-xs font-semibold">SOC 2 Type II</div>
                <div className="text-slate-500 text-xs font-semibold">GDPR Compliant</div>
                <div className="text-slate-500 text-xs font-semibold">HIPAA Ready</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Responsive Footer */}
      <footer className="relative border-t border-slate-700/50 mt-16 sm:mt-20 lg:mt-24 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Video className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              <span className="text-slate-300 font-semibold text-sm sm:text-base">Gatherly</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-400">
              <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Support</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Contact</a>
            </div>
          </div>
          <div className="border-t border-slate-700/30 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
            <p className="text-slate-500 text-xs sm:text-sm px-4">
              &copy; {new Date().getFullYear()} Gatherly. All rights reserved. Built for the modern workplace.
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <JoinMeetingModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        meetingId={meetingId}
        setMeetingId={setMeetingId}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
      />
    </div>
  );
}