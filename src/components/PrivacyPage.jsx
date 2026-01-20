import React from 'react';
import { 
  ShieldCheck, Eye, Lock, FileText, Globe, 
  Server, Cookie, Users, Clock, Mail, Check 
} from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { StructuredData, generateOrganizationSchema, generateWebPageSchema } from './StructuredData';

const PrivacyPage = () => {
  // SEO Meta Tags
  useSEO({
    title: 'Privacy Policy - CrewControl | Data Protection & Privacy',
    description: 'Read CrewControl\'s privacy policy to understand how we collect, use, and protect your personal information and workforce data. Last updated: January 2026.',
    keywords: 'privacy policy, data protection, gdpr compliance, workforce data privacy, employee data protection',
    ogImage: 'https://crewcontrol.io/dashboard-screenshot.png',
    canonical: 'https://crewcontrol.io/privacy',
  });

  // Structured Data
  const organizationSchema = generateOrganizationSchema();
  const webpageSchema = generateWebPageSchema({
    name: 'Privacy Policy - CrewControl',
    description: 'Read CrewControl\'s privacy policy to understand how we protect your data.',
    url: 'https://crewcontrol.io/privacy',
    breadcrumbs: [
      { name: 'Home', url: 'https://crewcontrol.io/' },
      { name: 'Privacy Policy', url: 'https://crewcontrol.io/privacy' },
    ],
  });
  const lastUpdated = "January 14, 2026";

  const privacySections = [
    {
      title: "1. Information We Collect",
      icon: <Eye size={24} className="text-purple-400" />,
      content: [
        "**Account Information:** When you sign up, we collect your name, email address, company name, and password (hashed).",
        "**Workforce Data:** We process data you input regarding your employees, including names, roles, schedules, and time logs.",
        "**Usage Data:** We automatically collect log data such as IP addresses, browser type, and pages visited to optimize performance."
      ]
    },
    {
      title: "2. How We Use Data",
      icon: <Server size={24} className="text-indigo-400" />,
      content: [
        "**Service Delivery:** To provide scheduling, time tracking, and payroll export features.",
        "**Communication:** To send transactional emails (password resets, billing) and product updates (if opted in).",
        "**Security:** To detect and prevent fraud, abuse, or security incidents."
      ]
    },
    {
      title: "3. Cookies & Tracking",
      icon: <Cookie size={24} className="text-orange-400" />,
      content: [
        "**Essential Cookies:** Required for login and session management.",
        "**Analytics Cookies:** We use anonymous analytics (e.g., PostHog) to understand how users interact with our dashboard.",
        "**Opt-Out:** You can configure your browser to refuse all cookies, though some features of CrewControl may not function properly."
      ]
    },
    {
      title: "4. Data Sharing & Subprocessors",
      icon: <Users size={24} className="text-blue-400" />,
      content: [
        "We do not sell your data. We only share data with trusted third-party service providers required to run our app:",
        "**AWS (Amazon Web Services):** Hosting and Database storage.",
        "**Stripe:** Payment processing (we never store credit card numbers).",
        "**SendGrid:** Transactional email delivery."
      ]
    },
    {
      title: "5. Data Retention",
      icon: <Clock size={24} className="text-emerald-400" />,
      content: [
        "**Active Accounts:** We retain your data for as long as your account is active.",
        "**Deleted Accounts:** Upon account deletion, we retain data in backups for 30 days before permanent erasure.",
        "**Legal Logs:** Access logs and audit trails are retained for 1 year for security compliance."
      ]
    },
    {
      title: "6. Security Measures",
      icon: <Lock size={24} className="text-red-400" />,
      content: [
        "**Encryption:** Data at rest is encrypted with AES-256. Data in transit uses TLS 1.3.",
        "**Access Control:** We enforce strict Role-Based Access Control (RBAC) and Multi-Factor Authentication (MFA) for internal staff access.",
        "**Audits:** We undergo annual penetration testing by independent security firms."
      ]
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
        <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px] mix-blend-screen"></div>
        {/* Tech Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* --- HEADER --- */}
      <header className="relative z-10 pt-32 pb-24 px-6 text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center justify-center p-5 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 mb-8 shadow-2xl shadow-purple-500/10">
            <ShieldCheck size={48} className="text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-white drop-shadow-2xl">
            Privacy & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Protection</span>
          </h1>
          
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            We believe data privacy is a fundamental human right. Here is exactly how we handle, process, and protect your workforce data.
          </p>
          
          <div className="mt-8 inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-slate-400 text-xs font-mono">
            Last Updated: <span className="text-white">{lastUpdated}</span>
          </div>
        </div>
      </header>

      {/* --- CONTENT --- */}
      <main className="max-w-5xl mx-auto px-6 pb-32 relative z-10">
        
        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {privacySections.map((section, idx) => (
            <div 
              key={idx} 
              className="group backdrop-blur-xl p-8 rounded-[2rem] border border-white/5 bg-white/[0.02] transition-all duration-500 relative overflow-hidden flex flex-col hover:border-purple-500/30 hover:bg-white/[0.04]"
            >
              {/* Hover Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[50px] -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                  {section.icon}
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white">{section.title}</h2>
              </div>
              
              <div className="space-y-3 relative z-10 flex-grow">
                {section.content.map((point, i) => {
                  // Basic markdown parsing for **bold**
                  const parts = point.split('**');
                  return (
                    <div key={i} className="flex items-start gap-3 text-sm text-slate-400 leading-relaxed">
                      <div className="w-1.5 h-1.5 bg-purple-500/50 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>
                        {parts.length > 1 ? (
                          <>
                            <strong className="text-slate-200">{parts[1]}</strong>
                            {parts[2]}
                          </>
                        ) : (
                          point
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* GDPR / Privacy Rights Section */}
        <div className="relative group">
           <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
           
           <div className="bg-slate-900/90 backdrop-blur-2xl rounded-[3rem] p-10 md:p-16 border border-white/10 shadow-2xl relative overflow-hidden">
              {/* Inner ambient light */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[60px] -mr-20 -mt-20 pointer-events-none"></div>

              <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold mb-4 uppercase tracking-widest text-xs">
                    <Globe size={16} /> User Rights
                  </div>
                  <h3 className="text-3xl font-black text-white mb-6">
                    Your Data, Your Control.
                  </h3>
                  <p className="text-lg text-slate-400 leading-relaxed mb-8">
                    Under GDPR and CCPA, you have the right to access, rectify, or delete your personal data. We are dedicated to data sovereignty and provide tools within your dashboard to export your data at any time.
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                    <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-300 flex items-center gap-2">
                      <Check size={14} className="text-emerald-400" /> Right to Access
                    </div>
                    <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-300 flex items-center gap-2">
                      <Check size={14} className="text-emerald-400" /> Right to Erasure
                    </div>
                    <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-300 flex items-center gap-2">
                      <Check size={14} className="text-emerald-400" /> Right to Portability
                    </div>
                  </div>
                </div>

                {/* Contact Box */}
                <div className="w-full md:w-80 bg-black/40 rounded-2xl p-6 border border-white/10 text-center">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail size={24} className="text-purple-400" />
                  </div>
                  <h4 className="font-bold text-white mb-2">Privacy Officer</h4>
                  <p className="text-sm text-slate-500 mb-6">
                    Questions about your data? Contact our Data Protection Officer directly.
                  </p>
                  <a href="mailto:privacy@crewcontrol.io" className="block w-full py-3 bg-white text-slate-950 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                    privacy@crewcontrol.io
                  </a>
                </div>
              </div>
           </div>
        </div>

      </main>
      </div>
    </>
  );
};

export default PrivacyPage;