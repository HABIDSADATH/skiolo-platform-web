"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ReceiptText, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PurchaseSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrimaryAction: () => void;
  primaryActionLabel: string;
  productTitle: string;
  amountPaise: number;
  orderId: string;
  type: "course" | "workshop";
}

export function PurchaseSuccessModal({
  isOpen,
  onClose,
  onPrimaryAction,
  primaryActionLabel,
  productTitle,
  amountPaise,
  orderId,
  type,
}: PurchaseSuccessModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amountPaise / 100);

  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-navy-night/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
            className="relative w-full max-w-md bg-paper-card rounded-2xl2 shadow-soft-lg overflow-hidden border border-line flex flex-col max-h-[90vh]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-ink-muted hover:text-ink hover:bg-paper-sunken rounded-full transition-colors z-10"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-8 flex-1 overflow-y-auto">
              {/* Header */}
              <div className="flex flex-col items-center text-center mb-8 pt-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    damping: 15,
                    stiffness: 200,
                    delay: 0.1,
                  }}
                  className="w-16 h-16 bg-accent-green/10 rounded-full flex items-center justify-center mb-4 text-accent-green"
                >
                  <CheckCircle2 className="w-8 h-8" />
                </motion.div>
                <h2 className="text-2xl font-display font-semibold text-ink tracking-tight2 mb-2">
                  Payment Successful!
                </h2>
                <p className="text-ink-muted text-sm max-w-[280px]">
                  A confirmation has been recorded. You can access your purchase anytime from {type === "course" ? "My Courses" : "My Bookings"}.
                </p>
              </div>

              {/* Receipt Card */}
              <div className="bg-paper-sunken rounded-xl border border-line p-5 mb-8">
                <div className="flex items-center gap-2 text-ink font-medium mb-4 pb-4 border-b border-line">
                  <ReceiptText className="w-4 h-4 text-ink-muted" />
                  <h3>Purchase Receipt</h3>
                </div>
                
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-ink-muted shrink-0">Product</span>
                    <span className="font-medium text-ink text-right">{productTitle}</span>
                  </div>
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-ink-muted shrink-0">Amount</span>
                    <span className="font-medium text-ink">{formattedAmount}</span>
                  </div>
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-ink-muted shrink-0">Date</span>
                    <span className="font-medium text-ink text-right">{formattedDate}</span>
                  </div>
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-ink-muted shrink-0">Order ID</span>
                    <span className="font-mono font-medium text-ink text-right text-xs mt-0.5 break-all">
                      {orderId}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <Button
                  variant="primary"
                  className="w-full justify-center py-3.5 text-base"
                  onClick={() => {
                    onClose();
                    onPrimaryAction();
                  }}
                >
                  {primaryActionLabel}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-center"
                  onClick={onClose}
                >
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
