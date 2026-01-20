import React from 'react';
import { Calendar, ChevronRight, Zap, Sparkles, Send, Activity, Shield, Users, Bell, Settings, CheckCircle2, ArrowRight, Star } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { StructuredData, generateOrganizationSchema, generateWebPageSchema } from './StructuredData';

const ChangelogPage = () => {
  // SEO Meta Tags
  useSEO({
    title: 'Changelog - CrewControl | Product Updates & New Features',
    description: 'Stay updated with the latest CrewControl features, improvements, and updates. See what\'s new in workforce management and employee scheduling.',
    keywords: 'crewcontrol changelog, product updates, new features, workforce management updates, scheduling software updates',
    ogImage: 'https://crewcontrol.io/dashboard-screenshot.png',
    canonical: 'https://crewcontrol.io/changelog',
  });

  // Structured Data
  const organizationSchema = generateOrganizationSchema();
  const webpageSchema = generateWebPageSchema({
    name: 'Changelog - CrewControl',
    description: 'Stay updated with the latest CrewControl features, improvements, and updates.',
    url: 'https://crewcontrol.io/changelog',
    breadcrumbs: [
      { name: 'Home', url: 'https://crewcontrol.io/' },
      { name: 'Changelog', url: 'https://crewcontrol.io/changelog' },
    ],
  });
  
  const updates = [
    {
      version: "v0.9.5",
      date: "December 2024",
      title: "Plan-Based Restrictions & Enhanced Team Management",
      description: "We've implemented comprehensive plan-based restrictions to ensure fair usage across all subscription tiers. Starter plans are now limited to 30 employees with HR role access restricted to Professional and Enterprise plans. The system now enforces employee limits before invitations, displays real-time remaining slots, and shows clear upgrade prompts when limits are reached. Enhanced team management includes visual warnings, disabled invite buttons at capacity, and detailed plan limit information in the stats dashboard.",
      category: "Feature",
      tags: ["Billing", "Team Management", "Plan Limits"]
    },
    {
      version: "v0.9.3",
      date: "December 2024",
      title: "Improved Navigation & User Experience",
      description: "Reorganized sidebar navigation for managers with a more intuitive order: Overview, Build Team, Team, and Shift Templates. Fixed avatar dropdown menu functionality across all pages, ensuring consistent access to Settings and Logout options. Enhanced user menu with smooth animations and better visual feedback.",
      category: "Improvement",
      tags: ["UX", "Navigation", "UI"]
    },
    {
      version: "v0.9.1",
      date: "December 2024",
      title: "Modern Toast Notifications with Animations",
      description: "Introduced beautiful, animated toast notifications for shift deletion and other key actions. Notifications feature slide-in animations, fade effects, scale transitions, and shimmer effects. Success messages now appear in the bottom-right corner with modern gradient backgrounds and auto-dismiss after 3 seconds.",
      category: "Feature",
      tags: ["Notifications", "Animations", "UX"]
    }
  ];

  return (
    <>
      {/* Structured Data for SEO Rich Snippets */}
      <StructuredData data={organizationSchema} />
      <StructuredData data={webpageSchema} />
      
      <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden font-sans selection:bg-purple-500/30">
      
      {/* --- AMBIENT BACKGROUND GLOWS --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[100px] mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* --- HEADER --- */}
      <header className="relative z-10 pt-32 pb-20 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-purple-300 text-sm font-semibold mb-8 shadow-[0_0_20px_rgba(168,85,247,0.15)] animate-in fade-in slide-in-from-top-4 duration-1000">
          <Activity size={16} className="text-purple-400" /> 
          <span className="tracking-wide uppercase text-xs font-bold">Product Updates</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white drop-shadow-2xl">
          What's New in <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">CrewControl</span>
        </h1>
        
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          We ship new features every week. Follow our journey as we build the future of workforce management.
        </p>
      </header>

      {/* --- TIMELINE CONTENT --- */}
      <main className="max-w-4xl mx-auto px-6 pb-32 relative z-10">
        
        <div className="relative border-l border-white/10 ml-4 md:ml-0 space-y-16">
          {/* Timeline Gradient Line Overlay */}
          <div className="absolute top-0 left-[-1px] w-[1px] h-full bg-gradient-to-b from-purple-500 via-transparent to-transparent"></div>

          {updates.map((update, index) => (
            <div key={index} className="ml-8 md:ml-12 relative group">
              
              {/* Timeline Indicator (Glowing Dot) */}
              <div className="absolute -left-[41px] md:-left-[57px] top-6 w-5 h-5 rounded-full bg-slate-950 border border-purple-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)] z-10">
                 <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              </div>
              
              {/* Update Card */}
              <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-md border border-white/10 p-8 md:p-10 rounded-3xl hover:bg-gradient-to-br hover:from-white/[0.05] hover:to-white/[0.02] hover:border-purple-500/40 transition-all duration-500 shadow-xl group-hover:shadow-2xl group-hover:shadow-purple-500/10 relative overflow-hidden">
                
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -z-0"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl -z-0"></div>
                
                <div className="relative z-10">
                  {/* Meta Header */}
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <span className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase border backdrop-blur-sm ${
                      update.category === 'Feature' ? 'bg-gradient-to-r from-purple-500/20 to-purple-600/10 text-purple-300 border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]' :
                      update.category === 'Improvement' ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/10 text-blue-300 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]' :
                      'bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 text-emerald-300 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                    }`}>
                      {update.category === 'Feature' && <Sparkles size={12} className="inline mr-1.5" />}
                      {update.category === 'Improvement' && <Zap size={12} className="inline mr-1.5" />}
                      {update.category}
                    </span>
                    
                    <div className="flex items-center text-slate-400 text-sm font-medium bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                      <Calendar size={14} className="mr-2 text-slate-500" />
                      {update.date}
                    </div>
                    
                    <div className="flex-grow"></div>
                    
                    <span className="font-mono text-xs text-purple-300 border border-purple-500/30 px-3 py-1.5 rounded-lg bg-purple-500/10 backdrop-blur-sm shadow-[0_0_10px_rgba(168,85,247,0.1)]">
                      {update.version}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-3xl md:text-4xl font-black text-white mb-6 flex items-center gap-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-500">
                    <div className={`p-2 rounded-xl ${
                      update.category === 'Feature' ? 'bg-purple-500/20 border border-purple-500/30' :
                      update.category === 'Improvement' ? 'bg-blue-500/20 border border-blue-500/30' :
                      'bg-emerald-500/20 border border-emerald-500/30'
                    }`}>
                      {update.category === 'Feature' && <Star size={20} className="text-purple-400" />}
                      {update.category === 'Improvement' && <Zap size={20} className="text-blue-400" />}
                    </div>
                    {update.title}
                  </h3>
                  
                  <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/30 rounded-2xl p-6 mb-8 border border-white/10 backdrop-blur-sm">
                    <p className="text-slate-300 text-base md:text-lg leading-relaxed">
                      {update.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-3 border-t border-white/10 pt-6">
                    {update.tags.map((tag, tagIndex) => (
                      <span key={tag} className="group/tag text-xs font-semibold text-slate-300 bg-gradient-to-r from-white/10 to-white/5 px-4 py-2 rounded-lg border border-white/10 hover:text-white hover:border-purple-500/50 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-purple-600/10 transition-all duration-300 cursor-default flex items-center gap-2 shadow-sm hover:shadow-purple-500/20">
                        <CheckCircle2 size={12} className="opacity-50 group-hover/tag:opacity-100 group-hover/tag:text-purple-400 transition-all" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- NEWSLETTER CTA --- */}
        <div className="mt-32 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 blur-3xl -z-10 rounded-full opacity-30"></div>
          
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] p-10 md:p-16 border border-white/10 text-center shadow-2xl relative overflow-hidden">
            {/* Inner Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[60px] pointer-events-none"></div>

            <div className="inline-block p-3 rounded-2xl bg-white/5 border border-white/10 mb-6">
               <Zap className="text-yellow-400 fill-yellow-400/20" size={32} />
            </div>
            
            <h4 className="text-3xl font-bold text-white mb-4 tracking-tight">Never miss an update</h4>
            <p className="text-slate-400 mb-10 max-w-md mx-auto text-lg">
              Join 12,000+ engineers receiving our monthly roundup of new features and tips.
            </p>
            
            <form className="flex flex-col sm:flex-row max-w-lg mx-auto gap-3 relative z-10">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-grow px-6 py-4 rounded-xl border border-white/10 bg-black/30 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all" 
              />
              <button className="bg-white text-slate-950 px-8 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 group">
                Subscribe <Send size={16} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
            
            <p className="mt-6 text-xs text-slate-600">No spam, unsubscribe anytime.</p>
          </div>
        </div>

      </main>
      </div>
    </>
  );
};

export default ChangelogPage;
