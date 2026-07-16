import Link from "next/link";
import Image from "next/image";
import { 
  Search, 
  ArrowRight, 
  HeartPulse, 
  Activity, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Lock, 
  ThumbsUp, 
  Stethoscope, 
  Brain, 
  Smile, 
  Scan, 
  ShieldAlert, 
  Globe, 
  CalendarCheck,
  ChevronDown
} from "lucide-react";

export default function ServicesPage() {
  const departments = [
    {
      title: "Cardiology",
      badge: "Heart Health",
      desc: "Comprehensive cardiovascular care using advanced non-invasive imaging and interventional procedures to manage complex heart conditions.",
      image: "/cardiology_dept.png",
      icon: HeartPulse,
      badgeColor: "bg-[#fde8ec] text-[#e0537a]"
    },
    {
      title: "Neurology",
      badge: "Brain & Nerves",
      desc: "Expert diagnosis and treatment for disorders of the nervous system, combining compassionate care with cutting-edge neuro-imaging.",
      image: "/services_hero.png", // Fallback to hero
      icon: Brain,
      badgeColor: "bg-[#e3f2fd] text-[#2f8fe5]"
    },
    {
      title: "Orthopedics",
      badge: "Musculoskeletal",
      desc: "Restoring movement and quality of life through advanced joint replacements, sports medicine, and rehabilitative surgery.",
      image: "/doctors_group.png", // Fallback to doctors group
      icon: Activity,
      badgeColor: "bg-[#fff3e0] text-[#f97316]"
    },
    {
      title: "Pediatrics",
      badge: "Children's Health",
      desc: "Specialized care for infants, children, and adolescents in a warm, family-centered environment that prioritizes comfort and safety.",
      image: "/explore_services.png", // Fallback to doctor with tablet
      icon: Smile,
      badgeColor: "bg-[#f3e8fd] text-[#8b5cf6]"
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50/50 font-sans flex flex-col justify-between">


      {/* Hero Banner Section */}
      <section className="relative h-[380px] bg-[#0b335c] overflow-hidden flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 opacity-40">
          <Image 
            src="/services_hero.png" 
            alt="Clinic Interior" 
            fill 
            className="object-cover"
            priority
          />
          {/* Blue gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b335c] via-[#0b335c]/95 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10 text-white space-y-5 w-full">
          <span className="inline-block bg-[#3bf0df] text-[#0b335c] text-[10px] font-extrabold tracking-wider px-3.5 py-1 rounded-full uppercase">
            Excellence in Healthcare
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight max-w-2xl leading-tight">
            World-Class Care Tailored to You.
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            Access our comprehensive network of specialized medical departments, equipped with the latest diagnostic technology and led by industry-leading specialists.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link 
              href="/patient/doctors" 
              className="bg-[#3bf0df] hover:bg-[#2ed2c2] text-[#0b335c] font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-md transition-all flex items-center gap-2"
            >
              <span>Book a Consultant</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </Link>
            <a 
              href="#departments" 
              className="border border-white/60 hover:bg-white/10 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full transition-all"
            >
              View All Departments
            </a>
          </div>
        </div>
      </section>

      {/* Specialized Medical Departments */}
      <section id="departments" className="max-w-7xl mx-auto px-6 lg:px-8 py-16 space-y-12 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 pb-6">
          <div className="space-y-2">
            <h2 className="font-serif font-bold text-3xl text-[#0b335c]">Specialized Medical Departments</h2>
            <p className="text-slate-500 text-sm max-w-2xl">
              Our multidisciplinary approach ensures that every patient receives highly specific, expert-led treatment across various fields of modern medicine.
            </p>
          </div>
          
          <button className="flex items-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 transition-colors shadow-sm">
            <span>Filter by Department</span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => {
            const IconComponent = dept.icon;
            return (
              <div key={dept.title} className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
                <div className="relative h-48 w-full">
                  <Image 
                    src={dept.image} 
                    alt={dept.title} 
                    fill 
                    className="object-cover group-hover:scale-101 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`inline-block text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase shadow-sm ${dept.badgeColor}`}>
                      {dept.badge}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <IconComponent className="h-5 w-5 text-[#0b335c]" />
                      <h3 className="font-serif font-bold text-lg text-[#0b335c]">{dept.title}</h3>
                    </div>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                      {dept.desc}
                    </p>
                  </div>
                  
                  <Link 
                    href="/patient/doctors" 
                    className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#0b335c] font-bold text-xs sm:text-sm transition-colors group/link cursor-pointer pt-2"
                  >
                    <span>Explore Specialists</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            );
          })}

          {/* Large diagnostic imaging card spans 2 cols */}
          <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 md:col-span-2 flex flex-col md:flex-row justify-between group">
            <div className="p-6 md:p-8 space-y-4 flex-1 flex flex-col justify-between md:max-w-[55%]">
              <div className="space-y-4">
                <span className="inline-block bg-[#e3f2fd] text-[#2f8fe5] text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase shadow-sm">
                  Advanced Technology
                </span>
                <div className="flex items-center gap-2.5">
                  <Scan className="h-5.5 w-5.5 text-[#0b335c]" />
                  <h3 className="font-serif font-bold text-xl text-[#0b335c]">Diagnostic Imaging</h3>
                </div>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  High-definition MRI, CT scans, and 3D imaging services providing clinicians with the clarity needed for accurate diagnosis and treatment planning.
                </p>
              </div>

              <Link 
                href="/patient/records" 
                className="bg-[#0b335c] hover:bg-[#061e38] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full transition-colors cursor-pointer w-fit shadow-sm mt-4 flex items-center gap-2"
              >
                <CalendarCheck className="h-4 w-4" />
                <span>Schedule a Scan</span>
              </Link>
            </div>

            <div className="relative h-48 md:h-full w-full md:w-[45%] shrink-0">
              <Image 
                src="/explore_services.png" 
                alt="Diagnostic Imaging Room" 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent hidden md:block" />
            </div>
          </div>
        </div>
      </section>

      {/* Built on Trust and Innovation */}
      <section className="bg-slate-100/50 py-16 w-full border-t border-slate-200/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Stats columns */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-3">
              <h2 className="font-serif font-bold text-3xl text-[#0b335c] leading-tight">
                Built on Trust and Innovation
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                We combine clinical expertise with the latest medical advancements to provide an unparalleled healthcare experience. Our metrics reflect our commitment to your health.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-2">
              <div className="space-y-1">
                <p className="text-3xl font-serif font-bold text-[#0b335c]">500+</p>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Certified Specialists</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-serif font-bold text-[#0b335c]">98%</p>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Patient Satisfaction</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-serif font-bold text-[#0b335c]">15+</p>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Global Accreditations</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-serif font-bold text-[#0b335c]">24/7</p>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Emergency Support</p>
              </div>
            </div>
          </div>

          {/* Group of doctors image */}
          <div className="lg:col-span-6 relative h-[360px] rounded-3xl overflow-hidden shadow-md">
            <Image 
              src="/doctors_group.png" 
              alt="Medical Team" 
              fill 
              className="object-cover"
            />
            {/* Overlay card */}
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md border border-slate-100 p-5 rounded-2xl shadow-lg flex items-center gap-3.5 max-w-sm">
              <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
                <ShieldCheck className="h-5.5 w-5.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0b335c] uppercase tracking-wider mb-0.5">Gold Standard Care</h4>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">
                  Recognized as a leading healthcare provider for five consecutive years.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prioritize Your Health CTA Banner */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12 w-full">
        <div className="bg-[#0b335c] rounded-3xl p-12 text-center text-white space-y-6 relative overflow-hidden shadow-lg">
          {/* Subtle watermark background icon */}
          <Stethoscope className="absolute -left-12 -bottom-12 h-64 w-64 text-white/5 opacity-5 pointer-events-none" />
          <HeartPulse className="absolute -right-12 -top-12 h-64 w-64 text-white/5 opacity-5 pointer-events-none" />

          <div className="space-y-3 relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-serif font-bold">Ready to prioritize your health?</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Our specialists are here to guide you through every step of your wellness journey. Book your first appointment today.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10 pt-2">
            <Link 
              href="/patient/doctors" 
              className="bg-[#3bf0df] hover:bg-[#2ed2c2] text-[#0b335c] font-bold text-xs sm:text-sm px-7 py-3.5 rounded-full shadow-md transition-colors"
            >
              Find a Doctor
            </Link>
            <Link 
              href="#" 
              className="border border-white/40 hover:bg-white/10 text-white font-bold text-xs sm:text-sm px-7 py-3.5 rounded-full transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 w-full">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs text-slate-500">
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#0b335c]">CareHub</h4>
            <p className="leading-relaxed">
              Leading the future of personalized healthcare through innovation, empathy, and clinical excellence.
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-800">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/patient/doctors" className="hover:text-[#0b335c] transition-colors">Find a Doctor</Link></li>
              <li><Link href="/patient/services" className="hover:text-[#0b335c] transition-colors">Medical Services</Link></li>
              <li><Link href="/patient/dashboard" className="hover:text-[#0b335c] transition-colors">Patient Resources</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-slate-800">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-slate-800">Newsletter</h4>
            <p className="leading-relaxed">Stay updated with health news and tips.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs text-slate-600 placeholder-slate-400 focus:outline-none focus:border-slate-300 w-full"
              />
              <button className="bg-[#0b335c] hover:bg-[#061e38] text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shrink-0">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 border-t border-slate-100 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400 gap-4">
          <p>&copy; {new Date().getFullYear()} CareHub Healthcare. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Delaware Beach, USA</span>
            <span>Contact: +1 (800) MED-PREM</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
