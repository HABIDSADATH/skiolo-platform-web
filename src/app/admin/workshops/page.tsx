"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface Workshop {
  id: string;
  title: string;
  pricePaise: number;
  mode: "ONLINE" | "OFFLINE";
  isPublished: boolean;
  startsAt: string;
}

export default function WorkshopsPage() {
  const { getToken } = useAuth();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState<"ONLINE" | "OFFLINE">("ONLINE");
  const [pricePaise, setPricePaise] = useState("");
  const [capacity, setCapacity] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [venue, setVenue] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchWorkshops = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      const data = await apiFetch<Workshop[]>("/admin/workshops", { method: "GET", token });
      setWorkshops(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkshops();
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
        mode,
        pricePaise: parseInt(pricePaise, 10),
        capacity: parseInt(capacity, 10),
        startsAt: new Date(startsAt).toISOString(),
        endsAt: new Date(endsAt).toISOString(),
        venue: mode === "OFFLINE" ? venue : undefined,
        isPublished,
      };

      await apiFetch("/admin/workshops", { method: "POST", token, body: payload });
      
      // Reset form
      setTitle("");
      setDescription("");
      setMode("ONLINE");
      setPricePaise("");
      setCapacity("");
      setStartsAt("");
      setEndsAt("");
      setVenue("");
      setIsPublished(false);
      
      // Refresh list
      await fetchWorkshops();
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
        <h2 className="text-xl font-semibold mb-4">Workshops</h2>
        {loading ? (
          <p className="text-sm text-gray-500">Loading workshops...</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : workshops.length === 0 ? (
          <p className="text-sm text-gray-500">No workshops yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Mode</th>
                  <th className="px-4 py-3">Starts At</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {workshops.map((w) => (
                  <tr key={w.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{w.title}</td>
                    <td className="px-4 py-3">{w.mode}</td>
                    <td className="px-4 py-3">{new Date(w.startsAt).toLocaleString()}</td>
                    <td className="px-4 py-3">₹{(w.pricePaise / 100).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${w.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {w.isPublished ? "Published" : "Draft"}
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
        <h2 className="text-xl font-semibold mb-4">New Workshop</h2>
        {formError && <p className="text-sm text-red-600 mb-4">{formError}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
            <select 
              value={mode} 
              onChange={(e) => setMode(e.target.value as "ONLINE" | "OFFLINE")} 
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="ONLINE">Online</option>
              <option value="OFFLINE">Offline</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
            <input 
              type="number" 
              value={capacity} 
              onChange={(e) => setCapacity(e.target.value)} 
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
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
          {mode === "OFFLINE" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
              <input 
                type="text" 
                value={venue} 
                onChange={(e) => setVenue(e.target.value)} 
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Starts At</label>
            <input 
              type="datetime-local" 
              value={startsAt} 
              onChange={(e) => setStartsAt(e.target.value)} 
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ends At</label>
            <input 
              type="datetime-local" 
              value={endsAt} 
              onChange={(e) => setEndsAt(e.target.value)} 
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div className="md:col-span-2 flex items-center gap-2 mt-2">
            <input 
              type="checkbox" 
              id="isPublishedW"
              checked={isPublished} 
              onChange={(e) => setIsPublished(e.target.checked)} 
              className="rounded border-gray-300 text-black focus:ring-black"
            />
            <label htmlFor="isPublishedW" className="text-sm font-medium text-gray-700">Published</label>
          </div>
          <div className="md:col-span-2">
            <button 
              onClick={handleCreate}
              disabled={submitting}
              className="mt-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Workshop"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
