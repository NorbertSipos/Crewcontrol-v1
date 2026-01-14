import React, { useState } from 'react';
import { 
  Check, X, Zap, Shield, Crown, HelpCircle, 
  ArrowRight, CreditCard, Sparkles, Building2 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  // --- PLANS DATA ---
  const plans = [
    {
      name: "Starter",
      desc: "Perfect for small crews getting organized.",
      price: isAnnual ? 0 : 0,
      period: "/forever",
      btnText: "Start for Free",
      btnColor: "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50",
      features: [
        "Up to 5 employees",
        "Basic Scheduling",
        "Mobile App Access",
        "1 Location",
        "Community Support"
      ],
      notIncluded: ["Time Tracking", "Payroll Export", "API Access"]
    },
    {
      name: "Professional",
      desc: "For growing businesses needing automation.",
      price: isAnnual ? 29 : 39,
      period: "/mo per user",
      isPopular: true,
      btnText: "Start 14-Day Trial",
      btnColor: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-purple-500/30",
      features: [
        "Up to 50 employees",
        "Smart Drag & Drop Scheduling",
        "GPS Time Tracking",
        "Payroll Exports (Excel/CSV)",
        "Priority Email Support",
        "Overtime Alerts"
      ],
      notIncluded: ["API Access", "SSO & Audit Logs"]
    },
    {
      name: "Enterprise",
      desc: "Full control & security for large organizations.",
      price: "Custom",
      period: "",
      btnText: "Contact Sales",
      btnColor: "bg-slate-900 text-white hover:bg-slate-800",
      features: [
        "Unlimited employees",
        "Everything in Professional",
        "Full REST API Access",
        "SSO (Okta, Azure AD)",
        "Dedicated Account Manager",
        "SLA (99.9% Uptime)",
        "On-premise Deployment option"
      ],
      notIncluded: []
    }
  ];

  // --- FEATURE MATRIX ---
  const featuresList = [
    { name: "Mobile App for Crews", starter: true, pro: true, ent: true },
    { name: "Drag & Drop Calendar", starter: true, pro: true, ent: true },
    { name: "GPS Time Clock", starter: false, pro: true, ent: true },
    { name: "Overtime Calculations", starter: false, pro: true, ent: true },
    { name: "Payroll Integrations", starter: false, pro: true, ent: true },
    { name: "Custom API Access", starter: false, pro: false, ent: true, highlight: true }, // Highlighted!
    { name: "Single Sign-On (SSO)", starter: false, pro: false, ent: true },
    { name: "Dedicated Success Manager", starter: false, pro: false, ent: true },
  ];

  // --- FAQs ---
  const faqs = [
    { q: "Do I need a credit card to sign up?", a: "No! You can start with our Free plan or a 14-day trial of Pro without entering any payment details." },
    { q: "Can I cancel anytime?", a: "Yes. There are no long-term contracts for Starter and Pro plans. You can upgrade, downgrade, or cancel at any time." },
    { q: "Is there a discount for annual billing?", a: "Absolutely. You save ~20% by choosing the annual billing option (selected by default)." },
    { q: "What happens if I need more than 50 employees?", a: "You'll be moved to our Enterprise tier, which offers volume discounts and dedicated infrastructure." },
  ];

  return (
    <div className="min-h-screen bg-[#fcfaff] relative overflow-hidden">
      
      {/* --- BACKGROUND DECORATION --- */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-purple-200/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#4338ca 1px, transparent 1px), linear-gradient(90deg, #4338ca 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      {/* --- HEADER --- */}
      <header className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pt-32 pb-32 px-6 relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-purple-300 text-sm font-bold mb-6">
            <Sparkles size={16} /> Simple, transparent pricing
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Choose the perfect plan for your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Crew</span>
          </h1>
          <p className="text-purple-200 text-lg max-w-2xl mx-auto mb-10">
            Start for free, scale as you grow. No hidden fees, no surprises.
          </p>

          {/* TOGGLE SWITCH */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-bold ${!isAnnual ? 'text-white' : 'text-slate-400'}`}>Monthly</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-16 h-8 bg-white/20 rounded-full p-1 transition-colors hover:bg-white/30 cursor-pointer"
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isAnnual ? 'translate-x-8' : 'translate-x-0'}`}></div>
            </button>
            <span className={`text-sm font-bold flex items-center gap-2 ${isAnnual ? 'text-white' : 'text-slate-400'}`}>
              Yearly <span className="bg-green-500 text-slate-900 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide">Save 20%</span>
            </span>
          </div>
        </div>

        {/* Curved Separator */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none translate-y-[1px]">
          <svg className="relative block w-full h-[60px] md:h-[100px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-1.11,1200,0.47V120H0Z" fill="#fcfaff"></path>
          </svg>
        </div>
      </header>

      {/* --- PRICING CARDS --- */}
      <main className="max-w-7xl mx-auto px-6 -mt-20 relative z-10 pb-20">
        <div className="grid lg:grid-cols-3 gap-8 mb-24">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`relative bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] border transition-all duration-300 flex flex-col
                ${plan.isPopular 
                  ? 'border-purple-500 shadow-2xl shadow-purple-900/20 scale-105 z-10' 
                  : 'border-white shadow-xl shadow-slate-200/50 hover:-translate-y-2'
                }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                  MOST POPULAR
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                <p className="text-sm text-slate-500 mt-2 min-h-[40px]">{plan.desc}</p>
              </div>

              <div className="mb-8 flex items-baseline gap-1">
                {typeof plan.price === 'number' ? (
                   <>
                     <span className="text-4xl font-black text-slate-900">${plan.price}</span>
                     <span className="text-slate-500 font-medium">{plan.period}</span>
                   </>
                ) : (
                  <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                )}
              </div>

              <button className={`w-full py-4 rounded-xl font-bold transition-all mb-8 cursor-pointer ${plan.btnColor}`}>
                {plan.btnText}
              </button>

              <div className="space-y-4 flex-grow">
                {plan.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-slate-700">
                    <Check size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
                {plan.notIncluded.map((feat, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-slate-400">
                    <X size={18} className="text-slate-300 flex-shrink-0 mt-0.5" />
                    <span className="line-through">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* --- COMPARISON TABLE --- */}
        <div className="mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Compare Features</h2>
          <div className="bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-white shadow-xl overflow-hidden">
            
            {/* Table Header */}
            <div className="grid grid-cols-4 p-6 bg-slate-50/50 border-b border-slate-100 text-sm font-bold text-slate-900">
              <div className="pl-4">Feature</div>
              <div className="text-center">Starter</div>
              <div className="text-center text-purple-600">Professional</div>
              <div className="text-center">Enterprise</div>
            </div>

            {/* Table Rows */}
            {featuresList.map((row, idx) => (
              <div 
                key={idx} 
                className={`grid grid-cols-4 p-5 border-b border-slate-100 last:border-0 hover:bg-white transition-colors items-center ${row.highlight ? 'bg-purple-50/50' : ''}`}
              >
                <div className={`pl-4 font-medium flex items-center gap-2 ${row.highlight ? 'text-purple-700 font-bold' : 'text-slate-700'}`}>
                  {row.name}
                  {row.highlight && <Crown size={14} className="text-purple-600" />}
                </div>
                <div className="flex justify-center">
                  {row.starter ? <Check size={20} className="text-green-500" /> : <X size={20} className="text-slate-300" />}
                </div>
                <div className="flex justify-center">
                  {row.pro ? <Check size={20} className="text-green-500" /> : <X size={20} className="text-slate-300" />}
                </div>
                <div className="flex justify-center">
                  {row.ent ? <Check size={20} className="text-green-500" /> : <X size={20} className="text-slate-300" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- FAQ SECTION --- */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-500">Have more questions? Contact our support team.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-white shadow-sm hover:shadow-md transition-all">
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <HelpCircle size={18} className="text-purple-500" /> {faq.q}
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed ml-7">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* --- TRUST BADGES --- */}
        <div className="mt-20 text-center border-t border-slate-200 pt-10">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Trusted by security-conscious teams</p>
          <div className="flex flex-wrap justify-center gap-6 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Placeholder Logos (Just text/icon representation for now) */}
             <div className="flex items-center gap-2 font-bold text-xl text-slate-700"><Building2 /> Acme Corp</div>
             <div className="flex items-center gap-2 font-bold text-xl text-slate-700"><Shield /> SecureNet</div>
             <div className="flex items-center gap-2 font-bold text-xl text-slate-700"><Zap /> PowerSystems</div>
          </div>
          
          <div className="mt-8 flex justify-center gap-4 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1"><CreditCard size={14}/> No credit card required</span>
            <span className="flex items-center gap-1"><Check size={14}/> Cancel anytime</span>
            <span className="flex items-center gap-1"><Shield size={14}/> SSL Secure Payment</span>
          </div>
        </div>

      </main>
    </div>
  );
};

export default PricingPage;