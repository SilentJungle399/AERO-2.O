"use client";

import React, { useState } from "react";

const Accordion: React.FC = () => {
  const [openSection, setOpenSection] = useState<number | null>(null);

  const toggleSection = (section: number) => {
    setOpenSection(openSection === section ? null : section);
  };

  const sections = [
    {
      question: "What are the basic types of RC planes available?",
      answer: "RC planes come in various types, such as trainers, sport planes, warbirds, gliders, and scale models. Trainers are ideal for beginners due to their stability. Sport planes are versatile and good for aerobatics. Warbirds are replicas of military aircraft. Gliders are engineless and rely on thermal currents. Scale models are detailed replicas of full-size aircraft."
    },
    {
      question: "What are the legal requirements for flying RC planes?",
      answer: "Regulations vary by country, but generally, you may need to register your RC plane if it exceeds a certain weight (often 250g). Follow local flying rules, avoid restricted airspace, and maintain visual line of sight. Some countries require membership in a national aeromodelling organization. Always check local laws and consider getting insurance."
    },
    {
      question: "How long can an RC plane fly on a single battery charge?",
      answer: "Flight time depends on various factors including battery capacity, plane size, and flying style. Typically, electric RC planes can fly for 10-20 minutes on a single charge. Some high-efficiency gliders might stay aloft for hours if conditions are favorable. Always land before the battery is completely drained to avoid crashes."
    },
    {
      question: "What are the essential features to look for in an RC plane?",
      answer: "Key features include durability (especially for beginners), stability, ease of repair, and appropriate size for your skill level. Look for planes with good reviews, quality electronics, and available spare parts. For beginners, features like self-leveling and 'safe' modes can be helpful. More advanced flyers might prioritize aerobatic capabilities or scale details."
    },
    {
      question: "Can RC planes be flown indoors?",
      answer: "Yes, some RC planes can be flown indoors. These are typically small, lightweight models often called 'park flyers' or 'micro planes'. They're usually made of foam and have slow flying speeds. Always ensure you have enough space and be mindful of obstacles. Indoor flying is great for practicing in bad weather or during winter months."
    },
    {
      question: "How do I maintain and care for my RC plane?",
      answer: "Regular maintenance is crucial. After each flight, check for any damage, loose screws, or misalignments. Clean your plane, especially after flying in dusty conditions. Store batteries properly and check them regularly. Keep moving parts lubricated. Store your plane in a cool, dry place, preferably disassembled or in a dedicated case to prevent warping or damage."
    },
    {
      question: "What is the difference between electric and fuel-powered RC planes?",
      answer: "Electric planes are generally quieter, cleaner, and easier to maintain. They're ideal for beginners and flying in residential areas. Fuel-powered planes (using nitro fuel or gasoline) offer longer flight times and more power, but are louder and require more maintenance. They're often preferred for larger scale models and for their realistic engine sound."
    },
    {
      question: "What are some common RC plane flying techniques?",
      answer: "Basic techniques include takeoff, landing, turns, and maintaining altitude. More advanced maneuvers include loops, rolls, inverted flight, and spins. It's important to master basic flight before attempting aerobatics. Always practice new techniques at a safe altitude. Many pilots use simulators to practice techniques before trying them with a real plane."
    },
    {
      question: "How do I choose the right RC plane for my skill level?",
      answer: "Beginners should start with trainer planes, which are designed for stability and easy control. These often have high-wing designs and self-correcting tendencies. As you progress, you can move to sport planes for more maneuverability. Advanced flyers might choose aerobatic planes, warbirds, or complex scale models. Always consider your budget, available flying space, and local regulations when choosing a plane."
    },
    {
      question: "What should I do if I crash my RC plane?",
      answer: "First, ensure it's safe to retrieve your plane. Once recovered, assess the damage. Minor crashes might only require simple repairs like gluing foam parts. For more serious damage, you may need to replace parts. Always check the integrity of the battery after a crash. Use crashes as learning experiences to improve your flying skills. Consider joining a local RC club where experienced members can offer repair advice."
    },
    {
      question: "How can I improve the stability and control of my RC plane?",
      answer: "Ensure proper balance and center of gravity as per the manufacturer's instructions. Use expo settings on your transmitter to soften control responses. Practice in calm weather conditions initially. Consider adding stabilization systems or gyros for more advanced planes. Regular trimming during flight can also improve stability. Upgrading to digital servos can provide more precise control."
    },
    {
      question: "What are some advanced features in modern RC planes?",
      answer: "Modern RC planes often include features like GPS for autonomous flight modes, FPV (First Person View) capabilities for immersive flying experiences, telemetry for real-time flight data, and programmable flight controllers. Some advanced models have features like return-to-home, altitude hold, and even obstacle avoidance systems."
    }
  ];

  return (
    <div id="accordion-flush" className="w-full">
      {sections.map((section, index) => (
        <div key={index}>
          <h2 id={`accordion-flush-heading-${index + 1}`}>
            <button
              type="button"
              className="flex items-center justify-between w-full py-5 font-medium text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 gap-3"
              onClick={() => toggleSection(index + 1)}
              aria-expanded={openSection === index + 1}
              aria-controls={`accordion-flush-body-${index + 1}`}
            >
              <span>{section.question}</span>
              <svg
                data-accordion-icon
                className={`w-3 h-3 transform transition-transform duration-200 ${
                  openSection === index + 1 ? "rotate-180" : ""
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
            id={`accordion-flush-body-${index + 1}`}
            className={`${openSection === index + 1 ? "block" : "hidden"}`}
            aria-labelledby={`accordion-flush-heading-${index + 1}`}
          >
            <div className="py-5 border-b border-gray-200 dark:border-gray-700">
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                {section.answer}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;