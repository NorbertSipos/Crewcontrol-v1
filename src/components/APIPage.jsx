import React from 'react';
import { Code, Key, Globe, ShieldCheck, Copy, Terminal, ChevronRight, Server, Zap } from 'lucide-react';

const APIPage = () => {
  const endpoints = [
    { method: 'GET', path: '/v1/employees', desc: 'Retrieve a list of all active crew members.', status: 200 },
    { method: 'POST', path: '/v1/shifts', desc: 'Create a new shift assignment for a team.', status: 201 },
    { method: 'PATCH', path: '/v1/attendance', desc: 'Update clock-in/out status for a specific job.', status: 200 },
    { method: 'GET', path: '/v1/locations', desc: 'Fetch geo-fence coordinates for job sites.', status: 200 },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText('curl -X GET https://api.crewcontrol.com/v1/status -H "Authorization: Bearer YOUR_API_KEY"');
    // You could add a toast notification here
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden font-sans selection:bg-purple-500/30">
      
      {/* --- AMBIENT BACKGROUND GLOWS --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[100px] mix-blend-screen"></div>
        {/* Tech Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* --- HEADER --- */}
      <header className="relative z-10 pt-32 pb-20 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-emerald-400 text-sm font-semibold mb-8 shadow-[0_0_20px_rgba(16,185,129,0.15)] animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="tracking-wide uppercase text-xs font-bold">System Status: Operational</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white drop-shadow-2xl">
          Build on <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">CrewControl</span>
        </h1>
        
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          The most powerful API for workforce management. Sync shifts, track time, and automate payroll with just a few lines of code.
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-32 grid lg:grid-cols-3 gap-12 relative z-10">
        
        {/* --- LEFT COLUMN (Content) --- */}
        <div className="lg:col-span-2 space-y-16">
          
          {/* Authentication Section */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-purple-500/10 p-3 rounded-xl border border-purple-500/20">
                <Key className="text-purple-400" size={24} />
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Authentication</h2>
            </div>
            
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Authenticate your requests by including your secret key in the <code className="bg-white/10 text-white px-2 py-0.5 rounded text-sm font-mono border border-white/10">Authorization</code> header. 
              Never share your keys in client-side code.
            </p>
            
            {/* Code Block */}
            <div className="rounded-2xl border border-white/10 bg-[#0d1117] overflow-hidden shadow-2xl group relative">
              <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                </div>
                <div className="text-xs text-slate-500 font-mono">bash</div>
              </div>
              
              <div className="p-6 overflow-x-auto">
                <pre className="text-sm font-mono leading-relaxed text-slate-300">
                  <code>
                    <span className="text-purple-400">curl</span> -X GET https://api.crewcontrol.com/v1/status \<br/>
                    &nbsp;&nbsp;-H <span className="text-emerald-400">"Authorization: Bearer YOUR_API_KEY"</span>
                  </code>
                </pre>
              </div>

              <button 
                onClick={handleCopy} 
                className="absolute top-[52px] right-4 p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <Copy size={16} />
              </button>
            </div>
          </section>

          {/* Endpoints Section */}
          <section>
            <div className="flex items-center gap-4 mb-8">
               <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
                <Server className="text-blue-400" size={24} />
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Core Endpoints</h2>
            </div>
            
            <div className="space-y-4">
              {endpoints.map((ep, idx) => (
                <div 
                  key={idx} 
                  className="group bg-white/[0.02] border border-white/5 p-5 rounded-2xl flex items-center justify-between hover:bg-white/[0.04] hover:border-purple-500/30 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-5">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-black tracking-wider w-20 text-center border ${
                      ep.method === 'GET' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                      ep.method === 'POST' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      'bg-orange-500/10 text-orange-400 border-orange-500/20'
                    }`}>
                      {ep.method}
                    </span>
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="font-mono text-white font-bold text-lg">{ep.path}</p>
                        <span className="text-xs text-slate-600 px-2 py-0.5 rounded border border-white/5 bg-white/[0.02] group-hover:text-slate-400 transition-colors">
                          Status: {ep.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">{ep.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="text-slate-600 group-hover:text-purple-400 transition-transform group-hover:translate-x-1" size={20} />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* --- RIGHT COLUMN (Sidebar) --- */}
        <aside className="space-y-6">
          
          {/* Base URL Card */}
          <div className="bg-slate-900/50 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/20 transition-colors"></div>
            
            <Globe className="text-purple-400 mb-6" size={32} />
            <h3 className="text-lg font-bold mb-2 text-white">Base URL</h3>
            <div className="bg-black/40 p-3 rounded-lg border border-white/5 font-mono text-xs text-slate-300 break-all">
              https://api.crewcontrol.com/v1
            </div>
          </div>

          {/* Rate Limits Card */}
          <div className="bg-slate-900/50 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/20 transition-colors"></div>
            
            <ShieldCheck className="text-emerald-400 mb-6" size={32} />
            <h3 className="text-lg font-bold mb-2 text-white">Rate Limits</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              We allow <span className="text-white font-bold">5,000 requests</span> per hour. Need more? Contact enterprise support.
            </p>
          </div>

          {/* SDK CTA */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-3xl text-white shadow-[0_0_40px_rgba(79,70,229,0.3)] relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
             <div className="relative z-10">
               <Terminal className="mb-6" size={32} />
               <h3 className="text-xl font-bold mb-2">SDK Libraries</h3>
               <p className="text-indigo-100 text-sm mb-6">Start building faster with our official Node.js, Python, and Go wrappers.</p>
               <button className="w-full bg-white text-indigo-900 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors cursor-pointer shadow-lg">
                 View Documentation
               </button>
             </div>
          </div>

        </aside>
      </main>
    </div>
  );
};

export default APIPage;