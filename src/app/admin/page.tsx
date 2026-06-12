"use client";

import { useUser } from "@clerk/nextjs";

export default function AdminDashboard() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h1 className="text-2xl font-semibold mb-2">Welcome</h1>
      <p className="text-gray-600">
        You are signed in as <span className="font-medium text-gray-900">{user.primaryEmailAddress?.emailAddress}</span>.
      </p>
    </div>
  );
}
