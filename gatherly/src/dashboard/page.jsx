'use client';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { auth, db } from '@/Lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref as dbRef, onValue } from 'firebase/database';
import { Plus, Video, Sparkles } from 'lucide-react';

// Import components
import Header from '@/components/Header';
import WelcomeSection from '@/components/WelcomeSection';
import QuickActions from '@/components/QuickActions';
import RecentMeetings from '@/components/RecentMeetings';
import DeviceStatus from '@/components/DeviceStatus';
import JoinMeetingModal from '@/components/JoinMeetingModal';

// Reusable Glassmorphic Card Component
function Card({ children, className = '', onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        relative bg-white/10 backdrop-blur-md border border-white/20
        rounded-2xl shadow-lg p-6 transition-transform transform
        hover:scale-105 hover:shadow-2xl cursor-pointer
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [meetingId, setMeetingId] = useState('');
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const [recentMeetings] = useState([
    { id: '1', title: 'Team Standup', time: '10:00 AM', participants: 8, status: 'upcoming' },
    { id: '2', title: 'Client Presentation', time: '2:00 PM', participants: 12, status: 'completed' },
    { id: '3', title: 'Project Review', time: '4:30 PM', participants: 6, status: 'ongoing' }
  ]);

  // Live Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Get user from Firebase Realtime DB
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userRef = dbRef(db, `users/${firebaseUser.uid}`);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setUser({
              name: data.displayName || 'Unnamed',
              email: data.email || '',
              avatar: data.photoURL || null,
              uid: firebaseUser.uid
            });
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleOpenJoinModal = () => setIsJoinModalOpen(true);
  const handleCloseJoinModal = () => {
    setIsJoinModalOpen(false);
    setMeetingId('');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading your dashboard...
      </div>
    );
  }

  // Example QuickActions data
  const quickActionsData = [
    {
      title: 'Start Meeting',
      description: 'Create an instant meeting and invite others',
      icon: Video,
      accent: Sparkles,
      gradient: 'from-red-600 to-blue-700',
      hoverGradient: 'from-green-600 to-emerald-700',
      accentColor: 'text-green-400',
      action: () => alert('Starting meeting...'),
      buttonText: 'Start Now',
      buttonIcon: Plus,
      requiresAuth: true,
    },
    // Add more actions here
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 text-white">
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            color: '#1f2937',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          },
        }}
      />

      {/* Header */}
      <Header uid={user.uid} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Welcome Section */}
        <Card className="bg-gradient-to-tr from-indigo-800 via-blue-900 to-slate-800">
          <WelcomeSection user={user} currentTime={currentTime} />
        </Card>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActionsData.map((action, index) => (
            <Card key={index} className={`bg-gradient-to-br ${action.gradient} hover:bg-gradient-to-br ${action.hoverGradient}`}>
              <QuickActions
                title={action.title}
                description={action.description}
                icon={action.icon}
                accent={action.accent}
                accentColor={action.accentColor}
                action={action.action}
                buttonText={action.buttonText}
                buttonIcon={action.buttonIcon}
                requiresAuth={action.requiresAuth}
              />
            </Card>
          ))}
        </div>

        {/* Recent Meetings */}
        <Card>
          <RecentMeetings meetings={recentMeetings} />
        </Card>

        {/* Device Status */}
        <Card>
          <DeviceStatus />
        </Card>
      </main>

      {/* Join Meeting Modal */}
      <JoinMeetingModal
        isOpen={isJoinModalOpen}
        onClose={handleCloseJoinModal}
        meetingId={meetingId}
        setMeetingId={setMeetingId}
      />
    </div>
  );
}
	