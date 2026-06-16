"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth, useUser, SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { loadRazorpayScript } from "@/lib/razorpay";
import { MediaBanner } from "@/components/MediaBanner";

export default function WorkshopDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();

  const [workshop, setWorkshop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");
  const [userBooking, setUserBooking] = useState<any>(null);
  const [checkingBooking, setCheckingBooking] = useState(false);

  const fetchUserBooking = async (workshopId: string) => {
    if (!isSignedIn) return;
    setCheckingBooking(true);
    try {
      const token = await getToken();
      if (token) {
        const bookings = await apiFetch<any[]>("/me/bookings", { method: "GET", token });
        const currentBooking = bookings.find((b: any) => b.workshopId === workshopId || b.workshop?.id === workshopId);
        setUserBooking(currentBooking || null);
      }
    } catch (err) {
      console.error("Failed to fetch booking status", err);
    } finally {
      setCheckingBooking(false);
    }
  };

  useEffect(() => {
    async function loadWorkshop() {
      try {
        const data = await apiFetch<any>(`/workshops/${slug}`, { method: "GET" });
        setWorkshop(data);
        if (isSignedIn) {
          fetchUserBooking(data.id);
        }
      } catch (err) {
        console.error("Failed to load workshop", err);
      } finally {
        setLoading(false);
      }
    }
    loadWorkshop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, isSignedIn]);

  const formatIST = (dateString: string) => {
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(new Date(dateString));
  };

  const handleBook = async () => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    setBooking(true);
    setMessage("");

    try {
      const token = await getToken();
      if (!token) {
        setMessage("Authentication error. Please sign in again.");
        setMessageType("error");
        setBooking(false);
        return;
      }

      const response = await apiFetch<any>(`/workshops/${workshop.id}/book`, {
        method: "POST",
        token,
      });

      if (response.type === "WAITLISTED") {
        setMessage(`This workshop is full. You've been added to the waitlist at position ${response.position}. We'll notify you if a seat opens.`);
        setMessageType("info");
        setBooking(false);
        fetchUserBooking(workshop.id);
        return;
      }

      if (response.type === "PAYMENT") {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          setMessage("Failed to load payment gateway. Please try again.");
          setMessageType("error");
          setBooking(false);
          return;
        }

        const options = {
          key: response.razorpayKeyId,
          amount: response.amountPaise,
          currency: response.currency,
          name: "SKIOLO",
          description: response.workshopTitle,
          order_id: response.orderId,
          handler: async function (rzpRes: any) {
            setMessage("Payment received, confirming your booking shortly...");
            setMessageType("success");
            await fetchUserBooking(workshop.id);
          },
          prefill: {
            email: user?.primaryEmailAddress?.emailAddress || "",
          },
          theme: { color: "#000000" },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (failRes: any) {
          setMessage(`Payment failed: ${failRes.error.description}`);
          setMessageType("error");
        });
        rzp.open();
      }

    } catch (err: any) {
      console.error(err);
      setMessage(err.message || "An error occurred during booking.");
      setMessageType("error");
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center min-h-screen flex items-center justify-center">Loading workshop...</div>;
  }

  if (!workshop) {
    return <div className="p-8 text-center min-h-screen flex items-center justify-center">Workshop not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="flex items-center justify-between p-6 max-w-5xl mx-auto border-b border-gray-200 bg-white shadow-sm mb-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold tracking-tight">SKIOLO</Link>
          <Link href="/courses" className="text-sm font-medium hover:underline text-gray-600">Courses</Link>
          <Link href="/workshops" className="text-sm font-medium hover:underline text-gray-600">Workshops</Link>
          <SignedIn>
            <Link href="/my-courses" className="text-sm font-medium hover:underline text-gray-600">My Courses</Link>
            <Link href="/my-bookings" className="text-sm font-medium hover:underline text-gray-600">My Bookings</Link>
          </SignedIn>
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-6 bg-white border rounded-lg shadow-sm">
        <MediaBanner imageUrl={workshop.thumbnail} title={workshop.title} variant="workshop" className="w-full h-64 rounded-md mb-6" />
        
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-4xl font-bold">{workshop.title}</h1>
          <span className={`text-sm px-3 py-1 rounded-full font-medium ${workshop.mode === 'ONLINE' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
            {workshop.mode}
          </span>
        </div>
        
        <div className="bg-gray-50 border rounded-md p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <strong className="block text-gray-900 mb-1">Starts At</strong>
            {formatIST(workshop.startsAt)}
          </div>
          <div>
            <strong className="block text-gray-900 mb-1">Ends At</strong>
            {formatIST(workshop.endsAt)}
          </div>
          {workshop.mode === "OFFLINE" && workshop.venue && (
            <div className="sm:col-span-2">
              <strong className="block text-gray-900 mb-1">Venue</strong>
              {workshop.venue}
            </div>
          )}
        </div>

        <p className="text-gray-700 text-lg mb-8 whitespace-pre-line">{workshop.description}</p>
        
        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-md border">
          <div>
            <span className="text-sm text-gray-500 uppercase tracking-wide">Price</span>
            <div className="text-3xl font-extrabold">₹{(workshop.pricePaise / 100).toFixed(2)}</div>
          </div>
          
          {checkingBooking ? (
            <button disabled className="bg-gray-300 text-gray-500 px-8 py-3 rounded-md font-medium cursor-not-allowed">
              Loading...
            </button>
          ) : (!isSignedIn || !userBooking || userBooking.status === "CANCELLED") ? (
            <button 
              onClick={handleBook} 
              disabled={booking}
              className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition font-medium disabled:opacity-50"
            >
              {booking ? "Processing..." : "Book Now"}
            </button>
          ) : userBooking.status === "CONFIRMED" ? (
            <div className="flex flex-col items-end gap-2">
              <div className="text-green-600 font-semibold flex items-center gap-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Booked ✓ You&apos;re confirmed
              </div>
              {workshop.mode === "ONLINE" && workshop.zoomJoinUrl && (
                <Link href={workshop.zoomJoinUrl} target="_blank" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition font-medium text-sm">
                  Join link
                </Link>
              )}
              {workshop.mode === "OFFLINE" && workshop.venue && (
                <div className="text-sm text-gray-600">
                  Venue: {workshop.venue}
                </div>
              )}
            </div>
          ) : userBooking.status === "PENDING_PAYMENT" ? (
            <div className="flex flex-col items-end gap-2">
              <div className="text-orange-600 font-semibold">Payment pending — complete your payment</div>
              <Link href="/my-bookings" className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition font-medium text-sm text-center">
                Go to My Bookings
              </Link>
            </div>
          ) : userBooking.status === "WAITLISTED" ? (
            <div className="text-gray-600 font-semibold bg-gray-200 px-6 py-3 rounded-md">
              You&apos;re on the waitlist {userBooking.waitlistPosition ? `(position ${userBooking.waitlistPosition})` : ""}
            </div>
          ) : userBooking.status === "OFFERED" ? (
            <div className="flex flex-col items-end gap-2">
              <div className="text-blue-600 font-semibold">A seat has been offered to you — pay to confirm</div>
              <Link href="/my-bookings" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition font-medium text-sm text-center">
                Go to My Bookings
              </Link>
            </div>
          ) : (
            <button 
              onClick={handleBook} 
              disabled={booking}
              className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition font-medium disabled:opacity-50"
            >
              {booking ? "Processing..." : "Book Now"}
            </button>
          )}
        </div>

        {message && (
          <div className={`mt-6 p-4 rounded-md border ${
            messageType === "error" ? "bg-red-50 text-red-700 border-red-200" : 
            messageType === "success" ? "bg-green-50 text-green-700 border-green-200" : 
            "bg-blue-50 text-blue-700 border-blue-200"
          }`}>
            <p>{message}</p>
            {messageType === "success" && (
              <Link href="/my-bookings" className="mt-3 block text-sm underline font-medium hover:text-green-900">
                Refresh status in My Bookings
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
