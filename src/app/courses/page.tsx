"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SignedIn } from "@clerk/nextjs";
import { apiFetch } from "@/lib/api";

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await apiFetch<any[]>("/courses", { method: "GET" });
        setCourses(data);
      } catch (err) {
        console.error("Failed to load courses", err);
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  if (loading) {
    return <div className="p-8 text-center min-h-screen flex items-center justify-center">Loading courses...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="flex items-center justify-between p-6 max-w-5xl mx-auto border-b border-gray-200 bg-white shadow-sm mb-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold tracking-tight">SKIOLO</Link>
          <Link href="/courses" className="text-sm font-medium hover:underline text-gray-600">Courses</Link>
          <SignedIn>
            <Link href="/my-courses" className="text-sm font-medium hover:underline text-gray-600">My Courses</Link>
          </SignedIn>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Available Courses</h1>
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
                <h2 className="text-xl font-semibold mb-2 line-clamp-1">{course.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2 min-h-[3rem]">{course.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">₹{(course.pricePaise / 100).toFixed(2)}</span>
                  <Link href={`/courses/${course.slug}`}>
                    <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition text-sm font-medium">
                      Buy Now
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {courses.length === 0 && (
            <p className="col-span-full text-center text-gray-500 py-10">No courses available right now.</p>
          )}
        </div>
      </div>
    </div>
  );
}
