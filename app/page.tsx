"use client"
import ContactUsPage from '@/components/ContactUs';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
	// Hero slideshow state
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [activeSection, setActiveSection] = useState('drones');
	const [scrollProgress, setScrollProgress] = useState(0);
	const [isScrolling, setIsScrolling] = useState(false);
	
	const heroImages = [
		'/banner.jpg',
		'/banner-drone.jpg',
		'/rocket-launching.jpg',
		'/222.jpg',
		'/reading.jpg',
	];

	const navigationItems = [
		{ id: 'drones', label: 'Drones', icon: '🚁', mobile: 'Drones'},
		{ id: 'rc-planes', label: 'RC Planes', icon: '✈️', mobile: 'Planes'},
		{ id: 'tech-fest', label: 'Techspardha', icon: '🔬', mobile: 'Techspardha'},
		{ id: 'skyforge', label: 'Skyforge', icon: '⚡', mobile: 'Skyforge'},
	];

	const competitions = [
		{
			id: 0,
			date: '',
			location: '',
			color: 'purple',
			delay: 0.2,
		},
		{
			id: 1,
			date: 'December 2024',
			location: 'IIT Bombay',
			color: 'cyan',
			delay: 0.3
		},
		{
			id: 2,
			date: 'March 2025',
			location: 'IIT Roorkee',
			color: 'blue',
			delay: 0.4
		},
		{
			id: 3,
			date: 'December 2025',
			location: 'NIDAR',
			color: 'indigo',
			delay: 0.5
		},
		{
			id: 6,
			date: '',
			title: '',
			location: '',
			color: 'purple',
			delay: 0.8,
		}
	];

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
		}, 5000); // 5 seconds
		return () => clearInterval(interval);
	}, [heroImages.length]);

	// Scroll detection for active section
	useEffect(() => {
		let ticking = false;
		let scrollTimeout: NodeJS.Timeout | null = null;
		
		const handleScroll = () => {
			// Don't update active section while programmatically scrolling
			if (isScrolling) return;
			
			if (!ticking) {
				requestAnimationFrame(() => {
					const scrollPosition = window.scrollY;
					
					// Calculate scroll progress
					const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
					const progress = Math.min(scrollPosition / documentHeight, 1);
					setScrollProgress(progress);
					
					const sections = navigationItems.map(item => document.getElementById(item.id));
					const viewportOffset = window.innerHeight / 3; // More sensitive detection

					for (let i = sections.length - 1; i >= 0; i--) {
						const section = sections[i];
						if (section) {
							const sectionTop = section.offsetTop;
							const sectionHeight = section.offsetHeight;
							const sectionBottom = sectionTop + sectionHeight;
							
							// Check if the section is prominently in view (at least 40% visible)
							if (scrollPosition + viewportOffset >= sectionTop && scrollPosition + viewportOffset <= sectionBottom - (sectionHeight * 0.2)) {
								setActiveSection(navigationItems[i].id);
								break;
							}
						}
					}
					ticking = false;
				});
				ticking = true;
			}
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll(); // Initial check
		return () => {
			window.removeEventListener('scroll', handleScroll);
			if (scrollTimeout) clearTimeout(scrollTimeout);
		};
	}, [isScrolling]);

	const scrollToSection = (sectionId: string) => {
		const element = document.getElementById(sectionId);
		if (element) {
			// Set scrolling state to prevent bounce back
			setIsScrolling(true);
			
			// Immediately update active section for instant feedback
			setActiveSection(sectionId);
			
			// Enhanced smooth scrolling with offset for better positioning
			const offsetTop = element.offsetTop - 20; // Small offset for better visual alignment
			window.scrollTo({
				top: offsetTop,
				behavior: 'smooth'
			});
			
			// Reset scrolling state after scroll animation completes
			// Smooth scroll typically takes 500-1000ms depending on distance
			setTimeout(() => {
				setIsScrolling(false);
			}, 800); // Give enough time for smooth scroll to complete
		}
	};

	return (
		<>
			{/* Unified Horizontal Bottom Navigation - Desktop & Mobile */}
			<motion.nav
				initial={{ y: 100, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.3, ease: "easeOut" }}
				className="fixed bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6 z-50"
			>
				<div className="relative bg-gray-900/95 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden max-w-2xl mx-auto">
					{/* Container for navigation items with proper spacing */}
					<div className="relative px-2 sm:px-4 py-2 sm:py-3">
						<div className="flex gap-1 sm:gap-2 items-center relative">
							{navigationItems.map((item, index) => (
								<motion.button
									key={item.id}
									onClick={() => scrollToSection(item.id)}
									className={`relative flex flex-col items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-2 sm:py-2 rounded-lg sm:rounded-xl border-none transition-all duration-300 group flex-1  ${
										activeSection === item.id
											? 'text-white bg-gradient-to-br from-cyan-500/25 to-purple-500/25 shadow-lg'
											: 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40 active:bg-gray-700/50'
									}`}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								transition={{ 
									type: "spring", 
									stiffness: 200, 
									damping: 15 
								}}
							>
								{/* Desktop label - hidden on mobile */}
								<motion.span 
									className={`text-xs font-semibold tracking-wide transition-all duration-300 hidden sm:block ${
										activeSection === item.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
									}`}
								>
									{item.label}
								</motion.span>

								{/* Mobile label - shows abbreviated text for active item */}
								<motion.span 
									className={`text-[10px] sm:hidden font-semibold tracking-wide transition-all duration-300 leading-tight ${
										activeSection === item.id ? 'text-white opacity-100' : 'text-gray-500 opacity-70'
									}`}
								>
									{item.mobile}
								</motion.span>
							</motion.button>
						))}
						</div>
						
						{/* Ambient glow effect */}
						<div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5 rounded-xl sm:rounded-2xl pointer-events-none" />
					</div>
				</div>
			</motion.nav>

			<div className="overflow-hidden bg-gray-900 hide-scrollbar">
				{/* 1. Hero: Aeromodelling Club intro + background image */}
				<section
					id="hero"
					className="relative min-h-screen flex items-center justify-center overflow-hidden"
				>
					{/* Background slideshow */}
					<div className="absolute inset-0">
						{heroImages.map((src, idx) => (
							<div
								key={src + idx}
								className={`absolute inset-0 bg-center bg-cover transition-opacity duration-1000 ${
									idx === currentImageIndex ? 'opacity-100' : 'opacity-0'
								}`}
								style={{ backgroundImage: `url('${src}')` }}
								aria-hidden
							/>
						))}
						{/* Dark overlay for readability */}
						<div className="absolute inset-0 bg-black/60" aria-hidden />
					</div>

					{/* Centered overlay text */}
					<motion.div 
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1, delay: 0.5 }}
						className="relative z-10 text-center px-6 md:px-8 max-w-6xl"
					>
						<h1
							className="text-white tracking-tight mb-6 text-7xl sm:text-7xl md:text-8xl lg:text-8xl font-bold"
							style={{ fontFamily: 'Bebas Neue, sans-serif' }}
						>
							<span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
								Aeromodelling Club
							</span>
						</h1>
						<p
							className="text-gray-200 mx-auto leading-relaxed text-lg sm:text-lg md:text-xl lg:text-xl max-w-4xl"
							style={{ fontFamily: 'Headland One, serif' }}
						>
							Exploring the skies through design, innovation, and teamwork — crafting aircraft and drones that turn imagination into flight.
						</p>
					</motion.div>
				</section>

				{/* 2. Drones */}
				<section 
					id="drones" 
					className={`relative py-20 md:py-32 px-6 md:px-12 bg-gradient-to-br from-gray-800/95 via-gray-850/90 to-gray-900/95 section-flow-bg transition-all duration-500 ${
						activeSection === 'drones' ? 'section-active' : ''
					}`}
					style={{ 
						clipPath: 'polygon(0 0, 100% 0, 100% 95%, 0 100%)'
					}}
				>
					{/* Smooth transition overlay at bottom */}
					<div className="gradient-transition-bottom"></div>
					<div className="max-w-7xl mx-auto relative z-10">
						<motion.div 
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, ease: "easeInOut" }}
							viewport={{ once: false, amount: 0.3 }}
							className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center"
						>
							{/* Text content - Left side */}
							<motion.div 
								initial={{ opacity: 0, y: 50 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, ease: "easeInOut", delay: 0.1 }}
								viewport={{ once: false, amount: 0.5 }}
								className="space-y-6"
							>
								<h2 
									className="text-5xl md:text-6xl font-bold text-white mb-8"
									style={{ fontFamily: 'Bebas Neue, sans-serif' }}
								>
									<span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
										Drones
									</span>
								</h2>
								<p 
									className="text-sm md:text-base  text-gray-300 leading-relaxed"
									style={{ fontFamily: 'Headland One, serif' }}
								>
									Our Drone Team began with the simple dream of making something fly — and we’ve been hooked ever since. From racing drones to projects in farming, rescue, and surveillance, every build is about learning, experimenting, and pushing what’s possible in the skies.
								</p>
							</motion.div>
							
							{/* Images - Right side */}
							<motion.div 
								initial={{ opacity: 0, y: 50 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, ease: "easeInOut", delay: 0.2 }}
								viewport={{ once: false, amount: 0.5 }}
								className="space-y-4"
							>
								{/* Top row - 2 images */}
								<div className="flex gap-4">
									<div className="flex-1 aspect-[3/2] bg-gradient-to-br from-gray-700 to-gray-800 rounded-3xl shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 border border-gray-600">
										<div className="w-full h-full flex items-center justify-center text-gray-400">
											<span className="text-sm opacity-50">Drone 1</span>
										</div>
									</div>
									<div className="flex-1 aspect-[3/2] bg-gradient-to-br from-gray-700 to-gray-800 rounded-3xl shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 border border-gray-600">
										<div className="w-full h-full flex items-center justify-center text-gray-400">
											<span className="text-sm opacity-50">Drone 2</span>
										</div>
									</div>
								</div>
								
								{/* Bottom row - 2 images */}
								<div className="flex gap-4">
									<div className="flex-1 aspect-[3/2] bg-gradient-to-br from-gray-700 to-gray-800 rounded-3xl shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 border border-gray-600">
										<div className="w-full h-full flex items-center justify-center text-gray-400">
											<span className="text-sm opacity-50">Drone 3</span>
										</div>
									</div>
									<div className="flex-1 aspect-[3/2] bg-gradient-to-br from-gray-700 to-gray-800 rounded-3xl shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 border border-gray-600">
										<div className="w-full h-full flex items-center justify-center text-gray-400">
											<span className="text-sm opacity-50">Drone 4</span>
										</div>
									</div>
								</div>
							</motion.div>
						</motion.div>
					</div>
				</section>

				{/* 3. RC Planes */}
				<section 
					id="rc-planes" 
					className={`relative py-20 md:py-32 px-6 md:px-12 bg-gradient-to-br from-gray-900/90 via-gray-875/85 to-gray-850/90 section-flow-bg -mt-16 transition-all duration-500 ${
						activeSection === 'rc-planes' ? 'section-active' : ''
					}`}
					style={{ 
						clipPath: 'polygon(0 5%, 100% 0, 100% 95%, 0 100%)'
					}}
				>
					{/* Smooth transition overlays */}
					<div className="gradient-transition-top"></div>
					<div className="gradient-transition-bottom"></div>
					<div className="max-w-7xl mx-auto relative z-10 pt-16">
						<motion.div 
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, ease: "easeInOut" }}
							viewport={{ once: false, amount: 0.3 }}
							className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center"
						>
							{/* Images - Left side */}
							<motion.div 
								initial={{ opacity: 0, y: 50 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, ease: "easeInOut", delay: 0.1 }}
								viewport={{ once: false, amount: 0.5 }}
								className="order-2 lg:order-1 space-y-4"
							>
								{/* Top row - 3 images */}
								<div className="flex gap-3">
									<div className="flex-1 aspect-[4/3] bg-gradient-to-br from-purple-800/30 to-blue-800/30 rounded-3xl shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 border border-gray-600">
										<div className="w-full h-full flex items-center justify-center text-gray-400">
											<span className="text-sm opacity-50">RC 1</span>
										</div>
									</div>
									<div className="flex-1 aspect-[4/3] bg-gradient-to-br from-purple-800/30 to-blue-800/30 rounded-3xl shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 border border-gray-600">
										<div className="w-full h-full flex items-center justify-center text-gray-400">
											<span className="text-sm opacity-50">RC 2</span>
										</div>
									</div>
									<div className="flex-1 aspect-[4/3] bg-gradient-to-br from-purple-800/30 to-blue-800/30 rounded-3xl shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 border border-gray-600">
										<div className="w-full h-full flex items-center justify-center text-gray-400">
											<span className="text-sm opacity-50">RC 3</span>
										</div>
									</div>
								</div>
								
								{/* Bottom row - 3 images */}
								<div className="flex gap-3">
									<div className="flex-1 aspect-[4/3] bg-gradient-to-br from-purple-800/30 to-blue-800/30 rounded-3xl shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 border border-gray-600">
										<div className="w-full h-full flex items-center justify-center text-gray-400">
											<span className="text-sm opacity-50">RC 4</span>
										</div>
									</div>
									<div className="flex-1 aspect-[4/3] bg-gradient-to-br from-purple-800/30 to-blue-800/30 rounded-3xl shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 border border-gray-600">
										<div className="w-full h-full flex items-center justify-center text-gray-400">
											<span className="text-sm opacity-50">RC 5</span>
										</div>
									</div>
									<div className="flex-1 aspect-[4/3] bg-gradient-to-br from-purple-800/30 to-blue-800/30 rounded-3xl shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 border border-gray-600">
										<div className="w-full h-full flex items-center justify-center text-gray-400">
											<span className="text-sm opacity-50">RC 6</span>
										</div>
									</div>
								</div>
							</motion.div>
							
							{/* Text content - Right side */}
							<motion.div 
								initial={{ opacity: 0, y: 50 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, ease: "easeInOut", delay: 0.2 }}
								viewport={{ once: false, amount: 0.5 }}
								className="order-1 lg:order-2 space-y-6"
							>
								<h2 
									className="text-5xl md:text-6xl font-bold text-white mb-8"
									style={{ fontFamily: 'Bebas Neue, sans-serif' }}
								>
									<span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
										RC Planes
									</span>
								</h2>
								<p 
									className="text-sm md:text-base  text-gray-300 leading-relaxed"
									style={{ fontFamily: 'Headland One, serif' }}
								>
									The RC Plane Team transforms ideas into aircraft — from trainers to aerobatic designs. Through design, construction, and test flights, hands-on experience teaches us more than theory, bringing us closer to stable, precise, and powerful flight.
								</p>
							</motion.div>
						</motion.div>
					</div>
				</section>

				{/* 4. Tech Fest (with sub-events) */}
				<section 
					id="tech-fest" 
					className={`relative py-20 md:py-32 px-6 md:px-12 bg-gradient-to-br from-gray-850/85 via-gray-825/80 to-gray-900/85 section-flow-bg -mt-16 transition-all duration-500 ${
						activeSection === 'tech-fest' ? 'section-active' : ''
					}`}
					style={{ 
						clipPath: 'polygon(0 5%, 100% 0, 100% 95%, 0 100%)'
					}}
				>
					{/* Smooth transition overlays */}
					<div className="gradient-transition-top"></div>
					<div className="gradient-transition-bottom"></div>
					<div className="max-w-7xl mx-auto relative z-10 pt-16">
						{/* Header */}
						<motion.div 
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, ease: "easeInOut" }}
							viewport={{ once: false, amount: 0.3 }}
							className="text-center mb-16"
						>
							<h2 
								className="text-5xl md:text-6xl font-bold text-white mb-8"
								style={{ fontFamily: 'Bebas Neue, sans-serif' }}
							>
								<span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
									Techspardha
								</span>
							</h2>
							<p 
								className="text-sm md:text-base  text-gray-300 max-w-4xl mx-auto leading-relaxed"
								style={{ fontFamily: 'Headland One, serif' }}
							>
								At Techspardha, the Aeromodelling Club owns the skies. From unveiling the fest theme through stunning aerial displays to hosting events like High Sky, SimSky, and Drone Racing League, we blend technology, creativity, and passion for flight into unforgettable experiences.
							</p>
						</motion.div>
						
						{/* Event Cards Grid */}
						<motion.div 
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, ease: "easeInOut", delay: 0.1 }}
							viewport={{ once: false, amount: 0.5 }}
							className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
						>
							{/* Drone Webfiesta */}
							<div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 overflow-hidden border border-gray-600 group">
								<div className="aspect-video bg-gradient-to-br from-cyan-800/30 to-blue-800/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
									<span className="text-gray-400 text-sm opacity-50">Event Image</span>
								</div>
								<div className="p-6">
									<h3 
										className="text-2xl font-bold text-white mb-4"
										style={{ fontFamily: 'Bebas Neue, sans-serif' }}
									>
										Drone Webfiesta
									</h3>
									<p className="text-gray-300 text-sm leading-relaxed">
										Short description placeholder for Drone Webfiesta event details.
									</p>
								</div>
							</div>

							{/* High Sky */}
							<div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 overflow-hidden border border-gray-600 group">
								<div className="aspect-video bg-gradient-to-br from-blue-800/30 to-purple-800/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
									<span className="text-gray-400 text-sm opacity-50">Event Image</span>
								</div>
								<div className="p-6">
									<h3 
										className="text-2xl font-bold text-white mb-4"
										style={{ fontFamily: 'Bebas Neue, sans-serif' }}
									>
										High Sky
									</h3>
									<p className="text-gray-300 text-sm leading-relaxed">
										Short description placeholder for High Sky event details.
									</p>
								</div>
							</div>

							{/* DRL */}
							<div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 overflow-hidden border border-gray-600 group">
								<div className="aspect-video bg-gradient-to-br from-purple-800/30 to-cyan-800/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
									<span className="text-gray-400 text-sm opacity-50">Event Image</span>
								</div>
								<div className="p-6">
									<h3 
										className="text-2xl font-bold text-white mb-4"
										style={{ fontFamily: 'Bebas Neue, sans-serif' }}
									>
										DRL
									</h3>
									<p className="text-gray-300 text-sm leading-relaxed">
										Short description placeholder for DRL event details.
									</p>
								</div>
							</div>

							{/* SimSky */}
							<div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 overflow-hidden border border-gray-600 group">
								<div className="aspect-video bg-gradient-to-br from-cyan-800/30 to-blue-800/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
									<span className="text-gray-400 text-sm opacity-50">Event Image</span>
								</div>
								<div className="p-6">
									<h3 
										className="text-2xl font-bold text-white mb-4"
										style={{ fontFamily: 'Bebas Neue, sans-serif' }}
									>
										SimSky
									</h3>
									<p className="text-gray-300 text-sm leading-relaxed">
										Short description placeholder for SimSky event details.
									</p>
								</div>
							</div>
						</motion.div>
					</div>
				</section>

				{/* 5. Skyforge Workshop */}
				<section 
					id="skyforge" 
					className={`relative py-20 md:py-32 px-6 md:px-12 bg-gradient-to-br from-gray-900/85 via-gray-875/80 to-gray-800/85 section-flow-bg -mt-16 transition-all duration-500 ${
						activeSection === 'skyforge' ? 'section-active' : ''
					}`}
					style={{ 
						clipPath: 'polygon(0 5%, 100% 0, 100% 100%, 0 100%)'
					}}
				>
					{/* Smooth transition overlay at top */}
					<div className="gradient-transition-top"></div>
					<div className="max-w-7xl mx-auto relative z-10 pt-16">
						<motion.div 
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, ease: "easeInOut" }}
							viewport={{ once: false, amount: 0.3 }}
							className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center"
						>
							{/* Text content - Left side */}
							<motion.div 
								initial={{ opacity: 0, y: 50 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, ease: "easeInOut", delay: 0.1 }}
								viewport={{ once: false, amount: 0.5 }}
								className="space-y-6"
							>
								<h2 
									className="text-5xl md:text-6xl font-bold text-white mb-8"
									style={{ fontFamily: 'Bebas Neue, sans-serif' }}
								>
									<span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
										Skyforge Workshop
									</span>
								</h2>
								<p 
									className="text-sm md:text-base  text-gray-300 leading-relaxed"
									style={{ fontFamily: 'Headland One, serif' }}
								>
									Step into the skies with drones — build, fly, and experiment like never before! Hands-on sessions, thrilling challenges, and real flights turn curiosity into skills, letting students innovate, create, and feel the rush of seeing their drones take flight.
								</p>
							</motion.div>
							
							{/* Images - Right side */}
							<motion.div 
								initial={{ opacity: 0, y: 50 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, ease: "easeInOut", delay: 0.2 }}
								viewport={{ once: false, amount: 0.5 }}
								className="space-y-4"
							>
								{/* Top row - 2 images */}
								<div className="flex gap-4">
									<div className="flex-1 aspect-[4/3] bg-gradient-to-br from-purple-800/30 to-cyan-800/30 rounded-3xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 border border-gray-600">
										<div className="w-full h-full flex items-center justify-center text-gray-400">
											<span className="text-sm opacity-50">Workshop 1</span>
										</div>
									</div>
									<div className="flex-1 aspect-[4/3] bg-gradient-to-br from-purple-800/30 to-cyan-800/30 rounded-3xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 border border-gray-600">
										<div className="w-full h-full flex items-center justify-center text-gray-400">
											<span className="text-sm opacity-50">Workshop 2</span>
										</div>
									</div>
								</div>
								
								{/* Bottom row - 3 images */}
								<div className="flex gap-3">
									<div className="flex-1 aspect-square bg-gradient-to-br from-cyan-800/30 to-blue-800/30 rounded-3xl shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 border border-gray-600">
										<div className="w-full h-full flex items-center justify-center text-gray-400">
											<span className="text-sm opacity-50">Workshop 3</span>
										</div>
									</div>
									<div className="flex-1 aspect-square bg-gradient-to-br from-cyan-800/30 to-blue-800/30 rounded-3xl shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 border border-gray-600">
										<div className="w-full h-full flex items-center justify-center text-gray-400">
											<span className="text-sm opacity-50">Workshop 4</span>
										</div>
									</div>
									<div className="flex-1 aspect-square bg-gradient-to-br from-cyan-800/30 to-blue-800/30 rounded-3xl shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 border border-gray-600">
										<div className="w-full h-full flex items-center justify-center text-gray-400">
											<span className="text-sm opacity-50">Workshop 5</span>
										</div>
									</div>
								</div>
							</motion.div>
						</motion.div>
					</div>
				</section>

				{/* 6. Competitions Timeline */}
				<section id="competitions-timeline" className="relative py-20 md:py-32 px-6 md:px-12 bg-gradient-to-br from-gray-800 via-gray-825 to-gray-850 -mt-16" style={{ clipPath: 'polygon(0 5%, 100% 0, 100% 95%, 0 100%)' }}>
					<div className="max-w-7xl mx-auto relative z-10 pt-16">
						{/* Section Header */}
						<motion.div 
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}
							viewport={{ once: true }}
							className="text-center mb-16"
						>
							<h2 
								className="text-5xl md:text-6xl font-bold text-white mb-8"
								style={{ fontFamily: 'Bebas Neue, sans-serif' }}
							>
								<span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
									Competitions Timeline
								</span>
							</h2>
							<p 
								className="text-sm md:text-base text-gray-300 max-w-4xl mx-auto leading-relaxed"
								style={{ fontFamily: 'Headland One, serif' }}
							>
								Our journey in national and international aeromodelling competitions
							</p>
						</motion.div>

						{/* Modern Horizontal Timeline */}
						<motion.div 
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
							viewport={{ once: true }}
							className="relative"
						>
							{/* Timeline Container with horizontal scroll on mobile */}
							<div className="relative overflow-x-auto pb-8">
								<div className="flex items-center justify-between min-w-[800px] mx-auto relative px-8">
									<div className="flex-1 relative mx-4">
										{/* Background Line */}
										<div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-600 transform -translate-y-1/2"></div>
										{/* Gradient Progress Line */}
										<div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transform -translate-y-1/2"></div>
										
										{/* Timeline Events */}
										<div className="relative flex justify-between items-center">
											{competitions.map((competition) => (
												<motion.div 
													key={competition.id}
													initial={{ opacity: 0, scale: 0 }}
													whileInView={{ opacity: 1, scale: 1 }}
													transition={{ duration: 0.5, delay: competition.delay, type: "spring", bounce: 0.4 }}
													viewport={{ once: true }}
													className={"relative group cursor-pointer flex flex-col items-center " + (competition.location.length > 0 ? "mx-3" : "")}
												>
													{/* Date Label Above - only show if not empty */}
													<div className="text-center mb-4 text-nowrap">
														{competition.date.length > 0 && (
															<div className={`text-sm font-semibold text-${competition.color}-400`}>{competition.date}</div>
														)}
													</div>
													
													{/* Event Dot - smaller and more subtle for empty items */}
													<div className={`w-3 h-3 bg-gradient-to-br from-${competition.color}-400 to-${competition.color}-600 rounded-full shadow-lg border-2 border-gray-900 hover:scale-125 transition-all duration-300`}></div>
													
													{/* Location Label Below - only show if not empty */}
													<div className="text-center mt-4 text-nowrap">
														{competition.location.length > 0 && (
															<div className="text-sm text-gray-300">{competition.location}</div>
														)}
													</div>
												</motion.div>
											))}
										</div>
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				</section>

				{/* 7. Postholders */}
				<section id="postholders" className="relative py-20 md:py-32 px-6 md:px-12 bg-gradient-to-br from-gray-850 via-gray-875 to-gray-900 -mt-16" style={{ clipPath: 'polygon(0 5%, 100% 0, 100% 100%, 0 100%)' }}>
					<div className="max-w-7xl mx-auto relative z-10 pt-16">
						{/* Section Header */}
						<motion.div 
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}
							viewport={{ once: true }}
							className="text-center mb-16"
						>
							<h2 
								className="text-5xl md:text-6xl font-bold text-white mb-8"
								style={{ fontFamily: 'Bebas Neue, sans-serif' }}
							>
								<span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
									Meet Our Team
								</span>
							</h2>
							<p 
								className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
								style={{ fontFamily: 'Headland One, serif' }}
							>
								The passionate leaders driving innovation and excellence in aeromodelling
							</p>
						</motion.div>

						{/* Team Grid */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
							{/* President */}
							<motion.div 
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.1 }}
								viewport={{ once: true }}
								className="group"
							>
								<div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-600 overflow-hidden hover:shadow-cyan-500/20 hover:-translate-y-2 transition-all duration-500">
									{/* Profile Image */}
									<div className="aspect-square bg-gradient-to-br from-cyan-800/30 to-blue-800/30 relative overflow-hidden">
										<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
										<div className="w-full h-full flex items-center justify-center text-gray-400">
											<div className="text-center">
												<div className="w-16 h-16 mx-auto mb-3 bg-cyan-500/20 rounded-full flex items-center justify-center">
													<div className="w-8 h-8 bg-cyan-400 rounded-full"></div>
												</div>
												<span className="text-sm opacity-70">Profile Photo</span>
											</div>
										</div>
									</div>
									
									{/* Profile Info */}
									<div className="p-6 text-center">
										{/* Role Badge */}
										<div className="inline-block bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-cyan-500/30">
											President
										</div>
										
										{/* Name Placeholder */}
										<h3 
											className="text-xl font-bold text-white mb-3"
											style={{ fontFamily: 'Bebas Neue, sans-serif' }}
										>
											[President Name]
										</h3>
										
										{/* Description */}
										<p className="text-sm text-gray-300 leading-relaxed">
											Leading the club's vision and strategic direction
										</p>
									</div>
								</div>
							</motion.div>

							{/* Vice President */}
							<motion.div 
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.2 }}
								viewport={{ once: true }}
								className="group"
							>
								<div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-600 overflow-hidden hover:shadow-blue-500/20 hover:-translate-y-2 transition-all duration-500">
									{/* Profile Image */}
									<div className="aspect-square bg-gradient-to-br from-blue-800/30 to-indigo-800/30 relative overflow-hidden">
										<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
										<div className="w-full h-full flex items-center justify-center text-gray-400">
											<div className="text-center">
												<div className="w-16 h-16 mx-auto mb-3 bg-blue-500/20 rounded-full flex items-center justify-center">
													<div className="w-8 h-8 bg-blue-400 rounded-full"></div>
												</div>
												<span className="text-sm opacity-70">Profile Photo</span>
											</div>
										</div>
									</div>
									
									{/* Profile Info */}
									<div className="p-6 text-center">
										{/* Role Badge */}
										<div className="inline-block bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-blue-500/30">
											Vice President
										</div>
										
										{/* Name Placeholder */}
										<h3 
											className="text-xl font-bold text-white mb-3"
											style={{ fontFamily: 'Bebas Neue, sans-serif' }}
										>
											[Vice President Name]
										</h3>
										
										{/* Description */}
										<p className="text-sm text-gray-300 leading-relaxed">
											Supporting leadership and operational excellence
										</p>
									</div>
								</div>
							</motion.div>

							{/* Secretary */}
							<motion.div 
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.3 }}
								viewport={{ once: true }}
								className="group"
							>
								<div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-600 overflow-hidden hover:shadow-purple-500/20 hover:-translate-y-2 transition-all duration-500">
									{/* Profile Image */}
									<div className="aspect-square bg-gradient-to-br from-purple-800/30 to-violet-800/30 relative overflow-hidden">
										<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
										<div className="w-full h-full flex items-center justify-center text-gray-400">
											<div className="text-center">
												<div className="w-16 h-16 mx-auto mb-3 bg-purple-500/20 rounded-full flex items-center justify-center">
													<div className="w-8 h-8 bg-purple-400 rounded-full"></div>
												</div>
												<span className="text-sm opacity-70">Profile Photo</span>
											</div>
										</div>
									</div>
									
									{/* Profile Info */}
									<div className="p-6 text-center">
										{/* Role Badge */}
										<div className="inline-block bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-purple-500/30">
											Secretary
										</div>
										
										{/* Name Placeholder */}
										<h3 
											className="text-xl font-bold text-white mb-3"
											style={{ fontFamily: 'Bebas Neue, sans-serif' }}
										>
											[Secretary Name]
										</h3>
										
										{/* Description */}
										<p className="text-sm text-gray-300 leading-relaxed">
											Managing communications and documentation
										</p>
									</div>
								</div>
							</motion.div>

							{/* Additional Secretary */}
							<motion.div 
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.4 }}
								viewport={{ once: true }}
								className="group"
							>
								<div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-600 overflow-hidden hover:shadow-emerald-500/20 hover:-translate-y-2 transition-all duration-500">
									{/* Profile Image */}
									<div className="aspect-square bg-gradient-to-br from-emerald-800/30 to-teal-800/30 relative overflow-hidden">
										<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
										<div className="w-full h-full flex items-center justify-center text-gray-400">
											<div className="text-center">
												<div className="w-16 h-16 mx-auto mb-3 bg-emerald-500/20 rounded-full flex items-center justify-center">
													<div className="w-8 h-8 bg-emerald-400 rounded-full"></div>
												</div>
												<span className="text-sm opacity-70">Profile Photo</span>
											</div>
										</div>
									</div>
									
									{/* Profile Info */}
									<div className="p-6 text-center">
										{/* Role Badge */}
										<div className="inline-block bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-emerald-500/30">
											Additional Secretary
										</div>
										
										{/* Name Placeholder */}
										<h3 
											className="text-xl font-bold text-white mb-3"
											style={{ fontFamily: 'Bebas Neue, sans-serif' }}
										>
											[Additional Secretary Name]
										</h3>
										
										{/* Description */}
										<p className="text-sm text-gray-300 leading-relaxed">
											Assisting with administrative tasks and coordination
										</p>
									</div>
								</div>
							</motion.div>
						</div>
					</div>
				</section>
			</div>
			<ContactUsPage />
		</>
	);
}
