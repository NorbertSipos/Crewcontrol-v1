import React, { useState } from 'react';
import { 
  Check, ChevronDown, ChevronUp, ArrowRight, 
  ShieldCheck, Briefcase, Smartphone, Play, Zap, Users, 
  Clock, BarChart3, Globe, Star, Crown, Quote, 
  UserCheck, Calendar, CheckCircle2, TrendingUp, Award, Lock, X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSEO } from './hooks/useSEO';
import { StructuredData, generateOrganizationSchema, generateSoftwareApplicationSchema, generateWebPageSchema, generateFAQSchema } from './components/StructuredData';

const App = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [employeeCount, setEmployeeCount] = useState(30);

  // SEO Meta Tags
  useSEO({
    title: 'CrewControl - Workforce Management & Employee Scheduling Software',
    description: 'Streamline your workforce with CrewControl. Drag-and-drop scheduling, time tracking, shift management, and team communication. Perfect for construction, retail, healthcare, and more.',
    keywords: 'workforce management, employee scheduling, shift management, time tracking, team scheduling software, workforce scheduling, employee management system',
    ogImage: 'https://crewcontrol.io/dashboard-screenshot.png',
    canonical: 'https://crewcontrol.io/',
  });

  // Structured Data for Rich Snippets
  const organizationSchema = generateOrganizationSchema();
  const softwareSchema = generateSoftwareApplicationSchema();
  const webpageSchema = generateWebPageSchema({
    name: 'CrewControl - Workforce Management & Employee Scheduling Software',
    description: 'Streamline your workforce with CrewControl. Drag-and-drop scheduling, time tracking, shift management, and team communication.',
    url: 'https://crewcontrol.io/',
    breadcrumbs: [
      { name: 'Home', url: 'https://crewcontrol.io/' },
    ],
  });
  const faqSchema = generateFAQSchema([
    { question: "How long does it take to get started?", answer: "Most teams are up and running within 24 hours. You can import your current staff list via CSV and start scheduling immediately." },
    { question: "Does it sync with Google Calendar?", answer: "Yes! We offer 2-way sync. Shifts created in CrewControl appear in Google Calendar, and personal events can block off availability automatically." },
    { question: "Is there a mobile app for employees?", answer: "Absolutely. We have a dedicated app for iOS and Android where staff can check shifts, swap times, and request time off." },
    { question: "What happens if I cancel my subscription?", answer: "No contracts, no lock-ins. If you cancel, you keep access until the end of your billing cycle. We'll keep your data for 30 days in case you change your mind." },
  ]);

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
    <>
      {/* Structured Data for SEO Rich Snippets */}
      <StructuredData data={organizationSchema} />
      <StructuredData data={softwareSchema} />
      <StructuredData data={webpageSchema} />
      <StructuredData data={faqSchema} />
      
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

      {/* --- MODERN DASHBOARD MOCKUP --- */}
      <div className="relative z-20 -mt-32 md:-mt-48 px-4 mb-32">
         <div className="max-w-7xl mx-auto">
            {/* Glassmorphic Container */}
            <div className="relative bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-slate-900/90 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl shadow-purple-900/30 overflow-hidden group hover:border-purple-500/30 transition-all duration-500">
               
               {/* Animated Background Glow */}
               <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -mr-48 -mt-48 group-hover:bg-purple-600/20 transition-colors"></div>
               
               {/* Browser Header - Modern */}
               <div className="relative bg-slate-950/60 border-b border-white/10 px-6 py-4 flex items-center justify-between backdrop-blur-md">
                  <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-red-500/30 border border-red-500/50 shadow-sm"></div>
                     <div className="w-3 h-3 rounded-full bg-yellow-500/30 border border-yellow-500/50 shadow-sm"></div>
                     <div className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-500/50 shadow-sm"></div>
                  </div>
                  <div className="h-7 px-6 bg-white/5 rounded-full border border-white/10 flex items-center justify-center text-[11px] font-mono text-slate-400 backdrop-blur-sm">
                     <span className="text-purple-400">app.</span>crewcontrol.io<span className="text-slate-500">/dashboard</span>
                  </div>
                  <div className="w-20"></div>
               </div>

               {/* Dashboard Content */}
               <div className="relative p-8 bg-gradient-to-b from-slate-950/50 to-slate-900/30">
                  
                  {/* Top Bar - Modern Design */}
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
                     {/* Left: Date Navigation */}
                     <div className="flex items-center gap-3">
                        <div className="h-10 px-4 bg-gradient-to-r from-purple-500/20 to-purple-600/10 rounded-xl border border-purple-500/30 flex items-center justify-center shadow-lg shadow-purple-500/10">
                           <span className="text-sm font-bold text-purple-300">January 2026</span>
                        </div>
                        <div className="flex gap-2">
                           <button className="h-9 w-9 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 flex items-center justify-center transition-all hover:scale-105">
                              <ChevronDown size={14} className="text-slate-400 rotate-90" />
                           </button>
                           <button className="h-9 w-9 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 flex items-center justify-center transition-all hover:scale-105">
                              <ChevronDown size={14} className="text-slate-400 -rotate-90" />
                           </button>
                        </div>
                     </div>
                     
                     {/* Right: Stats & View Toggle */}
                     <div className="flex items-center gap-4">
                        {/* Stats Pills */}
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 rounded-lg border border-purple-500/20">
                           <Users size={14} className="text-purple-400" />
                           <span className="text-xs font-bold text-purple-300">24</span>
                           <span className="text-[10px] text-slate-400">Active</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                           <Calendar size={14} className="text-emerald-400" />
                           <span className="text-xs font-bold text-emerald-300">142</span>
                           <span className="text-[10px] text-slate-400">Shifts</span>
                        </div>
                        
                        {/* View Toggle */}
                        <div className="flex gap-1 p-1 bg-white/5 rounded-lg border border-white/10">
                           <button className="px-3 py-1.5 bg-purple-500/20 rounded-md border border-purple-500/30 text-xs font-bold text-purple-300 shadow-sm">Week</button>
                           <button className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-300 transition-colors">Month</button>
                        </div>
                     </div>
                  </div>

                  {/* Calendar Grid - Enhanced */}
                  <div className="mb-4">
                     {/* Day Headers */}
                     <div className="grid grid-cols-7 gap-2 mb-3">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                           <div key={i} className="text-center text-xs font-bold text-slate-400 py-2 uppercase tracking-wider">
                              {day}
                           </div>
                        ))}
                     </div>

                     {/* Calendar Days */}
                     <div className="grid grid-cols-7 gap-2">
                        {[
                           { day: 15, shifts: [{ name: 'Sarah M.', startTime: '9:00 AM', endTime: '5:00 PM', color: 'purple' }, { name: 'Mike T.', startTime: '2:00 PM', endTime: '10:00 PM', color: 'blue' }] },
                           { day: 16, shifts: [{ name: 'Emma L.', startTime: '8:00 AM', endTime: '4:00 PM', color: 'emerald' }, { name: 'John D.', startTime: '12:00 PM', endTime: '8:00 PM', color: 'purple' }, { name: 'Lisa K.', startTime: '6:00 PM', endTime: '2:00 AM', color: 'pink' }] },
                           { day: 17, shifts: [{ name: 'Tom R.', startTime: '10:00 AM', endTime: '6:00 PM', color: 'blue' }] },
                           { day: 18, shifts: [{ name: 'Anna B.', startTime: '9:00 AM', endTime: '5:00 PM', color: 'purple' }, { name: 'Chris P.', startTime: '3:00 PM', endTime: '11:00 PM', color: 'emerald' }] },
                           { day: 19, shifts: [{ name: 'David W.', startTime: '8:00 AM', endTime: '4:00 PM', color: 'blue' }, { name: 'Sophie H.', startTime: '1:00 PM', endTime: '9:00 PM', color: 'pink' }] },
                           { day: 20, shifts: [{ name: 'Emergency', type: 'emergency' }] },
                           { day: 21, shifts: [] },
                        ].map((date, i) => (
                           <div 
                              key={i} 
                              className="min-h-[120px] bg-gradient-to-br from-slate-900/60 to-slate-950/60 rounded-xl border border-white/10 p-3 relative group hover:border-purple-500/40 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
                           >
                              {/* Day Number */}
                              <div className="text-sm font-bold text-slate-300 mb-2 leading-none">{date.day}</div>
                              
                              {/* Shifts */}
                              <div className="space-y-1.5">
                                 {date.shifts.slice(0, 3).map((shift, idx) => (
                                    <div 
                                       key={idx}
                                       className={`
                                          text-[10px] font-bold px-2 py-1.5 rounded-lg border backdrop-blur-sm
                                          transition-all group-hover:scale-[1.02]
                                          ${shift.type === 'emergency' 
                                             ? 'bg-red-500/20 text-red-300 border-red-500/40 shadow-sm shadow-red-500/10' 
                                             : shift.color === 'purple'
                                             ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm shadow-purple-500/10'
                                             : shift.color === 'blue'
                                             ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-sm shadow-blue-500/10'
                                             : shift.color === 'emerald'
                                             ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                                             : 'bg-pink-500/20 text-pink-300 border-pink-500/40 shadow-sm shadow-pink-500/10'
                                          }
                                       `}
                                    >
                                       {shift.type === 'emergency' ? (
                                          <span className="flex items-center gap-1">
                                             <span>🚨</span>
                                             <span>Emergency</span>
                                          </span>
                                       ) : (
                                          <div className="flex flex-col gap-0.5">
                                             <span className="truncate font-semibold">{shift.name.split(' ')[0]}</span>
                                             <span className="text-[9px] opacity-80 font-medium">{shift.startTime} - {shift.endTime}</span>
                                          </div>
                                       )}
                                    </div>
                                 ))}
                                 {date.shifts.length > 3 && (
                                    <div className="text-[10px] text-slate-500 font-medium px-2 py-1 bg-white/5 rounded-lg border border-white/5">
                                       +{date.shifts.length - 3} more
                                    </div>
                                 )}
                              </div>
                              
                              {/* Empty State */}
                              {date.shifts.length === 0 && (
                                 <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                    <div className="w-8 h-8 border-2 border-dashed border-white/20 rounded-lg"></div>
                                 </div>
                              )}
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Bottom Action Bar - Modern */}
                  <div className="flex items-center justify-between pt-6 border-t border-white/10">
                     <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                           <CheckCircle2 size={16} className="text-blue-400" />
                           <span className="text-sm font-bold text-blue-300">98%</span>
                           <span className="text-xs text-slate-400">Coverage</span>
                        </div>
                        <div className="h-8 w-px bg-white/10"></div>
                        <div className="text-xs text-slate-500">
                           <span className="font-semibold text-slate-400">142</span> shifts scheduled this week
                        </div>
                     </div>
                     
                     <button className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 rounded-xl text-sm font-bold text-white hover:from-purple-500 hover:to-purple-400 transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 hover:scale-105 flex items-center gap-2">
                        <Zap size={14} />
                        Auto-Fill Week
                     </button>
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
        
        {/* --- MODERN FEATURES GRID --- */}
        <section id="features" className="py-32 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-semibold mb-6">
                  <Zap size={14} className="text-purple-400" />
                  Core Features
               </div>
               <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                  Everything you need to <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">run operations.</span>
               </h2>
               <p className="text-slate-400 max-w-2xl mx-auto text-lg">A complete suite of tools designed to replace your spreadsheets, WhatsApp groups, and paper timesheets.</p>
            </div>

            {/* Modern Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               
               {/* Card 1: Smart Scheduling */}
               <div className="group relative bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 overflow-hidden hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20">
                  {/* Animated Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Icon with Glow */}
                  <div className="relative z-10 mb-6">
                     <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-2xl flex items-center justify-center border border-purple-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-purple-500/20">
                        <Calendar className="text-purple-400" size={28} />
                     </div>
                  </div>

                  <div className="relative z-10">
                     <h3 className="text-2xl font-black mb-3 group-hover:text-purple-300 transition-colors">Smart Scheduling</h3>
                     <p className="text-slate-400 mb-6 leading-relaxed">Drag and drop shifts in a beautiful calendar. Check availability instantly and publish schedules with a single click.</p>
                     
                     {/* Feature Pills */}
                     <div className="flex flex-wrap gap-2 mb-6">
                        <span className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs font-semibold text-purple-300">AI Detection</span>
                        <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-slate-300">Auto-Fill</span>
                        <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-slate-300">One-Click Publish</span>
                     </div>

                     {/* Visual Element */}
                     <div className="relative h-32 bg-slate-950/50 rounded-xl border border-white/5 overflow-hidden group-hover:border-purple-500/30 transition-colors">
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(168,85,247,0.1)_50%,transparent_100%)] animate-[shimmer_3s_infinite]"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="grid grid-cols-7 gap-1 w-full px-4">
                              {[1, 2, 3, 4, 5, 6, 7].map((day, i) => (
                                 <div key={i} className={`
                                    h-12 rounded-lg border flex items-center justify-center text-xs font-bold
                                    ${i === 1 || i === 3 
                                       ? 'bg-purple-500/20 border-purple-500/30 text-purple-400' 
                                       : 'bg-white/5 border-white/5 text-slate-500'
                                    }
                                 `}>
                                    {i === 1 || i === 3 ? '✓' : day}
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Corner Accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-purple-500/10 transition-colors"></div>
               </div>

               {/* Card 2: Team Management */}
               <div className="group relative bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 overflow-hidden hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20">
                  {/* Animated Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Icon with Glow */}
                  <div className="relative z-10 mb-6">
                     <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-blue-500/20">
                        <Users className="text-blue-400" size={28} />
                     </div>
                  </div>

                  <div className="relative z-10">
                     <h3 className="text-2xl font-black mb-3 group-hover:text-blue-300 transition-colors">Team Management</h3>
                     <p className="text-slate-400 mb-6 leading-relaxed">Organize employees into teams, assign roles, and manage permissions with intuitive controls.</p>
                     
                     {/* Feature Pills */}
                     <div className="flex flex-wrap gap-2 mb-6">
                        <span className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-semibold text-blue-300">Multi-Team</span>
                        <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-slate-300">Role-Based</span>
                        <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-slate-300">Invites</span>
                     </div>

                     {/* Visual Element */}
                     <div className="relative h-32 bg-slate-950/50 rounded-xl border border-white/5 overflow-hidden group-hover:border-blue-500/30 transition-colors">
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(59,130,246,0.1)_50%,transparent_100%)] animate-[shimmer_3s_infinite]"></div>
                        <div className="absolute inset-0 flex items-center justify-center p-4">
                           <div className="flex gap-3 w-full">
                              <div className="flex-1 h-full bg-blue-500/20 rounded-lg border border-blue-500/30 flex flex-col items-center justify-center gap-2">
                                 <div className="w-8 h-8 bg-blue-500/30 rounded-full"></div>
                                 <div className="h-2 w-12 bg-blue-500/20 rounded"></div>
                              </div>
                              <div className="flex-1 h-full bg-white/5 rounded-lg border border-white/5 flex flex-col items-center justify-center gap-2">
                                 <div className="w-8 h-8 bg-white/10 rounded-full"></div>
                                 <div className="h-2 w-12 bg-white/5 rounded"></div>
                              </div>
                              <div className="flex-1 h-full bg-white/5 rounded-lg border border-white/5 flex flex-col items-center justify-center gap-2">
                                 <div className="w-8 h-8 bg-white/10 rounded-full"></div>
                                 <div className="h-2 w-12 bg-white/5 rounded"></div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Corner Accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors"></div>
               </div>

               {/* Card 3: Analytics & Insights */}
               <div className="group relative bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 overflow-hidden hover:border-emerald-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/20">
                  {/* Animated Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Icon with Glow */}
                  <div className="relative z-10 mb-6">
                     <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-2xl flex items-center justify-center border border-emerald-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-emerald-500/20">
                        <BarChart3 className="text-emerald-400" size={28} />
                     </div>
                  </div>

                  <div className="relative z-10">
                     <h3 className="text-2xl font-black mb-3 group-hover:text-emerald-300 transition-colors">Analytics & Insights</h3>
                     <p className="text-slate-400 mb-6 leading-relaxed">Track coverage, labor costs, and shift patterns with real-time dashboards and reports.</p>
                     
                     {/* Feature Pills */}
                     <div className="flex flex-wrap gap-2 mb-6">
                        <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-semibold text-emerald-300">Real-Time</span>
                        <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-slate-300">Reports</span>
                        <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-slate-300">Trends</span>
                     </div>

                     {/* Visual Element - Chart */}
                     <div className="relative h-32 bg-slate-950/50 rounded-xl border border-white/5 overflow-hidden group-hover:border-emerald-500/30 transition-colors">
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(16,185,129,0.1)_50%,transparent_100%)] animate-[shimmer_3s_infinite]"></div>
                        <div className="absolute inset-0 flex items-end justify-center gap-1.5 px-4 py-3">
                           {[35, 60, 45, 75, 55, 70, 85].map((h, i) => (
                              <div 
                                 key={i} 
                                 style={{height: `${h}%`}} 
                                 className="flex-1 bg-emerald-500/40 rounded-t border border-emerald-500/50 group-hover:bg-emerald-500/50 transition-colors shadow-sm"
                              ></div>
                           ))}
                        </div>
                        {/* Chart Grid Lines */}
                        <div className="absolute inset-0 opacity-10">
                           <div className="h-full w-full bg-[linear-gradient(to_top,white_1px,transparent_1px)] bg-[length:100%_25%]"></div>
                        </div>
                     </div>
                  </div>

                  {/* Corner Accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors"></div>
               </div>

            </div>
          </div>

          {/* Add shimmer animation */}
          <style>{`
            @keyframes shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          `}</style>
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
                         <li className="flex gap-2"><Check size={16} className="text-purple-500"/> Up to 30 employees</li>
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
                         <li className="flex gap-2"><Check size={16} className="text-purple-400 group-hover:text-purple-300"/> Up to 100 employees</li>
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

        {/* --- WHY CHOOSE US - PRICING COMPARISON SECTION --- */}
        <section className="py-32 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-900/10 to-transparent pointer-events-none"></div>
          
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">CrewControl</span>?
              </h2>
              <p className="text-slate-400 text-lg mb-12">Compare pricing based on your team size</p>
              
              {/* Employee Slider */}
              <div className="max-w-2xl mx-auto mb-16">
                <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                  <label className="block text-center mb-6">
                    <span className="text-2xl font-bold text-white mb-2 block">Number of Employees</span>
                    <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                      {employeeCount}
                    </span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={employeeCount}
                    onChange={(e) => setEmployeeCount(parseInt(e.target.value))}
                    className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>1</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Comparison Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {/* CrewControl */}
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-xl rounded-2xl border-2 border-purple-500/30 p-8 shadow-[0_0_40px_rgba(168,85,247,0.2)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                    <span className="text-sm font-bold text-purple-300 uppercase tracking-wider">CrewControl</span>
                  </div>
                  <div className="mb-6">
                    <div className="text-5xl font-black text-white mb-2">
                      ${(() => {
                        if (employeeCount <= 30) return '19.99';
                        if (employeeCount <= 100) return '49.99';
                        return 'Custom';
                      })()}
                    </div>
                    <div className="text-slate-400 text-sm">per month</div>
                  </div>
                  <div className="space-y-2 text-sm text-slate-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400" />
                      <span>All core features included</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400" />
                      <span>14-day free trial</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400" />
                      <span>No per-user fees</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sling */}
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border-2 border-white/10 p-8 transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Sling</span>
                </div>
                <div className="mb-6">
                  <div className="text-5xl font-black text-white mb-2">
                    {employeeCount <= 30 ? '$0' : `$${(employeeCount * 2).toFixed(0)}`}
                  </div>
                  <div className="text-slate-400 text-sm">
                    {employeeCount <= 30 
                      ? 'Free plan (≤30 users)' 
                      : `Premium ($2/user/month)`
                    }
                  </div>
                </div>
                <div className="space-y-2 text-sm text-slate-400">
                  {employeeCount <= 30 ? (
                    <>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-400" />
                        <span>Free for up to 30 users</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <X size={16} className="text-red-400" />
                        <span>Limited features (basic scheduling)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <X size={16} className="text-red-400" />
                        <span>No time tracking included</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-400" />
                        <span>Includes time tracking</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <X size={16} className="text-red-400" />
                        <span>Per-user pricing adds up</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <X size={16} className="text-red-400" />
                        <span>Limited advanced features</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Deputy */}
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border-2 border-white/10 p-8 transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Deputy</span>
                </div>
                <div className="mb-6">
                  <div className="text-5xl font-black text-white mb-2">
                    ${(employeeCount * 4.5).toFixed(0)}
                  </div>
                  <div className="text-slate-400 text-sm">per month ($4.50/user)</div>
                </div>
                <div className="space-y-2 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <span>Per-user pricing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <span>31-day free trial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <X size={16} className="text-red-400" />
                    <span>Costs add up quickly</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Savings Highlight */}
            <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 rounded-2xl border border-emerald-500/30 p-8 text-center backdrop-blur-sm">
              <div className="flex items-center justify-center gap-3 mb-6">
                <TrendingUp size={32} className="text-emerald-400" />
                <h3 className="text-2xl font-bold text-white">Save with CrewControl</h3>
              </div>
              <div className="space-y-4 mb-8">
                {(() => {
                  const crewcontrolPrice = employeeCount <= 30 ? 19.99 : employeeCount <= 100 ? 49.99 : 0;
                  const slingPrice = employeeCount <= 30 ? 0 : employeeCount * 2; // Free for ≤30, $2/user for >30
                  const deputyPrice = employeeCount * 4.5;
                  const slingSavings = slingPrice - crewcontrolPrice;
                  const deputySavings = deputyPrice - crewcontrolPrice;
                  
                  return (
                    <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                      <div className={`rounded-xl p-6 border ${
                        slingSavings > 0 
                          ? 'bg-slate-900/40 border-emerald-500/20' 
                          : 'bg-slate-900/40 border-slate-700/50'
                      }`}>
                        <div className="text-sm text-slate-400 mb-2">vs Sling</div>
                        {slingSavings > 0 ? (
                          <>
                            <div className="text-3xl font-black text-emerald-400 mb-1">
                              ${slingSavings.toFixed(2)}
                              <span className="text-lg text-slate-400">/month saved</span>
                            </div>
                            <div className="text-xs text-slate-500">
                              Sling: ${slingPrice.toFixed(2)}/mo | CrewControl: ${crewcontrolPrice.toFixed(2)}/mo
                            </div>
                          </>
                        ) : slingSavings < 0 ? (
                          <>
                            <div className="text-lg font-bold text-slate-400 mb-1">
                              ${Math.abs(slingSavings).toFixed(2)}/mo more
                            </div>
                            <div className="text-xs text-slate-500 mb-2">
                              Sling Free: $0/mo | CrewControl: ${crewcontrolPrice.toFixed(2)}/mo
                            </div>
                            <div className="text-xs text-slate-600">
                              Sling Free has no time tracking • Limited features
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-lg font-bold text-slate-300 mb-2">
                              Same Price, More Value
                            </div>
                            <div className="text-xs text-slate-400">
                              Both: ${crewcontrolPrice.toFixed(2)}/mo - CrewControl includes more features
                            </div>
                          </>
                        )}
                      </div>
                      <div className="bg-slate-900/40 rounded-xl p-6 border border-emerald-500/20">
                        <div className="text-sm text-slate-400 mb-2">vs Deputy</div>
                        <div className="text-3xl font-black text-emerald-400 mb-1">
                          ${deputySavings.toFixed(2)}
                          <span className="text-lg text-slate-400">/month saved</span>
                        </div>
                        <div className="text-xs text-slate-500">
                          Deputy: ${deputyPrice.toFixed(2)}/mo | CrewControl: ${crewcontrolPrice.toFixed(2)}/mo
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
              <Link to="/pricing">
                <button className="px-8 py-4 bg-white text-slate-950 rounded-xl font-bold hover:bg-purple-50 transition-all shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1 active:scale-95 cursor-pointer inline-flex items-center gap-2">
                  Start Free Trial <ArrowRight size={18} />
                </button>
              </Link>
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
    </>
  );
};

export default App;
