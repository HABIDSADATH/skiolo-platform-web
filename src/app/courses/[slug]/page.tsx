"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth, useUser, SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { loadRazorpayScript } from "@/lib/razorpay";

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [message, setMessage] = useState("");
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [accessUrl, setAccessUrl] = useState<string | null>(null);

  useEffect(() => {
    async function checkEnrollment() {
      if (!isSignedIn) return;
      try {
        const token = await getToken();
        if (token) {
          const access = await apiFetch<any>(`/courses/${slug}/access`, { method: "GET", token });
          setIsEnrolled(true);
          setAccessUrl(access.accessUrl);
        }
      } catch (err) {
        // 403 expected if not enrolled
        console.log("Enrollment check:", err);
      }
    }
    checkEnrollment();
  }, [slug, isSignedIn, getToken]);

  useEffect(() => {
    async function loadCourse() {
      try {
        const data = await apiFetch<any>(`/courses/${slug}`, { method: "GET" });
        setCourse(data);
      } catch (err) {
        console.error("Failed to load course", err);
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [slug]);

  const handleBuy = async () => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    setBuying(true);
    setMessage("");

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setMessage("Failed to load payment gateway. Please try again.");
        setBuying(false);
        return;
      }

      const token = await getToken();
      if (!token) {
        setMessage("Authentication error. Please sign in again.");
        setBuying(false);
        return;
      }

      const orderData = await apiFetch<any>(`/payments/course/${course.id}`, {
        method: "POST",
        token,
      });

      const options = {
        key: orderData.razorpayKeyId,
        amount: orderData.amountPaise,
        currency: orderData.currency,
        name: "SKIOLO",
        description: orderData.courseTitle,
        order_id: orderData.orderId,
        handler: function (response: any) {
          setMessage("Payment received, confirming your enrollment shortly...");
        },
        prefill: {
          email: user?.primaryEmailAddress?.emailAddress || "",
        },
        theme: { color: "#000000" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setMessage(`Payment failed: ${response.error.description}`);
      });
      rzp.open();

    } catch (err: any) {
      console.error(err);
      setMessage(err.message || "An error occurred during checkout.");
    } finally {
      setBuying(false);
    }
  };

  const handleAccess = () => {
    if (accessUrl) {
      window.open(accessUrl, "_blank");
    } else {
      setMessage("Course link will be available soon.");
    }
  };

  if (loading) {
    return <div className="p-8 text-center min-h-screen flex items-center justify-center">Loading course...</div>;
  }

  if (!course) {
    return <div className="p-8 text-center min-h-screen flex items-center justify-center">Course not found.</div>;
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

      <div className="max-w-3xl mx-auto p-6 bg-white border rounded-lg shadow-sm">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} className="w-full h-64 object-cover rounded-md mb-6 bg-gray-100" />
        ) : (
          <div className="w-full h-64 bg-gray-200 rounded-md mb-6 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
        <p className="text-gray-700 text-lg mb-8 whitespace-pre-line">{course.description}</p>
        
        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-md border">
          <div>
            <span className="text-sm text-gray-500 uppercase tracking-wide">Price</span>
            <div className="text-3xl font-extrabold">₹{(course.pricePaise / 100).toFixed(2)}</div>
          </div>
          
          {isEnrolled ? (
            <button 
              onClick={handleAccess}
              className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition font-medium"
            >
              Access Course
            </button>
          ) : (
            <button 
              onClick={handleBuy} 
              disabled={buying}
              className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition font-medium disabled:opacity-50"
            >
              {buying ? "Processing..." : "Buy Now"}
            </button>
          )}
        </div>

        {message && (
          <div className={`mt-6 p-4 rounded-md border ${message.includes("failed") || message.includes("error") || message.includes("Failed") ? "bg-red-50 text-red-700 border-red-200" : "bg-green-50 text-green-700 border-green-200"}`}>
            <p>{message}</p>
            {message.includes("Payment received") && !isEnrolled && (
              <button 
                onClick={async () => {
                  try {
                    const token = await getToken();
                    if (!token) return;
                    const access = await apiFetch<any>(`/courses/${slug}/access`, { method: "GET", token });
                    setIsEnrolled(true);
                    setAccessUrl(access.accessUrl);
                    setMessage("Enrollment confirmed!");
                  } catch (err) {
                    setMessage("Payment received, confirming your enrollment shortly... (still processing)");
                  }
                }}
                className="mt-3 text-sm underline font-medium hover:text-green-900"
              >
                Refresh access
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
