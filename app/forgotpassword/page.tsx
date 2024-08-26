"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const baseUrl = process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_BACKEND_URL
        : 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/auth/sendresetemail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log(data)

      if (response.ok) {
        setMessage(data.message);
        setIsButtonDisabled(true);

        // Disable the button for 25 seconds
        setTimeout(() => {
          setIsButtonDisabled(false);
        }, 25000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Error sending password reset email. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-2">
        <div>
          <h2 className="font-mono text-green-700 mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-00">
            Reset Your Password
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only font-mono">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="font-mono appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          {message && <div className="text-green-500 text-sm mt-2">{message}</div>}
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          <div>
            <button
              type="submit"
              className="font-mono group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isButtonDisabled}
            >
              {isButtonDisabled ? "Check your mail..." : "Send Password Reset Email"}
            </button>
          </div>
        </form>
        <div className="mt-6 text-center space-y-2 sm:space-y-0 sm:flex sm:justify-between">
          <Link href="/login" className="font-mono text-sm text-gray-300 block sm:inline">
            Back to <span className="text-blue-400">Login</span>
          </Link>

          <Link href="/signup" className="font-mono text-sm text-gray-300 block sm:inline">
            Don&apos;t have an account?{" "}
            <span className="text-blue-400">Signup</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
