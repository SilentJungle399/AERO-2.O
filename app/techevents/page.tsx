"use client";
import Head from 'next/head';
import Link from "next/link";
import { Rocket, Zap, Trophy, Cloud, ShoppingBag } from 'lucide-react';

export default function Techspardha() {
  return (
    <div className="min-h-screen pt-5 bg-gray-900 text-white">
      <Head>
        <title>Techspardha 2025</title>
      </Head>

      {/* Hero Section */}
      <header className="relative py-44 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20 animate-grid-pulse"></div>
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-8 font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 animate-text-shine">
            <span className="font-['Press_Start_2P'] text-2xl lg:text-7xl">TECHSPARDHA</span>
            <span className="font-['Press_Start_2P'] block mt-4 text-xs text-red-400 drop-shadow-[0_0_8px_rgba(200_0_0_/_0.8)]">
              27-Feb to 2-March
            </span>
            <span className="font-['Press_Start_2P'] block mt-4 text-4xl text-green-400 drop-shadow-[0_0_8px_rgba(52_211_153_/_0.8)]">
              2025
            </span>
          </h1>

          {/* Sponsors Section */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/20">
              <h3 className="text-lg font-semibold mb-4 text-cyan-300 glow-cyan">Proudly Supported By</h3>
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center space-x-2 glow-blue">
                  <img className="w-6 h-6 rounded-full glow-blue" src="dass.png" alt="Sponsor" />
                  <span className="text-lg">Main Sponsor</span>
                </div>
                {['Tech Giant Corp', 'InnovateX', 'Future Labs'].map((sponsor, idx) => (
                  <div key={idx} className="flex items-center space-x-2 glow-blue">
                    <img className="w-6 h-6 rounded-full glow-blue" src="dass.png" alt="Sponsor" />
                    <span className="text-lg">{sponsor}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Events Section */}
      <div className="container mx-auto px-4 pb-16">
        <h2 className="text-4xl font-bold my-4 flex items-center">
          <Trophy className="mr-4 text-purple-400" />
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Events
          </span>
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              title: "High Sky",
              icon: <Rocket className="w-6 h-6" />,
              color: "from-blue-600 to-cyan-500",
              description: "Aerial robotics challenge testing autonomous flight systems",
              poster: "2ndyr.jpg"
            },
            {
              title: "Drone Web Fiesta",
              icon: <Zap className="w-6 h-6" />,
              color: "from-purple-600 to-pink-500",
              description: "Drone racing competition with obstacle navigation",
              poster: "2ndyr.jpg"
            },
            {
              title: "SimSky",
              icon: <Cloud className="w-6 h-6" />,
              color: "from-emerald-600 to-cyan-400",
              description: "Flight simulation challenge with emergency scenarios",
              poster: "2ndyr.jpg"
            },
            {
              title: "DRL",
              icon: <Trophy className="w-6 h-6" />,
              color: "from-rose-600 to-amber-500",
              description: "Professional drone racing league competition",
              poster: "2ndyr.jpg"
            }
          ].map((event, idx) => (
            <div key={idx} className="group relative bg-gray-800 rounded-2xl overflow-hidden transition-transform duration-300 md:hover:scale-[1.02] border border-cyan-500/20 md:hover:border-cyan-400/40">
              <div className={`absolute inset-0 bg-gradient-to-br opacity-30 ${event.color} md:group-hover:opacity-50 transition-opacity`}></div>

              {/* Event Poster */}
              <div className="relative h-48 md:h-40 overflow-hidden border-b border-cyan-500/20">
                <img
                  src={event.poster}
                  alt={event.title}
                  className="w-full h-full object-cover md:group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
              </div>

              <div className="p-4 md:p-6 relative">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className={`text-xl md:text-2xl font-bold bg-gradient-to-r ${event.color} bg-clip-text text-transparent`}>
                    {event.icon} {event.title}
                  </div>
                  <span className="px-3 py-1 text-[6px] md:text-sm bg-gray-700/50 rounded-full backdrop-blur-sm">
                    Team Size: 4
                  </span>
                </div>

                {/* Mobile Content */}
                <div className="md:hidden space-y-3">
                  <p className="text-gray-300 text-sm">{event.description}</p>
                  <button className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg font-semibold text-sm glow-cyan">
                    Register Now
                  </button>
                </div>

                {/* Desktop Hover Content */}
                <div className="hidden md:block overflow-hidden">
                  <div className="md:group-hover:translate-y-0 translate-y-full transition-transform duration-300">
                    <p className="text-gray-300 mb-4 text-sm">{event.description}</p>
                    <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl font-semibold hover:opacity-90 transition-opacity glow-cyan">
                      Register Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Merchandise Section */}
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="bg-gradient-to-br from-gray-800 to-blue-900/20 rounded-2xl p-6 md:p-8 relative overflow-hidden border border-cyan-500/20">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 flex items-center">
            <ShoppingBag className="mr-3 text-purple-400" />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Official Merchandise
            </span>
          </h2>

          {/* Mobile Carousel */}
          <div className='md:hidden flex flex-row justify-center items-center space-x-4 overflow-x-auto pb-4'>
          <div>⬅️</div>
          <div className="md:hidden overflow-x-auto pb-4">
            <div className="flex space-x-4 ">
              {[
                { price: 599, color: "Black", image: "T-shirt.png" },
                { price: 599, color: "White", image: "T-shirt.png" },
                { price: 699, color: "Limited Edition", image: "T-shirt.png" }
              ].map((item, idx) => (
                <div key={idx} className="flex-shrink-0 w-40 bg-gray-800/50 rounded-xl p-4 border border-cyan-500/20">
                  <div className="relative h-auto overflow-hidden rounded-lg mb-3">
                    <img
                      src={item.image}
                      alt={`Techspardha ${item.color} T-Shirt`}
                      className="w-auto h-auto object-cover"
                    />
                  </div>
                  <div className="text-xl font-bold">₹{item.price}</div>
                  <div className="text-sm text-gray-400">{item.color} T-Shirt</div>
                </div>
              ))}
            </div>
          </div>
          <div>➡️</div>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-6">
            {[
              { price: 599, color: "Black", image: "T-shirt.png" },
              { price: 599, color: "White", image: "T-shirt.png" },
              { price: 699, color: "Limited Edition", image: "T-shirt.png" }
            ].map((item, idx) => (
              <div key={idx} className="bg-gray-800/50 rounded-xl p-6 hover:bg-gray-700/30 transition-colors group relative border border-cyan-500/20">
                <div className="relative h-64 overflow-hidden rounded-lg mb-4">
                  <img
                    src={item.image}
                    alt={`Techspardha ${item.color} T-Shirt`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                </div>
                <div>
                  <div className="text-2xl font-bold">₹{item.price}</div>
                  <div className="text-sm text-gray-400">{item.color} T-Shirt</div>
                </div>
              </div>
            ))}
          </div>

          <div className='flex justify-center mt-6'>
            <Link
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity glow-cyan"
              href="/techevents/buy"
            >
              Purchase
            </Link>
          </div>
        </div>
      </div>



      {/* Global Styles */}
      <style jsx global>{`
        @keyframes text-shine {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        @keyframes grid-pulse {
          0% { opacity: 0.1; }
          50% { opacity: 0.2; }
          100% { opacity: 0.1; }
        }
        .animate-text-shine {
          background-size: 200% auto;
          animation: text-shine 3s linear infinite;
        }
        .animate-grid-pulse {
          animation: grid-pulse 3s ease-in-out infinite;
        }
        .glow-cyan {
          filter: drop-shadow(0 0 8px rgba(34, 211, 238, 0.5));
        }
        .glow-blue {
          filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.5));
        }
      `}</style>
    </div>
  );
}
