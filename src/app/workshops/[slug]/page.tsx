"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth, useUser, SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { loadRazorpayScript } from "@/lib/razorpay";
import { WorkshopBanner } from "@/components/WorkshopCard";
import { BulletList } from "@/components/BulletList";
import { FadeUp } from "@/components/motion/FadeUp";
import { Button } from "@/components/ui/Button";
import { AlertCircle, CheckCircle2, ArrowLeft, CalendarDays, MapPin, Video } from "lucide-react";
import { toast } from "sonner";
import { PurchaseSuccessModal } from "@/components/PurchaseSuccessModal";

export default function WorkshopDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();

  const [workshop, setWorkshop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [userBooking, setUserBooking] = useState<any>(null);
  const [checkingBooking, setCheckingBooking] = useState(false);
  const [successModal, setSuccessModal] = useState<{ isOpen: boolean; orderId: string; amountPaise: number } | null>(null);

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

    try {
      const token = await getToken();
      if (!token) {
        toast.error("Authentication error. Please sign in again.");
        setBooking(false);
        return;
      }

      const response = await apiFetch<any>(`/workshops/${workshop.id}/book`, {
        method: "POST",
        token,
      });

      if (response.type === "WAITLISTED") {
        toast.info(`This workshop is full. You've been added to the waitlist at position ${response.position}. We'll notify you if a seat opens.`);
        setBooking(false);
        fetchUserBooking(workshop.id);
        return;
      }

      if (response.type === "PAYMENT") {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          toast.error("Failed to load payment gateway. Please try again.");
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
            setSuccessModal({
              isOpen: true,
              orderId: response.orderId,
              amountPaise: response.amountPaise,
            });
            await fetchUserBooking(workshop.id);
          },
          prefill: {
            email: user?.primaryEmailAddress?.emailAddress || "",
          },
          theme: { color: "#000000" },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (failRes: any) {
          toast.error(`Payment failed: ${failRes.error.description}`);
        });
        rzp.open();
      }

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "An error occurred during booking.");
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

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(workshop.pricePaise / 100);

  return (
    <div className="min-h-screen bg-paper text-ink font-sans pb-32">
      <PurchaseSuccessModal
        isOpen={!!successModal?.isOpen}
        onClose={() => setSuccessModal(prev => prev ? { ...prev, isOpen: false } : null)}
        onPrimaryAction={() => router.push("/my-bookings")}
        primaryActionLabel="View My Bookings"
        productTitle={workshop.title}
        amountPaise={successModal?.amountPaise || 0}
        orderId={successModal?.orderId || ""}
        type="workshop"
      />

      <div className="max-w-6xl mx-auto px-6 pt-12">
        <FadeUp>
          <Link href="/workshops" className="inline-flex items-center gap-2 text-ink-muted hover:text-navy font-medium text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to workshops
          </Link>
        </FadeUp>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Main Content (Left) */}
          <div className="lg:col-span-8">
            <FadeUp delay={0.1}>
              <div className="rounded-2xl2 overflow-hidden mb-10 shadow-soft border border-line">
                <WorkshopBanner mode={workshop.mode} className="w-full aspect-video md:aspect-[21/9]" />
              </div>

              <div className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase border ${
                    workshop.mode === 'ONLINE' 
                      ? 'text-[#2E73C9] bg-[#2E73C9]/10 border-[#2E73C9]/20' 
                      : 'text-[#F2B53C] bg-[#F2B53C]/10 border-[#F2B53C]/20'
                  }`}>
                    {workshop.mode === 'ONLINE' ? <Video className="w-3 h-3 mr-1.5" /> : <MapPin className="w-3 h-3 mr-1.5" />}
                    {workshop.mode}
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-display font-bold text-ink tracking-tight2 mb-8 leading-tight">
                  {workshop.title}
                </h1>
                
                <div className="flex flex-wrap gap-4 mb-10">
                  <div className="flex-1 min-w-[200px] bg-white border border-line rounded-xl p-4 flex items-start gap-4 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center shrink-0">
                      <CalendarDays className="w-5 h-5 text-navy" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-1">Starts</p>
                      <p className="text-sm font-medium text-ink">{formatIST(workshop.startsAt)}</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-[200px] bg-white border border-line rounded-xl p-4 flex items-start gap-4 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center shrink-0">
                      <CalendarDays className="w-5 h-5 text-navy opacity-70" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-1">Ends</p>
                      <p className="text-sm font-medium text-ink">{formatIST(workshop.endsAt)}</p>
                    </div>
                  </div>
                  
                  {workshop.mode === "OFFLINE" && workshop.venue && (
                    <div className="w-full bg-white border border-line rounded-xl p-4 flex items-start gap-4 shadow-sm">
                      <div className="w-10 h-10 rounded-lg bg-[#F2B53C]/10 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-[#F2B53C]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-1">Venue</p>
                        <p className="text-sm font-medium text-ink">{workshop.venue}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-8">
                  <h3 className="text-xl font-display font-semibold mb-4 text-ink">About this workshop</h3>
                  <BulletList text={workshop.description} />
                </div>
              </div>
            </FadeUp>
          </div>

          {/* Sidebar CTA (Right) */}
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <FadeUp delay={0.2}>
              <div className="bg-white border border-line rounded-2xl2 p-8 shadow-soft-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-navy/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
                
                <div className="mb-8">
                  <span className="text-xs font-bold uppercase tracking-widest text-ink-muted block mb-2">Registration</span>
                  <div className="text-4xl font-display font-bold text-navy">
                    {formattedPrice}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {checkingBooking ? (
                    <Button variant="secondary" size="lg" disabled className="w-full justify-center py-4 text-base">
                      <div className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin mr-2" />
                      Loading...
                    </Button>
                  ) : (!isSignedIn || !userBooking || userBooking.status === "CANCELLED") ? (
                    <Button 
                      variant="primary" 
                      size="lg" 
                      onClick={handleBook} 
                      disabled={booking}
                      className="w-full justify-center py-4 text-base shadow-soft"
                    >
                      {booking ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </span>
                      ) : "Book Now"}
                    </Button>
                  ) : userBooking.status === "CONFIRMED" ? (
                    <div className="flex flex-col gap-3">
                      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        Booked & Confirmed
                      </div>
                      {workshop.mode === "ONLINE" && workshop.zoomJoinUrl && (
                        <Link href={workshop.zoomJoinUrl} target="_blank" className="w-full">
                          <Button variant="primary" className="w-full justify-center py-3 bg-[#2E73C9] hover:bg-[#235BA0]">
                            Join Link
                          </Button>
                        </Link>
                      )}
                    </div>
                  ) : userBooking.status === "PENDING_PAYMENT" ? (
                    <div className="flex flex-col gap-3">
                      <div className="bg-orange-50 border border-orange-200 text-orange-800 p-3 rounded-xl flex items-center justify-center text-sm font-semibold text-center">
                        Payment pending — complete your payment
                      </div>
                      <Link href="/my-bookings" className="w-full">
                        <Button variant="primary" className="w-full justify-center py-3">
                          Go to My Bookings
                        </Button>
                      </Link>
                    </div>
                  ) : userBooking.status === "WAITLISTED" ? (
                    <div className="bg-gray-100 border border-gray-200 text-gray-700 p-4 rounded-xl text-center text-sm font-semibold">
                      You&apos;re on the waitlist {userBooking.waitlistPosition ? `(position ${userBooking.waitlistPosition})` : ""}
                    </div>
                  ) : userBooking.status === "OFFERED" ? (
                    <div className="flex flex-col gap-3">
                      <div className="bg-[#2E73C9]/10 border border-[#2E73C9]/20 text-[#235BA0] p-3 rounded-xl text-center text-sm font-semibold">
                        A seat has been offered to you — pay to confirm
                      </div>
                      <Link href="/my-bookings" className="w-full">
                        <Button variant="primary" className="w-full justify-center py-3">
                          Go to My Bookings
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <Button 
                      variant="primary" 
                      size="lg" 
                      onClick={handleBook} 
                      disabled={booking}
                      className="w-full justify-center py-4 text-base shadow-soft"
                    >
                      {booking ? "Processing..." : "Book Now"}
                    </Button>
                  )}
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </div>
  );
}
