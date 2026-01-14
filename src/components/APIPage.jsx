import React from 'react';
import { Code, Key, Globe, ShieldCheck, Copy, Terminal, ChevronRight } from 'lucide-react';

const APIPage = () => {
  const endpoints = [
    { method: 'GET', path: '/v1/employees', desc: 'Retrieve a list of all active crew members.' },
    { method: 'POST', path: '/v1/shifts', desc: 'Create a new shift assignment for a team.' },
    { method: 'PATCH', path: '/v1/attendance', desc: 'Update clock-in/out status for a specific job.' },
    { method: 'GET', path: '/v1/locations', desc: 'Fetch geo-fence coordinates for job sites.' },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText('curl -X GET https://api.crewcontrol.com/v1/status -H "Authorization: Bearer YOUR_API_KEY"');
    alert('Code copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="flex items-center gap-3 justify-center mb-6">
            <div className="bg-purple-500/20 p-2 rounded-lg backdrop-blur-sm border border-purple-400/30">
              <Code className="text-purple-400" size={24} />
            </div>
            <span className="text-purple-400 font-bold tracking-widest uppercase text-sm">Developer Hub</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            CrewControl <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">REST API</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Build custom integrations, automate your payroll, and sync your workforce data with our enterprise-grade API.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Key className="text-purple-600" size={28} />
              <h2 className="text-3xl font-bold text-gray-900">Authentication</h2>
            </div>
            <p className="text-gray-600 text-lg mb-6">
              All API requests must be authenticated using a Bearer token. Generate keys in <code className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-sm">Settings &gt; Integrations</code>.
            </p>
            <div className="bg-slate-900 rounded-2xl p-6 shadow-xl relative group">
              <button onClick={handleCopy} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors cursor-pointer">
                <Copy size={18} />
              </button>
              <pre className="text-sm font-mono leading-relaxed overflow-x-auto">
                <code className="text-slate-300">
                  <span className="text-purple-400">curl</span> -X GET https://api.crewcontrol.com/v1/status \<br/>
                  &nbsp;&nbsp;-H <span className="text-green-400">"Authorization: Bearer YOUR_API_KEY"</span>
                </code>
              </pre>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Core Endpoints</h2>
            <div className="space-y-4">
              {endpoints.map((ep, idx) => (
                <div key={idx} className="bg-white border border-gray-100 p-5 rounded-2xl flex items-center justify-between hover:border-purple-200 transition-all shadow-sm group">
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-md text-xs font-bold ${
                      ep.method === 'GET' ? 'bg-blue-100 text-blue-700' : 
                      ep.method === 'POST' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {ep.method}
                    </span>
                    <div>
                      <p className="font-mono text-gray-900 font-bold">{ep.path}</p>
                      <p className="text-sm text-gray-500">{ep.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-300 group-hover:text-purple-500 transition-colors" size={20} />
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-8">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <Globe className="text-purple-600 mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2 text-gray-900">Base URL</h3>
            <p className="text-gray-500 text-sm font-mono bg-gray-50 p-2 rounded break-all">https://api.crewcontrol.com/v1</p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <ShieldCheck className="text-green-600 mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2 text-gray-900">Rate Limits</h3>
            <p className="text-gray-500 text-sm">
              Standard limits are <span className="font-bold text-gray-900">5,000 requests</span> per hour.
            </p>
          </div>

          <div className="bg-indigo-600 p-8 rounded-[2rem] text-white">
            <Terminal className="mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">SDKs</h3>
            <p className="text-indigo-100 text-sm mb-4">Official wrappers for Node.js, Python, and Go.</p>
            <button className="w-full bg-white text-indigo-600 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors cursor-pointer">
              View SDK Docs
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default APIPage;