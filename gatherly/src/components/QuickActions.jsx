// components/QuickActions.jsx - Professional Color Scheme
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '@/Contexts/AuthContext';
import {
  Video,
  Calendar,
  Plus,
  Link,
  Phone,
  Sparkles,
  Zap,
  Shield,
  Crown,
  Clock,
  UserCheck
} from 'lucide-react';

export default function QuickActions({ onJoinMeeting }) {
  const { currentUser } = useAuth();

  const getUserIdentity = () => {
    if (!currentUser) return null;
    return currentUser.displayName || currentUser.email?.split('@')[0] || `User-${currentUser.uid.substring(0, 8)}`;
  };

  const handleStartMeeting = async () => {
    if (!currentUser) {
      toast.error('Please sign in to start a meeting');
      return;
    }

    const newMeetingId = Math.random().toString(36).substr(2, 9);
    const identity = getUserIdentity();
    
    try {
      console.log('Starting meeting with:', { identity, roomName: newMeetingId });
      
      // Show loading toast
      const loadingToast = toast.loading('Creating meeting...');
      
      const response = await fetch(`/api/token?identity=${encodeURIComponent(identity)}&roomName=${newMeetingId}`);
      
      console.log('Response status:', response.status);
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      if (!response.ok) {
        if (response.headers.get('content-type')?.includes('text/html')) {
          console.error("Received HTML instead of JSON - API route may not exist");
          toast.error("API route not found. Please check if /pages/api/token.js exists.");
          return;
        }
        
        const errorText = await response.text();
        console.error('Error response:', errorText);
        
        // Try to parse as JSON for better error message
        try {
          const errorData = JSON.parse(errorText);
          toast.error(errorData.error || `HTTP error! status: ${response.status}`);
        } catch {
          toast.error(`HTTP error! status: ${response.status}`);
        }
        return;
      }

      const data = await response.json();
      console.log('Token response:', data);
      
      if (!data.token) {
        toast.error("No token received from server");
        console.error('No token in response:', data);
        return;
      }

      toast.success(`Meeting started! ID: ${newMeetingId}`);
      
      // Store the meeting data for the room component
      const meetingData = {
        token: data.token,
        identity: data.identity,
        roomName: data.roomName,
        livekitUrl: data.LIVEKIT_URL,
        userInfo: {
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
          uid: currentUser.uid
        }
      };
      
      // Store in sessionStorage (more reliable than localStorage for this use case)
      sessionStorage.setItem('meetingData', JSON.stringify(meetingData));
      
      // Navigate to the room
      console.log('Navigating to:', `/room/${newMeetingId}`);
      window.location.href = `/room/${newMeetingId}`;
      
    } catch (error) {
      console.error("Failed to start meeting:", error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        toast.error("Cannot connect to server. Please check if your server is running.");
      } else {
        toast.error(`Failed to start meeting: ${error.message}`);
      }
    }
  };

  const handleScheduleMeeting = () => {
    toast.success('Opening scheduler...');
    console.log('Schedule meeting functionality not yet implemented');
  };

  const actions = [
    {
      title: 'Start Instant Meeting',
      description: 'Create an instant meeting and invite others',
      icon: Video,
      accent: Sparkles,
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
      borderColor: 'border-blue-200 dark:border-blue-800',
      iconBg: 'bg-blue-500',
      accentColor: 'text-blue-400',
      action: handleStartMeeting,
      buttonText: 'Start Now',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      buttonIcon: Plus,
      requiresAuth: true,
      premium: false
    },
    {
      title: 'Join Meeting',
      description: 'Join an existing meeting with an ID or link',
      icon: Link,
      accent: Zap,
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      iconBg: 'bg-emerald-500',
      accentColor: 'text-emerald-400',
      action: onJoinMeeting,
      buttonText: 'Join Meeting',
      buttonColor: 'bg-emerald-600 hover:bg-emerald-700',
      buttonIcon: Phone,
      requiresAuth: false,
      premium: false
    },
    {
      title: 'Schedule Meeting',
      description: 'Plan and schedule meetings for later with calendar integration',
      icon: Calendar,
      accent: Shield,
      bgColor: 'bg-violet-50 dark:bg-violet-950/30',
      borderColor: 'border-violet-200 dark:border-violet-800',
      iconBg: 'bg-violet-500',
      accentColor: 'text-violet-400',
      action: handleScheduleMeeting,
      buttonText: 'Schedule',
      buttonColor: 'bg-violet-600 hover:bg-violet-700',
      buttonIcon: Clock,
      requiresAuth: true,
      premium: true
    }
  ];

  const handleActionClick = (action) => {
    if (action.requiresAuth && !currentUser) {
      toast.error('Please sign in to use this feature');
      return;
    }
    action.action();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {actions.map((action, index) => (
        <motion.div
          key={action.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
          whileHover={{ y: -5 }}
          className={`relative ${action.bgColor} backdrop-blur-sm rounded-2xl p-6 border ${action.borderColor} transition-all duration-300 shadow-md group`}
        >
          {/* Premium badge */}
          {action.premium && (
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center z-10 shadow-md">
              <Crown className="w-3 h-3 mr-1" />
              PRO
            </div>
          )}
          
          {/* Icon container */}
          <div className="flex items-center justify-between mb-5">
            <div className={`${action.iconBg} p-3 rounded-xl text-white shadow-sm`}>
              <action.icon className="w-6 h-6" />
            </div>
            <motion.div
              initial={{ scale: 1, rotate: 0 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <action.accent className={`w-5 h-5 ${action.accentColor} opacity-80 group-hover:opacity-100`} />
            </motion.div>
          </div>
          
          {/* Content */}
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">{action.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-5 leading-relaxed">{action.description}</p>
          
          {/* Show user info for authenticated actions */}
          {action.requiresAuth && currentUser && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-5 p-3 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center space-x-3">
                {currentUser.photoURL ? (
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-700 shadow-sm"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-700 shadow-sm">
                    <span className="text-white text-sm font-bold">
                      {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-gray-800 dark:text-white text-sm font-medium">{getUserIdentity()}</p>
                  <div className="flex items-center mt-1">
                    <UserCheck className="w-3 h-3 text-green-500 mr-1" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Signed in</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Auth required message */}
          {action.requiresAuth && !currentUser && (
            <div className="mb-5 p-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-700">
              <p className="text-amber-700 dark:text-amber-300 text-sm text-center">
                Sign in required
              </p>
            </div>
          )}

          {/* Action button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleActionClick(action)}
            className={`w-full ${action.buttonColor} text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm`}
            disabled={action.requiresAuth && !currentUser}
          >
            <action.buttonIcon className="w-5 h-5" />
            <span>{action.buttonText}</span>
          </motion.button>
        </motion.div>
      ))}
    </div>
  );
}