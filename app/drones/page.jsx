import React from "react";
// import Card from "./Card";

import Image from "next/image";
import Accordion from "./Accordion";

const DronePage = () => {
  // Define state to track the open section

  return (
    <div className="mb">
      <header>
        <div className="relative bg-cover bg-center h-96 shadow-lg overflow-hidden flex items-end mb-6 transform">
          <Image
            className="object-cover"
            src="/sample-drone.jpg"
            alt="image description"
            layout="fill" // This will allow the image to fill its container
          />
        </div>
      </header>

      <main>
        <section className="mb-8 mt-11 pt-11">
          <div className="article__header article__header--trimmed px-4">
            {/* <span className="text-sm font-semibold text-gray-200">
              Soaring like The King of Sky
            </span> */}
            <div className="flex flex-col lg:flex-row justify-between mt-4 mx-0 px-0 ">
              <div className="articleHeader__info w-[80%]">
                <h1 className="text-3xl font-bold">
                  Drones: Unmanned aerial vehicles
                </h1>
                <p className="text-lg mt-2 text-white">
                  Aerial robots or Unmanned aerial vehicles(UAVs), commonly
                  known as Drones, refers to an aircraft that operates
                  autonomously or by remote control, with no pilot on board.
                  These are rapidly becoming necessary in various fields,
                  performing wide range of tasks including package delivery to
                  aerial photography. These versatile devices operate through an
                  closed loop system that collects sensor data, maps the scene,
                  and navigates trajectory paths. Our Aeromodelling Club at NIT
                  Kurukshetra provides an excellent platform for enthusiasts to
                  explore, design, and fly drones, integrating advanced
                  engineering principles with hands-on experience.
                </p>
              </div>
              <div className="articleHeader__contact mt-6 lg:mt-0 w-[20%]">
                <div className="contactBox bg-gray-100 p-4 rounded-md">
                  <h3 className="text-xl font-semibold text-black">
                    Flyer&apos;s CheckList
                  </h3>
                  <ul className="text-black">
                    <li>hi</li>
                    <li>hii</li>
                    <li>hiii</li>
                    <li>hiiii</li>
                    <li>hiiiii</li>
                    <li>hiiiiii</li>
                  </ul>
                </div>
              </div>
            </div>
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

            <h2 className="text-2xl font-bold ">Latest Projects on Drones</h2>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
            {/* <div /> */}
            <h2 className="text-2xl font-bold ">FAQs on Drones</h2>

            <Accordion />
          </div>

          <div className="container mx-auto p-4"></div>

          {/* <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card />
            <Card />
            <Card />
            </div> */}
        </section>
      </main>

      <footer className="text-gray-600">
        <p>&copy; 2024 Aeromodelling Club. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DronePage;