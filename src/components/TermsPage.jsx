import React from 'react';
import { jsPDF } from "jspdf";
import { 
  Scale, ShieldAlert, CheckCircle2, AlertCircle, FileWarning, 
  ArrowRight, CreditCard, Ban, Server, Copyright, Users, Globe, Download 
} from 'lucide-react';

const TermsPage = () => {
  const lastUpdated = "January 14, 2026";

  // --- BUSINESS LEGAL DATA ---
  const legalSections = [
    {
      title: "1. Acceptance of Terms",
      icon: <Scale size={24} className="text-indigo-400" />,
      content: "By accessing or using CrewControl, you agree to be bound by these Terms. If you are using the Service on behalf of an organization, you are agreeing to these Terms for that organization and promising that you have the authority to bind that organization to these terms."
    },
    {
      title: "2. Subscription & Payments",
      icon: <CreditCard size={24} className="text-purple-400" />,
      content: "CrewControl is a subscription service. You agree to pay the fees applicable to your chosen plan (Starter, Pro, or Enterprise). Payments are billed in advance on a monthly or annual basis. Subscriptions auto-renew unless cancelled 24 hours prior to the end of the current period. Refunds are not provided for partial months."
    },
    {
      title: "3. Account Responsibilities",
      icon: <CheckCircle2 size={24} className="text-emerald-400" />,
      content: "You are responsible for maintaining the security of your account and password. CrewControl cannot and will not be liable for any loss or damage from your failure to comply with this security obligation. You are responsible for all content posted and activity that occurs under your account."
    },
    {
      title: "4. Acceptable Use Policy",
      icon: <Ban size={24} className="text-rose-400" />,
      content: "You may not use the Service for any illegal purpose or to violate any laws in your jurisdiction. You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service without express written permission by us."
    },
    {
      title: "5. Service Availability (SLA)",
      icon: <Server size={24} className="text-blue-400" />,
      content: "We strive to provide 99.9% uptime for Enterprise customers. However, strictly necessary maintenance or force majeure events may cause downtime. We do not warrant that the service will be uninterrupted, timely, secure, or error-free."
    },
    {
      title: "6. User Generated Content",
      icon: <Users size={24} className="text-orange-400" />,
      content: "You retain ownership of all content (schedules, employee data) you post to the Service. However, you grant CrewControl a worldwide, royalty-free license to use, host, store, and display your content solely as required to provide the Service to you."
    },
    {
      title: "7. Intellectual Property",
      icon: <Copyright size={24} className="text-pink-400" />,
      content: "The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of CrewControl and its licensors. The Service is protected by copyright, trademark, and other laws."
    },
    {
      title: "8. Termination",
      icon: <ShieldAlert size={24} className="text-red-400" />,
      content: "We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease."
    },
    {
      title: "9. Limitation of Liability",
      icon: <AlertCircle size={24} className="text-amber-400" />,
      content: "In no event shall CrewControl, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses."
    },
    {
      title: "10. Governing Law",
      icon: <Globe size={24} className="text-cyan-400" />,
      content: "These Terms shall be governed and construed in accordance with the laws of the European Union and the local jurisdiction of our headquarters, without regard to its conflict of law provisions."
    }
  ];

  // --- PDF GENERATION LOGIC ---
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    let yPos = 20;

    // Title
    doc.setFontSize(22);
    doc.text("CrewControl - Terms of Service", 20, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    doc.text(`Last Updated: ${lastUpdated}`, 20, yPos);
    yPos += 20;

    // Content Loop
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    
    legalSections.forEach((section) => {
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.text(section.title, 20, yPos);
      yPos += 7;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const splitText = doc.splitTextToSize(section.content, 170);
      doc.text(splitText, 20, yPos);
      
      yPos += (splitText.length * 5) + 10; 
    });

    doc.setFontSize(10);
    doc.text("© 2026 CrewControl Inc. All rights reserved.", 20, pageHeight - 10);
    doc.save("CrewControl_Terms_of_Service.pdf");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* --- AMBIENT BACKGROUND GLOWS --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] left-[-5%] w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-[20%] right-[-5%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[130px] mix-blend-screen"></div>
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* --- HEADER --- */}
      <header className="relative z-10 pt-32 pb-24 px-6 text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center justify-center p-5 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 mb-8 shadow-2xl shadow-indigo-500/10">
            <FileWarning size={48} className="text-indigo-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-white drop-shadow-2xl">
            Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-300">Service</span>
          </h1>
          
          <p className="text-lg font-medium text-indigo-200/70 max-w-2xl mx-auto">
            Please review our rules and regulations. Last updated: <span className="font-bold text-white">{lastUpdated}</span>
          </p>
        </div>
      </header>

      {/* --- CONTENT --- */}
      <main className="max-w-6xl mx-auto px-6 pb-32 relative z-10">
        
        {/* Legal Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-24">
          {legalSections.map((section, idx) => (
            <div 
              key={idx} 
              className="group backdrop-blur-xl p-8 rounded-[2rem] border border-white/5 bg-white/[0.02] transition-all duration-500 flex flex-col relative overflow-hidden hover:border-indigo-500/30 hover:bg-white/[0.04]"
            >
              {/* Hover Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[50px] -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="flex items-start gap-5 relative z-10">
                <div className="flex-shrink-0 w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:border-indigo-500/30 transition-all duration-500 shadow-inner">
                  {section.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-indigo-300 transition-colors">{section.title}</h2>
                  <p className="leading-relaxed text-slate-400 text-sm">
                    {section.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Card */}
        <div className="relative group max-w-3xl mx-auto">
           <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
           
           <div className="bg-slate-900/90 backdrop-blur-2xl rounded-[3rem] p-10 md:p-16 text-center border border-white/10 shadow-2xl relative overflow-hidden">
              {/* Inner ambient light */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[60px] -mr-20 -mt-20 pointer-events-none"></div>

              <h3 className="text-3xl font-bold text-white mb-4 relative z-10">Need a hard copy?</h3>
              <p className="text-slate-400 mb-10 max-w-lg mx-auto relative z-10 text-lg">
                You can download the full legal agreement as a PDF file for your company records.
              </p>
              
              <button 
                onClick={generatePDF}
                className="group/btn relative z-10 flex items-center gap-3 px-8 py-4 bg-white text-slate-950 rounded-xl font-bold hover:bg-indigo-50 transition-all cursor-pointer mx-auto shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 duration-300"
              >
                <Download size={20} />
                Download Official PDF 
                <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
           </div>
        </div>

      </main>
    </div>
  );
};

export default TermsPage;