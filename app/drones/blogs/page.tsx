"use client"
import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaQuoteLeft } from 'react-icons/fa';

const testimonials = [
  {
    name: "Anita Sharma",
    content: `This real estate agent made the home-buying process so easy for us. They understood our needs and shows us several options within our budget. We are very happy with our new home!`,
    city: "Mohali",
    image:  `https://avatar.iran.liara.run/public/girl?username=${Math.random()*9000}`
  },
  {
    name: "Vikram Patel",
    content: `Propertyease helped us buy the perfect 3BHK flat in a great neighborhood at a very reasonable price. We had spoken to many home-selling agents before, but this one stood out.`,
    city: "Mohali",
    image:  `https://avatar.iran.liara.run/public/boy?username=${Math.random()*9000}`

  },
  {
    name: "Ritesh",
    content: `I found the perfect office space for my business thanks to this real estate agent. They listened to what I needed and found several great options for me to choose from.`,
    city: "Gurugram",
    image:  `https://avatar.iran.liara.run/public/boy?username=${Math.random()*9000}`

  },
  {
    name: "Rabia Mullick",
    content: `I had been struggling to find a rental property in a good area, but propertyease came through for me.  Now i can say that they are best property dealers for rental properties.`,
    city: "Kurukshetra",
    image:  `https://avatar.iran.liara.run/public/girl?username=${Math.random()*9000}`

  },
  {
    name: "Sanjay Kumar",
    content: `Working with this real estate agent was a fantastic experience. They were always available to answer my questions and guided me through buying my first home.`,
    city: "Ambala",
    image:  `https://avatar.iran.liara.run/public/boy?username=${Math.random()*9000}`

  },
  {
    name: "Namit Garg",
    content: `I am incredibly impressed by how this real estate agent works. They helped me meet many sellers and landowners who were interested in selling.`,
    city: "Ambala",
    image:  `https://avatar.iran.liara.run/public/boy?username=${Math.random()*9000}`

  },
  {
    name: "Priya Singh",
    content: `I was looking to sell my house quickly, and the agent did it in no time. They were professional and efficient and got me a great price.
    .
          `,
          
    city: "Chandigarh",

    image:  `https://avatar.iran.liara.run/public/girl?username=${Math.random()*9000}`

  },
];

const TestimonialCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % testimonials.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prevSlide) => 
            prevSlide === 0 ? testimonials.length - 1 : prevSlide - 1
        );
    };

    useEffect(() => {
        const interval = setInterval(nextSlide, 1000); // Auto slide every 5 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="mt-24 container mx-auto py-10 px-4">
            <div className="max-w-4xl mx-auto mb-10 text-center">
                <h3 className="text-4xl font-bold mb-4">
                    What People Say about <span className="text-blue-300">Propertyease</span>
                </h3>
                <p className="text-gray-300">
                    We value strong relationships and have seen the benefits they bring to our business. 
                    Customer feedback is vital in helping us get it right.
                </p>
            </div>
            <div className="relative h-70 bg-white rounded-lg shadow-xl p-8 mb-8">
                <FaQuoteLeft className="text-5xl text-blue-200 absolute top-4 left-4 opacity-50" />
                <div className="testimonial-carousel w-full">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="md:w-1/3 mb-6 md:mb-0">
                            <img 
                                src={testimonials[currentSlide].image} 
                                alt={testimonials[currentSlide].name}
                                className="w-32 h-32 rounded-full mx-auto border-4 border-blue-200 shadow-lg"
                            />
                        </div>
                        <div className="md:w-2/3 md:pl-8">
                            <p className="text-lg text-gray-700 font-mono mb-4">{testimonials[currentSlide].content}</p>
                            <div className="text-center md:text-left">
                                <p className="font-semibold font-mono text-xl text-blue-600">{testimonials[currentSlide].name}</p>
                                <p className="text-gray-500 font-mono">{testimonials[currentSlide].city}</p>
                            </div>
                        </div>
                    </div>
                </div>
            <div className="flex mt-6 justify-center space-x-80">
                <button
                    className="bg-blue-400 text-white p-2 rounded-full shadow-md transition duration-300 ease-in-out hover:bg-blue-600 focus:outline-none"
                    onClick={prevSlide}
                >
                    <FaChevronLeft className="text-xl" />
                </button>
                <button
                    className="bg-blue-400 text-white p-2 rounded-full shadow-md transition duration-300 ease-in-out hover:bg-blue-600 focus:outline-none"
                    onClick={nextSlide}
                >
                    <FaChevronRight className="text-xl" />
                </button>
            </div>
            </div>
        </div>
    );
};

export default TestimonialCarousel;