import React from 'react';
import { Check, X, TrendingDown, DollarSign, Zap, Shield, Users, Clock, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { StructuredData, generateOrganizationSchema, generateWebPageSchema } from './StructuredData';

const ConnecteamComparison = () => {
  // SEO Meta Tags
  useSEO({
    title: 'CrewControl vs Connecteam | Better Workforce Management Comparison',
    description: 'Compare CrewControl vs Connecteam. See why CrewControl offers better pricing, simpler interface, and focused features for workforce management. Perfect alternative to Connecteam.',
    keywords: 'crewcontrol vs connecteam, connecteam alternative, connecteam vs crewcontrol, workforce management comparison, connecteam pricing, crewcontrol better',
    ogImage: 'https://crewcontrol.io/dashboard-screenshot.png',
    canonical: 'https://crewcontrol.io/crewcontrol-vs-connecteam',
  });

  // Structured Data
  const organizationSchema = generateOrganizationSchema();
  const webpageSchema = generateWebPageSchema({
    name: 'CrewControl vs Connecteam - Workforce Management Comparison',
    description: 'Compare CrewControl vs Connecteam side-by-side. See pricing, features, and why CrewControl is the better choice.',
    url: 'https://crewcontrol.io/crewcontrol-vs-connecteam',
    breadcrumbs: [
      { name: 'Home', url: 'https://crewcontrol.io/' },
      { name: 'CrewControl vs Connecteam', url: 'https://crewcontrol.io/crewcontrol-vs-connecteam' },
    ],
  });

  return (
    <>
      {/* Structured Data for SEO Rich Snippets */}
      <StructuredData data={organizationSchema} />
      <StructuredData data={webpageSchema} />

      <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden font-sans selection:bg-purple-500/30">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[100px] mix-blend-screen"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </div>

        {/* Header */}
        <header className="relative z-10 pt-32 pb-20 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 backdrop-blur-md text-purple-300 text-sm font-semibold mb-8">
              <Shield size={16} className="text-purple-400" />
              <span>Head-to-Head Comparison</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white drop-shadow-2xl">
              CrewControl <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">vs Connecteam</span>
            </h1>
            
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
              Two workforce management platforms, but which one is right for you? See the detailed comparison and find out why teams choose CrewControl.
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
          
          {/* Quick Comparison Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Connecteam */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Users className="text-blue-400" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white">Connecteam</h3>
              </div>
              
              <div className="mb-6">
                <div className="text-3xl font-black text-white mb-2">$29/mo</div>
                <div className="text-sm text-slate-400">base price + $3/user/month</div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <Check className="text-blue-400 mt-0.5" size={16} />
                  <span className="text-slate-300">Comprehensive feature set</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <X className="text-red-400 mt-0.5" size={16} />
                  <span className="text-slate-400">Complex interface</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <X className="text-red-400 mt-0.5" size={16} />
                  <span className="text-slate-400">Per-user pricing escalates</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="text-sm text-slate-500 mb-2">For 30 employees:</div>
                <div className="text-2xl font-black text-white">$119/mo</div>
              </div>
            </div>

            {/* CrewControl */}
            <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/10 rounded-3xl border-2 border-purple-500/30 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center border border-purple-500/30">
                    <Zap className="text-purple-400" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">CrewControl</h3>
                  <div className="ml-auto bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                    WINNER
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="text-3xl font-black text-white mb-2">$19.99/mo</div>
                  <div className="text-sm text-slate-300">flat rate for up to 30 employees</div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-sm">
                    <Check className="text-emerald-400 mt-0.5" size={16} />
                    <span className="text-slate-200">Simple, focused features</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Check className="text-emerald-400 mt-0.5" size={16} />
                    <span className="text-slate-200">Intuitive interface</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Check className="text-emerald-400 mt-0.5" size={16} />
                    <span className="text-slate-200">No per-user fees</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-purple-500/30">
                  <div className="text-sm text-slate-300 mb-2">For 30 employees:</div>
                  <div className="text-2xl font-black text-emerald-400">$19.99/mo</div>
                  <div className="text-sm text-emerald-400 mt-1">Save $99/month!</div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Comparison */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-12 mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-8 text-center">Feature-by-Feature Comparison</h2>
            
            <div className="space-y-6">
              {[
                { feature: 'Employee Scheduling', connecteam: true, crewcontrol: true, note: 'Both excel at scheduling' },
                { feature: 'Time Tracking', connecteam: true, crewcontrol: true, note: 'Full time tracking support' },
                { feature: 'Shift Templates', connecteam: true, crewcontrol: true, note: 'Reusable templates available' },
                { feature: 'Mobile App', connecteam: true, crewcontrol: true, note: 'iOS and Android apps' },
                { feature: 'Team Communication', connecteam: true, crewcontrol: true, note: 'In-app messaging' },
                { feature: 'Payroll Integration', connecteam: true, crewcontrol: true, note: 'Export to QuickBooks, Xero, ADP' },
                { feature: 'Pricing Model', connecteam: false, crewcontrol: true, note: 'CrewControl: Flat rate | Connecteam: Base + per-user' },
                { feature: 'Ease of Use', connecteam: false, crewcontrol: true, note: 'CrewControl: Simple | Connecteam: Complex' },
                { feature: 'Setup Time', connecteam: false, crewcontrol: true, note: 'CrewControl: 5 min | Connecteam: Hours' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-6 bg-slate-950/50 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex-1">
                    <div className="font-semibold text-white mb-1">{item.feature}</div>
                    <div className="text-sm text-slate-400">{item.note}</div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.connecteam ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-slate-800 border border-slate-700'}`}>
                      {item.connecteam ? <Check className="text-blue-400" size={16} /> : <X className="text-slate-500" size={16} />}
                    </div>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.crewcontrol ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-slate-800 border border-slate-700'}`}>
                      {item.crewcontrol ? <Check className="text-purple-400" size={16} /> : <X className="text-slate-500" size={16} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Differentiators */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-2xl border border-purple-500/20 p-6">
              <DollarSign className="text-purple-400 mb-4" size={32} />
              <h3 className="text-xl font-bold text-white mb-2">Better Value</h3>
              <p className="text-sm text-slate-400">Save up to $1,200/year with flat-rate pricing. No surprises when you grow your team.</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-2xl border border-emerald-500/20 p-6">
              <Zap className="text-emerald-400 mb-4" size={32} />
              <h3 className="text-xl font-bold text-white mb-2">Simpler to Use</h3>
              <p className="text-sm text-slate-400">Less complexity, more focus. Your team will be productive from day one.</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-2xl border border-blue-500/20 p-6">
              <Shield className="text-blue-400 mb-4" size={32} />
              <h3 className="text-xl font-bold text-white mb-2">Focused Features</h3>
              <p className="text-sm text-slate-400">Everything you need for workforce management, nothing you don't.</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl border border-purple-500/30 p-12 text-center backdrop-blur-xl">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Choose CrewControl</h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              See why teams prefer CrewControl over Connecteam for simpler pricing and better usability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <button className="px-8 py-4 bg-white text-slate-950 rounded-xl font-bold hover:bg-purple-50 transition-all shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1 active:scale-95 cursor-pointer inline-flex items-center gap-2">
                  Start Free Trial <ArrowRight size={18} />
                </button>
              </Link>
              <Link to="/pricing">
                <button className="px-8 py-4 bg-white/5 text-white rounded-xl font-bold border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                  View Pricing
                </button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ConnecteamComparison;
