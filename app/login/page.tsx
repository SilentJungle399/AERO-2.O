"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebaseConfig from "@/Backend/Firebseconfig/FirebaseConfig";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_BACKEND_URL
          : "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/auth/google-signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ user }),
      });
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("_id", data._id);
        localStorage.setItem("name", data.full_name);
        localStorage.setItem("profile_pic", data.profile_pic);
        localStorage.setItem("role", data.role); // Save user role
        // router.push(data.role === "admin" ? "/" : "/"); // Redirect based on role
        // window.location.reload();
        setTimeout(function () {
          window.location.href = "/";
        }, 100); // Delay the redirect by 100 milliseconds
      } else {
        setError("Failed to sign in with Google");
      }
    } catch (error) {
      setError("Error signing in with Google");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_BACKEND_URL
          : "http://localhost:5000";
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("_id", data._id);
        localStorage.setItem("name", data.full_name);
        localStorage.setItem("profile_pic", data.profile_pic);
        localStorage.setItem("role", data.role);
        console.log(data);
        setTimeout(() => {
          window.location.href = "/";
        }, 100);
      } else {
        const data = await response.json();
        alert(data.message);
        setError(data.message || "Login failed");
      }
    } catch (err) {
      alert(err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-2">
        <p className="flex text-3xl text-mono monoton text-blue-300 typing-effect">
          Welcome&nbsp;to&nbsp;Aero&nbsp;Club...
        </p>

        <style jsx>{`
          .typing-effect {
            overflow: hidden;
            border-right: 0.15em solid #1e40af;
            white-space: nowrap;
            letter-spacing: 0.20em;
            animation: typing 3.5s steps(40, end),
              blink-caret 0.75s step-end infinite;
          }

          @keyframes typing {
            from {
              width: 0;
            }
            to {
              width: 100%;
            }
          }

          @keyframes blink-caret {
            from,
            to {
              border-color: transparent;
            }
            50% {
              border-color: #1e40af;
            }
          }
        `}</style>

        <div>
        <h2 className="font-mono text-green-700 mt-6 text-center text-3xl font-extrabold text-gray-00">
        Login in to your account
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
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="font-mono appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          <div>
            <button
              type="submit"
              className="font-mono group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </div>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="font-mono px-2 bg-black text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={signInWithGoogle}
              className="font-mono w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg
                className="w-5 h-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 48 48"
              >
                <defs>
                  <path
                    id="a"
                    d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
                  ></path>
                </defs>
                <clipPath id="b">
                  <use xlinkHref="#a" overflow="visible"></use>
                </clipPath>
                <path
                  clipPath="url(#b)"
                  fill="#FBBC05"
                  d="M0 37V11l17 13z"
                ></path>
                <path
                  clipPath="url(#b)"
                  fill="#EA4335"
                  d="M0 11l17 13 7-6.1L48 14V0H0z"
                ></path>
                <path
                  clipPath="url(#b)"
                  fill="#34A853"
                  d="M0 37l30-23 7.9 1L48 0v48H0z"
                ></path>
                <path
                  clipPath="url(#b)"
                  fill="#4285F4"
                  d="M48 48L17 24l-4-3 35-10z"
                ></path>
              </svg>
              Login in with Google
            </button>
          </div>
        </div>

        <div className="space-x-56 mt-4 text-center  ">
        <Link href={"/signup"} className="font-mono text-sm text-gray-300">
          Don&apos;t have an account?{" "}
          <span className="text-blue-400 ">Signup</span>
        </Link>

        <Link href={"/forgotpassword"} className="font-mono text-sm text-gray-300">
          <span className="text-blue-400 ">Forgot Password</span>
        </Link>

        </div>
      </div>
    </div>
  );
}
