import React from "react";
import Image from "next/image";
import Accordion from "./Accordion";

const DronePage = () => {

  const droneProjects = [
    {
      id: 1,
      title: "Object Tracing Drone",
      description: "An innovative drone project focusing on object detection and tracking using AI algorithms.",
      image: "/drone_project1.webp",
    },
    {
      id: 2,
      title: "Arduino-Based Mini Drone",
      description: "A compact and efficient drone powered by Arduino, perfect for DIY enthusiasts and educational purposes.",
      image: "/drone_project2.jpg",
    },
    {
      id: 3,
      title: "FPV Racing Drone",
      description: "A fast and agile FPV racing drone designed for high-speed maneuvering and competitive racing.",
      image: "/drone_project3.jpg",
    },
  ];
  

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <header className="relative h-screen">
        <Image
          className="object-cover"
          src="/banner-drone.jpg"
          alt="Drone in flight"
          layout="fill"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-5xl md:text-7xl headland-one-regular font-bold text-center text-white shadow-lg">
            Drones: The Future of Flight
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <section className="mb-16">
          <div className="flex flex-col lg:flex-row justify-between gap-12">
            <div className="lg:w-2/3">
              <h2 className="text-4xl font-bold mb-6">
                Unmanned Aerial Vehicles
              </h2>
              <p className="text-lg mb-6 leading-relaxed">
                Aerial robots or Unmanned Aerial Vehicles (UAVs), commonly known as Drones, are aircraft that operate autonomously or by remote control, with no pilot on board. These versatile devices are rapidly becoming essential in various fields, performing a wide range of tasks from package delivery to aerial photography. Drones operate through a closed-loop system that collects sensor data, maps the scene, and navigates trajectory paths. Our Aeromodelling Club at NIT Kurukshetra provides an excellent platform for enthusiasts to explore, design, and fly drones, integrating advanced engineering principles with hands-on experience.
              </p>
            </div>
            <div className="lg:w-1/3">
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold mb-4">
                  Drone Pilot's CheckList
                </h3>
                <ul className="space-y-2">
                  <li>✓ Double Tape, Cello Tape, Cutter</li>
                  <li>✓ ESCs, Battery</li>
                  <li>✓ Screw Driver, L-keys</li>
                  <li>✓ Motor, Motor Screw Box, Motor Shat</li>
                  <li>✓ Rubber Band, Propellers</li>
                  <li>✓ Transmitter, Receiver</li>
                  <li>✓ Pliers</li>
                  <li>✓ Jumper Wires</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Latest Drone Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {droneProjects.map((item) => (
              <div key={item.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
                <Image
                  src={item.image}
                  alt={`Drone Project ${item.id}`}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-8">FAQs on Drones</h2>
          <Accordion />
        </section>
      </main>

      <footer className="bg-gray-800 text-center py-6">
        <p>&copy; 2024 Aeromodelling Club. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DronePage;