import Link from "next/link";
import Image from "next/image";
import { 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Heart, 
  Clock, 
  Lock, 
  Globe, 
  Award,
  Briefcase,
  Zap,
  Eye,
  Activity,
  FileText,
  UserRound,
  Shield,
  Smartphone,
  CheckCircle
} from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-slate-50/50 overflow-hidden font-sans">
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
            <Link href="/about" className="hover:text-[#0b335c] transition-colors">About Us</Link>
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
              World-Class Healthcare Platform
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-[#0b335c] sm:text-5xl lg:text-6xl leading-[1.1]">
              Precision Healthcare<br />
              <span className="text-[#0ea5e9]">Human–Centered Care.</span>
            </h1>

            <p className="text-base sm:text-lg leading-relaxed text-slate-500">
              Experience a seamless medical journey where technology meets empathy. Whether you're seeking top-tier care or providing it, CareHub bridges the gap with clinical excellence.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
              <Link 
                href="/signup" 
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#005c53] hover:bg-[#004d45] px-6 py-3.5 text-sm font-bold text-white transition-all shadow-sm w-full sm:w-auto"
              >
                <UserRound className="h-4.5 w-4.5" />
                For Patients
              </Link>
              <Link 
                href="/signup?role=doctor" 
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-6 py-3.5 text-sm font-bold text-slate-600 transition-all w-full sm:w-auto"
              >
                <Briefcase className="h-4.5 w-4.5 text-slate-400" />
                For Providers
              </Link>
            </div>
          </div>

          {/* Hero Right Image & Float Card */}
          <div className="lg:col-span-5 relative w-full flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[460px] aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
              <Image
                src="/doctor_patient_hero.png"
                alt="Doctor and Patient looking at tablet"
                fill
                priority
                className="object-cover object-center"
              />

              {/* Floating Card */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-100 p-4 shadow-xl">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                  <Check className="h-5 w-5 font-bold" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-slate-900 leading-tight">99.8% Satisfaction</p>
                  <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Trusted by over 10,000+ Premium Members</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges / Certifications Banner */}
      <section className="border-t border-b border-slate-200/50 bg-slate-50/80 py-8">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-items-center text-center">
            <div className="flex items-center gap-2.5 text-slate-500 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="h-5 w-5 text-slate-400" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-500 font-bold text-xs uppercase tracking-wider">
              <Lock className="h-5 w-5 text-slate-400" />
              <span>GDPR Secured</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-500 font-bold text-xs uppercase tracking-wider">
              <Award className="h-5 w-5 text-slate-400" />
              <span>FDA Clearance</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-500 font-bold text-xs uppercase tracking-wider">
              <Shield className="h-5 w-5 text-slate-400" />
              <span>ISO 27001 Certified</span>
            </div>
          </div>
        </div>
      </section>

      {/* Choose Your Experience Section */}
      <section className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-8 lg:px-12 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#0b335c] sm:text-4xl">
            Choose Your CareHub Experience
          </h2>
          <p className="text-slate-500 font-medium text-sm sm:text-base leading-relaxed">
            Tailored ecosystems designed for clinical efficiency and personal health excellence.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
          {/* Card 1: Patient */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-8 sm:p-10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Icon Container */}
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-[#005c53]">
                <Heart className="h-6 w-6" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-[#0b335c]">I am a Patient</h3>
              </div>

              {/* Bullet points */}
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm font-semibold text-slate-500 leading-relaxed">
                  <CheckCircle className="h-5 w-5 text-[#005c53] shrink-0 mt-0.5" />
                  <span>Access to the top 5% of specialized physicians nationwide.</span>
                </li>
                <li className="flex items-start gap-3 text-sm font-semibold text-slate-500 leading-relaxed">
                  <CheckCircle className="h-5 w-5 text-[#005c53] shrink-0 mt-0.5" />
                  <span>24/7 dedicated concierge medical support via secure chat.</span>
                </li>
                <li className="flex items-start gap-3 text-sm font-semibold text-slate-500 leading-relaxed">
                  <CheckCircle className="h-5 w-5 text-[#005c53] shrink-0 mt-0.5" />
                  <span>Unified health records with biometric data integration.</span>
                </li>
                <li className="flex items-start gap-3 text-sm font-semibold text-slate-500 leading-relaxed">
                  <CheckCircle className="h-5 w-5 text-[#005c53] shrink-0 mt-0.5" />
                  <span>Priority scheduling for in-person and telehealth visits.</span>
                </li>
              </ul>
            </div>

            <Link 
              href="/signup" 
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#005c53] hover:bg-[#004d45] px-6 py-4 text-sm font-bold text-white transition-all w-full text-center group"
            >
              <span>Start Your Journey</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Card 2: Healthcare Provider */}
          <div className="bg-[#0b335c] rounded-3xl p-8 sm:p-10 shadow-lg text-white flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Icon Container */}
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-sky-400">
                <Briefcase className="h-6 w-6" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold">I am a Healthcare Provider</h3>
              </div>

              {/* Bullet points */}
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm font-semibold text-slate-200/80 leading-relaxed">
                  <CheckCircle className="h-5 w-5 text-sky-400 shrink-0 mt-0.5" />
                  <span>Advanced AI-driven diagnostic assistance and charting.</span>
                </li>
                <li className="flex items-start gap-3 text-sm font-semibold text-slate-200/80 leading-relaxed">
                  <CheckCircle className="h-5 w-5 text-sky-400 shrink-0 mt-0.5" />
                  <span>Streamlined reimbursement with 98% claim acceptance rate.</span>
                </li>
                <li className="flex items-start gap-3 text-sm font-semibold text-slate-200/80 leading-relaxed">
                  <CheckCircle className="h-5 w-5 text-sky-400 shrink-0 mt-0.5" />
                  <span>Seamless multi-disciplinary collaboration tools.</span>
                </li>
                <li className="flex items-start gap-3 text-sm font-semibold text-slate-200/80 leading-relaxed">
                  <CheckCircle className="h-5 w-5 text-sky-400 shrink-0 mt-0.5" />
                  <span>Customizable practice management and patient portal.</span>
                </li>
              </ul>
            </div>

            <Link 
              href="/signup?role=doctor" 
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-slate-100 px-6 py-4 text-sm font-bold text-[#0b335c] transition-all w-full text-center group"
            >
              <span>Join the Network</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Designed for the Modern Medical Era */}
      <section className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Grid (4 Cards) */}
          <div className="lg:col-span-6 grid gap-6 sm:grid-cols-2">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4 hover:border-sky-200 transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <Clock className="h-5 w-5" />
              </div>
              <h4 className="text-base font-extrabold text-slate-900">Instant</h4>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">Average 5 min wait for telehealth sessions.</p>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4 hover:border-sky-200 transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="text-base font-extrabold text-slate-900">Secure</h4>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">Enterprise-grade security for all data.</p>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4 hover:border-sky-200 transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <Eye className="h-5 w-5" />
              </div>
              <h4 className="text-base font-extrabold text-slate-900">Transparent</h4>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">No hidden fees or complex insurance billing.</p>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4 hover:border-sky-200 transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <Globe className="h-5 w-5" />
              </div>
              <h4 className="text-base font-extrabold text-slate-900">Global</h4>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">Network of international medical experts.</p>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-6 space-y-8 flex flex-col justify-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-extrabold tracking-tight text-[#0b335c] sm:text-4xl">
                Designed for the Modern Medical Era
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-slate-500">
                Our platform is built on the pillars of speed, security, and transparency. We eliminate the administrative burden for doctors and the complexity of navigation for patients, allowing for what matters most: health outcomes.
              </p>
            </div>

            {/* Feature Horizontal Rows */}
            <div className="space-y-4">
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:border-sky-100 transition-all duration-200 hover:translate-x-1">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0ea5e9]/10 text-[#0ea5e9]">
                  <Activity className="h-5 w-5" />
                </div>
                <span className="text-sm font-extrabold text-slate-800">AI-Powered Health Insights & Symptom Analysis</span>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:border-sky-100 transition-all duration-200 hover:translate-x-1">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0ea5e9]/10 text-[#0ea5e9]">
                  <Zap className="h-5 w-5" />
                </div>
                <span className="text-sm font-extrabold text-slate-800">Real-time EMR Synchronization Across Institutions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
        <div className="bg-[#0b335c] rounded-[2rem] px-8 py-16 sm:p-16 lg:p-20 text-center text-white space-y-8 relative overflow-hidden shadow-xl">
          {/* Background Decorative Blob for CTA */}
          <div className="absolute top-[-50%] left-[-20%] w-[60%] h-[120%] rounded-full bg-white/5 blur-[80px] pointer-events-none" />
          <div className="absolute bottom-[-50%] right-[-20%] w-[60%] h-[120%] rounded-full bg-sky-500/10 blur-[85px] pointer-events-none" />

          <div className="space-y-4 max-w-2xl mx-auto relative z-10">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
              Ready to Experience Premium Care?
            </h2>
            <p className="text-sm sm:text-base text-slate-200/80 leading-relaxed font-semibold">
              Join thousands of members and providers who have chosen a better way to manage healthcare.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 relative z-10 max-w-md mx-auto">
            <Link 
              href="/signup" 
              className="rounded-xl bg-[#005c53] hover:bg-[#004d45] px-8 py-4 text-sm font-bold text-white transition-all w-full sm:w-auto shadow-md"
            >
              Join as Patient
            </Link>
            <Link 
              href="/signup?role=doctor" 
              className="rounded-xl border border-white/20 hover:bg-white/10 px-8 py-4 text-sm font-bold text-white transition-all w-full sm:w-auto"
            >
              Join as Provider
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-100/60 border-t border-slate-200/40 mt-16 pt-16 pb-8">
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
                <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Find a Doctor</Link></li>
                <li><Link href="#" className="hover:text-[#0b335c] transition-colors">How It Works</Link></li>
                <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Pricing Plans</Link></li>
                <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Mobile App</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Company</h4>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-400">
                <li><Link href="#" className="hover:text-[#0b335c] transition-colors">About Us</Link></li>
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
