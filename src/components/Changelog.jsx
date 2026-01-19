import React from 'react';
import { Calendar, ChevronRight, Zap, Sparkles, Send, Activity } from 'lucide-react';

const ChangelogPage = () => {
  
  const updates = [
    {
      version: "v2.4.0",
      date: "March 10, 2024",
      title: "AI Forecasting & Smart Scheduling",
      description: "We've introduced intelligent forecasting to help you plan labor needs based on historical data patterns. The AI engine now analyzes over 50 data points to predict staffing requirements.",
      category: "Feature",
      tags: ["AI", "Enterprise"]
    },
    {
      version: "v2.3.5",
      date: "February 28, 2024",
      title: "Faster Mobile Access & Bug Fixes",
      description: "Optimized mobile app loading speeds by 40% and improved the reliability of shift-swap notifications. The dashboard now caches frequent requests for instant loading.",
      category: "Improvement",
      tags: ["Mobile", "Performance"]
    },
    {
      version: "v2.3.0",
      date: "February 12, 2024",
      title: "Public API Beta Launch",
      description: "External API access is now available for Enterprise clients. You can now sync your internal systems seamlessly with our REST endpoints.",
      category: "API",
      tags: ["Integration", "Enterprise"]
    }
  ];

  return (
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
              <div className="bg-white/[0.02] backdrop-blur-md border border-white/5 p-8 rounded-3xl hover:bg-white/[0.04] hover:border-purple-500/30 transition-all duration-500 shadow-xl group-hover:shadow-2xl group-hover:shadow-purple-500/5">
                
                {/* Meta Header */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold tracking-wider uppercase border ${
                    update.category === 'Feature' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                    update.category === 'Improvement' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {update.category}
                  </span>
                  
                  <div className="flex items-center text-slate-500 text-sm font-medium">
                    <Calendar size={14} className="mr-2 text-slate-600" />
                    {update.date}
                  </div>
                  
                  <div className="flex-grow"></div>
                  
                  <span className="font-mono text-xs text-slate-500 border border-white/10 px-2 py-1 rounded bg-black/20">
                    {update.version}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2 group-hover/card:text-purple-300 transition-colors">
                  {update.title}
                </h3>
                
                <p className="text-slate-400 text-lg leading-relaxed mb-8">
                  {update.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 border-t border-white/5 pt-6">
                  {update.tags.map(tag => (
                    <span key={tag} className="text-xs font-medium text-slate-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 hover:text-white hover:border-white/20 transition-colors cursor-default">
                      #{tag}
                    </span>
                  ))}
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
  );
};

export default ChangelogPage;
