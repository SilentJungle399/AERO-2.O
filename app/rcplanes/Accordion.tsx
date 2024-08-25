"use client";

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
          className="flex items-center justify-between w-full py-5 font-medium text-gray-200 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 gap-3"
          onClick={() => toggleSection(1)}
          aria-expanded={openSection === 1}
          aria-controls="accordion-flush-body-1"
        >
          <span>What are the basic types of drones available?</span>
          <svg
            data-accordion-icon
            className={`w-3 h-3 transform transition-transform duration-200 ${openSection === 1 ? "rotate-180" : ""
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
          <p className="mb-2 text-white dark:text-gray-400">
            Drones come in various types, such as quadcopters, hexacopters,
            fixed-wing drones, and hybrid drones, each suited for different
            applications like aerial photography, racing, or mapping.
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
          <span>What are the legal requirements for flying a drone?</span>
          <svg
            data-accordion-icon
            className={`w-3 h-3 transform transition-transform duration-200 ${openSection === 2 ? "rotate-180" : ""
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
            Regulations vary by country, but generally, you may need to register
            your drone, follow no-fly zones, and maintain a line of sight. In
            many cases, you also need to obtain a drone pilot license for
            commercial use.
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
          <span>How far can a drone fly on a single charge?</span>
          <svg
            data-accordion-icon
            className={`w-3 h-3 transform transition-transform duration-200 ${openSection === 3 ? "rotate-180" : ""
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
            The flight range depends on the drone&apos;s battery capacity and
            model. Consumer drones typically range between 20-30 minutes, with
            some high-end models lasting up to an hour.
          </p>
        </div>
      </div>
      {/* Section 4 */}
      <h2 id="accordion-flush-heading-3">
        <button
          type="button"
          className="flex items-center justify-between w-full py-5 font-medium text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 gap-3"
          onClick={() => toggleSection(3)}
          aria-expanded={openSection === 3}
          aria-controls="accordion-flush-body-3"
        >
          <span>What are the essential features to look for in a drone?</span>
          <svg
            data-accordion-icon
            className={`w-3 h-3 transform transition-transform duration-200 ${openSection === 3 ? "rotate-180" : ""
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
            Key features include flight time, camera quality, GPS, obstacle
            avoidance, flight modes, and ease of use, depending on your needs,
            whether for photography, racing, or surveying.
          </p>
        </div>
      </div>
      {/* Section 5 */}
      <h2 id="accordion-flush-heading-3">
        <button
          type="button"
          className="flex items-center justify-between w-full py-5 font-medium text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 gap-3"
          onClick={() => toggleSection(3)}
          aria-expanded={openSection === 3}
          aria-controls="accordion-flush-body-3"
        >
          <span>Can drones be flown indoors?</span>
          <svg
            data-accordion-icon
            className={`w-3 h-3 transform transition-transform duration-200 ${openSection === 3 ? "rotate-180" : ""
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
            Yes, many drones can be flown indoors, but its&apos; recommended to
            use smaller, more agile models with propeller guards to prevent
            damage or accidents.
          </p>
        </div>
      </div>
      {/* Section 6 */}
      <h2 id="accordion-flush-heading-3">
        <button
          type="button"
          className="flex items-center justify-between w-full py-5 font-medium text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 gap-3"
          onClick={() => toggleSection(3)}
          aria-expanded={openSection === 3}
          aria-controls="accordion-flush-body-3"
        >
          <span>How do I maintain and care for my drone?</span>
          <svg
            data-accordion-icon
            className={`w-3 h-3 transform transition-transform duration-200 ${openSection === 3 ? "rotate-180" : ""
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
            Regularly check the propellers, battery, motors, and camera for wear
            and tear. Keep the firmware updated and store the drone in a dry,
            cool place when not in use.
          </p>
        </div>
      </div>
      {/* Section 7 */}
      <h2 id="accordion-flush-heading-3">
        <button
          type="button"
          className="flex items-center justify-between w-full py-5 font-medium text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 gap-3"
          onClick={() => toggleSection(3)}
          aria-expanded={openSection === 3}
          aria-controls="accordion-flush-body-3"
        >
          <span>What is the difference between FPV and non-FPV drones?</span>
          <svg
            data-accordion-icon
            className={`w-3 h-3 transform transition-transform duration-200 ${openSection === 3 ? "rotate-180" : ""
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
            FPV (First Person View) drones provide a real-time video feed from
            the drone&apos;s camera to a screen or goggles, offering an
            immersive flying experience. Non-FPV drones typically rely on
            line-of-sight control without live video feedback.
          </p>
        </div>
      </div>
      {/* Section  8 */}
      <h2 id="accordion-flush-heading-3">
        <button
          type="button"
          className="flex items-center justify-between w-full py-5 font-medium text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 gap-3"
          onClick={() => toggleSection(3)}
          aria-expanded={openSection === 3}
          aria-controls="accordion-flush-body-3"
        >
          <span>What are the common uses of drones?</span>
          <svg
            data-accordion-icon
            className={`w-3 h-3 transform transition-transform duration-200 ${openSection === 3 ? "rotate-180" : ""
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
            Drones are used for various purposes including aerial photography
            and videography, agriculture (crop monitoring), surveying and
            mapping, delivery services, inspection of infrastructure, and
            recreational flying.
          </p>
        </div>
      </div>
      {/* Section 9 */}
      <h2 id="accordion-flush-heading-3">
        <button
          type="button"
          className="flex items-center justify-between w-full py-5 font-medium text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 gap-3"
          onClick={() => toggleSection(3)}
          aria-expanded={openSection === 3}
          aria-controls="accordion-flush-body-3"
        >
          <span>What should I do if I lose connection with my drone?</span>
          <svg
            data-accordion-icon
            className={`w-3 h-3 transform transition-transform duration-200 ${openSection === 3 ? "rotate-180" : ""
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
            Most drones are equipped with a &quot;Return to Home&quot; feature,
            which brings the drone back to its takeoff point if it loses
            connection. Ensure this feature is enabled before flight.
          </p>
        </div>
      </div>
      {/* Section 10 */}
      <h2 id="accordion-flush-heading-3">
        <button
          type="button"
          className="flex items-center justify-between w-full py-5 font-medium text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 gap-3"
          onClick={() => toggleSection(3)}
          aria-expanded={openSection === 3}
          aria-controls="accordion-flush-body-3"
        >
          <span>How can I improve the stability and control of my drone?</span>
          <svg
            data-accordion-icon
            className={`w-3 h-3 transform transition-transform duration-200 ${openSection === 3 ? "rotate-180" : ""
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
            Fly in calm weather, ensure the drone&apos;s software is up to date,
            calibrate the drone before each flight, and use GPS mode if
            available for more stable flight.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Accordion;