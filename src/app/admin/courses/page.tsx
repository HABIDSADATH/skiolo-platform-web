"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface Course {
  id: string;
  title: string;
  pricePaise: number;
  isPublished: boolean;
}

export default function CoursesPage() {
  const { getToken } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pricePaise, setPricePaise] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      const data = await apiFetch<Course[]>("/admin/courses", { method: "GET", token });
      setCourses(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async () => {
    try {
      setSubmitting(true);
      setFormError(null);
      const token = await getToken();
      
      const payload = {
        title,
        description,
        pricePaise: parseInt(pricePaise, 10),
        isPublished,
      };

      await apiFetch("/admin/courses", { method: "POST", token, body: payload });
      
      // Reset form
      setTitle("");
      setDescription("");
      setPricePaise("");
      setIsPublished(false);
      
      // Refresh list
      await fetchCourses();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* List Section */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Courses</h2>
        {loading ? (
          <p className="text-sm text-gray-500">Loading courses...</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : courses.length === 0 ? (
          <p className="text-sm text-gray-500">No courses yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{c.title}</td>
                    <td className="px-4 py-3">₹{(c.pricePaise / 100).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {c.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Create Section */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">New Course</h2>
        {formError && <p className="text-sm text-red-600 mb-4">{formError}</p>}
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price in paise (e.g. 199900 = ₹1999)</label>
            <input 
              type="number" 
              value={pricePaise} 
              onChange={(e) => setPricePaise(e.target.value)} 
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="isPublished"
              checked={isPublished} 
              onChange={(e) => setIsPublished(e.target.checked)} 
              className="rounded border-gray-300 text-black focus:ring-black"
            />
            <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">Published</label>
          </div>
          <button 
            onClick={handleCreate}
            disabled={submitting}
            className="mt-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create Course"}
          </button>
        </div>
      </section>
    </div>
  );
}
