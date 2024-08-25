"use client"; // Ensure it's treated as a client-side component

import React, { Component } from "react";

class ContactUsPage extends Component {
  componentDidMount() {
    // Load Google Maps script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&callback=initMap`;
    script.async = true;
    document.body.appendChild(script);

    // Initialize the map
    window.initMap = () => {
      const location = { lat: 29.9667, lng: 76.8333 }; // Coordinates for NIT Kurukshetra
      const map = new window.google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: location,
      });
      new window.google.maps.Marker({
        position: location,
        map: map,
        title: "NIT Kurukshetra",
      });
    };
  }

  render() {
    const sponsors = [
      { name: "Unstop", logo: "/unstop.png" },
      { name: "Polygon", logo: "/polygon.png" },
      { name: "Dassault Systems", logo: "/dass.png" },
      { name: "EM Works", logo: "/emworks.png" },
      // Add more sponsors as needed
    ];

    const events = [
      { name: "High-Sky", logo: "/high.png" },
      { name: "Webfiesta", logo: "/web.png" },
      { name: "DroneScape", logo: "/droneS.png" },
      { name: "Theme Launch", logo: "/tech.png" },
    ];
    return (
      <div className="contact-us">
        <div className="p-4 md:p-8 bg-black text-white">
          {/* Sponsors List */}
          <h2 className="text-3xl font-bold text-blue-500 text-center mb-6">
            Our Past Sponsors
          </h2>
          <div className="flex flex-wrap justify-center mb-8">
            {sponsors.map((sponsor, index) => (
              <div
                key={index}
                className="flex items-center justify-center m-4 p-4"
              >
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="h-16 w-16 object-contain rounded-full"
                />
                <p className="text-lg ml-4">{sponsor.name}</p>
              </div>
            ))}
          </div>

          <h2 className="text-3xl font-bold text-blue-500 text-center mb-6">
            Our Past Events
          </h2>
          <div className="flex flex-wrap justify-center mb-8">
            {events.map((event, index) => (
              <div
                key={index}
                className="flex items-center justify-center m-4 p-4"
              >
                <img
                  src={event.logo}
                  alt={event.name}
                  className="h-16 w-16 object-contain rounded-full"
                />
                <p className="text-lg ml-4">{event.name}</p>
              </div>
            ))}
          </div>

          <h1 className="text-2xl md:text-3xl text-center mb-4">Contact Us</h1>

          {/* Get in Touch Form */}
          <div className="mb-6">
            <form className="space-y-4 max-w-2xl mx-auto">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300"
                >
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300"
                >
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-300"
                >
                  Message:
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit
              </button>
            </form>
          </div>

          {/* Google Map */}
          <div
            id="map"
            className="c-map h-96 w-full rounded-lg shadow-lg"
          ></div>
        </div>
      </div>
    );
  }
}

export default ContactUsPage;
