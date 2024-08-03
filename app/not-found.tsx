// pages/404.js
import Link from 'next/link';

export default function notfound() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-blue-500">
            <div className="text-center">
                <h1 className="text-9xl font-bold">404</h1>
                <p className="mt-4 text-2xl">Page Not Found</p>
                <p className="mt-2 text-lg">
                    Sorry, we couldn&apos;t find the page you&apos;re looking for.
                </p>
                <Link href="/">
                    <div className="mt-8 inline-block px-6 py-3 bg-blue-500 text-black rounded-md hover:bg-blue-400 transition">
                        Go Back Home
                    </div>
                </Link>
            </div>
        </div>
    );
}
