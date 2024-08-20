"use client"; // Add this directive to mark the component as a Client Component

import React, { useState } from "react";

const Accordion: React.FC = () => {
  const [openSection, setOpenSection] = useState<number | null>(null);

  const toggleSection = (section: number) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div id="accordion-flush" className="w-full">
      {/* Section 1 */}
      <h2 id="accordion-flush-heading-1">
        <button
          type="button"
          className="flex items-center justify-between w-full py-5 font-medium text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 gap-3"
          onClick={() => toggleSection(1)}
          aria-expanded={openSection === 1}
          aria-controls="accordion-flush-body-1"
        >
          <span>Current Projects</span>
          <svg
            data-accordion-icon
            className={`w-3 h-3 transform transition-transform duration-200 ${
              openSection === 1 ? "rotate-180" : ""
            }`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5 5 1 1 5"
            />
          </svg>
        </button>
      </h2>
      <div
        id="accordion-flush-body-1"
        className={`${openSection === 1 ? "block" : "hidden"}`}
        aria-labelledby="accordion-flush-heading-1"
      >
        <div className="py-5 border-b border-gray-200 dark:border-gray-700">
          <p className="mb-2 text-gray-500 dark:text-gray-400">
            Our Aero Club is currently engaged in several innovative drone
            projects, focusing on environmental monitoring, search and rescue
            operations, and aerial photography. These projects aim to enhance
            drone technology for practical applications, offering hands-on
            experience in design, programming, and piloting. We&apos;re
            exploring cutting-edge advancements to push the boundaries of drone
            capabilities.{" "}
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Check out this guide to learn how to{" "}
            <a
              href="#"
              className="text-blue-600 dark:text-blue-500 hover:underline"
            >
              get started
            </a>{" "}
            and start developing websites even faster with components on top of
            Tailwind CSS.
          </p>
        </div>
      </div>

      {/* Section 2 */}
      <h2 id="accordion-flush-heading-2">
        <button
          type="button"
          className="flex items-center justify-between w-full py-5 font-medium text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 gap-3"
          onClick={() => toggleSection(2)}
          aria-expanded={openSection === 2}
          aria-controls="accordion-flush-body-2"
        >
          <span>Is experienced flyers available?</span>
          <svg
            data-accordion-icon
            className={`w-3 h-3 transform transition-transform duration-200 ${
              openSection === 2 ? "rotate-180" : ""
            }`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5 5 1 1 5"
            />
          </svg>
        </button>
      </h2>
      <div
        id="accordion-flush-body-2"
        className={`${openSection === 2 ? "block" : "hidden"}`}
        aria-labelledby="accordion-flush-heading-2"
      >
        <div className="py-5 border-b border-gray-200 dark:border-gray-700">
          <p className="mb-2 text-gray-500 dark:text-gray-400">
            Yes, our Aero Club has a team of experienced flyers available. They
            are skilled in piloting various types of drones, ensuring safe and
            effective operation during projects and events. These experts
            provide valuable guidance and training to new members, fostering a
            supportive environment for learning and development in drone
            technology.
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Check out the{" "}
            <a
              href="#"
              className="text-blue-600 dark:text-blue-500 hover:underline"
            >
              Figma design system
            </a>{" "}
            based on the utility classes from Tailwind CSS and components from
            Flowbite.
          </p>
        </div>
      </div>

      {/* Section 3 */}
      <h2 id="accordion-flush-heading-3">
        <button
          type="button"
          className="flex items-center justify-between w-full py-5 font-medium text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 gap-3"
          onClick={() => toggleSection(3)}
          aria-expanded={openSection === 3}
          aria-controls="accordion-flush-body-3"
        >
          <span>
            What are the differences between a drone and an RC Plane flyers?
          </span>
          <svg
            data-accordion-icon
            className={`w-3 h-3 transform transition-transform duration-200 ${
              openSection === 3 ? "rotate-180" : ""
            }`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5 5 1 1 5"
            />
          </svg>
        </button>
      </h2>
      <div
        id="accordion-flush-body-3"
        className={`${openSection === 3 ? "block" : "hidden"}`}
        aria-labelledby="accordion-flush-heading-3"
      >
        <div className="py-5 border-b border-gray-200 dark:border-gray-700">
          <p className="mb-2 text-gray-500 dark:text-gray-400">
            Drones and RC (Radio-Controlled) flyers differ mainly in autonomy
            and purpose. Drones are typically autonomous or semi-autonomous
            aircraft equipped with GPS, sensors, and cameras, used for tasks
            like surveillance, photography, and mapping. RC flyers are manually
            operated, hobbyist aircraft, requiring constant human control, and
            are primarily used for recreational flying.
          </p>
          <p className="mb-2 text-gray-500 dark:text-gray-400">
            However, we actually recommend using both Flowbite, Flowbite Pro,
            and even Tailwind UI as there is no technical reason stopping you
            from using the best of two worlds.
          </p>
          <p className="mb-2 text-gray-500 dark:text-gray-400">
            Learn more about these technologies:
          </p>
          <ul className="ps-5 text-gray-500 list-disc dark:text-gray-400">
            <li>
              <a
                href="#"
                className="text-blue-600 dark:text-blue-500 hover:underline"
              >
                Flowbite Pro
              </a>
            </li>
            <li>
              <a
                href="#"
                rel="nofollow"
                className="text-blue-600 dark:text-blue-500 hover:underline"
              >
                Tailwind UI
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Accordion;
