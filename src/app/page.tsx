import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="flex items-center justify-between p-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold tracking-tight">SKIOLO</Link>
          <Link href="/courses" className="text-sm font-medium hover:underline text-gray-600">Courses</Link>
          <SignedIn>
            <Link href="/my-courses" className="text-sm font-medium hover:underline text-gray-600">My Courses</Link>
          </SignedIn>
        </div>
        <div className="flex items-center gap-4">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in" className="text-sm font-medium hover:underline">
              Sign In
            </Link>
          </SignedOut>
        </div>
      </header>
      
      <main className="flex flex-col items-center justify-center py-32 px-4 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight sm:text-6xl mb-6">
          SKIOLO Platform
        </h2>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl">
          The central hub for managing your courses, workshops, and users. 
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <SignedIn>
            <Link 
              href="/admin" 
              className="rounded-md bg-black px-8 py-3 text-sm font-medium text-white shadow hover:bg-gray-800 transition-colors"
            >
              Go to Admin
            </Link>
          </SignedIn>
          <SignedOut>
            <Link 
              href="/sign-in" 
              className="rounded-md bg-black px-8 py-3 text-sm font-medium text-white shadow hover:bg-gray-800 transition-colors"
            >
              Sign In
            </Link>
          </SignedOut>
        </div>
      </main>
    </div>
  );
}
