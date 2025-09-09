import { useState, useEffect } from 'react';
import { useAuth } from '@/Contexts/AuthContext';
import QuickActions from '@/components/QuickActions';
import JoinMeetingModal from '@/components/JoinMeetingModal';
import AuthModal from '@/components/AuthModal';
import UserProfile from '@/components/userProfile';
import { Video, LogIn, UserPlus, Sparkles, Users, Calendar, Clock, Shield, Zap, Globe } from 'lucide-react';

export default function HomeClient({ searchParams }) {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [meetingId, setMeetingId] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white overflow-hidden">
      {/* Professional animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-1/3 w-96 h-96 bg-slate-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Professional Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/90 backdrop-blur-xl border-b border-slate-700/30' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur-sm opacity-60"></div>
                <div className="relative flex items-center space-x-2 bg-slate-800/80 pl-3 pr-4 py-2 rounded-lg border border-slate-700/50">
                  <Video className="w-7 h-7 text-blue-400" />
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Gatherly</h1>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-slate-800/40 backdrop-blur-lg rounded-full px-5 py-2 mb-8 border border-slate-700/50">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-slate-200 font-medium">Enterprise-grade video conferencing</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-slate-100 to-blue-100 bg-clip-text text-transparent">Professional.</span>{' '}
            <span className="bg-gradient-to-r from-blue-100 via-indigo-100 to-slate-100 bg-clip-text text-transparent">Reliable.</span>{' '}
            <span className="bg-gradient-to-r from-indigo-100 via-blue-100 to-white bg-clip-text text-transparent">Secure.</span>
          </h1>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Experience enterprise-grade video conferencing with military-level security, crystal-clear HD quality, and AI-powered productivity features designed for modern businesses.
          </p>

          {currentUser && (
            <div className="mt-16">
              <QuickActions onJoinMeeting={handleJoinMeeting} />
            </div>
          )}
        </div>

        {!currentUser && (
          <div className="flex flex-col items-center">
            <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 max-w-md w-full shadow-2xl shadow-blue-600/10">
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Get Started Today</h3>
              <p className="text-slate-300 mb-8 text-center">
                Join thousands of businesses using Gatherly for their video conferencing needs
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => openAuthModal('signup')}
                  className="w-full py-4 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-blue-600/40 flex items-center justify-center space-x-2"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Start Free Trial</span>
                </button>
                <button
                  onClick={() => openAuthModal('login')}
                  className="w-full py-4 px-4 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg transition-all duration-200 font-semibold border border-slate-600/50 hover:border-slate-500 flex items-center justify-center space-x-2"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </button>
              </div>
            </div>

            {/* Professional feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 w-full max-w-5xl mx-auto">
              <div className="bg-slate-800/20 backdrop-blur-lg rounded-xl p-8 border border-slate-700/40 hover:border-slate-600/60 transition-all duration-300 hover:bg-slate-800/30">
                <div className="w-14 h-14 bg-blue-600/20 rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-7 h-7 text-blue-400" />
                </div>
                <h4 className="font-bold text-xl mb-3 text-white">Enterprise Scale</h4>
                <p className="text-slate-300 leading-relaxed">Host meetings with up to 1000 participants with 4K video quality and advanced moderation controls.</p>
              </div>

              <div className="bg-slate-800/20 backdrop-blur-lg rounded-xl p-8 border border-slate-700/40 hover:border-slate-600/60 transition-all duration-300 hover:bg-slate-800/30">
                <div className="w-14 h-14 bg-indigo-600/20 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-7 h-7 text-indigo-400" />
                </div>
                <h4 className="font-bold text-xl mb-3 text-white">Bank-Level Security</h4>
                <p className="text-slate-300 leading-relaxed">End-to-end encryption, GDPR compliance, and enterprise-grade security protocols for peace of mind.</p>
              </div>

              <div className="bg-slate-800/20 backdrop-blur-lg rounded-xl p-8 border border-slate-700/40 hover:border-slate-600/60 transition-all duration-300 hover:bg-slate-800/30">
                <div className="w-14 h-14 bg-slate-600/20 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-7 h-7 text-slate-400" />
                </div>
                <h4 className="font-bold text-xl mb-3 text-white">AI-Powered Features</h4>
                <p className="text-slate-300 leading-relaxed">Real-time transcription, smart scheduling, and automated meeting summaries powered by advanced AI.</p>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 text-center">
              <p className="text-slate-400 text-sm mb-6 font-medium">Trusted by 10,000+ businesses worldwide</p>
              <div className="flex items-center justify-center space-x-8 opacity-60">
                <div className="text-slate-500 text-xs font-semibold">ISO 27001</div>
                <div className="text-slate-500 text-xs font-semibold">SOC 2 Type II</div>
                <div className="text-slate-500 text-xs font-semibold">GDPR Compliant</div>
                <div className="text-slate-500 text-xs font-semibold">HIPAA Ready</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Professional Footer */}
      <footer className="relative border-t border-slate-700/50 mt-24 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Video className="w-6 h-6 text-blue-400" />
              <span className="text-slate-300 font-semibold">Gatherly</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-slate-400">
              <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Support</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Contact</a>
            </div>
          </div>
          <div className="border-t border-slate-700/30 mt-8 pt-8 text-center">
            <p className="text-slate-500 text-sm">
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