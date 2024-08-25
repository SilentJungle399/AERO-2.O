import Head from 'next/head';
import Link from 'next/link';
export default function Techspardha() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-dark text-white">
      <Head>
        <title>Techspardha - Coming Soon</title>
      </Head>
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4 text-blue-500">TECHSPARDHA</h1>
        <p className="text-2xl">Coming Soon...</p>
        <Link href="/">
                    <div className="mt-8 inline-block px-6 py-3 bg-blue-500 text-black rounded-md hover:bg-blue-400 transition">
                        Go Back Home
                    </div>
        </Link>
      </div>
    </div>
  );
}
