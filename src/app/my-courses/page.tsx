"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth, SignedIn, RedirectToSignIn } from "@clerk/nextjs";
import { apiFetch } from "@/lib/api";

export default function MyCoursesPage() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMyCourses() {
      if (!isLoaded || !isSignedIn) return;
      try {
        const token = await getToken();
        if (token) {
          const data = await apiFetch<any[]>("/me/courses", { method: "GET", token });
          setCourses(data);
        }
      } catch (err) {
        console.error("Failed to load my courses", err);
      } finally {
        setLoading(false);
      }
    }
    if (isLoaded) {
      loadMyCourses();
    }
  }, [isLoaded, isSignedIn, getToken]);

  if (!isLoaded) {
    return <div className="p-8 text-center min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="flex items-center justify-between p-6 max-w-5xl mx-auto border-b border-gray-200 bg-white shadow-sm mb-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold tracking-tight">SKIOLO</Link>
          <Link href="/courses" className="text-sm font-medium hover:underline text-gray-600">Courses</Link>
          <SignedIn>
            <Link href="/my-courses" className="text-sm font-medium hover:underline text-gray-900">My Courses</Link>
          </SignedIn>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">My Courses</h1>
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading your courses...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-4 line-clamp-2">{course.title}</h2>
                  <Link href={`/courses/${course.slug}`}>
                    <button className="w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition text-sm font-medium">
                      Access Course
                    </button>
                  </Link>
                </div>
              </div>
            ))}
            {courses.length === 0 && (
              <div className="col-span-full text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-600 mb-4">You haven't purchased any courses yet.</p>
                <Link href="/courses">
                  <button className="bg-gray-100 text-gray-900 px-6 py-2 rounded-md hover:bg-gray-200 transition text-sm font-medium">
                    Browse Courses
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
