import Link from "next/link";
import { FadeUp } from "@/components/motion/FadeUp";
import { Stagger } from "@/components/motion/Stagger";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { BookOpen, Presentation, Star } from "lucide-react";
import { FloatingActions } from "@/components/FloatingActions";

const testimonials = [
  {
    image: "/testimonials/Nizar Ahammed.jpeg",
    name: "Nizar Ahammed",
    title: "CEO, Lago Group",
    quote: "SKIOLO brought real structure to how we operate. The systems they set up gave our team clarity we never had before — everyone finally knows their role and what to deliver."
  },
  {
    image: "/testimonials/Abdul Kalam Asad.jpeg",
    name: "Abdul Kalam Asad",
    title: "CEO, Focus Motors",
    quote: "Before SKIOLO, too much depended on me personally. They helped us build proper processes and reporting, and now the business runs smoothly without me chasing every detail."
  },
  {
    image: "/testimonials/Aseem.jpeg",
    name: "Aseem",
    title: "CEO, Deco Italia",
    quote: "The clarity SKIOLO delivers is exceptional. They documented our workflows and put systems in place that made our whole operation more organized and scalable."
  },
  {
    image: "/testimonials/Nikhil KG.jpeg",
    name: "Nikhil KG",
    title: "CEO, Money Talk",
    quote: "Working with SKIOLO was a turning point. Their approach to systems and SOPs transformed how we manage our team and track performance. Highly recommended for any growing business."
  },
  {
    image: "/testimonials/Niyas Cholakkal.jpeg",
    name: "Niyas Cholakkal",
    title: "CEO, Toptan Finistore",
    quote: "SKIOLO understands what a business actually needs to scale. The structure and accountability they installed have made a real difference to our day-to-day operations."
  },
  {
    image: "/testimonials/Shibin Chettuvai.jpeg",
    name: "Shibin Chettuvai",
    title: "CEO, Ed-Dream Distance Education",
    quote: "Genuinely impressed with SKIOLO's work. They set up systems that brought order and direction to our organization. Our processes are clearer and our team is far more efficient now."
  }
];

export default function Home() {
  return (
    <div className="flex flex-col w-full bg-paper">
      {/* 1. HERO (Dark, Animated) */}
      <section className="relative w-full pt-32 pb-24 md:pt-48 md:pb-40 overflow-hidden flex flex-col items-center text-center px-6 bg-gradient-to-b from-navy-night to-navy-deep">
        {/* Soft animated radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[1000px] md:h-[1000px] rounded-full blur-[100px] md:blur-[140px] opacity-30 pointer-events-none mix-blend-screen bg-navy-glow animate-[pulse_8s_ease-in-out_infinite]" />

        {/* Accent Squares Motif */}
        <FadeUp delay={0.1} className="flex gap-2 mb-10 z-10">
          <div className="w-2 h-2 bg-accent-green rounded-sm opacity-80" />
          <div className="w-2 h-2 bg-accent-amber rounded-sm opacity-80" />
          <div className="w-2 h-2 bg-accent-coral rounded-sm opacity-80" />
          <div className="w-2 h-2 bg-accent-blue rounded-sm opacity-80" />
        </FadeUp>

        <FadeUp delay={0.2} className="z-10 mb-6">
          <span className="uppercase tracking-widest text-xs font-semibold text-accent-blue font-sans">
            &mdash; BUSINESS CLARITY PLATFORM
          </span>
        </FadeUp>

        <FadeUp delay={0.3} className="max-w-4xl z-10">
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight2 text-paper-on-dark leading-[1.1] mb-8 text-balance">
            Master the systems that scale your business. <br className="hidden md:block" />
            <span className="font-serif-accent text-accent-blue font-normal opacity-90">Set the system.</span>
          </h1>
        </FadeUp>

        <FadeUp delay={0.4} className="max-w-2xl z-10">
          <p className="text-lg md:text-xl text-paper-on-dark-muted mb-12 text-balance font-sans">
            Gain operational clarity through our premium courses and live workshops. We help founders design, document, and deploy the SOPs that drive sustainable growth.
          </p>
        </FadeUp>

        <FadeUp delay={0.5} className="flex flex-col sm:flex-row gap-4 z-10">
          <Link href="/courses">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto bg-paper-on-dark text-navy-night hover:bg-white border-none font-semibold">
              Explore Courses
            </Button>
          </Link>
          <Link href="/workshops">
            <Button variant="ghost" size="lg" className="w-full sm:w-auto text-paper-on-dark hover:bg-white/10 hover:text-white border border-white/20">
              Browse Workshops
            </Button>
          </Link>
        </FadeUp>
      </section>

      {/* 2. "THREE THINGS" FEATURE SECTION (Dark) */}
      <section className="relative w-full py-32 px-6 bg-navy-night border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <FadeUp delay={0.1} className="mb-16">
            <span className="uppercase tracking-widest text-xs font-semibold text-accent-blue font-sans block mb-4">
              &mdash; WHAT YOU&apos;LL MASTER
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-paper-on-dark tracking-tight2">
              Build a business that runs <br />
              <span className="font-serif-accent text-accent-green font-normal">without you.</span>
            </h2>
          </FadeUp>

          <Stagger staggerDelay={0.15} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeUp>
              <div className="relative h-full p-10 flex flex-col items-start text-left rounded-2xl2 bg-white/[0.02] border border-white/10 backdrop-blur-sm overflow-hidden group hover:bg-white/[0.04] transition-colors duration-500">
                <div className="absolute right-6 top-6 text-[100px] leading-none font-display font-bold text-navy-glow/20 group-hover:text-navy-glow/40 transition-colors duration-500 pointer-events-none select-none z-0">
                  01
                </div>
                <h3 className="text-2xl font-display font-semibold text-paper-on-dark mb-4 mt-8 relative z-10">Visibility</h3>
                <p className="text-paper-on-dark-muted relative z-10 leading-relaxed">
                  See your whole operation clearly. Document every process so nothing lives only in someone&apos;s head.
                </p>
              </div>
            </FadeUp>

            <FadeUp>
              <div className="relative h-full p-10 flex flex-col items-start text-left rounded-2xl2 bg-white/[0.02] border border-white/10 backdrop-blur-sm overflow-hidden group hover:bg-white/[0.04] transition-colors duration-500">
                <div className="absolute right-6 top-6 text-[100px] leading-none font-display font-bold text-navy-glow/20 group-hover:text-navy-glow/40 transition-colors duration-500 pointer-events-none select-none z-0">
                  02
                </div>
                <h3 className="text-2xl font-display font-semibold text-paper-on-dark mb-4 mt-8 relative z-10">Control</h3>
                <p className="text-paper-on-dark-muted relative z-10 leading-relaxed">
                  Reporting, limits, and escalation paths that catch problems early before they impact your bottom line.
                </p>
              </div>
            </FadeUp>

            <FadeUp>
              <div className="relative h-full p-10 flex flex-col items-start text-left rounded-2xl2 bg-white/[0.02] border border-white/10 backdrop-blur-sm overflow-hidden group hover:bg-white/[0.04] transition-colors duration-500">
                <div className="absolute right-6 top-6 text-[100px] leading-none font-display font-bold text-navy-glow/20 group-hover:text-navy-glow/40 transition-colors duration-500 pointer-events-none select-none z-0">
                  03
                </div>
                <h3 className="text-2xl font-display font-semibold text-paper-on-dark mb-4 mt-8 relative z-10">Automation</h3>
                <p className="text-paper-on-dark-muted relative z-10 leading-relaxed">
                  Systems do the heavy lifting. Stop managing people, start managing the system.
                </p>
              </div>
            </FadeUp>
          </Stagger>
        </div>
      </section>

      {/* 3. WHAT WE OFFER (Light section) */}
      <section className="w-full py-32 px-6 bg-paper">
        <div className="max-w-6xl mx-auto">
          <FadeUp delay={0.1} className="mb-16 text-center">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-ink tracking-tight2">
              Everything you need to <span className="font-serif-accent text-navy">scale.</span>
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeUp delay={0.2} className="h-full">
              <Card className="h-full p-10 flex flex-col items-start text-left hover:-translate-y-1 transition-transform duration-300">
                <div className="w-14 h-14 rounded-2xl bg-navy/5 flex items-center justify-center mb-8">
                  <BookOpen className="text-navy" size={28} />
                </div>
                <h3 className="text-2xl font-display font-semibold text-ink mb-4">Courses</h3>
                <p className="text-ink-muted mb-8 text-lg">
                  Deep-dive, on-demand learning modules designed to systematically upgrade your operational knowledge.
                </p>
                <Link href="/courses" className="mt-auto">
                  <Button variant="secondary" className="font-semibold text-navy">View Courses</Button>
                </Link>
              </Card>
            </FadeUp>

            <FadeUp delay={0.3} className="h-full">
              <Card className="h-full p-10 flex flex-col items-start text-left hover:-translate-y-1 transition-transform duration-300">
                <div className="w-14 h-14 rounded-2xl bg-accent-amber/10 flex items-center justify-center mb-8">
                  <Presentation className="text-accent-amber" size={28} />
                </div>
                <h3 className="text-2xl font-display font-semibold text-ink mb-4">Workshops</h3>
                <p className="text-ink-muted mb-8 text-lg">
                  Interactive online and offline sessions where we tackle real-world business challenges together.
                </p>
                <Link href="/workshops" className="mt-auto">
                  <Button variant="secondary" className="font-semibold text-navy">View Workshops</Button>
                </Link>
              </Card>
            </FadeUp>
          </div>

          {/* FLAGSHIP PROGRAM */}
          <FadeUp delay={0.4} className="mt-8 max-w-4xl mx-auto">
            <Card className="p-10 md:p-12 bg-white relative overflow-hidden border border-accent-blue/10 z-10 hover:border-accent-blue/20 transition-colors duration-300">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-navy-tint/60 rounded-full blur-[80px] pointer-events-none -z-10 translate-x-1/3 -translate-y-1/3" />
              
              <div className="mb-10 text-center md:text-left">
                <span className="uppercase tracking-widest text-xs font-semibold text-accent-blue font-sans block mb-4">
                  FLAGSHIP PROGRAM &middot; 3 MONTHS
                </span>
                <h3 className="text-3xl md:text-4xl font-display font-bold text-ink mb-4">
                  We set the system <span className="font-serif-accent text-navy font-normal italic">with you.</span>
                </h3>
                <p className="text-ink-muted text-lg max-w-2xl">
                  A 3-month hands-on engagement where SKIOLO installs real operating systems into your business &mdash; reporting, structure, accountability &mdash; and transfers it to your team.
                </p>
              </div>

              {/* THREE-PHASE PROGRESSION */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 mb-12 relative">
                {/* Connecting line for desktop */}
                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-px bg-line -z-10" />
                
                {/* Phase 1 */}
                <div className="flex flex-col items-start md:items-center text-left md:text-center relative bg-white md:bg-transparent">
                  <div className="w-12 h-12 rounded-full bg-accent-coral/10 flex items-center justify-center mb-4 text-accent-coral font-display font-bold border border-accent-coral/20">
                    01
                  </div>
                  <h4 className="font-display font-semibold text-ink mb-2">Month 1: I Do</h4>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    Our team runs your systems directly &mdash; setting up proper reporting, team structures, and processes inside your business.
                  </p>
                </div>

                {/* Phase 2 */}
                <div className="flex flex-col items-start md:items-center text-left md:text-center relative bg-white md:bg-transparent">
                  <div className="w-12 h-12 rounded-full bg-accent-amber/10 flex items-center justify-center mb-4 text-accent-amber font-display font-bold border border-accent-amber/20">
                    02
                  </div>
                  <h4 className="font-display font-semibold text-ink mb-2">Month 2: We Do</h4>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    We work alongside your team, running the systems together and coaching them in real time.
                  </p>
                </div>

                {/* Phase 3 */}
                <div className="flex flex-col items-start md:items-center text-left md:text-center relative bg-white md:bg-transparent">
                  <div className="w-12 h-12 rounded-full bg-accent-green/10 flex items-center justify-center mb-4 text-accent-green font-display font-bold border border-accent-green/20">
                    03
                  </div>
                  <h4 className="font-display font-semibold text-ink mb-2">Month 3: You Do</h4>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    Your team takes full ownership and runs the system independently &mdash; with SKIOLO supporting from the side.
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center md:text-left">
                {/* CTA: Currently wired to WhatsApp */}
                <a href="https://wa.me/918304807856?text=Hi%20SKIOLO%2C%20I%27d%20like%20to%20know%20more%20about%20your%20programs" target="_blank" rel="noopener noreferrer">
                  <Button variant="primary" size="lg" className="font-semibold text-base px-8">
                    Enquire about the program
                  </Button>
                </a>
              </div>
            </Card>
          </FadeUp>
        </div>
      </section>

      {/* 4. TESTIMONIALS */}
      <section className="w-full py-24 px-6 bg-paper-sunken border-t border-line">
        <div className="max-w-6xl mx-auto">
          <FadeUp delay={0.1} className="mb-16 text-center">
            <span className="uppercase tracking-widest text-xs font-semibold text-accent-blue font-sans block mb-4">
              &mdash; WHAT LEADERS SAY
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-ink tracking-tight2">
              Trusted by founders who <span className="font-serif-accent text-navy italic">set the system.</span>
            </h2>
          </FadeUp>

          <Stagger staggerDelay={0.1} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <FadeUp key={idx} className="h-full">
                <Card className="p-8 h-full bg-paper-card border border-line rounded-2xl2 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className="fill-accent-amber text-accent-amber" />
                      ))}
                    </div>
                    <p className="text-ink-soft font-sans mb-8 text-lg leading-relaxed">
                      &quot;{t.quote}&quot;
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={encodeURI(t.image)} alt={t.name} className="w-14 h-14 rounded-full object-cover shrink-0" />
                    <div>
                      <p className="font-semibold text-ink font-display">{t.name}</p>
                      <p className="text-sm text-ink-muted">{t.title}</p>
                    </div>
                  </div>
                </Card>
              </FadeUp>
            ))}
          </Stagger>
        </div>
      </section>

      {/* 5. FINAL CTA BAND (Dark) */}
      <section className="relative w-full py-32 px-6 bg-navy-night overflow-hidden border-t border-navy-glow/30">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-navy-glow/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto text-center z-10">
          <FadeUp delay={0.2}>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-paper-on-dark tracking-tight2 mb-8">
              Ready to <span className="font-serif-accent text-accent-blue font-normal">set your system?</span>
            </h2>
            <p className="text-paper-on-dark-muted text-xl mb-12 max-w-2xl mx-auto">
              Join a community of operators and founders scaling their businesses through structure and clarity.
            </p>
            <Link href="/courses">
              <Button variant="primary" size="lg" className="!bg-white !text-navy hover:!bg-paper-sunken border-none font-semibold text-lg px-8">
                Start Learning Today
              </Button>
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* 6. FLOATING ACTION BUTTONS */}
      <FloatingActions />
    </div>
  );
}
