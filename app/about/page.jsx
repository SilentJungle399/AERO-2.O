"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AboutUs() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8">
        <div>
          <h2 className="text-center text-4xl font-extrabold text-gray-100">
            About Us
          </h2>
        </div>
        <div className="text-lg text-gray-700">
          <p className="mb-4">
            Welcome to the Aeromodelling Club! At the Aeromodelling Club, we
            bring together college students inquisitive about the artwork and
            science of designing, constructing and flying model aircraft.
            Established in 2007, our group has grown from a small organization
            of enthusiasts to a thriving community, regarded for innovation,
            determination and excellence in aviation. Our founders and leaders
            Our journey commenced with Kamal kant Gaur and a dedicated
            institution of aviation enthusiasts—Deepesh, Rupesh and Suman. Dr.
            A.S. Under the expert guidance of Dr. GL Pahuja, their imaginative
            and vision and leadership have contributed immensely in shaping the
            club what it is today.{" "}
          </p>
          <p className="mb-4">
            What are we doing with it? We have been involved in quite a few
            aircraft prototyping sports starting from developing complex plane
            prototypes to exploring flight dynamics and advanced flight ideas.
            Our membership allows members to collaborate on projects, proportion
            expertise and push the boundaries of their creativity and technical
            talents.
          </p>
          <p>
            Whether you&apos;re an skilled pilot or simply beginning your adventure
            in aviation modeling, our team welcomes you. We provide a supportive
            environment wherein you can analyze, innovate and jump to new
            heights. Join us to be a part of the ardour for exceptional
            aviation.
          </p>
        </div>
        <div className="text-center">
          <Link
            href={"/"}
            className="inline-block text-indigo-600 hover:text-indigo-700 text-sm"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}