import React from "react";
import Card from "./Card";

import Image from "next/image";
// import droneImage from '../public/drone.jpg'; // Import your drone image

const DronePage = () => {
  return (
    <div
      className="max-w-4xl mx-auto px-4 py-8 mt-10
    "
    >
      <header>
        <h1 className="text-center">Drones</h1>
        <div className="relative h-64 sm:h-80 md:h-96 lg:h-128 bg-cover bg-center flex justify-center items-center">
          <Image
            className="h-auto max-w-lg rounded-lg object-contain"
            src="/sample-drone.jpg"
            alt="image description"
            width={1000}
            height={200}
          />
        </div>
      </header>

      <main>
        <section className="mb-8">
          <div className="container mx-auto p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="left-column">
                <h1 className="text-2xl font-bold">Heading</h1>
              </div>
              <div className="right-column">
                <article className="prose">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                  <p>
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <p>
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur.
                  </p>
                </article>
              </div>
            </div>
          </div>

          <div className="container mx-auto p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="left-column">
                <h1 className="text-2xl font-bold">Heading</h1>
              </div>
              <div className="right-column">
                <article className="prose">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                  <p>
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <p>
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur.
                  </p>
                </article>
              </div>
            </div>
          </div>

          <p className="mb-3">Track work across the enterprise through an open, collaborative platform. Link issues across Jira and ingest data from other software development tools, so your IT support and operations teams have richer contextual information to rapidly respond to requests, incidents, and changes.</p>

          <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card />
            <Card />
            <Card />
          </div>

          <h2 className="text-2xl font-semibold mb-2">What are Drones?</h2>
          <p className="text-gray-700">
            Drones, also known as unmanned aerial vehicles (UAVs), are aircraft
            without a human pilot on board. They are controlled remotely or can
            fly autonomously using pre-programmed flight plans or on-board
            computers.
          </p>
        </section>
      </main>

      <footer className="text-gray-600">
        <p>&copy; 2024 Aeromodelling Club. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DronePage;
