import Link from "next/link";
import { FadeUp } from "@/components/motion/FadeUp";

export function Footer() {
  return (
    <footer className="w-full bg-paper-sunken border-t border-line mt-auto">
      <FadeUp className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          <div className="md:col-span-2 space-y-4">
            <h2 className="font-display font-semibold text-2xl text-ink tracking-tight2">SKIOLO</h2>
            <p className="text-ink-muted font-sans max-w-sm">
              Set the system. Premium education for modern builders.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-ink">Platform</h3>
            <ul className="space-y-2">
              <li><Link href="/courses" className="text-ink-muted hover:text-ink transition-colors">Courses</Link></li>
              <li><Link href="/workshops" className="text-ink-muted hover:text-ink transition-colors">Workshops</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-ink">Company</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-ink-muted hover:text-ink transition-colors">About</Link></li>
              <li><Link href="#" className="text-ink-muted hover:text-ink transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-ink">Office</h3>
            <ul className="space-y-2 text-ink-muted text-sm">
              <li>Calicut</li>
              <li>Kondotty</li>
              <li>Chalakudy</li>
              <li className="pt-2 opacity-80">Kerala, India</li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-line flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-ink-muted font-sans">
            © 2026 SKIOLO. All rights reserved.
          </p>
        </div>
      </FadeUp>
    </footer>
  );
}
