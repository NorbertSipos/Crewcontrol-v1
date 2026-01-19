import React from 'react';
import { Zap, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const IntegrationsPage = () => {
  const integrations = [
    {
      name: 'QuickBooks',
      category: 'Payroll',
      description: 'Export timesheets directly to QuickBooks for seamless payroll processing.',
      icon: '💰',
      status: 'Available'
    },
    {
      name: 'ADP',
      category: 'Payroll',
      description: 'Sync employee hours with ADP for automated payroll calculations.',
      icon: '📊',
      status: 'Available'
    },
    {
      name: 'Xero',
      category: 'Accounting',
      description: 'Connect CrewControl to Xero for integrated financial management.',
      icon: '💼',
      status: 'Available'
    },
    {
      name: 'Google Calendar',
      category: 'Calendar',
      description: '2-way sync with Google Calendar. Shifts appear automatically in employee calendars.',
      icon: '📅',
      status: 'Available'
    },
    {
      name: 'Slack',
      category: 'Communication',
      description: 'Get shift notifications and updates directly in Slack channels.',
      icon: '💬',
      status: 'Coming Soon'
    },
    {
      name: 'Microsoft Teams',
      category: 'Communication',
      description: 'Integrate shift schedules and notifications with Microsoft Teams.',
      icon: '👥',
      status: 'Coming Soon'
    }
  ];

  const categories = ['All', 'Payroll', 'Accounting', 'Calendar', 'Communication'];

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden font-sans selection:bg-purple-500/30">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] mix-blend-screen"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 pt-32 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-purple-300 text-sm font-semibold mb-8">
            <Zap size={16} className="text-purple-400" />
            <span>Extend Your Workflow</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white drop-shadow-2xl">
            Integrations & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">Connections</span>
          </h1>
          
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Connect CrewControl with the tools you already use. Seamless integrations for payroll, accounting, and communication.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        {/* Integrations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {integrations.map((integration, index) => (
            <div
              key={index}
              className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 hover:bg-white/[0.08] transition-all duration-500 hover:-translate-y-2 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{integration.icon}</div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  integration.status === 'Available' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                }`}>
                  {integration.status}
                </span>
              </div>
              
              <h3 className="text-xl font-bold mb-2 text-white">{integration.name}</h3>
              <p className="text-xs text-purple-400 mb-4 uppercase tracking-wider">{integration.category}</p>
              <p className="text-slate-400 text-sm leading-relaxed">{integration.description}</p>
              
              {integration.status === 'Available' && (
                <div className="mt-6 pt-6 border-t border-white/5">
                  <span className="text-sm text-purple-400 group-hover:text-purple-300 transition-colors flex items-center gap-2">
                    Learn More <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center py-12 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 rounded-3xl border border-purple-500/20 p-12">
          <h2 className="text-3xl font-bold mb-4">Need a custom integration?</h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            We're constantly adding new integrations. If you need to connect with a specific tool, let us know.
          </p>
          <Link to="/contact">
            <button className="px-8 py-4 bg-white text-slate-950 rounded-full font-bold hover:bg-purple-50 transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-1 active:scale-95 cursor-pointer">
              Request Integration →
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default IntegrationsPage;
