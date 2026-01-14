import React, { useState } from 'react';
import { Menu, X, Check, ChevronDown, ChevronUp, ArrowRight, ShieldCheck, Briefcase, Smartphone, Play } from 'lucide-react';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-white selection:bg-purple-200">
      
      {/* --- HERO WRAPPER (Colored Background) --- */}
      <div className="relative bg-gradient-to-br from-purple-700 via-indigo-600 to-purple-700 pb-32 lg:pb-60 overflow-hidden">
        
        {/* Background Decor Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[10%] left-[-10%] w-72 h-72 bg-purple-400/20 rounded-full blur-3xl"></div>
        </div>

        {/* --- NAVBAR --- */}
        <nav className="relative z-50 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20">
              <div className="flex items-center">
                <a href="#" className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-all duration-300">
                      <span className="text-white font-bold text-xl">C</span>
                  </div>
                  <span className="text-2xl font-bold tracking-tight text-white group-hover:text-purple-100 transition-colors">CrewControl</span>
                </a>
              </div>
              
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-8">
                {['Home', 'Features', 'Pricing', 'FAQ'].map((item) => (
                    <a key={item} href={`#${item.toLowerCase().replace(/\s/g, '')}`} className="text-sm font-medium text-purple-100 hover:text-white transition-colors cursor-pointer relative group/nav">
                        {item}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover/nav:w-full"></span>
                    </a>
                ))}
                
                <div className="flex items-center gap-4 ml-4">
                    <a href="#" className="text-white font-medium hover:text-purple-200 transition-colors cursor-pointer">Sign In</a>
                    <button className="bg-white text-purple-700 px-6 py-2.5 rounded-full font-bold hover:bg-purple-50 hover:-translate-y-1 active:scale-95 transition-all duration-300 shadow-lg shadow-purple-900/20 cursor-pointer flex items-center gap-2">
                    Get Started <ArrowRight size={16} />
                    </button>
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2 hover:bg-white/10 rounded-lg cursor-pointer">
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-20 left-0 w-full bg-indigo-900/95 backdrop-blur-md border-b border-white/10 p-4 space-y-2 shadow-xl z-50">
              {['Features','Pricing', 'FAQ'].map((item) => (
                  <a key={item} href="#" className="block py-3 text-base font-medium text-white border-b border-white/10" onClick={() => setIsMenuOpen(false)}>{item}</a>
              ))}
              <button className="w-full mt-4 bg-white text-purple-700 py-3 rounded-lg font-bold hover:bg-gray-100 transition cursor-pointer">Get Started</button>
            </div>
          )}
        </nav>

        {/* --- HERO CONTENT --- */}
        <section className="pt-20 px-4 text-center relative z-10 max-w-5xl mx-auto">
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
              Your team,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">in sync.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-purple-100 mb-10 max-w-3xl mx-auto leading-relaxed opacity-90">
              The "clean canvas" for your workforce. Eliminate scheduling conflicts 
              and payroll errors with a single source of truth. Designed to enhance operational efficiency.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="bg-white text-purple-800 px-10 py-5 rounded-full text-lg font-bold hover:bg-purple-50 hover:-translate-y-1 active:scale-95 transition-all duration-300 shadow-xl shadow-purple-900/20 cursor-pointer flex items-center justify-center">
                             Start Free Trial
                </button>
                <button className="bg-transparent border border-white/30 text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-white/10 hover:-translate-y-1 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2">
                    <Play size={20} fill="currentColor" className="opacity-80"/> Watch Demo
                </button>
            </div>
        </section>

        {/* --- CURVED SEPARATOR (SVG) --- */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
                 <svg className="relative block w-full h-[50px] md:h-[100px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
                  <path d="M0,0V120H1200V0C1023.2,54.39,783.33,90,600,90S176.8,54.39,0,0Z" fill="#ffffff"></path>
                  </svg>
          </div>
      </div>

      {/* --- FLOATING DASHBOARD IMAGE SECTION --- */}
      <div className="relative z-20 -mt-24 md:-mt-48 px-4 mb-24">
         <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl shadow-purple-900/20 border-8 border-white/50 backdrop-blur-xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-500">
            {/* Fake Dashboard Header */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="h-2 w-32 bg-slate-200 rounded-full"></div>
                <div className="flex gap-3">
                     <div className="h-8 w-8 rounded-full bg-slate-200"></div>
                </div>
            </div>
            {/* Fake Dashboard Content (Preview) */}
            <div className="p-8 bg-white grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="hidden md:block col-span-1 space-y-4">
                    <div className="h-8 w-full bg-purple-50 rounded-lg"></div>
                    <div className="h-8 w-3/4 bg-slate-50 rounded-lg"></div>
                    <div className="h-8 w-4/5 bg-slate-50 rounded-lg"></div>
                    <div className="mt-8 h-32 w-full bg-slate-50 rounded-xl"></div>
                </div>
                {/* Main Area */}
                <div className="col-span-1 md:col-span-3 grid grid-cols-2 gap-6">
                    <div className="col-span-2 md:col-span-1 h-32 bg-gradient-to-r from-purple-50 to-white border border-purple-100 rounded-2xl p-4">
                        <div className="h-4 w-12 bg-purple-200 rounded mb-2"></div>
                        <div className="h-8 w-24 bg-purple-600 rounded"></div>
                    </div>
                    <div className="col-span-2 md:col-span-1 h-32 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                         <div className="h-4 w-12 bg-slate-200 rounded mb-2"></div>
                         <div className="h-8 w-24 bg-slate-800 rounded"></div>
                    </div>
                    <div className="col-span-2 h-64 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-300">
                        [ Interactive Schedule Grid ]
                    </div>
                </div>
            </div>
         </div>
      </div>

      {/* --- TRUSTED BY --- */}
      <div className="max-w-7xl mx-auto px-4 text-center mb-24">
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Trusted by 500+ Innovative Teams</p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500 cursor-default">
            <div className="text-2xl font-black text-purple-900">LOGISTIC<span className="text-purple-500">CO</span></div>
            <div className="text-2xl font-black text-purple-900">Coffee<span className="italic font-light">House</span></div>
            <div className="text-2xl font-black text-purple-900">EVENT<span className="text-slate-400">MASTER</span></div>
            <div className="text-2xl font-black text-purple-900">Shift<span className="text-purple-500">Sync</span></div>
        </div>
      </div>

      <main className="flex-grow">
        
        {/* --- FEATURES (3-in-1 Vision) --- */}
        <section id="features" className="py-24 bg-white relative">
          <div className="max-w-6xl mx-auto px-6 space-y-32">
            
            {/* For Managers */}
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="flex-1">
                <div className="inline-block p-3 bg-purple-100 rounded-2xl mb-6">
                    <Briefcase className="text-purple-600" size={32} />
                </div>
                <h2 className="text-4xl font-extrabold text-slate-900 mb-6">For Managers: <br/><span className="text-purple-600">Visual Control.</span></h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  Drag and drop shifts in a beautiful calendar. Check availability instantly and 
                  publish schedules to the whole team with a single click.
                </p>
                <ul className="space-y-4 font-medium text-slate-700">
                  <li className="flex items-center gap-3"><div className="bg-green-100 p-1 rounded-full"><Check size={16} className="text-green-600"/></div> Smart conflict detection</li>
                  <li className="flex items-center gap-3"><div className="bg-green-100 p-1 rounded-full"><Check size={16} className="text-green-600"/></div> One-click shift publishing</li>
                </ul>
              </div>
              <div className="flex-1 w-full h-80 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-[40px] border border-white shadow-2xl shadow-purple-100 flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition duration-500 flex items-center justify-center">
                     <button className="bg-white px-6 py-2 rounded-full shadow-lg text-sm font-bold text-purple-700">View Dashboard</button>
                  </div>
                  <span className="text-purple-200 font-bold text-2xl group-hover:scale-110 transition duration-500">Manager View</span>
              </div>
            </div>

            {/* For Workers */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-16">
              <div className="flex-1 text-right md:text-left">
                 <div className="inline-block p-3 bg-pink-100 rounded-2xl mb-6">
                    <Smartphone className="text-pink-600" size={32} />
                </div>
                <h2 className="text-4xl font-extrabold text-slate-900 mb-6">For Workers: <br/><span className="text-pink-500">Total Clarity.</span></h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  No more "when am I working?" calls. Employees can check their schedule 
                  on their phones, request swaps, and log their hours effortlessly.
                </p>
                <ul className="space-y-4 font-medium text-slate-700 flex flex-col items-end md:items-start">
                  <li className="flex items-center gap-3"><div className="bg-pink-100 p-1 rounded-full"><Check size={16} className="text-pink-600"/></div> Mobile-first personal schedule</li>
                  <li className="flex items-center gap-3"><div className="bg-pink-100 p-1 rounded-full"><Check size={16} className="text-pink-600"/></div> Easy time-off requests</li>
                </ul>
              </div>
              <div className="flex-1 w-full h-80 bg-gradient-to-br from-pink-50 to-rose-50 rounded-[40px] border border-white shadow-2xl shadow-pink-100 flex items-center justify-center text-pink-200 font-bold text-2xl">
                  Mobile App
              </div>
            </div>

            {/* For HR */}
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="flex-1">
                <div className="inline-block p-3 bg-indigo-100 rounded-2xl mb-6">
                    <ShieldCheck className="text-indigo-600" size={32} />
                </div>
                <h2 className="text-4xl font-extrabold text-slate-900 mb-6">For HR: <br/><span className="text-indigo-600">Payroll Perfection.</span></h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  Automate the month-end headache. HR teams can track total hours, monitor 
                  overtime, and export audit-ready reports for payroll in seconds.
                </p>
                <ul className="space-y-4 font-medium text-slate-700">
                  <li className="flex items-center gap-3"><div className="bg-indigo-100 p-1 rounded-full"><Check size={16} className="text-indigo-600"/></div> Monthly analytics</li>
                  <li className="flex items-center gap-3"><div className="bg-indigo-100 p-1 rounded-full"><Check size={16} className="text-indigo-600"/></div> Audit-ready payroll exports</li>
                </ul>
              </div>
              <div className="flex-1 w-full h-80 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-[40px] border border-white shadow-2xl shadow-indigo-100 flex items-center justify-center text-indigo-200 font-bold text-2xl">
                  HR Analytics
              </div>
            </div>

          </div>
        </section>

        {/* --- PRICING SECTION --- */}
        <section id="pricing" className="py-32 bg-slate-50 relative overflow-hidden">
          {/* Decor */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200/50 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900">Choose the perfect plan</h2>
              <p className="mt-4 text-xl text-slate-500">Simple pricing that scales with your team size.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-center">
              
              {/* 1. Basic Plan */}
              <div className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200 border border-slate-100 hover:scale-105 hover:border-purple-300 transition-all duration-300 cursor-pointer">
                <h3 className="text-lg font-bold text-slate-900">Basic</h3>
                <p className="text-slate-500 text-sm mt-1">For micro-teams & startups</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-slate-900">$19</span>
                  <span className="text-slate-500 text-sm">/mo</span>
                </div>
                <div className="space-y-4 mb-8 text-sm">
                  {["Up to 5 employees", "Mobile app access", "Visual drag & drop schedule builder", "Public holiday & time-off requests", "Email support"].map(feat => (
                    <div key={feat} className="flex items-center text-slate-600"><Check className="text-purple-500 mr-3 shrink-0" size={18}/> {feat}</div>
                  ))}
                </div>
                <button className="w-full py-3 border-2 border-slate-100 text-slate-900 font-bold rounded-xl hover:border-purple-600 hover:text-purple-600 transition-colors cursor-pointer">
                  Get Started
                </button>
              </div>

              {/* 2. Pro Plan - HIGHLIGHTED */}
              <div className="bg-gradient-to-b from-purple-700 to-indigo-800 p-10 rounded-3xl shadow-2xl shadow-purple-900/40 transform scale-105 hover:scale-110 transition-all duration-500 relative text-white z-10 cursor-pointer group">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                  Popular
                </div>
                <h3 className="text-xl font-bold">Business Pro</h3>
                <p className="text-purple-200 text-sm mt-1">Everything you need to scale</p>
                <div className="my-6">
                  <span className="text-5xl font-extrabold">$49</span>
                  <span className="text-purple-200 text-sm">/mo</span>
                </div>
                <div className="space-y-4 mb-8 text-sm text-purple-100">
                  {["Up to 25 employees", "AI Auto-Scheduling", "SMS Notifications", "Payroll Integration", "Priority support"].map(feat => (
                    <div key={feat} className="flex items-center"><Check className="text-purple-300 mr-3" size={18}/> {feat}</div>
                  ))}
                </div>
                <button className="w-full py-4 bg-white text-purple-800 font-bold rounded-xl hover:bg-purple-50 active:scale-95 transition-all shadow-lg cursor-pointer">
                  Try Pro Free
                </button>
              </div>

              {/* 3. Enterprise Plan */}
              <div className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200 border border-slate-100 hover:scale-105 hover:border-purple-300 transition-all duration-300 cursor-pointer">
                <h3 className="text-lg font-bold text-slate-900">Enterprise</h3>
                <p className="text-slate-500 text-sm mt-1">For multi-location operations</p>
                <div className="my-6 text-slate-900 font-extrabold text-4xl">
                  Custom
                </div>
                <div className="space-y-4 mb-8 text-sm">
                  {["Unlimited employees", "Custom API Access", "Custom approval workflows", "SLA-based support", "Dedicated account manager"].map(feat => (
                      <div key={feat} className="flex items-center text-slate-600"><Check className="text-purple-500 mr-3 shrink-0" size={18}/> {feat}</div>
                  ))}
                </div>
                <button className="w-full py-3 border-2 border-slate-100 text-slate-900 font-bold rounded-xl hover:border-purple-600 hover:text-purple-600 transition-colors cursor-pointer">
                  Contact Sales
                </button>
              </div>

            </div>
          </div>
        </section>

   {/* --- LAST CALL TO ACTION --- */}
<section className="bg-gradient-to-r from-purple-700 to-indigo-800 py-24 relative overflow-hidden">
    
    {/* --- TOP CURVE ---*/}
    <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg className="relative block w-full h-[40px] md:h-[80px]" viewBox="0 0 1200 120" preserveAspectRatio="none">

            <path d="M0,0V120H1200V0C1023.2,54.39,783.33,90,600,90S176.8,54.39,0,0Z" fill="#ffffff"></path>
        </svg>
    </div>


    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
    <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>

    <div className="max-w-4xl mx-auto px-4 text-center relative z-10 mt-8">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Ready to regain control?</h2>
        <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
            Join 500+ operations teams who switched to CrewControl. 
            Start your 14-day free trial today.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-purple-800 px-10 py-5 rounded-full text-lg font-bold hover:bg-white hover:-translate-y-1 hover:shadow-xl hover:shadow-white/20 active:scale-95 transition-all duration-300 shadow-lg cursor-pointer">
                Get Started Now
            </button>
            <button className="bg-transparent border border-purple-400 text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-white/10 hover:-translate-y-1 active:scale-95 transition-all duration-300 cursor-pointer">
                Talk to Sales
            </button>
        </div>
    </div>
</section>

        {/* --- FAQ SECTION --- */}
        <section id="faq" className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              {faqData.map((item, index) => (
                <div key={index} className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${openFaqIndex === index ? 'border-purple-500 shadow-lg ring-1 ring-purple-100' : 'border-slate-200 hover:border-purple-200'}`}>
                  <button 
                    onClick={() => toggleFaq(index)}
                    className="w-full flex justify-between items-center p-6 text-left focus:outline-none cursor-pointer"
                  >
                    <span className={`font-bold text-lg transition ${openFaqIndex === index ? 'text-purple-700' : 'text-slate-800'}`}>{item.question}</span>
                    {openFaqIndex === index ? (
                      <div className="bg-purple-100 p-1 rounded-full"><ChevronUp className="text-purple-600" size={20} /></div>
                    ) : (
                      <div className="bg-slate-100 p-1 rounded-full"><ChevronDown className="text-slate-400" size={20} /></div>
                    )}
                  </button>
                  
                  <div 
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      openFaqIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 pb-6 text-slate-600 text-base leading-relaxed border-t border-slate-50 pt-4">
                      {item.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">C</span>
                </div>
                <span className="text-2xl font-bold text-white">CrewControl</span>
              </div>
              <p className="max-w-xs text-base text-slate-400 leading-relaxed">
                Enterprise-grade scheduling for modern operations. 
                Built for control, speed, and reliability.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Product</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="http://localhost:5173/changelog" className="hover:text-purple-400 transition cursor-pointer">Changelog</a></li>
                <li><a href="#" className="hover:text-purple-400 transition cursor-pointer">Documentation</a></li>
                <li><a href="#" className="hover:text-purple-400 transition cursor-pointer">API Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Legal</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-purple-400 transition cursor-pointer">Privacy</a></li>
                <li><a href="#" className="hover:text-purple-400 transition cursor-pointer">Terms</a></li>
                <li><a href="#" className="hover:text-purple-400 transition cursor-pointer">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <span>&copy; 2026 CrewControl Systems.</span>
            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> All Systems Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;