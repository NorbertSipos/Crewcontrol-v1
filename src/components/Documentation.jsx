import React, { useState } from 'react';
import { 
  Zap, Smartphone, Code, Search, 
  Layout, Clock, CreditCard, 
  Headset, ArrowRight 
} from 'lucide-react';

const DocumentationPage = () => {
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');

  // --- KNOWLEDGE BASE DATA ---
  const docCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <Zap size={20} />,
      content: [
        {
          title: "Creating your Workspace",
          body: "Your workspace is the central hub for your company. To create one, simply sign up and follow the onboarding wizard. You will be asked to define your company name, default time zone, and the start day of your work week (e.g., Monday or Sunday)."
        },
        {
          title: "Inviting Team Members",
          body: "Go to the 'Team' tab and click 'Add Employee'. You can add them individually by email or bulk upload via CSV. Employees will receive an email invitation with a magic link to set up their password and download the mobile app."
        },
        {
          title: "Defining Roles & Permissions",
          body: "CrewControl comes with 3 default roles: \n1. Admin: Full access to billing and settings.\n2. Manager: Can edit schedules and approve timesheets for their specific teams.\n3. Crew: Read-only access to their own schedule and time clock features."
        }
      ]
    },
    {
      id: 'scheduling',
      title: 'Smart Scheduling',
      icon: <Layout size={20} />,
      content: [
        {
          title: "Using the Drag & Drop Calendar",
          body: "Our calendar view supports intuitive drag & drop actions. Simply click on an open shift template from the sidebar and drag it onto an employee's row. To move a shift, click and hold the shift card, then drop it on the new date or employee."
        },
        {
          title: "Handling Conflicts",
          body: "The system automatically detects conflicts. If you try to schedule an employee who is already working, on leave, or has exceeded their weekly hour limit, a red warning modal will appear requiring confirmation."
        },
        {
          title: "Recurring Shifts",
          body: "For fixed schedules, use the 'Repeat' feature. Open a shift, check 'Make Recurring', and select the frequency (Daily, Weekly, Bi-weekly). You can set an end date or let it run indefinitely."
        }
      ]
    },
    {
      id: 'time-tracking',
      title: 'Time & Attendance',
      icon: <Clock size={20} />,
      content: [
        {
          title: "GPS Geofencing",
          body: "Ensure your crew is on-site before they clock in. You can set a geofence radius (e.g., 500 meters) around each Job Site. If an employee tries to clock in outside this zone, the app will block the action or flag it for manager review."
        },
        {
          title: "Biometric Verification",
          body: "On the mobile app, you can enable FaceID or Fingerprint requirements for clock-ins to prevent 'buddy punching'."
        },
        {
          title: "Timesheet Approvals",
          body: "At the end of a pay period, managers can review all time logs. Flagged entries (late arrivals, missed breaks) are highlighted in yellow for quick resolution."
        }
      ]
    },
    {
      id: 'mobile-app',
      title: 'Mobile App Guide',
      icon: <Smartphone size={20} />,
      content: [
        {
          title: "Worker Dashboard",
          body: "Upon logging in, workers see their 'Upcoming Shifts' immediately. They can tap a shift to see address details, notes from the manager, and the 'Clock In' button."
        },
        {
          title: "Shift Swapping",
          body: "If a worker cannot make a shift, they can request a swap. Eligible coworkers (same role/skills) will receive a notification to accept the shift. The manager must give final approval."
        },
        {
          title: "Offline Mode",
          body: "No signal? No problem. The app stores clock-in/out data locally and syncs it to the cloud automatically once the internet connection is restored."
        }
      ]
    },
    {
      title: 'Payroll & Reports',
      id: 'payroll',
      icon: <CreditCard size={20} />,
      content: [
        {
          title: "Exporting Data",
          body: "Go to Reports > Payroll. Select your date range. You can export data in CSV, Excel, or PDF formats compatible with major providers like ADP, Paychex, and QuickBooks."
        },
        {
          title: "Overtime Rules",
          body: "Configure your local labor laws in Settings. You can set daily (e.g., >8 hours) and weekly (e.g., >40 hours) overtime thresholds. The system calculates 1.5x and 2.0x rates automatically."
        }
      ]
    },
    {
      title: 'API & Integrations',
      id: 'api-docs',
      icon: <Code size={20} />,
      content: [
        {
          title: "Generating API Keys",
          body: "Enterprise admins can generate Bearer tokens in the Developer Portal. Keep these keys secure; they grant full access to your organization's data."
        },
        {
          title: "Webhooks",
          body: "Subscribe to real-time events. We can send a JSON payload to your endpoint whenever a shift is created, updated, or deleted."
        }
      ]
    }
  ];

  // --- SEARCH LOGIC ---
  const filteredDocs = searchQuery.length > 0 
    ? docCategories.flatMap(cat => 
        cat.content.filter(article => 
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          article.body.toLowerCase().includes(searchQuery.toLowerCase())
        ).map(article => ({ ...article, category: cat.title }))
      )
    : docCategories.find(c => c.id === activeCategory)?.content || [];

  // Helper component for highlighting search terms
  const HighlightedText = ({ text, highlight }) => {
    if (!highlight.trim()) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() ? 
            <span key={i} className="bg-yellow-200 text-slate-900 rounded px-0.5">{part}</span> : part
        )}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#fcfaff] relative overflow-hidden">
      
      {/* --- BACKGROUND DECORATION --- */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[15%] right-[-5%] w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] bg-purple-200/20 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#4338ca 1px, transparent 1px), linear-gradient(90deg, #4338ca 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      {/* --- HEADER --- */}
      <header className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6">Documentation</h1>
          
          {/* SEARCH BAR */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search guides, articles, or API docs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-md transition-all"
            />
          </div>
        </div>

        {/* Separator */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none translate-y-[1px]">
          <svg className="relative block w-full h-[60px] md:h-[100px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-1.11,1200,0.47V120H0Z" fill="#fcfaff"></path>
          </svg>
        </div>
      </header>

      {/* --- MAIN LAYOUT --- */}
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10 flex flex-col md:flex-row gap-12">
        
        {/* --- SIDEBAR MENU --- */}
        <aside className={`md:w-72 flex-shrink-0 space-y-2 ${searchQuery ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="sticky top-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-4">Categories</h3>
            {docCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 text-left ${
                  activeCategory === cat.id 
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30" 
                  : "text-slate-600 hover:bg-white hover:shadow-sm"
                }`}
              >
                {cat.icon}
                {cat.title}
              </button>
            ))}

            {/* --- NEW MODERN QUICK SUPPORT CARD --- */}
            <div className="mt-10 relative group">
              {/* Background Glow */}
              <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>

              {/* Glass Card */}
              <div className="relative bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white/50 shadow-xl overflow-hidden">

                {/* Inner Decoration */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-emerald-100/50 rounded-full blur-2xl"></div>

                {/* Header with Icon */}
                <div className="flex items-center gap-4 mb-4 relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Headset size={24} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-black text-lg text-slate-900 leading-tight">Enterprise Support</h4>
                    <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider">24/7 Priority Access</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 mb-6 leading-relaxed relative z-10">
                  Need immediate assistance? Our dedicated engineering team is ready to help you resolve critical issues.
                </p>

                {/* Modern Button */}
                <button className="w-full py-3 px-4 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-bold text-sm transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2 group/btn relative z-10 cursor-pointer">
                  Open Live Chat
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform"/>
                </button>
              </div>
            </div>
            {/* --- END OF CARD --- */}

          </div>
        </aside>

        {/* --- CONTENT AREA --- */}
        <main className="flex-grow min-h-[500px]">
          {searchQuery.length > 0 ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Search size={20} className="text-purple-600" />
                Search results for "{searchQuery}"
              </h2>
              {filteredDocs.length === 0 && (
                <p className="text-slate-500 italic">No documentation found matching your query.</p>
              )}
              {filteredDocs.map((doc, idx) => (
                <div key={idx} className="bg-white/70 backdrop-blur-md p-8 rounded-[2rem] border border-white shadow-lg hover:shadow-xl transition-all">
                  <div className="text-xs font-bold text-purple-500 uppercase mb-2 tracking-widest">{doc.category}</div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    <HighlightedText text={doc.title} highlight={searchQuery} />
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    <HighlightedText text={doc.body} highlight={searchQuery} />
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500" key={activeCategory}>
              <div className="flex items-center gap-3 mb-8">
                 <div className="p-3 bg-white rounded-2xl shadow-sm text-purple-600">
                    {docCategories.find(c => c.id === activeCategory)?.icon}
                 </div>
                 <h2 className="text-3xl font-bold text-slate-900">
                   {docCategories.find(c => c.id === activeCategory)?.title}
                 </h2>
              </div>

              {filteredDocs.map((doc, idx) => (
                <div key={idx} className="bg-white/70 backdrop-blur-md p-8 rounded-[2rem] border border-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    {doc.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                    {doc.body}
                  </p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DocumentationPage;