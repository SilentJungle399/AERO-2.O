import React from "react";
import Card from "./Card";

import Image from "next/image";
import Accordion from "./Accordion";

// import droneImage from '../public/drone.jpg'; // Import your drone image

const DronePage = () => {
  // Define state to track the open section

  return (
    <div
      className="max-w-4xl mx-auto px-0 py-8 mt-10
    "
    >
      <header className="w-full h-[80vh] overflow-hidden">
        <div className="w-[100vw] h-full">
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
          <div className="article__header article__header--trimmed">
            <span className="text-sm font-semibold text-gray-600">
              Soaring like The King of Sky
            </span>
            <div className="flex flex-col lg:flex-row justify-between mt-4 mx-0 px-0 ">
              <div className="articleHeader__info w-[60%]">
                <h1 className="text-3xl font-bold">
                  RoboBees: Autonomous Flying Microrobots
                </h1>
                <p className="text-lg mt-2 text-gray-700">
                  Insect-inspired robots with potential uses in crop
                  pollination, search and rescue missions, surveillance, as well
                  as high-resolution weather, climate, and environmental
                  monitoring
                </p>
              </div>
              <div className="articleHeader__contact mt-6 lg:mt-0 w-[40%]">
                <div className="contactBox bg-gray-100 p-4 rounded-md">
                  <h3 className="text-xl font-semibold text-black">
                    Flyer&apos;s CheckList
                  </h3>
                  <p className="text-gray-600 mt-2">
                    We seek to create unique collaborations with academic
                    institutions, industry, investors, foundations, and
                    philanthropists who share our vision of bridging the divide
                    between breakthrough scientific discovery and commercial
                    impact.
                  </p>
                </div>
              </div>
            </div>
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

           <Accordion/>

            <div className="technologyStats mt-6">
              <div className="technologyStats__item">
                <div className="text-lg font-semibold">Secretary</div>
                <div className="technologyStats__info mt-1">
                  <a
                    className="text-blue-600 hover:text-blue-800 underline"
                    href="#"
                    target="_self"
                  >
                    Sachin Kamboj
                  </a>
                </div>
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

          <p className="mb-3">
            Track work across the enterprise through an open, collaborative
            platform. Link issues across Jira and ingest data from other
            software development tools, so your IT support and operations teams
            have richer contextual information to rapidly respond to requests,
            incidents, and changes.
          </p>

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
