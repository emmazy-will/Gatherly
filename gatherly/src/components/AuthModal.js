// components/AuthModal.js

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/Contexts/AuthContext';
import { Mail, Lock, User, X, Shield, CheckCircle } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, mode = 'login' }) {
  const [authMode, setAuthMode] = useState(mode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, signup, loginWithGoogle } = useAuth();

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (authMode === 'login') {
        await login(email, password);
      } else {
        await signup(email, password, displayName);
      }
      onClose();
      resetForm();
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Google auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
  };

  const switchMode = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
    resetForm();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 w-full max-w-md shadow-2xl shadow-blue-600/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {authMode === 'login' ? 'Welcome Back' : 'Join Gatherly'}
                </h2>
                <p className="text-slate-300 text-sm">
                  {authMode === 'login' 
                    ? 'Sign in to access your workspace' 
                    : 'Create your professional account'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>
            </div>

            {authMode === 'signup' && (
              <div className="mb-6 p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold text-sm mb-1">Enterprise Security</h4>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      Your data is protected with bank-level encryption and enterprise-grade security protocols.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-5">
              {authMode === 'signup' && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-lg bg-slate-700/30 border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-slate-400 transition-all duration-200"
                    required
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="Work Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-lg bg-slate-700/30 border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-slate-400 transition-all duration-200"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-lg bg-slate-700/30 border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-slate-400 transition-all duration-200"
                  required
                  minLength={6}
                />
                {authMode === 'signup' && (
                  <p className="mt-2 text-xs text-slate-400">
                    Minimum 6 characters required
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-blue-600/30"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  authMode === 'login' ? 'Sign In to Workspace' : 'Create Account'
                )}
              </button>
            </form>

            <div className="my-6 flex items-center">
              <div className="flex-1 h-px bg-slate-600/50"></div>
              <span className="px-4 text-slate-400 text-sm font-medium">or continue with</span>
              <div className="flex-1 h-px bg-slate-600/50"></div>
            </div>

            <button
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full py-4 px-4 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 border border-slate-600/50 hover:border-slate-500/50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="font-medium">Google Workspace</span>
            </button>

            {authMode === 'signup' && (
              <div className="mt-6 p-4 bg-slate-700/20 rounded-lg border border-slate-600/30">
                <div className="flex items-center space-x-2 mb-3">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-slate-200">What you get:</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                    <span>HD video calls with up to 50 participants</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                    <span>End-to-end encryption & enterprise security</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                    <span>AI-powered meeting transcription</span>
                  </li>
                </ul>
              </div>
            )}

            <div className="mt-8 text-center">
              <button
                onClick={switchMode}
                className="text-slate-400 hover:text-white transition-colors font-medium"
              >
                {authMode === 'login' 
                  ? "New to Gatherly? Create an account" 
                  : "Already have an account? Sign in"}
              </button>
            </div>

            {authMode === 'signup' && (
              <div className="mt-6 text-center">
                <p className="text-xs text-slate-400 leading-relaxed">
                  By creating an account, you agree to our{' '}
                  <a href="#" className="text-blue-400 hover:text-blue-300">Terms of Service</a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}