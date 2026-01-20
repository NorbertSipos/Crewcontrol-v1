import React from 'react';
import { Check, X, TrendingDown, DollarSign, Zap, Shield, Users, Clock, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { StructuredData, generateOrganizationSchema, generateWebPageSchema } from './StructuredData';

const DeputyAlternative = () => {
  // SEO Meta Tags
  useSEO({
    title: 'Deputy Alternative - CrewControl vs Deputy | Better Workforce Management',
    description: 'Looking for a Deputy alternative? CrewControl offers simpler pricing, better usability, and focused workforce management. Compare features, pricing, and see why teams switch from Deputy.',
    keywords: 'deputy alternative, deputy vs crewcontrol, deputy competitor, workforce management alternative, scheduling software alternative, deputy pricing alternative',
    ogImage: 'https://crewcontrol.io/dashboard-screenshot.png',
    canonical: 'https://crewcontrol.io/deputy-alternative',
  });

  // Structured Data
  const organizationSchema = generateOrganizationSchema();
  const webpageSchema = generateWebPageSchema({
    name: 'Deputy Alternative - CrewControl vs Deputy',
    description: 'CrewControl: A better Deputy alternative with simpler pricing and focused workforce management.',
    url: 'https://crewcontrol.io/deputy-alternative',
    breadcrumbs: [
      { name: 'Home', url: 'https://crewcontrol.io/' },
      { name: 'Deputy Alternative', url: 'https://crewcontrol.io/deputy-alternative' },
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
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] mix-blend-screen"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </div>

        {/* Header */}
        <header className="relative z-10 pt-32 pb-20 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-md text-emerald-300 text-sm font-semibold mb-8">
              <TrendingDown size={16} className="text-emerald-400" />
              <span>Better Value, Same Features</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white drop-shadow-2xl">
              Looking for a <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Deputy Alternative</span>?
            </h1>
            
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
              CrewControl offers everything Deputy does—but with simpler pricing, better usability, and a focus on what actually matters for your team.
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
          
          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6 text-center">
              <DollarSign className="text-purple-400 mx-auto mb-4" size={32} />
              <div className="text-3xl font-black text-white mb-2">Save 60%</div>
              <div className="text-sm text-slate-400">vs Deputy per-user pricing</div>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-emerald-500/20 p-6 text-center">
              <Zap className="text-emerald-400 mx-auto mb-4" size={32} />
              <div className="text-3xl font-black text-white mb-2">5 Min</div>
              <div className="text-sm text-slate-400">Setup time (vs hours)</div>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-blue-500/20 p-6 text-center">
              <Users className="text-blue-400 mx-auto mb-4" size={32} />
              <div className="text-3xl font-black text-white mb-2">30-100</div>
              <div className="text-sm text-slate-400">Employees per plan</div>
            </div>
          </div>

          {/* Pricing Comparison */}
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-12 mb-16 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-black mb-8 text-center">Pricing Comparison</h2>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Deputy */}
              <div className="bg-slate-900/50 rounded-2xl border border-white/10 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Clock className="text-blue-400" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Deputy</h3>
                </div>
                
                <div className="mb-6">
                  <div className="text-4xl font-black text-white mb-2">$4.50/user</div>
                  <div className="text-sm text-slate-400">per month</div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3 text-sm">
                    <X className="text-red-400 mt-0.5" size={16} />
                    <span className="text-slate-400">Per-user pricing adds up quickly</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <X className="text-red-400 mt-0.5" size={16} />
                    <span className="text-slate-400">Complex interface</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <X className="text-red-400 mt-0.5" size={16} />
                    <span className="text-slate-400">Many features you may not need</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <div className="text-sm text-slate-500 mb-2">For 50 employees:</div>
                  <div className="text-2xl font-black text-white">$225/mo</div>
                </div>
              </div>

              {/* CrewControl */}
              <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/10 rounded-2xl border-2 border-purple-500/30 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center border border-purple-500/30">
                      <Zap className="text-purple-400" size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-white">CrewControl</h3>
                    <div className="ml-auto bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                      BETTER VALUE
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-4xl font-black text-white mb-2">$49.99/mo</div>
                    <div className="text-sm text-slate-300">flat rate for up to 100 employees</div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3 text-sm">
                      <Check className="text-emerald-400 mt-0.5" size={16} />
                      <span className="text-slate-200">No per-user fees</span>
                    </div>
                    <div className="flex items-start gap-3 text-sm">
                      <Check className="text-emerald-400 mt-0.5" size={16} />
                      <span className="text-slate-200">Simple, intuitive interface</span>
                    </div>
                    <div className="flex items-start gap-3 text-sm">
                      <Check className="text-emerald-400 mt-0.5" size={16} />
                      <span className="text-slate-200">Focused on scheduling & workforce</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-purple-500/30">
                    <div className="text-sm text-slate-300 mb-2">For 50 employees:</div>
                    <div className="text-2xl font-black text-emerald-400">$49.99/mo</div>
                    <div className="text-sm text-emerald-400 mt-1">Save $175/month!</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Savings Highlight */}
            <div className="mt-8 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingDown className="text-emerald-400" size={24} />
                <span className="text-xl font-bold text-emerald-400">Save up to $2,100 per year</span>
              </div>
              <p className="text-slate-400 text-sm">That's money back in your pocket for a 50-person team</p>
            </div>
          </div>

          {/* Feature Comparison Table */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-12 mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-8 text-center">Feature Comparison</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-4 text-slate-300 font-semibold">Feature</th>
                    <th className="text-center py-4 px-4 text-blue-400 font-semibold">Deputy</th>
                    <th className="text-center py-4 px-4 text-purple-400 font-semibold">CrewControl</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-4 text-slate-300">Employee Scheduling</td>
                    <td className="py-4 px-4 text-center"><Check className="text-blue-400 mx-auto" size={20} /></td>
                    <td className="py-4 px-4 text-center"><Check className="text-purple-400 mx-auto" size={20} /></td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-4 text-slate-300">Time Tracking</td>
                    <td className="py-4 px-4 text-center"><Check className="text-blue-400 mx-auto" size={20} /></td>
                    <td className="py-4 px-4 text-center"><Check className="text-purple-400 mx-auto" size={20} /></td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-4 text-slate-300">Shift Templates</td>
                    <td className="py-4 px-4 text-center"><Check className="text-blue-400 mx-auto" size={20} /></td>
                    <td className="py-4 px-4 text-center"><Check className="text-purple-400 mx-auto" size={20} /></td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-4 text-slate-300">Mobile App</td>
                    <td className="py-4 px-4 text-center"><Check className="text-blue-400 mx-auto" size={20} /></td>
                    <td className="py-4 px-4 text-center"><Check className="text-purple-400 mx-auto" size={20} /></td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-4 text-slate-300">Team Communication</td>
                    <td className="py-4 px-4 text-center"><Check className="text-blue-400 mx-auto" size={20} /></td>
                    <td className="py-4 px-4 text-center"><Check className="text-purple-400 mx-auto" size={20} /></td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-4 text-slate-300 font-semibold text-white">Pricing Model</td>
                    <td className="py-4 px-4 text-center text-slate-400 text-sm">Per-user ($4.50)</td>
                    <td className="py-4 px-4 text-center text-emerald-400 text-sm font-semibold">Flat rate ($49.99)</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-4 text-slate-300 font-semibold text-white">Setup Time</td>
                    <td className="py-4 px-4 text-center text-slate-400 text-sm">Hours</td>
                    <td className="py-4 px-4 text-center text-emerald-400 text-sm font-semibold">5 minutes</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-slate-300 font-semibold text-white">Learning Curve</td>
                    <td className="py-4 px-4 text-center text-slate-400 text-sm">Steep</td>
                    <td className="py-4 px-4 text-center text-emerald-400 text-sm font-semibold">Simple</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Why Switch Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Why Teams Switch</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="text-emerald-400 mt-0.5 shrink-0" size={20} />
                  <div>
                    <div className="font-semibold text-white mb-1">Predictable Costs</div>
                    <div className="text-sm text-slate-400">No surprises when you add employees</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-emerald-400 mt-0.5 shrink-0" size={20} />
                  <div>
                    <div className="font-semibold text-white mb-1">Faster Onboarding</div>
                    <div className="text-sm text-slate-400">Your team will be productive in minutes</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-emerald-400 mt-0.5 shrink-0" size={20} />
                  <div>
                    <div className="font-semibold text-white mb-1">Better Support</div>
                    <div className="text-sm text-slate-400">Responsive team that actually cares</div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Perfect For</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Star className="text-purple-400 mt-0.5 shrink-0" size={20} />
                  <div>
                    <div className="font-semibold text-white mb-1">Growing Teams (10-100 employees)</div>
                    <div className="text-sm text-slate-400">Scale without scaling costs</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="text-purple-400 mt-0.5 shrink-0" size={20} />
                  <div>
                    <div className="font-semibold text-white mb-1">Construction & Field Work</div>
                    <div className="text-sm text-slate-400">Designed for mobile-first teams</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="text-purple-400 mt-0.5 shrink-0" size={20} />
                  <div>
                    <div className="font-semibold text-white mb-1">Restaurants & Retail</div>
                    <div className="text-sm text-slate-400">Simple scheduling that works</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-3xl border border-purple-500/30 p-12 text-center backdrop-blur-xl">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to Make the Switch?</h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Join teams who've switched from Deputy and saved thousands while getting better results.
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
            <p className="text-sm text-slate-400 mt-6">14-day free trial • No credit card required • Cancel anytime</p>
          </div>
        </main>
      </div>
    </>
  );
};

export default DeputyAlternative;
