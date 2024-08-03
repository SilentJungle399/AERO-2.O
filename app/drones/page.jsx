import React from 'react';
// import droneImage from '../public/drone.jpg'; // Import your drone image

const DronePage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <header>
        <h1 className="text-4xl font-bold mb-4">Drones</h1>
      </header>

      <main>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">What are Drones?</h2>
          <p className="text-gray-700">
            Drones, also known as unmanned aerial vehicles (UAVs), are aircraft without a human pilot on board. They are controlled remotely or can fly autonomously using pre-programmed flight plans or on-board computers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Types of Drones</h2>
          <ul className="list-disc pl-4">
            <li>
              <h3 className="text-xl font-semibold mb-1">Fixed-wing Drones</h3>
              <p className="text-gray-700">
                Fixed-wing drones are designed for longer-range missions and are suitable for tasks such as aerial mapping, surveillance, and cargo delivery.
              </p>
            </li>
            <li>
              <h3 className="text-xl font-semibold mb-1">Rotary-wing Drones</h3>
              <p className="text-gray-700">
                Rotary-wing drones, also known as multirotor drones, are suitable for tasks that require hovering and precise maneuverability, such as aerial photography and inspection.
              </p>
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Applications of Drones</h2>
          <ul className="list-disc pl-4 text-gray-700">
            <li>Aerial photography and videography</li>
            <li>Agricultural monitoring and precision farming</li>
            <li>Search and rescue operations</li>
            <li>Disaster management and emergency response</li>
            <li>Delivery of goods and medical supplies</li>
          </ul>
        </section>

        <section className="mb-8">
          <img src={"e"} alt="Drone" className="w-full h-auto" />
          <p className="text-gray-700 mt-2">This is an example image of a drone.</p>
        </section>
      </main>

      <footer className="text-gray-600">
        <p>&copy; 2023 Drone Company. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DronePage;