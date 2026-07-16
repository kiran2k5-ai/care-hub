import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  Heart, 
  ShieldCheck, 
  Activity, 
  Smile, 
  Globe, 
  Award,
  Users,
  Compass,
  FileText,
  Smartphone
} from "lucide-react";

export default function AboutPage() {
  return (
    <main className="relative min-h-screen bg-slate-50/50 font-sans flex flex-col justify-between overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-15%] w-[45%] h-[55%] rounded-full bg-sky-50/50 blur-[90px] pointer-events-none -z-10" />
      <div className="absolute top-[35%] right-[-15%] w-[40%] h-[50%] rounded-full bg-teal-50/30 blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] left-[-10%] w-[35%] h-[45%] rounded-full bg-sky-50/40 blur-[125px] pointer-events-none -z-10" />

      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif font-bold text-2xl text-[#0b335c] tracking-tight">CareHub</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link href="/services" className="hover:text-[#0b335c] transition-colors">Services</Link>
            <Link href="/about" className="hover:text-[#0b335c] transition-colors text-[#0b335c]">About Us</Link>
          </nav>

          {/* CTAs */}
          <div className="flex items-center gap-6 text-sm font-semibold">
            <Link href="/login" className="text-slate-600 hover:text-[#0b335c] transition-colors">
              Log in
            </Link>
            <Link 
              href="/signup" 
              className="rounded-full bg-[#005c53] hover:bg-[#004d45] px-6 py-2.5 text-white shadow-sm transition-all hover:shadow-md active:scale-98"
            >
              Join CareHub
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative mx-auto w-full max-w-7xl px-6 pt-12 pb-16 sm:px-8 lg:px-12 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Hero Left Content */}
          <div className="space-y-6 lg:col-span-7 flex flex-col items-start text-left max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#005c53]">
              Our Mission
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-[#0b335c] sm:text-5xl lg:text-6xl leading-[1.1]">
              Transforming the<br />
              <span className="text-[#0ea5e9]">Healthcare Experience.</span>
            </h1>

            <p className="text-base sm:text-lg leading-relaxed text-slate-500 font-medium">
              CareHub was founded on a simple principle: medical care should be as precise as modern science allows, yet as empathetic as human nature demands. We build the infrastructure that connects patients with elite specialists, eliminating administrative friction for doctors and navigation complexity for members.
            </p>
          </div>

          {/* Hero Right Image */}
          <div className="lg:col-span-5 relative w-full flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[460px] aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
              <Image
                src="/doctors_group.png"
                alt="CareHub Clinical Board"
                fill
                priority
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-8 lg:px-12 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#0b335c] sm:text-4xl">
            Our Core Values
          </h2>
          <p className="text-slate-500 font-semibold text-sm sm:text-base leading-relaxed">
            The principles that guide our product, our culture, and our clinical network.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6 hover:border-sky-200 transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-[#005c53]">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-extrabold text-[#0b335c]">Precision</h3>
            <p className="text-xs sm:text-sm text-slate-400 font-semibold leading-relaxed">
              We leverage data-driven matching and structured medical record tracking to ensure complete accuracy.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6 hover:border-sky-200 transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-[#005c53]">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-extrabold text-[#0b335c]">Empathy</h3>
            <p className="text-xs sm:text-sm text-slate-400 font-semibold leading-relaxed">
              We design software and workflow pathways that respect patient dignity and clinician workload.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6 hover:border-sky-200 transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-[#005c53]">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-extrabold text-[#0b335c]">Accessibility</h3>
            <p className="text-xs sm:text-sm text-slate-400 font-semibold leading-relaxed">
              We bring world-class clinical guidance directly to your screen, simplifying telehealth and booking.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6 hover:border-sky-200 transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-[#005c53]">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-extrabold text-[#0b335c]">Trust</h3>
            <p className="text-xs sm:text-sm text-slate-400 font-semibold leading-relaxed">
              We secure health information with standard-setting controls, achieving full HIPAA compliance.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#0b335c] text-white py-20 w-full">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <p className="text-4xl sm:text-5xl font-extrabold text-[#0ea5e9]">99.8%</p>
            <p className="text-slate-300 text-xs font-bold uppercase tracking-wider">Satisfaction Rate</p>
          </div>
          <div className="space-y-2">
            <p className="text-4xl sm:text-5xl font-extrabold text-[#0ea5e9]">10k+</p>
            <p className="text-slate-300 text-xs font-bold uppercase tracking-wider">Premium Members</p>
          </div>
          <div className="space-y-2">
            <p className="text-4xl sm:text-5xl font-extrabold text-[#0ea5e9]">500+</p>
            <p className="text-slate-300 text-xs font-bold uppercase tracking-wider">Certified Doctors</p>
          </div>
          <div className="space-y-2">
            <p className="text-4xl sm:text-5xl font-extrabold text-[#0ea5e9]">100%</p>
            <p className="text-slate-300 text-xs font-bold uppercase tracking-wider">HIPAA Compliant</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-100/60 border-t border-slate-200/40 pt-16 pb-8 w-full">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid gap-10 md:grid-cols-4 pb-16">
            <div className="space-y-4">
              <span className="font-serif font-bold text-xl text-[#0b335c] tracking-tight">CareHub</span>
              <p className="text-xs font-semibold leading-relaxed text-slate-400">
                The leading digital health ecosystem for premium patients and top-tier providers.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Platform</h4>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-400">
                <li><Link href="/services" className="hover:text-[#0b335c] transition-colors">Services</Link></li>
                <li><Link href="#" className="hover:text-[#0b335c] transition-colors">How It Works</Link></li>
                <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Pricing Plans</Link></li>
                <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Mobile App</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Company</h4>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-400">
                <li><Link href="/about" className="hover:text-[#0b335c] transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Newsroom</Link></li>
                <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Compliance</h4>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-400">
                <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-[#0b335c] transition-colors">HIPAA Compliance</Link></li>
                <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Accessibility</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200/50 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-semibold text-slate-400 gap-4">
            <p>&copy; {new Date().getFullYear()} CareHub Healthcare. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-[#0b335c] transition-colors"><Globe className="h-4.5 w-4.5" /></Link>
              <Link href="#" className="hover:text-[#0b335c] transition-colors"><FileText className="h-4.5 w-4.5" /></Link>
              <Link href="#" className="hover:text-[#0b335c] transition-colors"><Smartphone className="h-4.5 w-4.5" /></Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
