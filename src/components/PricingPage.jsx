import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, X, Zap, Shield, Crown, HelpCircle, 
  ArrowRight, CreditCard, Sparkles, Building2, LayoutGrid, Users 
} from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { StructuredData, generateOrganizationSchema, generateWebPageSchema } from './StructuredData';

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const navigate = useNavigate();

  // SEO Meta Tags
  useSEO({
    title: 'Pricing Plans - CrewControl | Simple Pricing for Teams of All Sizes',
    description: 'Choose the perfect plan for your team. Starter plan: $19.99/mo for up to 30 employees. Professional: $49.99/mo for up to 100 employees. Enterprise: Custom pricing. 14-day free trial.',
    keywords: 'workforce management pricing, employee scheduling pricing, team management software cost, shift management pricing',
    ogImage: 'https://crewcontrol.io/dashboard-screenshot.png',
    canonical: 'https://crewcontrol.io/pricing',
  });

  // Structured Data
  const organizationSchema = generateOrganizationSchema();
  const webpageSchema = generateWebPageSchema({
    name: 'Pricing Plans - CrewControl',
    description: 'Choose the perfect plan for your team. Starter plan: $19.99/mo for up to 30 employees. Professional: $49.99/mo for up to 100 employees.',
    url: 'https://crewcontrol.io/pricing',
    breadcrumbs: [
      { name: 'Home', url: 'https://crewcontrol.io/' },
      { name: 'Pricing', url: 'https://crewcontrol.io/pricing' },
    ],
  });

  const handleButtonClick = (planName, btnText) => {
    if (btnText.toLowerCase().includes('contact') || btnText.toLowerCase().includes('sales')) {
      navigate('/contact');
    } else {
      // "Start Free Trial" or "Try Free 14 Days" -> go to signup
      navigate('/signup');
    }
  };

  const plans = [
    {
      name: "Starter",
      desc: "Perfect for small crews just getting started.",
      price: isAnnual ? 15.99 : 19.99,
      period: "/mo",
      btnText: "Start Free Trial",
      isPopular: false,
      features: [
        "Up to 30 employees",
        "Drag-and-drop scheduling",
        "Mobile pulse app",
        "Shift swap requests",
        "AI conflict detection",
        "Real-time 'Who's In' dashboard",
        "One-click shift publishing",
        "Availability calendar",
        "Time-off requests",
        "Shift notifications",
        "Multiple locations",
        "Email support"
      ],
      notIncluded: ["Automated Shift Filling", "In-App Messaging", "Payroll Export", "HR Role"]
    },
    {
      name: "Professional",
      desc: "Power & automation for growing businesses.",
      price: isAnnual ? 39.99 : 49.99,
      period: "/mo",
      isPopular: true,
      btnText: "Start 14-Day Trial",
      features: [
        "Up to 100 employees",
        "Automated shift filling",
        "In-app messaging",
        "Payroll exports (QuickBooks, Xero, ADP)",
        "Absence & leave management",
        "Workforce analytics",
        "HR role access",
        "Priority support"
      ],
      notIncluded: ["Document Vault", "Compliance Audit Trail", "API Access"]
    },
    {
      name: "Enterprise",
      desc: "Total control & security for organizations.",
      price: "Custom",
      period: "",
      isPopular: false,
      btnText: "Contact Sales",
      features: [
        "Unlimited employees",
        "Everything in Professional",
        "Digital document vault",
        "Compliance audit trail",
        "Advanced workforce analytics",
        "REST API access",
        "Custom payroll integrations",
        "Dedicated account manager",
        "99.9% uptime SLA"
      ],
      notIncluded: []
    }
  ];

  const featuresList = [
    { name: "Drag-and-Drop Scheduling", starter: true, pro: true, ent: true },
    { name: "Mobile Pulse App", starter: true, pro: true, ent: true },
    { name: "Shift Swap Requests", starter: true, pro: true, ent: true },
    { name: "Multiple Locations", starter: true, pro: true, ent: true },
    { name: "Time-Off Requests", starter: true, pro: true, ent: true },
    { name: "AI Conflict Detection", starter: true, pro: true, ent: true },
    { name: "Real-Time 'Who's In' Dashboard", starter: true, pro: true, ent: true },
    { name: "One-Click Shift Publishing", starter: true, pro: true, ent: true },
    { name: "Availability Calendar", starter: true, pro: true, ent: true },
    { name: "Automated Shift Filling", starter: false, pro: true, ent: true },
    { name: "In-App Messaging", starter: false, pro: true, ent: true },
    { name: "Payroll Exports (QuickBooks, Xero, ADP)", starter: false, pro: true, ent: true },
    { name: "Absence & Leave Management", starter: false, pro: true, ent: true },
    { name: "Workforce Analytics", starter: false, pro: true, ent: true },
    { name: "HR Role Access", starter: false, pro: true, ent: true },
    { name: "Digital Document Vault", starter: false, pro: false, ent: true },
    { name: "Compliance Audit Trail", starter: false, pro: false, ent: true },
    { name: "REST API Access", starter: false, pro: false, ent: true, highlight: true },
    { name: "Custom Integrations", starter: false, pro: false, ent: true },
  ];

  return (
    <>
      {/* Structured Data for SEO Rich Snippets */}
      <StructuredData data={organizationSchema} />
      <StructuredData data={webpageSchema} />

      <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden font-sans selection:bg-purple-500/30">
      
      {/* --- AMBIENT BACKGROUND GLOWS --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[100px] mix-blend-screen"></div>
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[1000px] h-[500px] bg-slate-900/50 blur-[80px] rounded-full"></div>
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* --- HEADER --- */}
      <header className="relative z-10 pt-32 pb-20 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-purple-300 text-sm font-semibold mb-8 shadow-[0_0_20px_rgba(168,85,247,0.15)] animate-in fade-in slide-in-from-top-4 duration-1000">
          <Sparkles size={16} className="text-purple-400" /> 
          <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Simple, transparent pricing</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white drop-shadow-2xl">
          Plans that scale with your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">Ambition</span>
        </h1>
        
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Whether you're a startup of 5 or an enterprise of 5,000, we have a plan that fits your workflow.
        </p>

        {/* TOGGLE */}
        <div className="flex items-center justify-center gap-6">
          <span className={`text-sm font-bold tracking-wide transition-colors ${
            !isAnnual ? 'text-white' : 'text-slate-500'
          }`}>MONTHLY</span>
          
          <button 
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative w-20 h-10 bg-slate-900 rounded-full border border-white/10 p-1 cursor-pointer shadow-inner transition-colors hover:border-purple-500/50"
          >
            <div className={`absolute top-1 left-1 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/40 transition-all duration-500 ease-spring ${isAnnual ? 'translate-x-10' : 'translate-x-0'}`}>
              {/* Shine effect on toggle */}
              <div className="absolute top-1 left-1 w-3 h-3 bg-white/30 rounded-full blur-[1px]"></div>
            </div>
          </button>

          <span className={`text-sm font-bold tracking-wide flex items-center gap-2 transition-colors ${
            isAnnual ? 'text-white' : 'text-slate-500'
          }`}>
            YEARLY
            <span className="bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              -20% OFF
            </span>
          </span>
        </div>
      </header>

      {/* --- PRICING CARDS --- */}
      <main className="max-w-7xl mx-auto px-6 relative z-10 pb-32">
        <div className="grid lg:grid-cols-3 gap-8 mb-32 items-center">
          {plans.map((plan, idx) => (
            <div 
              key={idx}
              className={`relative group rounded-[2rem] transition-all duration-500 
                ${plan.isPopular 
                  ? 'bg-slate-900/40 border border-purple-500/30 scale-105 shadow-[0_0_50px_-12px_rgba(168,85,247,0.2)] z-10' 
                  : 'bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
                } backdrop-blur-xl p-8 flex flex-col h-full`}
            >
              {/* Popular Glow Effect */}
              {plan.isPopular && (
                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent rounded-[2rem] pointer-events-none" />
              )}
              
              {plan.isPopular && (
                <div className="absolute -top-5 left-0 w-full flex justify-center">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_20px_rgba(236,72,153,0.4)] flex items-center gap-2">
                    <Crown size={12} /> Most Popular
                  </div>
                </div>
              )}

              <div className="mb-6 relative">
                <h3 className={`text-xl font-bold mb-2 ${plan.isPopular ? 'text-white' : 'text-slate-200'}`}>{plan.name}</h3>
                <p className="text-sm text-slate-400 h-10">{plan.desc}</p>
              </div>

              <div className="mb-8 relative">
                <div className="flex items-baseline gap-1">
                  {typeof plan.price === 'number' ? (
                    <>
                      <span className="text-5xl font-black text-white tracking-tight">
                        ${Math.floor(plan.price)}<span className="text-2xl">.{String(Math.round((plan.price % 1) * 100)).padStart(2, '0')}</span>
                      </span>
                      <span className="text-slate-500 font-medium">{plan.period}</span>
                    </>
                  ) : (
                    <span className="text-5xl font-black text-white tracking-tight">{plan.price}</span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={() => handleButtonClick(plan.name, plan.btnText)}
                className={`w-full py-4 rounded-xl font-bold transition-all duration-300 relative overflow-hidden group/btn mb-8 cursor-pointer ${
                  plan.isPopular 
                    ? 'bg-white text-slate-950 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]' 
                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {plan.btnText} {plan.isPopular && <ArrowRight size={16} />}
                </span>
              </button>

              {/* Features */}
              <div className="space-y-4 flex-grow relative">
                {plan.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-slate-300 group-hover:text-slate-200 transition-colors">
                    <div className={`mt-0.5 p-1 rounded-full ${plan.isPopular ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-800 text-slate-400'}`}>
                      <Check size={10} strokeWidth={4} />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
                {plan.notIncluded.map((feat, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    <X size={16} className="mt-0.5 opacity-50" />
                    <span className="line-through decoration-slate-700">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* --- COMPARISON TABLE (Glassy Data Grid) --- */}
        <div className="mb-32">
          <h2 className="text-3xl font-bold text-white text-center mb-12 tracking-tight">Feature Comparison</h2>
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-md shadow-2xl">
            <div className="grid grid-cols-4 p-6 border-b border-white/5 bg-white/[0.02] text-sm font-bold text-slate-300 uppercase tracking-wider">
              <div className="pl-4">Features</div>
              <div className="text-center opacity-70">Starter</div>
              <div className="text-center text-purple-400">Professional</div>
              <div className="text-center opacity-70">Enterprise</div>
            </div>
            
            {featuresList.map((row, idx) => (
              <div key={idx} className="grid grid-cols-4 p-5 border-b border-white/5 hover:bg-white/[0.02] transition-colors items-center group">
                <div className={`pl-4 text-sm font-medium flex items-center gap-2 ${row.highlight ? 'text-purple-300' : 'text-slate-400 group-hover:text-slate-200'}`}>
                  {row.name}
                  {row.highlight && <Crown size={12} className="text-purple-500 animate-pulse" />}
                </div>
                <div className="flex justify-center">
                  {row.starter ? <Check size={18} className="text-slate-500" /> : <div className="w-2 h-2 rounded-full bg-slate-800" />}
                </div>
                <div className="flex justify-center">
                  {row.pro ? <Check size={18} className="text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" /> : <div className="w-2 h-2 rounded-full bg-slate-800" />}
                </div>
                <div className="flex justify-center">
                  {row.ent ? <Check size={18} className="text-emerald-400" /> : <div className="w-2 h-2 rounded-full bg-slate-800" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- FAQ SECTION --- */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Questions?</h2>
            <p className="text-slate-400">We are here to help you get setup.</p>
          </div>
          <div className="grid gap-4">
             {/* Simple Modern Accordion Style Cards */}
             <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
               <h3 className="font-bold text-white mb-2 flex items-center gap-3"><CreditCard className="text-purple-500" size={20}/> Payment methods?</h3>
               <p className="text-slate-400 text-sm ml-8">We accept all major credit cards including Visa, Mastercard, and Amex. Enterprise plans can be paid via wire transfer.</p>
             </div>
             <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
               <h3 className="font-bold text-white mb-2 flex items-center gap-3"><Users className="text-blue-500" size={20}/> Can I change seats?</h3>
               <p className="text-slate-400 text-sm ml-8">Absolutely. You can add or remove users at any time. Your billing will be prorated automatically.</p>
             </div>
          </div>
        </div>

      </main>
      </div>
    </>
  );
};

export default PricingPage;