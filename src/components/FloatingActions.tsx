"use client";

import { Sparkles, MessageCircle } from "lucide-react";

export function FloatingActions() {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
      {/* Chatbot Placeholder (future phase) */}
      {/* Replace onClick behavior with real chatbot integration when ready */}
      <button 
        className="w-14 h-14 rounded-full bg-navy text-white shadow-soft-lg flex items-center justify-center hover:scale-110 hover:bg-navy-hover transition-all duration-300 group relative"
        onClick={() => alert("AI assistant coming soon!")}
        aria-label="Open AI Assistant"
      >
        <Sparkles size={24} />
        <span className="absolute right-full mr-4 bg-navy text-white text-sm font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          AI assistant coming soon
        </span>
      </button>

      {/* WhatsApp Floating Button */}
      {/* PLACEHOLDER: Update phone number to real SKIOLO WhatsApp number */}
      <a 
        href="https://wa.me/910000000000" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-[#25D366] text-white shadow-soft-lg flex items-center justify-center hover:scale-110 hover:bg-[#20bd5a] transition-all duration-300 group relative"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={28} className="fill-current" />
        <span className="absolute right-full mr-4 bg-paper-card text-ink text-sm font-medium px-3 py-1.5 rounded-lg shadow-soft opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat with us
        </span>
      </a>
    </div>
  );
}
