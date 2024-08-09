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
        <div className="relative h-64 sm:h-80 md:h-96 lg:h-128 bg-cover bg-center flex justify-center items-center bg-gray-50">
          <Image
            className="h-auto bg-cover max-w-lg rounded-lg object-contain"
            src="/sample-rc.jpg"
            alt="image description"
            width={1000}
            height={200}
          />
        </div>
      </header>

      <main className="font-serif text-lg">
        <p className="mt-5 font-serif text-lg mb-3	">
          RC planes are popular nowadays in the field of aviation different
          types of planes. These are actual model aircrafts, which are being
          piloted from the ground by exceptionally trained operators, and offer
          a fine amalgam of science of the engineering, principles of
          aerodynamics and principle of precision controls.
        </p>
        <p className="mt-5 font-serif text-lg mb-3	">
          The Aeromodelling club at the NIT Kurukshetra gives us a chance to
          design, construct as well as fly aeromodels. Not only detailed
          information but also the methods of designing, analysis and
          manufacturing of an RC plane are discussed here.{" "}
        </p>
        <p className="mt-3 font-serif  mb-5	">
          Our aim is to build a specific atext-lgnd effective structure of an
          aircraft that will be triumphant in several tasks.
        </p>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="bg-gray-600 p-4 rounded-md bg-center flex justify-center items-center text-lg font-serif">
              Aerofoil
            </div>
            <div className="bg-gray-600 p-4 rounded-md bg-center flex justify-center items-center text-lg font-serif">
              Propeller
            </div>
            <div className="bg-gray-600 p-4 rounded-md bg-center flex justify-center items-center text-lg font-serif">
              ESCs
            </div>
            <div className="bg-gray-600 p-4 rounded-md bg-center flex justify-center items-center text-lg font-serif">
              Battery
            </div>
          </div>
        </div>

        <h2 className="mb-2 mt-3 text-lg font-semibold text-gray-900 dark:text-white">
          How things work?
        </h2>
        <ol className=" list-decimal list-inside">
          <li className="mt-1 mb-1">
            Choose Your Plane: Our first idea can therefore be categorized as a
            model for a beginner level.
          </li>
          <li className="mt-1 mb-1">
            Teaching the Basics: This is the simplest categories of controls and
            their influence regarding the plane’s motions.
          </li>
          <li className="mt-1 mb-1">
            Join our Club: Membership in a club includes contact with other
            pilots, knowledgeable in flying fields and other enthusiasts of
            flying.
          </li>
          <li className="mt-1 mb-1">
            Safety First: To reduce the chances of an accident during the flight
            we always adhere to the safety rules in order to have a good flying
            experience.
          </li>
        </ol>

        <section className="mb-8">
          <h2 className="mb-2 text-lg font-semibold">Our club offers:</h2>
          <ul className=" space-y-1 list-disc list-inside mb-5">
            <li>Workshops and Training</li>
            <li>
              Flying Sessions: Once a week or every other week, when you have to
              fly your planes and test them.
            </li>
            <li>
              Competitions: our group are involved in local and national
              competitions.
            </li>
            <li>
              Resources: Opportunity to use certain equipments and
              information, as well as different types of materials.
            </li>
          </ul>

          <p className="mb-3 text-lg">
            Come visit us at SAC Aeromodelling Room in NIT Kurukshetra.
          </p>

          <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card />
            <Card />
            <Card />
          </div>
        </section>
      </main>

      
    </div>
  );
};

export default DronePage;
