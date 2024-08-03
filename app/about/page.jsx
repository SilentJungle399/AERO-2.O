'use client'

import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
            Welcome to our website! We are a team of dedicated professionals committed to delivering top-quality services to our clients. Our team has a diverse set of skills and experience, allowing us to tackle various challenges and provide innovative solutions.
          </p>
          <p className="mb-4">
            Our mission is to offer exceptional service and value to our clients while maintaining a commitment to integrity and excellence. We believe in the power of collaboration and innovation to achieve our goals and exceed expectations.
          </p>
          <p>
            Thank you for visiting our site. If you have any questions or would like to get in touch with us, please <Link href="/contact" className="text-indigo-600 hover:text-indigo-700">contact us</Link>.
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
