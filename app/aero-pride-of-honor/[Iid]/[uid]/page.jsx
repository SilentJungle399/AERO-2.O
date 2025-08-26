"use client";
import React, {useEffect, useRef, useState} from "react";
import {useParams} from "next/navigation";
import {FaTrophy} from "react-icons/fa";
import html2canvas from "html2canvas";

const InstagramShareBadge = () => {
  const [badgeData, setBadgeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPreview, setIsPreview] = useState(true); // State to toggle preview mode
  const {Iid, uid} = useParams();
  const badgeRef = useRef(null);

  useEffect(() => {
    const fetchBadgeData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const baseUrl =
          process.env.NODE_ENV === "production"
            ? ""
            : "http://localhost:5000";

        const apiUrl = `${baseUrl}/api/users/induction/${Iid}/inductee/${uid}`;
        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch badge data");
        }

        const data = await response.json();
        setBadgeData(data);
        setIsLoading(false);
        setTimeout(() => setIsPreview(false), 2000); // Show preview for 2 seconds
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    if (Iid && uid) {
      fetchBadgeData();
    } else {
      setError("Missing induction or inductee ID");
    }
  }, [Iid, uid]);

  const handleShare = async () => {
    if (badgeRef.current) {
      try {
        const canvas = await html2canvas(badgeRef.current);
        canvas.toBlob(async (blob) => {
          const file = new File([blob], "badge.png", {type: "image/png"});
          await navigator.share({
            title: "Honor Badge🏅",
            text: `Congratulations ${badgeData.name} for inducting in Aeromodelling club!!`,
            files: [file],
          });
        });
      } catch (error) {
        console.error("Error sharing:", error);
        alert("Sharing failed. Please try again.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="text-center mt-24">
        <p className="text-2xl font-semibold">
          Generating your personalized badge...
        </p>
        <div className="mt-4 spinner"></div>
        {" "}
        {/* Add a spinner for loading indication */}
      </div>
    );
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {isPreview ? (
        <div className="text-center mt-24">
          <p className="text-2xl font-semibold">
            Generating your personalized badge...
          </p>
          <div className="mt-4 spinner"></div>
          {" "}
          {/* Add a spinner for loading indication */}
        </div>
      ) : (
        <div
          ref={badgeRef}
          className="bg-black relative mt-24 ml-36 w-400 h-300 max-w-[900px] h-[1020px] md:max-w-[1080px] md:h-[1300px] bg-cover bg-center rounded-lg border-8 border-yellow-400 p-8 flex flex-col items-center justify-between text-white shadow-lg"
          style={{
            backgroundImage: 'url("/badge-bg.png")',
            backgroundSize: "cover",
            backgroundPosition: "27% 0%",
            position: "relative",
          }}
        >
          {/* Badge Title */}
          <h1 className="flex text-5xl monoton text-center text--300 drop-shadow-md">
            {/* <FaTrophy className="text-green-400"/>&nbsp;&nbsp; */}
            AERO &nbsp;PRIDE &nbsp;OF&nbsp; HONOR&nbsp;&nbsp;
            {/* <FaTrophy/> */}
            <FaTrophy className="text-green-400"/>&nbsp;&nbsp;

          </h1>

          {/* Badge Text */}
          <div className="mt-96 p-4 bg-opacity-80 rounded-lg">
            {/* Greeting */}
            <p className="text-4xl font-serif font-extrabold text-green-500 italic tracking-wide mb-4 text-left">
              Congratulations {badgeData.name} 🎉
            </p>

            {/* Details Section */}
            <div className="flex flex-col md:flex-row items-left justify-left text-left md:text-left">
              <div className="">
                <p className="text-2xl font-mono text-yellow-100 mb-2">
                  Roll No:{" "}
                  <span className="font-semibold">{badgeData.roll_no}</span>
                </p>
                <p className="text-2xl font-mono text-red-400">
                  Team:{" "}
                  <span className="font-semibold">
                    {badgeData.team_preference}
                  </span>
                </p>
              </div>

              {/* Ribbon */}
              <div className="relative ">
                <img
                  src="/approved1.png"
                  alt="Approved Ribbon"
                  className="w-32 h-32 object-contain"
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="text-lg font-mono mr-80 text-yellow-100 max-w-[80%] mx-auto px-4">
              <p className="mt-4">
                Congratulations! 🎉 You have been officially selected in
                induction of the prestigious{" "}
                <strong className="text-green-400">Aero Modelling Club</strong>{" "}
                at NIT Kurukshetra.
              </p>
              <p className="mb-4">
                This is a remarkable achievement and a testament to your skills,
                dedication, and passion for aeromodelling. Your commitment has
                truly set you apart, and we are thrilled to welcome you on
                board.
              </p>
              <p className="mb-4">
                <strong>
                  A big cheer 👏 for your enthusiasm and dedication 🔥!
                </strong>{" "}
                We believe you will make significant contributions to the club
                and help us soar to new heights. Your journey with us begins
                now, and we’re excited to see all that you will accomplish.
              </p>
              <p>
                If you have any questions or need assistance, please don’t
                hesitate to reach out to us. Our team is here to support you
                every step of the way. Welcome aboard and let's make this
                journey unforgettable!
              </p>


              <div className="flex justify-between">

                <div>
                  <p className="text-xl mt-4 text-blue-500">Issued by</p>
                  <p className="text-xl mt-2 text-blue-500">Sachin Kamboj</p>
                  <p className="text-xl mt-2 text-blue-500">
                    Aeromodelling club, Nit kkr
                  </p>
                </div>

                <div>
                  <img
                    src="/aeronewlogo-removebg.png"
                    alt="Aero Club Logo"
                    className="pb-16 pr-12 relative w-60 h-60"
                  />
                </div>
              </div>


            </div>

          </div>

          {/* Footer Text */}
          <p className="text-xl mt-4 text-blue-500">
            Let't Roar into the sky!!!✈️
          </p>
        </div>
      )}

      {/* Share Button */}
      {!isPreview && (
        <button
          onClick={handleShare}
          className="ml- mt-8 w-1/2 text-center bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition transform hover:-translate-y-1 shadow-lg"
        >
          Share on Instagram
        </button>
      )}
    </>
  );
};

export default InstagramShareBadge;
