import React from 'react';

const sponsors = [
  { name: 'Sponsor A', logo: '/path-to-logo-a.png' },
  { name: 'Sponsor B', logo: '/path-to-logo-b.png' },
  { name: 'Sponsor C', logo: '/path-to-logo-c.png' },
  // Add more sponsors as needed
];

const SponsorsPage = () => {
  return (
    <div className="bg-black text-white min-h-screen py-10 px-5">
      <h1 className="text-4xl font-bold text-center mb-10 text-blue-500">Our Past Sponsors</h1>
      <div className="flex flex-wrap justify-center">
        {sponsors.map((sponsor, index) => (
          <div key={index} className="flex items-center justify-center m-4 p-4 bg-blue-800 rounded-lg shadow-lg">
            <img src={sponsor.logo} alt={sponsor.name} className="h-16 w-16 object-contain" />
            <p className="text-lg ml-4">{sponsor.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SponsorsPage;
