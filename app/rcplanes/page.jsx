import React from "react";
import Image from "next/image";
import Accordion from "./Accordion";

const RcPage = () => {

  const rcPlaneProjects = [
    {
      id: 1,
      title: "Ornithopter",
      description: "A bio-inspired RC plane that mimics the flight of birds using flapping wings.",
      image: "/rc_project1.jpeg",
    },
    {
      id: 2,
      title: "Pixhawk-Based Automatic Plane",
      description: "An advanced RC plane equipped with a Pixhawk flight controller for autonomous flight capabilities.",
      image: "/rc_project2.jpeg",
    },
    {
      id: 3,
      title: "VTOL Aircraft",
      description: "A versatile RC plane capable of vertical take-off and landing, combining the best of both helicopters and airplanes.",
      image: "/rc_project3.jpg",
    },
  ];
  
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <header className="relative h-screen">
        <Image
          className="object-cover"
          src="/sample-rc.jpg"
          alt="RC Plane in flight"
          layout="fill"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-5xl md:text-7xl headland-one-regular font-bold text-center">
          RC Planes in Action
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <section className="mb-16">
          <div className="flex flex-col lg:flex-row justify-between gap-12">
            <div className="lg:w-2/3">
              <h2 className="text-4xl font-bold mb-6">
                Radio Controlled Aircrafts
              </h2>
              <p className="text-lg mb-6 leading-relaxed">
                RC planes are popular nowadays in the field of aviation. These model aircrafts, piloted from the ground by exceptionally trained operators, offer a fine amalgam of engineering science, aerodynamics principles, and precision controls. The Aeromodelling club at NIT Kurukshetra gives us a chance to design, construct, and fly aeromodels, discussing detailed information and methods of designing, analysis, and manufacturing of RC planes.
              </p>
            </div>
            <div className="lg:w-1/3">
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold mb-4">
                  Flyer's CheckList
                </h3>
                <ul className="space-y-2">
                  <li>✓ Double Tape, Cello Tape, Cutter</li>
                  <li>✓ ESCs, Battery</li>
                  <li>✓ Screw Driver</li>
                  <li>✓ Styrofoam, Balsa Wood</li>
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
          <h2 className="text-3xl font-bold mb-8">Latest RC Plane Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Add project cards here */}
            {rcPlaneProjects.map((item) => (
              <div key={item.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={item.image}
                  alt={`Project ${item.id}`}
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
          <h2 className="text-3xl font-bold mb-8">FAQs on Planes</h2>
          <Accordion />
        </section>
      </main>

      <footer className="bg-gray-800 text-center py-6">
        <p>&copy; 2024 Aeromodelling Club. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default RcPage;