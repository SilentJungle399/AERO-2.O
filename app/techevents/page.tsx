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
          {/* Main Heading */}
          <h1 className="text-7xl mb-8 font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 animate-text-shine">
            <span className="font-['Press_Start_2P']">TECHSPARDHA</span>
            <span className="font-['Press_Start_2P'] block mt-4 text-xs text-red-400 drop-shadow-[0_0_8px_rgba(200_0_0_/_0.8)]">
              27-Feb to 2-March
            </span>
            <span className="font-['Press_Start_2P'] block mt-4 text-4xl text-green-400 drop-shadow-[0_0_8px_rgba(52_211_153_/_0.8)]">
              2025
            </span>
          </h1>

          {/* Sponsors Section */}
          <div className="max-w-4xl mx-auto ">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/20">
              <h3 className="text-lg font-semibold mb-4 text-cyan-300 glow-cyan">Proudly Supported By</h3>
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center space-x-2 glow-blue">
                  <img className="w-6 h-6 rounded-full glow-blue" src="dass.png" />
                  <span className="text-lg">Main Sponsor</span>
                </div>
                {['Tech Giant Corp', 'InnovateX', 'Future Labs'].map((sponsor, idx) => (
                  <div key={idx} className="flex items-center space-x-2 glow-blue">
                    <img className="w-6 h-6 rounded-full glow-blue" src="dass.png" />
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
            <div key={idx} className="group relative bg-gray-800 rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.02] border border-cyan-500/20 hover:border-cyan-400/40">
              <div className="absolute inset-0 bg-gradient-to-br opacity-30 ${event.color} group-hover:opacity-50 transition-opacity"></div>

              {/* Event Poster */}
              <div className="relative h-48 overflow-hidden border-b border-cyan-500/20">
                <img
                  src={event.poster}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
              </div>

              <div className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`text-2xl font-bold bg-gradient-to-r ${event.color} bg-clip-text text-transparent`}>
                    {event.icon} {event.title}
                  </div>
                  <span className="px-3 py-1 bg-gray-700/50 rounded-full text-sm backdrop-blur-sm">
                    Team Size: 2-4
                  </span>
                </div>

                {/* Hover Content */}
                <div className="overflow-hidden">
                  <div className="group-hover:translate-y-0 translate-y-full transition-transform duration-300">
                    <p className="text-gray-300 mb-6 text-sm">{event.description}</p>
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
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-br from-gray-800 to-blue-900/20 rounded-2xl p-8 relative overflow-hidden border border-cyan-500/20">
          <h2 className="text-4xl font-bold mb-8 flex items-center">
            <ShoppingBag className="mr-4 text-purple-400" />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Official Merchandise
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-2xl font-bold">₹{item.price}</div>
                    <div className="text-sm text-gray-400">{item.color} T-Shirt</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className='flex justify-center'>
          <Link className="px-4 py-2 mt-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors glow-blue"
            href="/techevents/buy">
            Quick Buy
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
        .glow-amber {
          filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.5));
        }
      `}</style>
    </div>
  );
}
