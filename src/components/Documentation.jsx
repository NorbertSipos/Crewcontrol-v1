import React, { useState } from 'react';
import { 
  Zap, Smartphone, Code, Search, 
  Layout, Clock, CreditCard, 
  Headset, ArrowRight, BookOpen 
} from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { StructuredData, generateOrganizationSchema, generateWebPageSchema } from './StructuredData';

const DocumentationPage = () => {
  // SEO Meta Tags
  useSEO({
    title: 'Documentation - CrewControl | User Guides & Help Center',
    description: 'Complete documentation for CrewControl. Learn how to manage your workforce, schedule shifts, invite team members, and use all features of the platform.',
    keywords: 'crewcontrol documentation, user guide, help center, workforce management guide, scheduling software documentation',
    ogImage: 'https://crewcontrol.io/dashboard-screenshot.png',
    canonical: 'https://crewcontrol.io/documentation',
  });

  // Structured Data
  const organizationSchema = generateOrganizationSchema();
  const webpageSchema = generateWebPageSchema({
    name: 'Documentation - CrewControl',
    description: 'Complete documentation and user guides for CrewControl.',
    url: 'https://crewcontrol.io/documentation',
    breadcrumbs: [
      { name: 'Home', url: 'https://crewcontrol.io/' },
      { name: 'Documentation', url: 'https://crewcontrol.io/documentation' },
    ],
  });
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
            <span key={i} className="bg-purple-500/30 text-white rounded px-0.5 border border-purple-500/50">{part}</span> : part
        )}
      </span>
    );
  };

  return (
    <>
      {/* Structured Data for SEO Rich Snippets */}
      <StructuredData data={organizationSchema} />
      <StructuredData data={webpageSchema} />
      
      <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden font-sans selection:bg-purple-500/30">
      
      {/* --- AMBIENT BACKGROUND GLOWS --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[100px] mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* --- HEADER --- */}
      <header className="relative z-10 pt-32 pb-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-purple-300 text-sm font-semibold mb-8 shadow-[0_0_20px_rgba(168,85,247,0.15)] animate-in fade-in slide-in-from-top-4 duration-1000">
            <BookOpen size={16} className="text-purple-400" /> 
            <span className="tracking-wide uppercase text-xs font-bold">Knowledge Base</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter text-white drop-shadow-2xl">
            How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">help you?</span>
          </h1>
          
          {/* SEARCH BAR */}
          <div className="max-w-xl mx-auto relative mt-10 group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-400 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search guides, articles, or API docs..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/90 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-xl transition-all shadow-2xl"
              />
            </div>
          </div>
        </div>
      </header>

      {/* --- MAIN LAYOUT --- */}
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10 flex flex-col md:flex-row gap-12">
        
        {/* --- SIDEBAR MENU --- */}
        <aside className={`md:w-72 flex-shrink-0 space-y-2 ${searchQuery ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="sticky top-24">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-4">Categories</h3>
            {docCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 text-left border ${
                  activeCategory === cat.id 
                  ? "bg-purple-600/10 border-purple-500/30 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.15)]" 
                  : "border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                <div className={`${activeCategory === cat.id ? "text-purple-400" : "opacity-70"}`}>
                   {cat.icon}
                </div>
                {cat.title}
              </button>
            ))}

            {/* --- SUPPORT CARD --- */}
            <div className="mt-10 relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>

                <div className="flex items-center gap-4 mb-4 relative z-10">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/20">
                    <Headset size={20} className="text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white leading-tight">Enterprise Support</h4>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">24/7 Priority Access</p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mb-6 leading-relaxed relative z-10">
                  Need immediate assistance? Our dedicated engineering team is ready to help.
                </p>

                <button className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-emerald-500/30 text-white rounded-xl font-bold text-xs transition-all duration-300 flex items-center justify-center gap-2 group/btn relative z-10 cursor-pointer">
                  Open Live Chat
                  <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform text-emerald-400"/>
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
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                <Search size={20} className="text-purple-400" />
                Search results for "{searchQuery}"
              </h2>
              
              {filteredDocs.length === 0 && (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5 border-dashed">
                    <p className="text-slate-500">No results found.</p>
                </div>
              )}
              
              {filteredDocs.map((doc, idx) => (
                <div key={idx} className="bg-white/[0.02] backdrop-blur-md p-8 rounded-[2rem] border border-white/5 hover:bg-white/[0.04] transition-all group">
                  <div className="text-xs font-bold text-purple-400 uppercase mb-3 tracking-widest">{doc.category}</div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-200 transition-colors">
                    <HighlightedText text={doc.title} highlight={searchQuery} />
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    <HighlightedText text={doc.body} highlight={searchQuery} />
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500" key={activeCategory}>
              <div className="flex items-center gap-4 mb-8">
                 <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-purple-400">
                    {docCategories.find(c => c.id === activeCategory)?.icon}
                 </div>
                 <h2 className="text-3xl font-bold text-white tracking-tight">
                   {docCategories.find(c => c.id === activeCategory)?.title}
                 </h2>
              </div>

              {filteredDocs.map((doc, idx) => (
                <div key={idx} className="bg-white/[0.02] backdrop-blur-md p-8 rounded-[2rem] border border-white/5 hover:bg-white/[0.04] hover:border-purple-500/20 hover:shadow-[0_0_30px_rgba(168,85,247,0.05)] transition-all duration-300 group">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 group-hover:text-purple-300 transition-colors">
                    {doc.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed whitespace-pre-line text-sm md:text-base">
                    {doc.body}
                  </p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      </div>
    </>
  );
};

export default DocumentationPage;