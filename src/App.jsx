import React, { useState } from 'react';
import { 
  Check, ChevronDown, ChevronUp, ArrowRight, 
  ShieldCheck, Briefcase, Smartphone, Play, Zap, Users, 
  Clock, BarChart3, Globe, Star, Crown, Quote, 
  UserCheck, Calendar, CheckCircle2, TrendingUp, Award, Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';

const App = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "How long does it take to get started?",
      answer: "Most teams are up and running within 24 hours. You can import your current staff list via CSV and start scheduling immediately."
    },
    {
      question: "Does it sync with Google Calendar?",
      answer: "Yes! We offer 2-way sync. Shifts created in CrewControl appear in Google Calendar, and personal events can block off availability automatically."
    },
    {
      question: "Is there a mobile app for employees?",
      answer: "Absolutely. We have a dedicated app for iOS and Android where staff can check shifts, swap times, and request time off."
    },
    {
      question: "What happens if I cancel my subscription?",
      answer: "No contracts, no lock-ins. If you cancel, you keep access until the end of your billing cycle. We'll keep your data for 30 days in case you change your mind."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans text-white bg-slate-950 selection:bg-purple-500/30 overflow-hidden">
      
      {/* --- HERO SECTION --- */}
      <div className="relative pb-32 lg:pb-48">
        
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
           {/* Top Glow */}
           <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen"></div>
           <div className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px] mix-blend-screen"></div>
           
           {/* Grid Floor */}
           <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </div>

        <section className="pt-32 px-4 text-center relative z-10 max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-purple-300 text-sm font-semibold mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
               </span>
               v1.0 is live: AI Auto-Scheduling
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-tight drop-shadow-2xl">
              Your team,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 animate-gradient">in sync.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              The operating system for modern workforce management. Eliminate scheduling conflicts and payroll errors with a single source of truth.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link to="/pricing">
                  <button className="group relative px-10 py-5 bg-white text-slate-950 rounded-full text-lg font-bold hover:bg-purple-50 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:-translate-y-1 active:scale-95 cursor-pointer w-full sm:w-auto">
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Start Free Trial <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                      </span>
                  </button>
                </Link>
                <button className="px-10 py-5 rounded-full text-lg font-bold text-white border border-white/10 bg-white/5 hover:bg-white/10 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 backdrop-blur-md group cursor-pointer w-full sm:w-auto">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-purple-500 transition-colors shrink-0">
                      <Play size={14} fill="currentColor" className="ml-0.5"/>
                    </div>
                    Watch Demo
                </button>
            </div>
        </section>
      </div>

      {/* --- FLOATING DASHBOARD --- */}
      <div className="relative z-20 -mt-32 md:-mt-48 px-4 mb-32 group perspective-1000">
         <div className="max-w-6xl mx-auto bg-slate-900 rounded-3xl shadow-2xl shadow-purple-900/50 border border-white/10 overflow-hidden transform group-hover:rotate-x-2 transition-transform duration-700 ease-out relative">
            
            {/* Reflection Glare */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/5 to-transparent pointer-events-none z-20"></div>

            {/* Browser Header */}
            <div className="bg-slate-950/50 border-b border-white/5 px-6 py-4 flex items-center justify-between backdrop-blur-md">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                </div>
                <div className="h-6 w-64 bg-white/5 rounded-full border border-white/5 mx-auto flex items-center justify-center text-[10px] font-mono text-slate-500">
                  app.crewcontrol.io/dashboard
                </div>
            </div>

            {/* Dashboard UI Mockup */}
            <div className="p-8 bg-[#0B0F19] grid grid-cols-1 md:grid-cols-4 gap-8 min-h-[500px] relative">
               {/* Sidebar Mock */}
               <div className="hidden md:flex flex-col gap-4 border-r border-white/5 pr-6">
                  <div className="h-10 w-full bg-purple-500/20 rounded-lg border border-purple-500/30"></div>
                  <div className="h-10 w-3/4 bg-white/5 rounded-lg"></div>
                  <div className="h-10 w-4/5 bg-white/5 rounded-lg"></div>
                  <div className="mt-auto h-32 w-full bg-gradient-to-b from-white/5 to-transparent rounded-xl border border-white/5"></div>
               </div>

               {/* Main Content */}
               <div className="col-span-1 md:col-span-3 grid grid-cols-2 gap-6">
                  {/* Stat Cards */}
                  <div className="col-span-1 h-32 bg-slate-900 rounded-2xl border border-white/5 p-5 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-xl"></div>
                     <div className="h-8 w-8 bg-purple-500/20 rounded-lg mb-4"></div>
                     <div className="h-4 w-20 bg-white/10 rounded mb-2"></div>
                     <div className="h-8 w-32 bg-white/20 rounded"></div>
                  </div>
                  <div className="col-span-1 h-32 bg-slate-900 rounded-2xl border border-white/5 p-5 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl"></div>
                     <div className="h-8 w-8 bg-emerald-500/20 rounded-lg mb-4"></div>
                     <div className="h-4 w-20 bg-white/10 rounded mb-2"></div>
                     <div className="h-8 w-32 bg-white/20 rounded"></div>
                  </div>

                  {/* Big Chart Area */}
                  <div className="col-span-2 h-72 bg-slate-900 rounded-2xl border border-white/5 p-6 relative flex items-center justify-center">
                     <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
                     <div className="text-slate-600 font-mono text-sm tracking-widest">[ INTERACTIVE SCHEDULE GRID ]</div>
                     
                     {/* Decorative Lines */}
                     <div className="absolute bottom-10 left-10 right-10 h-32 flex items-end justify-between gap-2 opacity-30">
                        {[40, 70, 45, 90, 60, 80, 50, 70, 95, 60].map((h, i) => (
                          <div key={i} style={{height: `${h}%`}} className="w-full bg-purple-500 rounded-t-sm"></div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* --- LOGO STRIP --- */}
      <div className="max-w-7xl mx-auto px-4 text-center mb-32">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-10">Powering the world's best teams</p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700 cursor-default">
            {/* Logos using text for demo */}
            <h3 className="text-2xl font-black text-white flex items-center gap-2"><Globe size={24}/> ATLAS</h3>
            <h3 className="text-2xl font-black text-white flex items-center gap-2"><Zap size={24}/> BOLT</h3>
            <h3 className="text-2xl font-black text-white flex items-center gap-2"><ShieldCheck size={24}/> SECURE</h3>
            <h3 className="text-2xl font-black text-white flex items-center gap-2"><Star size={24}/> NORTH</h3>
        </div>
      </div>

      <main className="flex-grow">
        
        {/* --- BENTO GRID FEATURES --- */}
        <section id="features" className="py-24 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
               <h2 className="text-4xl md:text-5xl font-black mb-6">Everything you need to <span className="text-purple-400">run operations.</span></h2>
               <p className="text-slate-400 max-w-2xl mx-auto text-lg">A complete suite of tools designed to replace your spreadsheets, WhatsApp groups, and paper timesheets.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-6 h-auto md:h-[800px]">
               
               {/* 1. Manager Card (Large Left) */}
               <div className="col-span-1 md:col-span-2 row-span-2 bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden group hover:border-purple-500/30 hover:-translate-y-1 transition-all duration-500 cursor-pointer">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-purple-600/20 transition-colors"></div>
                  
                  <div className="relative z-10">
                     <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-8 border border-purple-500/30 group-hover:scale-110 transition-transform duration-500">
                        <Briefcase className="text-purple-400" size={28} />
                     </div>
                     <h3 className="text-3xl font-bold mb-4">Smart Scheduling</h3>
                     <p className="text-slate-400 text-lg mb-8 max-w-md">Drag and drop shifts in a beautiful calendar. Check availability instantly and publish schedules to the whole team with a single click.</p>
                     
                     <div className="flex gap-3 mb-10">
                        <div className="px-4 py-2 bg-white/5 rounded-full text-sm font-medium border border-white/5">AI Conflict Detection</div>
                        <div className="px-4 py-2 bg-white/5 rounded-full text-sm font-medium border border-white/5">Auto-Publish</div>
                     </div>
                  </div>

                  {/* Visual Mockup inside card */}
                  <div className="absolute bottom-0 right-0 w-3/4 h-1/2 bg-[#0B0F19] rounded-tl-3xl border-t border-l border-white/10 p-6 shadow-2xl translate-y-10 group-hover:translate-y-6 transition-transform duration-500">
                      <div className="flex gap-4 mb-4">
                         <div className="w-1/3 h-24 bg-purple-500/10 rounded-xl border border-purple-500/20"></div>
                         <div className="w-1/3 h-24 bg-white/5 rounded-xl border border-white/5"></div>
                         <div className="w-1/3 h-24 bg-white/5 rounded-xl border border-white/5"></div>
                      </div>
                      <div className="w-full h-8 bg-purple-600 rounded-lg flex items-center justify-center text-xs font-bold text-white">Publish Schedule</div>
                  </div>
               </div>

               {/* 2. Mobile App Card (Top Right) */}
               <div className="col-span-1 row-span-1 bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-pink-500/30 hover:-translate-y-1 transition-all duration-500 cursor-pointer">
                   <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-pink-500/10 to-transparent"></div>
                   <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-6 border border-pink-500/30 group-hover:scale-110 transition-transform duration-500">
                      <Smartphone className="text-pink-400" size={24} />
                   </div>
                   <h3 className="text-2xl font-bold mb-2">Mobile First</h3>
                   <p className="text-slate-400 text-sm">Employees check shifts, swap times, and clock in from their pockets.</p>
               </div>

               {/* 3. Payroll Card (Bottom Right) */}
               <div className="col-span-1 row-span-1 bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-emerald-500/30 hover:-translate-y-1 transition-all duration-500 cursor-pointer">
                   <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-emerald-500/10 to-transparent"></div>
                   <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6 border border-emerald-500/30 group-hover:scale-110 transition-transform duration-500">
                      <BarChart3 className="text-emerald-400" size={24} />
                   </div>
                   <h3 className="text-2xl font-bold mb-2">Payroll Ready</h3>
                   <p className="text-slate-400 text-sm">Export timesheets directly to Quickbooks, ADP, or Xero in seconds.</p>
               </div>

            </div>
          </div>
        </section>

        {/* --- 3-CARD PRICING TEASER --- */}
        <section id="pricing" className="py-32 relative">
           {/* Slanted Background */}
           <div className="absolute inset-0 bg-white/[0.02] -skew-y-3 transform origin-bottom-right pointer-events-none"></div>
           
           <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="text-center mb-16">
                 <h2 className="text-4xl font-black mb-4">Start small, <span className="text-purple-400">scale infinitely.</span></h2>
                 <p className="text-slate-400">Simple pricing for teams of all sizes.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 items-center">
                  
                  {/* 1. Starter */}
                  <div className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 transition-all duration-500 hover:scale-105 hover:bg-slate-900/90 hover:border-purple-500/30 hover:shadow-[0_0_40px_rgba(168,85,247,0.1)] cursor-pointer">
                      <h3 className="text-lg font-bold text-slate-300 group-hover:text-white transition-colors">Starter</h3>
                      <div className="my-4">
                         <span className="text-4xl font-black text-white">$19<span className="text-2xl">.99</span></span>
                         <span className="text-sm text-slate-500">/mo</span>
                      </div>
                      <p className="text-slate-400 text-sm mb-6">Perfect for small crews getting started.</p>
                      <ul className="space-y-3 mb-8 text-sm text-slate-300 group-hover:text-slate-200">
                         <li className="flex gap-2"><Check size={16} className="text-purple-500"/> Up to 10 employees</li>
                         <li className="flex gap-2"><Check size={16} className="text-purple-500"/> Drag-and-drop scheduling</li>
                         <li className="flex gap-2"><Check size={16} className="text-purple-500"/> Mobile pulse app</li>
                         <li className="flex gap-2"><Check size={16} className="text-purple-500"/> Shift swap requests</li>
                         <li className="flex gap-2"><Check size={16} className="text-purple-500"/> AI conflict detection</li>
                         <li className="flex gap-2"><Check size={16} className="text-purple-500"/> Real-time "Who's In" dashboard</li>
                         <li className="flex gap-2"><Check size={16} className="text-purple-500"/> One-click shift publishing</li>
                         <li className="flex gap-2"><Check size={16} className="text-purple-500"/> Availability calendar</li>
                         <li className="flex gap-2"><Check size={16} className="text-purple-500"/> Time-off requests</li>
                         <li className="flex gap-2"><Check size={16} className="text-purple-500"/> Multiple locations</li>
                         <li className="flex gap-2"><Check size={16} className="text-purple-500"/> Email support</li>
                      </ul>
                      <Link to="/pricing">
                        <button className="w-full py-3 rounded-xl border border-white/10 font-bold hover:bg-white text-white hover:text-slate-900 transition-all cursor-pointer">Get Started</button>
                      </Link>
                  </div>

                  {/* 2. Professional (Featured - Interactive) */}
                  <div className="group relative p-10 rounded-3xl bg-slate-900/90 border border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.2)] transform scale-105 transition-all duration-500 hover:scale-110 hover:shadow-[0_0_80px_rgba(168,85,247,0.4)] hover:border-purple-400 cursor-pointer z-10">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg">
                         Most Popular
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors">Professional</h3>
                      <div className="my-4">
                         <span className="text-5xl font-black text-white">$49<span className="text-3xl">.99</span></span>
                         <span className="text-sm text-slate-400">/mo</span>
                      </div>
                      <p className="text-purple-200 text-sm mb-6">Everything you need to scale operations.</p>
                      <ul className="space-y-3 mb-8 text-sm text-white">
                         <li className="flex gap-2"><Check size={16} className="text-purple-400 group-hover:text-purple-300"/> Up to 50 employees</li>
                         <li className="flex gap-2"><Check size={16} className="text-purple-400 group-hover:text-purple-300"/> Automated shift filling</li>
                         <li className="flex gap-2"><Check size={16} className="text-purple-400 group-hover:text-purple-300"/> In-app messaging</li>
                         <li className="flex gap-2"><Check size={16} className="text-purple-400 group-hover:text-purple-300"/> Payroll exports (QuickBooks, Xero, ADP)</li>
                         <li className="flex gap-2"><Check size={16} className="text-purple-400 group-hover:text-purple-300"/> Absence & leave management</li>
                         <li className="flex gap-2"><Check size={16} className="text-purple-400 group-hover:text-purple-300"/> Workforce analytics</li>
                         <li className="flex gap-2"><Check size={16} className="text-purple-400 group-hover:text-purple-300"/> HR role access</li>
                         <li className="flex gap-2"><Check size={16} className="text-purple-400 group-hover:text-purple-300"/> Priority support</li>
                      </ul>
                      <Link to="/pricing">
                        <button className="w-full py-4 rounded-xl bg-white text-slate-900 font-bold hover:bg-purple-50 transition-all shadow-lg group-hover:shadow-purple-500/20 cursor-pointer">Try Free 14 Days</button>
                      </Link>
                  </div>

                  {/* 3. Enterprise */}
                  <div className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 transition-all duration-500 hover:scale-105 hover:bg-slate-900/90 hover:border-purple-500/30 hover:shadow-[0_0_40px_rgba(168,85,247,0.1)] cursor-pointer">
                      <h3 className="text-lg font-bold text-slate-300 group-hover:text-white transition-colors">Enterprise</h3>
                      <div className="my-4">
                         <span className="text-4xl font-black text-white">Custom</span>
                      </div>
                      <p className="text-slate-400 text-sm mb-6">For multi-location organizations.</p>
                      <ul className="space-y-3 mb-8 text-sm text-slate-300 group-hover:text-slate-200">
                         <li className="flex gap-2"><Check size={16} className="text-purple-500"/> Unlimited employees</li>
                         <li className="flex gap-2"><Check size={16} className="text-purple-500"/> Everything in Professional</li>
                         <li className="flex gap-2"><Check size={16} className="text-purple-500"/> Digital document vault</li>
                         <li className="flex gap-2"><Check size={16} className="text-purple-500"/> Compliance audit trail</li>
                         <li className="flex gap-2"><Check size={16} className="text-purple-500"/> Advanced workforce analytics</li>
                         <li className="flex gap-2"><Check size={16} className="text-purple-500"/> REST API access</li>
                         <li className="flex gap-2"><Check size={16} className="text-purple-500"/> Custom integrations</li>
                         <li className="flex gap-2"><Check size={16} className="text-purple-500"/> Dedicated account manager</li>
                         <li className="flex gap-2"><Check size={16} className="text-purple-500"/> 99.9% uptime SLA</li>
                      </ul>
                      <Link to="/contact">
                        <button className="w-full py-3 rounded-xl border border-white/10 font-bold hover:bg-white text-white hover:text-slate-900 transition-all cursor-pointer">Contact Sales</button>
                      </Link>
                  </div>

              </div>
           </div>
        </section>

        {/* --- TESTIMONIALS SECTION --- */}
        <section className="py-32 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Trusted by <span className="text-purple-400">operations leaders</span>
              </h2>
              <p className="text-slate-400 text-lg">See what teams like yours are saying</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="group relative bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:border-purple-500/30 hover:shadow-[0_0_40px_rgba(168,85,247,0.1)] transition-all duration-500 hover:-translate-y-2">
                <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-30 transition-opacity">
                  <Quote className="text-purple-400" size={48} />
                </div>
                
                <div className="relative z-10">
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="fill-yellow-400 text-yellow-400" size={20} />
                    ))}
                  </div>
                  
                  <p className="text-slate-300 text-lg leading-relaxed mb-6">
                    "CrewControl cut our scheduling time from 8 hours to 15 minutes. No more Excel disasters or forgotten shifts. Our team actually looks forward to checking their schedules now."
                  </p>
                  
                  <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                      SM
                    </div>
                    <div>
                      <div className="font-bold text-white">Sarah Mitchell</div>
                      <div className="text-sm text-slate-400">Operations Manager, Brew & Bean Café</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="group relative bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:border-pink-500/30 hover:shadow-[0_0_40px_rgba(236,72,153,0.1)] transition-all duration-500 hover:-translate-y-2">
                <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-30 transition-opacity">
                  <Quote className="text-pink-400" size={48} />
                </div>
                
                <div className="relative z-10">
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="fill-yellow-400 text-yellow-400" size={20} />
                    ))}
                  </div>
                  
                  <p className="text-slate-300 text-lg leading-relaxed mb-6">
                    "We manage 3 construction sites with 45+ workers. The location-based scheduling is a game-changer. No more confusion about who's working where. Our no-show rate dropped by 60%."
                  </p>
                  
                  <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold text-lg">
                      JC
                    </div>
                    <div>
                      <div className="font-bold text-white">James Chen</div>
                      <div className="text-sm text-slate-400">Site Supervisor, Metro Construction</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="group relative bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:border-emerald-500/30 hover:shadow-[0_0_40px_rgba(16,185,129,0.1)] transition-all duration-500 hover:-translate-y-2">
                <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-30 transition-opacity">
                  <Quote className="text-emerald-400" size={48} />
                </div>
                
                <div className="relative z-10">
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="fill-yellow-400 text-yellow-400" size={20} />
                    ))}
                  </div>
                  
                  <p className="text-slate-300 text-lg leading-relaxed mb-6">
                    "The mobile app makes everything so easy. Employees can swap shifts themselves, request time off, and get notifications. I barely get scheduling questions anymore. It's like having a 24/7 assistant."
                  </p>
                  
                  <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                      MR
                    </div>
                    <div>
                      <div className="font-bold text-white">Maria Rodriguez</div>
                      <div className="text-sm text-slate-400">Restaurant Manager, The Garden Bistro</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- HOW IT WORKS SECTION --- */}
        <section className="py-32 relative">
          {/* Diagonal Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(168,85,247,0.03)_0%,transparent_50%)] pointer-events-none"></div>
          
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Get started in <span className="text-purple-400">3 simple steps</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                From signup to your first schedule, we've made it effortless
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* Step 1 */}
              <div className="relative group">
                {/* Connecting Line (Hidden on mobile) */}
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-purple-500/50 to-transparent z-0 translate-x-8"></div>
                
                <div className="relative bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:border-purple-500/30 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] transition-all duration-500 hover:-translate-y-2">
                  {/* Step Number Badge */}
                  <div className="absolute -top-4 left-8 w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg z-10">
                    1
                  </div>
                  
                  {/* Icon */}
                  <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 mt-4 border border-purple-500/30 group-hover:scale-110 transition-transform duration-500">
                    <UserCheck className="text-purple-400" size={32} />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-white">Sign Up & Set Up</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Create your account and tell us about your business. Choose remote, on-site, or hybrid work. Add your locations if needed.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative group">
                {/* Connecting Line */}
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-purple-500/50 to-transparent z-0 translate-x-8"></div>
                
                <div className="relative bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:border-pink-500/30 hover:shadow-[0_0_40px_rgba(236,72,153,0.15)] transition-all duration-500 hover:-translate-y-2">
                  {/* Step Number Badge */}
                  <div className="absolute -top-4 left-8 w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg z-10">
                    2
                  </div>
                  
                  {/* Icon */}
                  <div className="w-16 h-16 bg-pink-500/20 rounded-2xl flex items-center justify-center mb-6 mt-4 border border-pink-500/30 group-hover:scale-110 transition-transform duration-500">
                    <Users className="text-pink-400" size={32} />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-white">Invite Your Team</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Send email invitations to your employees. They'll receive a link to join and can set up their profiles in minutes.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative group">
                <div className="relative bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:border-emerald-500/30 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] transition-all duration-500 hover:-translate-y-2">
                  {/* Step Number Badge */}
                  <div className="absolute -top-4 left-8 w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg z-10">
                    3
                  </div>
                  
                  {/* Icon */}
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 mt-4 border border-emerald-500/30 group-hover:scale-110 transition-transform duration-500">
                    <Calendar className="text-emerald-400" size={32} />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-white">Start Scheduling</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Create your first schedule with drag-and-drop. Auto-detect conflicts, publish instantly, and let your team sync to mobile.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center mt-12">
              <Link to="/pricing">
                <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full font-bold hover:from-purple-600 hover:to-indigo-600 transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-1 active:scale-95 cursor-pointer">
                  Get Started Free →
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* --- TRUST INDICATORS SECTION --- */}
        <section className="py-24 relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-indigo-900/10 to-purple-900/10 pointer-events-none"></div>
          
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Built for <span className="text-purple-400">enterprise security</span>
              </h2>
              <p className="text-slate-400 text-lg">Your data is protected with industry-leading standards</p>
            </div>

            {/* Trust Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-purple-500/30 hover:bg-white/[0.08] transition-all duration-300">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                  <CheckCircle2 className="text-green-400" size={24} />
                </div>
                <div className="text-3xl font-black text-white mb-2">99.9%</div>
                <div className="text-sm text-slate-400">Uptime SLA</div>
              </div>

              <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-purple-500/30 hover:bg-white/[0.08] transition-all duration-300">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                  <Lock className="text-blue-400" size={24} />
                </div>
                <div className="text-3xl font-black text-white mb-2">SOC 2</div>
                <div className="text-sm text-slate-400">Certified</div>
              </div>

              <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-purple-500/30 hover:bg-white/[0.08] transition-all duration-300">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
                  <ShieldCheck className="text-purple-400" size={24} />
                </div>
                <div className="text-3xl font-black text-white mb-2">GDPR</div>
                <div className="text-sm text-slate-400">Compliant</div>
              </div>

              <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-purple-500/30 hover:bg-white/[0.08] transition-all duration-300">
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-500/30">
                  <Award className="text-orange-400" size={24} />
                </div>
                <div className="text-3xl font-black text-white mb-2">ISO 27001</div>
                <div className="text-sm text-slate-400">Ready</div>
              </div>
            </div>

            {/* Additional Trust Points */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-4 p-6 bg-slate-900/30 rounded-2xl border border-white/5">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-purple-500/30">
                  <TrendingUp className="text-purple-400" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">500+ Teams</h4>
                  <p className="text-sm text-slate-400">Trust CrewControl for their operations</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-slate-900/30 rounded-2xl border border-white/5">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-blue-500/30">
                  <Globe className="text-blue-400" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">15+ Countries</h4>
                  <p className="text-sm text-slate-400">Serving teams worldwide</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-slate-900/30 rounded-2xl border border-white/5">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-emerald-500/30">
                  <Clock className="text-emerald-400" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">24/7 Support</h4>
                  <p className="text-sm text-slate-400">Always here when you need us</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- FAQ SECTION --- */}
        <section id="faq" className="py-24 relative">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-16">Common Questions</h2>
            
            <div className="space-y-4">
              {faqData.map((item, index) => (
                <div key={index} className={`bg-white/5 border rounded-2xl overflow-hidden transition-all duration-300 ${
                  openFaqIndex === index ? 'border-purple-500 bg-white/10 shadow-[0_0_30px_rgba(168,85,247,0.1)]' : 'border-white/5 hover:border-white/20'
                }`}>
                  <button 
                    onClick={() => toggleFaq(index)}
                    className="w-full flex justify-between items-center p-6 text-left focus:outline-none cursor-pointer"
                  >
                    <span className={`font-bold text-lg transition ${openFaqIndex === index ? 'text-purple-300' : 'text-slate-200'}`}>{item.question}</span>
                    {openFaqIndex === index ? (
                      <div className="bg-purple-500/20 p-1 rounded-full"><ChevronUp className="text-purple-400" size={20} /></div>
                    ) : (
                      <div className="bg-white/5 p-1 rounded-full"><ChevronDown className="text-slate-400" size={20} /></div>
                    )}
                  </button>
                  
                  <div 
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      openFaqIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 pb-6 text-slate-400 text-base leading-relaxed border-t border-white/5 pt-4">
                      {item.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- FINAL CTA --- */}
        <section className="py-32 text-center relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/20 pointer-events-none"></div>
           <div className="relative z-10 max-w-4xl mx-auto px-6">
              <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">
                Ready to regain <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">control?</span>
              </h2>
              <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
                Join 500+ operations teams who switched to CrewControl this month.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link to="/pricing">
                  <button className="px-10 py-5 bg-white text-slate-950 rounded-full text-lg font-bold hover:bg-slate-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] cursor-pointer">
                    Get Started Now
                  </button>
                </Link>
                <button className="px-10 py-5 rounded-full text-lg font-bold text-white border border-white/10 hover:bg-white/5 transition-all cursor-pointer">
                  Contact Sales
                </button>
              </div>
           </div>
        </section>

      </main>
    </div>
  );
};

export default App;
