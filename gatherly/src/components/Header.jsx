'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	Video,
	Bell,
	Search,
	Settings,
	User,
	LogOut,
	ChevronDown,
	Menu,
	X
} from 'lucide-react';
import { onValue, ref as dbRef } from 'firebase/database';
import { signOut } from 'firebase/auth';
import { auth, db } from '@/Lib/firebase';
import { useRouter } from 'next/navigation';

export default function Header({ uid }) {
	const [showUserMenu, setShowUserMenu] = useState(false);
	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const [showMobileSearch, setShowMobileSearch] = useState(false);
	const [userData, setUserData] = useState({
		name: 'Loading...',
		email: 'Loading...'
	});
	const router = useRouter();

	useEffect(() => {
		if (!uid) return;

		const userRef = dbRef(db, `users/${uid}`);
		const unsubscribe = onValue(userRef, (snapshot) => {
			const data = snapshot.val();
			if (data) {
				setUserData({
					name: data.displayName || 'No Name',
					email: data.email || 'No Email'
				});
			}
		});

		return () => unsubscribe();
	}, [uid]);

	// Close menus when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (showUserMenu && !event.target.closest('.user-menu-container')) {
				setShowUserMenu(false);
			}
		};

		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	}, [showUserMenu]);

	const handleLogout = async () => {
		try {
			await signOut(auth);
			router.push('/');
		} catch (error) {
			console.error('Error signing out:', error);
		}
	};

	const getUserInitials = () => {
		if (userData.name && userData.name !== 'Loading...') {
			const names = userData.name.split(' ');
			return names.length >= 2 
				? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
				: userData.name[0].toUpperCase();
		}
		return 'U';
	};

	return (
		<>
			<header className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-40">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-14 sm:h-16">
						{/* Logo - Always visible */}
						<div className="flex items-center flex-shrink-0">
							<div className="bg-gradient-to-r from-blue-500 to-pink-600 p-1.5 sm:p-2 rounded-lg">
								<Video className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
							</div>
							<span className="ml-2 sm:ml-3 text-lg sm:text-xl font-bold text-white hidden xs:block">
								Gatherly
							</span>
							<span className="ml-2 text-sm font-bold text-white xs:hidden">
								G
							</span>
						</div>

						{/* Desktop Search - Hidden on mobile and tablet */}
						<div className="hidden lg:flex flex-1 max-w-md mx-8">
							<div className="relative w-full">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
								<input
									type="text"
									placeholder="Search meetings, contacts..."
									className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-white/50 transition-all"
								/>
							</div>
						</div>

						{/* Mobile/Tablet Search Button */}
						<div className="lg:hidden">
							<button
								onClick={() => setShowMobileSearch(true)}
								className="p-2 rounded-lg hover:bg-white/10 transition-colors"
							>
								<Search className="w-5 h-5 text-white" />
							</button>
						</div>

						{/* Desktop Actions - Hidden on mobile */}
						<div className="hidden md:flex items-center space-x-2 lg:space-x-4">
							<button className="p-2 rounded-lg hover:bg-white/10 transition-colors group">
								<Bell className="w-5 h-5 text-white group-hover:text-blue-300 transition-colors" />
							</button>
							<button className="p-2 rounded-lg hover:bg-white/10 transition-colors group">
								<Settings className="w-5 h-5 text-white group-hover:text-blue-300 transition-colors" />
							</button>

							{/* Desktop User Menu */}
							<div className="relative user-menu-container">
								<button
									onClick={() => setShowUserMenu(!showUserMenu)}
									className="flex items-center space-x-2 p-1.5 lg:p-2 rounded-lg hover:bg-white/10 transition-colors"
								>
									<div className="w-7 h-7 lg:w-8 lg:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs lg:text-sm">
										{getUserInitials()}
									</div>
									<div className="hidden lg:block text-left max-w-32">
										<p className="text-white text-sm font-medium truncate">
											{userData.name}
										</p>
									</div>
									<ChevronDown className={`w-4 h-4 text-white transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
								</button>

								<AnimatePresence>
									{showUserMenu && (
										<motion.div
											initial={{ opacity: 0, y: -10, scale: 0.95 }}
											animate={{ opacity: 1, y: 0, scale: 1 }}
											exit={{ opacity: 0, y: -10, scale: 0.95 }}
											transition={{ duration: 0.15 }}
											className="absolute right-0 mt-2 w-56 lg:w-64 bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 z-50 overflow-hidden"
										>
											<div className="p-4 border-b border-white/20">
												<div className="flex items-center space-x-3">
													<div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
														{getUserInitials()}
													</div>
													<div className="flex-1 min-w-0">
														<p className="text-white font-medium text-sm truncate">
															{userData.name}
														</p>
														<p className="text-white/60 text-xs truncate">
															{userData.email}
														</p>
													</div>
												</div>
											</div>

											<div className="p-2">
												<button className="w-full flex items-center px-3 py-2.5 text-white hover:bg-white/10 rounded-lg transition-colors text-left">
													<User className="w-4 h-4 mr-3 text-white/80" />
													<span className="text-sm">Profile Settings</span>
												</button>
												<button className="w-full flex items-center px-3 py-2.5 text-white hover:bg-white/10 rounded-lg transition-colors text-left">
													<Settings className="w-4 h-4 mr-3 text-white/80" />
													<span className="text-sm">Preferences</span>
												</button>
												<hr className="border-white/20 my-2" />
												<button
													onClick={handleLogout}
													className="w-full flex items-center px-3 py-2.5 text-red-300 hover:bg-red-500/10 hover:text-red-200 rounded-lg transition-colors text-left"
												>
													<LogOut className="w-4 h-4 mr-3" />
													<span className="text-sm">Sign Out</span>
												</button>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						</div>

						{/* Mobile Hamburger */}
						<div className="md:hidden">
							<button
								className="p-2 rounded-lg hover:bg-white/10 transition-colors"
								onClick={() => setShowMobileMenu(true)}
							>
								<Menu className="w-5 h-5 text-white" />
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* Mobile Search Overlay */}
			<AnimatePresence>
				{showMobileSearch && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
						onClick={() => setShowMobileSearch(false)}
					>
						<motion.div
							initial={{ y: -50, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							exit={{ y: -50, opacity: 0 }}
							className="bg-white/10 backdrop-blur-lg border-b border-white/20 p-4"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="max-w-7xl mx-auto flex items-center space-x-4">
								<div className="relative flex-1">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
									<input
										type="text"
										placeholder="Search meetings, contacts..."
										className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-white/50"
										autoFocus
									/>
								</div>
								<button
									onClick={() => setShowMobileSearch(false)}
									className="p-2 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
								>
									<X className="w-5 h-5 text-white" />
								</button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Mobile Drawer */}
			<AnimatePresence>
				{showMobileMenu && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
						onClick={() => setShowMobileMenu(false)}
					>
						<motion.div
							initial={{ x: '100%' }}
							animate={{ x: 0 }}
							exit={{ x: '100%' }}
							transition={{ type: 'spring', stiffness: 300, damping: 30 }}
							className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-slate-900/95 backdrop-blur-xl border-l border-white/20"
							onClick={(e) => e.stopPropagation()}
						>
							{/* Mobile Menu Header */}
							<div className="flex items-center justify-between p-6 border-b border-white/20">
								<div className="flex items-center space-x-3">
									<div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
										{getUserInitials()}
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-white font-medium text-sm truncate">
											{userData.name}
										</p>
										<p className="text-white/60 text-xs truncate">
											{userData.email}
										</p>
									</div>
								</div>
								<button 
									onClick={() => setShowMobileMenu(false)}
									className="p-2 rounded-lg hover:bg-white/10 transition-colors"
								>
									<X className="w-5 h-5 text-white" />
								</button>
							</div>

							{/* Mobile Menu Items */}
							<div className="p-4 space-y-2">
								<button 
									onClick={() => setShowMobileSearch(true)}
									className="w-full flex items-center space-x-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors text-left"
								>
									<Search className="w-5 h-5 text-white/80" />
									<span>Search</span>
								</button>
								
								<button className="w-full flex items-center space-x-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors text-left">
									<Bell className="w-5 h-5 text-white/80" />
									<span>Notifications</span>
								</button>
								
								<button className="w-full flex items-center space-x-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors text-left">
									<User className="w-5 h-5 text-white/80" />
									<span>Profile Settings</span>
								</button>
								
								<button className="w-full flex items-center space-x-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors text-left">
									<Settings className="w-5 h-5 text-white/80" />
									<span>Preferences</span>
								</button>
								
								<hr className="border-white/20 my-4" />
								
								<button
									onClick={handleLogout}
									className="w-full flex items-center space-x-3 px-4 py-3 text-red-300 hover:bg-red-500/10 hover:text-red-200 rounded-lg transition-colors text-left"
								>
									<LogOut className="w-5 h-5" />
									<span>Sign Out</span>
								</button>
							</div>

							{/* Mobile Menu Footer */}
							<div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20">
								<div className="flex items-center justify-center space-x-2">
									<div className="bg-gradient-to-r from-blue-500 to-pink-600 p-1 rounded">
										<Video className="w-4 h-4 text-white" />
									</div>
									<span className="text-white/60 text-sm">Gatherly</span>
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}