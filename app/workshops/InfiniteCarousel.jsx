import React from 'react';
import Link from 'next/link';

const gradients = [
  "from-red-300 to-blue-300",
  "from-blue-300 to-violet-300",
  "from-violet-300 to-purple-300",
  "from-purple-300 to-red-300",
  "from-red-300 to-blue-300",
];

const EventsList = ({ events }) => {
  return (
    <div className="relative overflow-y-auto h-screen ">
      {events.map((event, index) => (
        <div
          key={event._id}
          className={`flex flex-col lg:flex-row gap-8 text-white p-6 md:p-10 lg:p-16 max-w-6xl mb-10 bg-gradient-to-b ${gradients[index % gradients.length]}`}
        >
          <div className="lg:w-1/2 space-y-6">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold">{event.E_name}</h1>
            <div className="space-y-4 text-lg md:text-xl">
              <p><span className="font-bold">Date:</span> {new Date(event.E_date).toLocaleDateString()}</p>
              <p><span className="font-bold">Time:</span> {event.E_timings}</p>
              <p><span className="font-bold">Location:</span> {event.E_location}</p>
              <p><span className="font-bold">Domain:</span> {event.E_domain}</p>
              <p><span className="font-bold">Team Size:</span> {event.E_team_size}</p>
            </div>
            <p className="text-lg md:text-xl">{event.E_mini_description}</p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Link className="flex-1 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-500 transition-colors text-center text-lg"  href={`/events/create-team/${event._id}`} passHref>
                
                  Create Team
               
              </Link>
                 
              <Link className="flex-1 bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-500 transition-colors text-center text-lg" href={`/events/join-team/${event._id}`} passHref>
                  Join Team
               
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="relative w-full h-64 md:h-96 lg:h-[500px]">
              <img
                src={event.E_main_img || "/default-event-image.jpg"}
                alt={event.E_name}
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventsList;
