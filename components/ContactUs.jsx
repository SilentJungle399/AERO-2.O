"use client"; // Ensure it's treated as a client-side component

import React, {useState} from "react";

const ContactUsPage = () => {
  const sponsors = [
    {name: "Unstop", logo: "/unstop.png"},
    {name: "Polygon", logo: "/polygon.png"},
    {name: "Dassault Systems", logo: "/dass.png"},
    {name: "EM Works", logo: "/emworks.png"},
    // Add more sponsors as needed
  ];

  const events = [
    {name: "High-Sky", logo: "/high.png"},
    {name: "Webfiesta", logo: "/web.png"},
    {name: "DroneScape", logo: "/droneS.png"},
    {name: "Theme Launch", logo: "/tech.png"},
  ];

  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const submitContactUs = (event) => {
    event.preventDefault();
    setMessage("Message sending...")
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? ""
        : "http://localhost:5000";
    console.log(formData)
    fetch(`${baseUrl}/api/users/contactus`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

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
        <h2 className="text-3xl font-bold text-blue-500 text-center mb-6">
          Connect With Us
        </h2>
        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex-1">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2713.621113508049!2d76.81762199640569!3d29.946413601785384!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390e3f422f5244e7%3A0x9c630c311d6349b8!2sNIT%20KURUKSHETRA!5e0!3m2!1sen!2sin!4v1724629070863!5m2!1sen!2sin"
              allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full justify-center"></iframe>
          </div>

          {/* Get in Touch Form */}
          <div className="flex-1 border-red-500">
            <h1 className="text-3xl font-bold text-blue-500 text-center mt-6 mb-8">Message Us</h1>
            <form
              className="space-y-4 max-w-2xl mx-auto"
              onInput={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
              onSubmit={submitContactUs}
            >
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
                  className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black p-2"
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
                  className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black p-2"
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black p-2"
                  required

                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={message.length > 0}
              >
                {message.length > 0 ? message : "Send"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;