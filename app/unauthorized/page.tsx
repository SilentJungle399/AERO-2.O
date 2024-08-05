import React from 'react';
import Link from 'next/link';

const Unauthorized = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('./unauth.png')" }}>
      <div className="bg-black bg-opacity-80 p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-700">Access Denied</h1>
        <p className="mb-4">You are Caught , you  do not have the necessary permissions to view this page.</p>
        <Link className="text-blue-500 hover:underline" href="/login">
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
