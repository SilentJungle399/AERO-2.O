import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const AlumniCarousel = ({ alumni }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="mt-24 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-10 shadow-2xl">
      <h2 className="text-4xl font-bold mb-10 text-white text-center">Our Distinguished Alumni</h2>
      <Slider {...settings}>
        {alumni.map(alumnus => (
          <div key={alumnus._id} className="px-2">
            <AlumniCard user={alumnus} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

const AlumniCard = ({ user }) => (
  <div className="bg-gray-900 text-white shadow-xl rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 h-[400px] flex flex-col">
    <div className="px-6 py-8 flex-grow">
      <div className="flex flex-col items-center mb-4">
        <img
          className="h-24 w-24 rounded-full object-cover border-4 border-indigo-700 mb-4"
          src={user.profile_pic || 'https://via.placeholder.com/150'}
          alt={user.full_name}
        />
        <h3 className="text-xl font-bold text-center">{user.full_name}</h3>
        <p className="text-sm text-indigo-400 text-center">{user.email}</p>
      </div>
      <div className="text-sm">
        <InfoItem label="Session" value={user.session} />
        <InfoItem label="Branch" value={user.branch} />
        {user.company_name && (
          <>
            <InfoItem label="Company" value={user.company_name} />
            <InfoItem label="Current Post" value={user.current_post} />
          </>
        )}
      </div>
    </div>
  </div>
);

const InfoItem = ({ label, value }) => (
  <div>
    <p className="font-medium text-gray-500">{label}</p>
    <p className="text-gray-900">{value || 'N/A'}</p>
  </div>
);

export default AlumniCarousel;
