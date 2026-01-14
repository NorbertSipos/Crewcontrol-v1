import React from 'react';
import { ShieldCheck, Eye, Lock, FileText, Globe, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPage = () => {
  const lastUpdated = "January 14, 2026";

  const sections = [
    {
      title: "1. Information We Collect",
      icon: <Eye size={24} className="text-purple-600" />,
      content: "We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us. This includes your name, email, company details, and workforce data (employee names and schedules)."
    },
    {
      title: "2. How We Use Data",
      icon: <Globe size={24} className="text-purple-600" />,
      content: "We use the collected data to provide, maintain, and improve our services, including scheduling automation, payroll exports, and real-time notifications for your crew members."
    },
    {
      title: "3. Data Security",
      icon: <Lock size={24} className="text-purple-600" />,
      content: "We implement industry-standard security measures, including 256-bit encryption for data at rest and TLS/SSL for data in transit. Your workforce data is isolated and encrypted to prevent unauthorized access."
    }
  ];

  return (
    <div className="min-h-screen bg-[#fcfaff] relative overflow-hidden">
      {/* --- BACKGROUND DECORATION --- */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[10%] right-[-5%] w-[400px] h-[400px] bg-purple-200/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-indigo-200/20 rounded-full blur-[120px]"></div>
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#4338ca 1px, transparent 1px), linear-gradient(90deg, #4338ca 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      {/* --- HEADER --- */}
      <header className="bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900 pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 mb-6">
            <ShieldCheck size={32} className="text-purple-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">Privacy Policy</h1>
          <p className="text-purple-200 text-lg">Safeguarding your data. Last updated: {lastUpdated}</p>
        </div>

        {/* FIXED Curved Separator - Merging with the bg color */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none translate-y-[1px]">
          <svg className="relative block w-full h-[60px] md:h-[100px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-1.11,1200,0.47V120H0Z" fill="#fcfaff"></path>
          </svg>
        </div>
      </header>

      {/* --- CONTENT --- */}
      <main className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        <div className="space-y-8">
          {sections.map((section, idx) => (
            <div 
              key={idx} 
              className="bg-white/70 backdrop-blur-sm p-8 md:p-10 rounded-[2.5rem] border border-white shadow-xl shadow-purple-900/5 hover:shadow-purple-900/10 transition-all duration-500"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl flex items-center justify-center border border-purple-100 shadow-inner">
                    {section.icon}
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">{section.title}</h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* GDPR Highlight Card */}
          <div className="mt-16 bg-gradient-to-br from-indigo-600 to-purple-700 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-900/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-white/20 transition-all duration-700"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FileText size={24} /> 
                Your GDPR Rights
              </h3>
              <p className="text-indigo-50 text-lg leading-relaxed mb-6 opacity-90">
                You have the right to access, correct, or delete your personal data. We are dedicated to your data sovereignty.
              </p>
              <div className="flex items-center gap-2 text-white font-bold bg-white/10 w-fit px-4 py-2 rounded-full border border-white/20">
                Email us: <span className="text-purple-200">privacy@crewcontrol.io</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPage;