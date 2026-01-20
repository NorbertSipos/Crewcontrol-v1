import React from 'react';
import { Check, X, TrendingDown, DollarSign, Zap, Shield, Users, Clock, ArrowRight, Star, FileSpreadsheet, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { StructuredData, generateOrganizationSchema, generateWebPageSchema } from './StructuredData';

const ExcelReplacement = () => {
  // SEO Meta Tags
  useSEO({
    title: 'Excel Replacement for Workforce Management | Stop Using Spreadsheets',
    description: 'Tired of Excel spreadsheets for employee scheduling? CrewControl replaces Excel with automated scheduling, real-time updates, mobile access, and team communication. No more manual errors.',
    keywords: 'excel replacement, excel alternative, spreadsheet replacement, employee scheduling excel alternative, workforce management without excel, stop using excel for scheduling',
    ogImage: 'https://crewcontrol.io/dashboard-screenshot.png',
    canonical: 'https://crewcontrol.io/excel-replacement',
  });

  // Structured Data
  const organizationSchema = generateOrganizationSchema();
  const webpageSchema = generateWebPageSchema({
    name: 'Excel Replacement for Workforce Management - CrewControl',
    description: 'Replace Excel spreadsheets with CrewControl for automated employee scheduling and workforce management.',
    url: 'https://crewcontrol.io/excel-replacement',
    breadcrumbs: [
      { name: 'Home', url: 'https://crewcontrol.io/' },
      { name: 'Excel Replacement', url: 'https://crewcontrol.io/excel-replacement' },
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
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-orange-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] mix-blend-screen"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </div>

        {/* Header */}
        <header className="relative z-10 pt-32 pb-20 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 backdrop-blur-md text-orange-300 text-sm font-semibold mb-8">
              <AlertTriangle size={16} className="text-orange-400" />
              <span>Stop Fighting with Spreadsheets</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white drop-shadow-2xl">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">Excel Replacement</span> You Need
            </h1>
            
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
              Say goodbye to manual spreadsheets, version conflicts, and errors. CrewControl automates your workforce management so you can focus on what matters.
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
          
          {/* Pain Points vs Solutions */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Excel Problems */}
            <div className="bg-red-500/10 backdrop-blur-xl rounded-3xl border border-red-500/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center border border-red-500/30">
                  <FileSpreadsheet className="text-red-400" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white">Excel Spreadsheets</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <X className="text-red-400 mt-0.5 shrink-0" size={20} />
                  <div>
                    <div className="font-semibold text-white mb-1">Manual Entry Errors</div>
                    <div className="text-sm text-slate-400">Double-booking, wrong dates, typos</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <X className="text-red-400 mt-0.5 shrink-0" size={20} />
                  <div>
                    <div className="font-semibold text-white mb-1">Version Conflicts</div>
                    <div className="text-sm text-slate-400">Multiple copies, who has the latest?</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <X className="text-red-400 mt-0.5 shrink-0" size={20} />
                  <div>
                    <div className="font-semibold text-white mb-1">No Real-Time Updates</div>
                    <div className="text-sm text-slate-400">Changes take hours to circulate</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <X className="text-red-400 mt-0.5 shrink-0" size={20} />
                  <div>
                    <div className="font-semibold text-white mb-1">No Mobile Access</div>
                    <div className="text-sm text-slate-400">Employees can't check shifts on the go</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <X className="text-red-400 mt-0.5 shrink-0" size={20} />
                  <div>
                    <div className="font-semibold text-white mb-1">Hours of Weekly Work</div>
                    <div className="text-sm text-slate-400">Building, updating, fixing schedules</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-red-500/20">
                <div className="text-center">
                  <div className="text-sm text-slate-400 mb-1">Time wasted per week:</div>
                  <div className="text-3xl font-black text-red-400">5-10 hours</div>
                </div>
              </div>
            </div>

            {/* CrewControl Solutions */}
            <div className="bg-gradient-to-br from-purple-500/20 to-emerald-500/10 rounded-3xl border-2 border-purple-500/30 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center border border-purple-500/30">
                    <Zap className="text-purple-400" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">CrewControl</h3>
                  <div className="ml-auto bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                    SOLUTION
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Check className="text-emerald-400 mt-0.5 shrink-0" size={20} />
                    <div>
                      <div className="font-semibold text-white mb-1">Automated Scheduling</div>
                      <div className="text-sm text-slate-300">AI conflict detection, zero errors</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="text-emerald-400 mt-0.5 shrink-0" size={20} />
                    <div>
                      <div className="font-semibold text-white mb-1">Single Source of Truth</div>
                      <div className="text-sm text-slate-300">One system, always up-to-date</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="text-emerald-400 mt-0.5 shrink-0" size={20} />
                    <div>
                      <div className="font-semibold text-white mb-1">Instant Updates</div>
                      <div className="text-sm text-slate-300">Changes sync immediately</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="text-emerald-400 mt-0.5 shrink-0" size={20} />
                    <div>
                      <div className="font-semibold text-white mb-1">Mobile Apps</div>
                      <div className="text-sm text-slate-300">Employees check shifts anywhere</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="text-emerald-400 mt-0.5 shrink-0" size={20} />
                    <div>
                      <div className="font-semibold text-white mb-1">5-Minute Setup</div>
                      <div className="text-sm text-slate-300">Import your team and start</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-purple-500/30">
                  <div className="text-center">
                    <div className="text-sm text-slate-300 mb-1">Time saved per week:</div>
                    <div className="text-3xl font-black text-emerald-400">5-10 hours</div>
                    <div className="text-sm text-emerald-400 mt-1">Get your time back!</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Comparison */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-12 mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-8 text-center">Excel vs CrewControl</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-4 text-slate-300 font-semibold">Feature</th>
                    <th className="text-center py-4 px-4 text-red-400 font-semibold">Excel</th>
                    <th className="text-center py-4 px-4 text-purple-400 font-semibold">CrewControl</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-4 text-slate-300">Drag-and-Drop Scheduling</td>
                    <td className="py-4 px-4 text-center"><X className="text-red-400 mx-auto" size={20} /></td>
                    <td className="py-4 px-4 text-center"><Check className="text-purple-400 mx-auto" size={20} /></td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-4 text-slate-300">Conflict Detection</td>
                    <td className="py-4 px-4 text-center"><X className="text-red-400 mx-auto" size={20} /></td>
                    <td className="py-4 px-4 text-center"><Check className="text-purple-400 mx-auto" size={20} /></td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-4 text-slate-300">Real-Time Updates</td>
                    <td className="py-4 px-4 text-center"><X className="text-red-400 mx-auto" size={20} /></td>
                    <td className="py-4 px-4 text-center"><Check className="text-purple-400 mx-auto" size={20} /></td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-4 text-slate-300">Mobile Access</td>
                    <td className="py-4 px-4 text-center"><X className="text-red-400 mx-auto" size={20} /></td>
                    <td className="py-4 px-4 text-center"><Check className="text-purple-400 mx-auto" size={20} /></td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-4 text-slate-300">Team Notifications</td>
                    <td className="py-4 px-4 text-center"><X className="text-red-400 mx-auto" size={20} /></td>
                    <td className="py-4 px-4 text-center"><Check className="text-purple-400 mx-auto" size={20} /></td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-4 text-slate-300">Shift Templates</td>
                    <td className="py-4 px-4 text-center text-slate-400 text-sm">Manual copy/paste</td>
                    <td className="py-4 px-4 text-center text-emerald-400 text-sm font-semibold">One-click reuse</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-4 text-slate-300">Time-Off Requests</td>
                    <td className="py-4 px-4 text-center text-slate-400 text-sm">Email or text</td>
                    <td className="py-4 px-4 text-center text-emerald-400 text-sm font-semibold">In-app with approval</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-slate-300 font-semibold text-white">Setup Time</td>
                    <td className="py-4 px-4 text-center text-slate-400 text-sm">Hours to build</td>
                    <td className="py-4 px-4 text-center text-emerald-400 text-sm font-semibold">5 minutes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-2xl border border-emerald-500/20 p-6">
              <Clock className="text-emerald-400 mb-4" size={32} />
              <h3 className="text-xl font-bold text-white mb-2">Save 5-10 Hours/Week</h3>
              <p className="text-sm text-slate-400">Stop manually updating spreadsheets. Automated scheduling does the work for you.</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-2xl border border-purple-500/20 p-6">
              <Shield className="text-purple-400 mb-4" size={32} />
              <h3 className="text-xl font-bold text-white mb-2">Zero Errors</h3>
              <p className="text-sm text-slate-400">AI conflict detection prevents double-booking and scheduling mistakes.</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-2xl border border-blue-500/20 p-6">
              <Users className="text-blue-400 mb-4" size={32} />
              <h3 className="text-xl font-bold text-white mb-2">Happy Employees</h3>
              <p className="text-sm text-slate-400">Mobile access means your team always knows their schedule.</p>
            </div>
          </div>

          {/* Migration Section */}
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-12 mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-6 text-center">Easy Migration from Excel</h2>
            <p className="text-lg text-slate-300 text-center mb-8 max-w-2xl mx-auto">
              Already have your team in a spreadsheet? Import them in seconds.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-slate-950/50 rounded-xl p-6 border border-white/5 text-center">
                <div className="text-4xl font-black text-purple-400 mb-2">1</div>
                <h3 className="font-bold text-white mb-2">Export from Excel</h3>
                <p className="text-sm text-slate-400">Save your team list as CSV</p>
              </div>
              <div className="bg-slate-950/50 rounded-xl p-6 border border-white/5 text-center">
                <div className="text-4xl font-black text-purple-400 mb-2">2</div>
                <h3 className="font-bold text-white mb-2">Import to CrewControl</h3>
                <p className="text-sm text-slate-400">Upload CSV file in settings</p>
              </div>
              <div className="bg-slate-950/50 rounded-xl p-6 border border-white/5 text-center">
                <div className="text-4xl font-black text-purple-400 mb-2">3</div>
                <h3 className="font-bold text-white mb-2">Start Scheduling</h3>
                <p className="text-sm text-slate-400">Your team is ready to go!</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-purple-500/20 to-orange-500/20 rounded-3xl border border-purple-500/30 p-12 text-center backdrop-blur-xl">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Stop Using Excel for Scheduling</h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Join teams who've replaced Excel with CrewControl and saved hours every week.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <button className="px-8 py-4 bg-white text-slate-950 rounded-xl font-bold hover:bg-purple-50 transition-all shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1 active:scale-95 cursor-pointer inline-flex items-center gap-2">
                  Replace Excel Now <ArrowRight size={18} />
                </button>
              </Link>
              <Link to="/pricing">
                <button className="px-8 py-4 bg-white/5 text-white rounded-xl font-bold border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                  View Pricing
                </button>
              </Link>
            </div>
            <p className="text-sm text-slate-400 mt-6">14-day free trial • Import your Excel data • Cancel anytime</p>
          </div>
        </main>
      </div>
    </>
  );
};

export default ExcelReplacement;
