import React, { useState } from 'react';
import { Calendar, CheckCircle2, Clock, ArrowRight, Zap, Rocket, Target, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

const Roadmap = () => {
  const [expandedPhase, setExpandedPhase] = useState('in-progress');

  const roadmapItems = [
    {
      phase: "Current",
      status: "completed",
      title: "Core Foundation & MVP",
      quarter: "Q4 2024",
      description: "Building the essential features for launch-ready product",
      items: [
        "User authentication & multi-tenant setup",
        "Role-based access control (Manager, Employee, HR)",
        "Team management & invitations",
        "Schedule/Shift Management with templates",
        "Notification system (in-app & email)",
        "Plan-based restrictions & billing",
        "Settings & user preferences",
        "Real-time dashboard metrics"
      ],
      color: "purple",
      progress: 100
    },
    {
      phase: "Next",
      status: "in-progress",
      title: "Essential Scheduling Features",
      quarter: "Q1 2025",
      description: "Critical features needed before launch",
      items: [
        "Time-Off Requests (request, approve/reject)",
        "Schedule Swaps (employee-initiated swaps)",
        "HR Dashboard (attendance reports, hours tracking)",
        "Clock In/Out System (attendance tracking)"
      ],
      color: "blue",
      progress: 25
    },
    {
      phase: "Post-Launch",
      status: "planned",
      title: "Enhanced Features",
      quarter: "Q2 2025",
      description: "Features to enhance user experience after launch",
      items: [
        "Mobile App (iOS & Android)",
        "Advanced Analytics & Reporting",
        "Automated Shift Filling",
        "In-App Messaging",
        "Payroll Exports (CSV/Excel)"
      ],
      color: "indigo",
      progress: 0
    },
    {
      phase: "Future",
      status: "planned",
      title: "Enterprise & Integrations",
      quarter: "Q3 2025+",
      description: "Enterprise features and third-party integrations",
      items: [
        "API Access for Enterprise",
        "Third-party Integrations (QuickBooks, ADP, Slack, etc.)",
        "Document Vault",
        "Compliance Audit Trail",
        "Advanced Customization Options"
      ],
      color: "pink",
      progress: 0
    }
  ];

  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return {
          icon: CheckCircle2,
          iconColor: 'text-emerald-400',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          text: 'text-emerald-300',
          progressBg: 'bg-emerald-500',
          glow: 'shadow-[0_0_20px_rgba(16,185,129,0.2)]',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
        };
      case 'in-progress':
        return {
          icon: Clock,
          iconColor: 'text-blue-400',
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30',
          text: 'text-blue-300',
          progressBg: 'bg-blue-500',
          glow: 'shadow-[0_0_20px_rgba(59,130,246,0.2)]',
          badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
        };
      default:
        return {
          icon: Target,
          iconColor: 'text-slate-500',
          bg: 'bg-slate-800/50',
          border: 'border-slate-700/50',
          text: 'text-slate-400',
          progressBg: 'bg-slate-600',
          glow: '',
          badge: 'bg-slate-700/50 text-slate-400 border-slate-600/50'
        };
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden font-sans selection:bg-purple-500/30">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[100px] mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 pt-24 pb-12 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-purple-300 text-sm font-semibold mb-6 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
          <Rocket size={16} className="text-purple-400" /> 
          <span className="tracking-wide uppercase text-xs font-bold">Development Roadmap</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter text-white drop-shadow-2xl">
          Our Journey to <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Launch & Beyond</span>
        </h1>
        
        <p className="text-base text-slate-400 max-w-2xl mx-auto">
          See where we are now, what's coming next, and our vision for the future.
        </p>
      </header>

      {/* Main Content - Grid Layout */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 gap-6">
          {roadmapItems.map((item, index) => {
            const config = getStatusConfig(item.status);
            const Icon = config.icon;
            const isExpanded = expandedPhase === item.phase;
            
            return (
              <div
                key={index}
                className={`group relative bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-md border ${config.border} rounded-2xl overflow-hidden transition-all duration-500 hover:from-white/[0.05] hover:to-white/[0.02] ${config.glow} cursor-pointer`}
                onClick={() => setExpandedPhase(isExpanded ? null : item.phase)}
              >
                {/* Decorative Background */}
                <div className={`absolute top-0 right-0 w-32 h-32 ${config.bg} rounded-full blur-3xl opacity-30 -z-0`}></div>
                
                <div className="relative z-10 p-6">
                  {/* Header Section */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${config.bg} ${config.border} border`}>
                          <Icon size={20} className={config.iconColor} />
                        </div>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold tracking-wider uppercase border ${config.badge}`}>
                          {item.phase}
                        </span>
                      </div>
                      <h3 className={`text-2xl font-black mb-1 ${config.text} group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-500`}>
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                        <Calendar size={14} />
                        <span>{item.quarter}</span>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                      {isExpanded ? (
                        <ChevronUp size={20} className="text-slate-500" />
                      ) : (
                        <ChevronDown size={20} className="text-slate-500" />
                      )}
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span>Progress</span>
                      <span className={config.text}>{item.progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${config.progressBg} transition-all duration-1000 ease-out`}
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Expandable Features List */}
                  <div className={`transition-all duration-500 overflow-hidden ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="pt-4 border-t border-white/10">
                      <ul className="space-y-2.5">
                        {item.items.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-3 text-sm">
                            <div className={`mt-1 flex-shrink-0 ${item.status === 'completed' ? 'text-emerald-400' : item.status === 'in-progress' ? 'text-blue-400' : 'text-slate-600'}`}>
                              {item.status === 'completed' ? (
                                <CheckCircle2 size={16} className="fill-emerald-500/20" />
                              ) : (
                                <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'in-progress' ? 'bg-blue-400' : 'bg-slate-600'}`}></div>
                              )}
                            </div>
                            <span className={`${item.status === 'completed' ? 'text-slate-300' : item.status === 'in-progress' ? 'text-slate-300' : 'text-slate-500'}`}>
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${config.progressBg} ${item.status === 'in-progress' ? 'animate-pulse' : ''}`}></div>
                      <span className="text-xs text-slate-500">{item.items.length} features</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 size={24} className="text-emerald-400" />
              <span className="text-2xl font-black text-emerald-300">1</span>
            </div>
            <p className="text-sm text-slate-400">Phase Completed</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <Clock size={24} className="text-blue-400 animate-spin" />
              <span className="text-2xl font-black text-blue-300">1</span>
            </div>
            <p className="text-sm text-slate-400">In Progress</p>
          </div>
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/30 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <Target size={24} className="text-slate-500" />
              <span className="text-2xl font-black text-slate-400">2</span>
            </div>
            <p className="text-sm text-slate-400">Planned</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 blur-3xl -z-10 rounded-full opacity-30"></div>
          
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[60px] pointer-events-none"></div>

            <div className="inline-block p-3 rounded-xl bg-white/5 border border-white/10 mb-4">
              <Sparkles className="text-yellow-400 fill-yellow-400/20" size={24} />
            </div>
            
            <h4 className="text-2xl font-bold text-white mb-2 tracking-tight">Stay Updated</h4>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Follow our progress and be the first to know when new features launch.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <a href="/changelog" className="px-6 py-3 bg-white text-slate-950 rounded-xl font-bold hover:bg-slate-200 transition-all shadow-lg flex items-center justify-center gap-2 group text-sm">
                View Changelog <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="/contact" className="px-6 py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all border border-white/20 flex items-center justify-center gap-2 text-sm">
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Roadmap;
