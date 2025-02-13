import Head from 'next/head';
import Font, { Text } from 'react-font'
import { Rocket, Zap, Trophy, Cloud, ShoppingBag } from 'lucide-react';

export default function Techspardha() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Techspardha 2025</title>
      </Head>

      {/* Hero Section */}
      <header className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
        <div className="container mx-auto px-4 text-center">
          {/* Main Heading */}
          <h1 className="text-7xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 animate-gradient-shift">
            TECHSPARDHA
            <span className="text-4xl block mt-4 font-medium text-gray-300">2025</span>
          </h1>
          
          {/* Sponsors Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-cyan-300">Proudly Supported By</h3>
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                  <span className="text-lg">Main Sponsor</span>
                </div>
                {['Tech Giant Corp', 'InnovateX', 'Future Labs'].map((sponsor, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
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
        <div className="grid md:grid-cols-2 gap-8">
          {/* Event Cards */}
          {[
            {
              title: "High Sky",
              icon: <Rocket className="w-6 h-6" />,
              color: "from-blue-600 to-cyan-500",
              description: "Aerial robotics challenge testing autonomous flight and payload delivery systems"
            },
            {
              title: "Drone Web Fiesta",
              icon: <Zap className="w-6 h-6" />,
              color: "from-purple-600 to-pink-500",
              description: "Drone racing competition with obstacle navigation and precision landing"
            },
            {
              title: "SimSky",
              icon: <Cloud className="w-6 h-6" />,
              color: "from-emerald-600 to-cyan-400",
              description: "Flight simulation challenge with realistic aerodynamics and emergency scenarios"
            },
            {
              title: "DRL",
              icon: <Trophy className="w-6 h-6" />,
              color: "from-rose-600 to-amber-500",
              description: "Professional drone racing league with custom-built quadcopters"
            }
          ].map((event, idx) => (
            <div key={idx} className="group relative bg-gray-800 rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-br opacity-30 ${event.color} group-hover:opacity-50 transition-opacity"></div>
              
              <div className="p-8 relative">
                <div className="flex items-center justify-between mb-6">
                  <div className={`text-3xl font-bold bg-gradient-to-r ${event.color} bg-clip-text text-transparent`}>
                    {event.icon} {event.title}
                  </div>
                  <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">Team Size: 2-4</span>
                </div>

                {/* Hover Content */}
                <div className="overflow-hidden">
                  <div className="group-hover:translate-y-0 translate-y-full transition-transform duration-300">
                    <p className="text-gray-300 mb-6">{event.description}</p>
                    <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl font-semibold hover:opacity-90 transition-opacity">
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
        <div className="bg-gradient-to-br from-gray-800 to-blue-900/20 rounded-2xl p-8 relative overflow-hidden">
          <h2 className="text-4xl font-bold mb-8 flex items-center">
            <ShoppingBag className="mr-4" />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Official Merchandise
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[599, 399].map((price, idx) => (
              <div key={idx} className="bg-gray-800/50 rounded-xl p-6 hover:bg-gray-700/30 transition-colors">
                <div className="h-48 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg mb-4"></div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-2xl font-bold">₹{price}</div>
                    <div className="text-sm text-gray-400">{idx ? 'T-Shirts' : 'Premium Hoodies'}</div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors">
                    Quick View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
