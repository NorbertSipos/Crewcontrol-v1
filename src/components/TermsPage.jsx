import React from 'react';
import { jsPDF } from "jspdf";
import { 
  Scale, ShieldAlert, CheckCircle2, AlertCircle, FileWarning, 
  ArrowRight, CreditCard, Ban, Server, Copyright, Users, Globe 
} from 'lucide-react';

const TermsPage = () => {
  const lastUpdated = "January 14, 2026";

  // --- BUSINESS LEGAL DATA ---
  const legalSections = [
    {
      title: "1. Acceptance of Terms",
      icon: <Scale size={24} className="text-indigo-600" />,
      content: "By accessing or using CrewControl, you agree to be bound by these Terms. If you are using the Service on behalf of an organization, you are agreeing to these Terms for that organization and promising that you have the authority to bind that organization to these terms."
    },
    {
      title: "2. Subscription & Payments",
      icon: <CreditCard size={24} className="text-purple-600" />,
      content: "CrewControl is a subscription service. You agree to pay the fees applicable to your chosen plan (Starter, Pro, or Enterprise). Payments are billed in advance on a monthly or annual basis. Subscriptions auto-renew unless cancelled 24 hours prior to the end of the current period. Refunds are not provided for partial months."
    },
    {
      title: "3. Account Responsibilities",
      icon: <CheckCircle2 size={24} className="text-green-600" />,
      content: "You are responsible for maintaining the security of your account and password. CrewControl cannot and will not be liable for any loss or damage from your failure to comply with this security obligation. You are responsible for all content posted and activity that occurs under your account."
    },
    {
      title: "4. Acceptable Use Policy",
      icon: <Ban size={24} className="text-red-600" />,
      content: "You may not use the Service for any illegal purpose or to violate any laws in your jurisdiction. You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service without express written permission by us."
    },
    {
      title: "5. Service Availability (SLA)",
      icon: <Server size={24} className="text-blue-600" />,
      content: "We strive to provide 99.9% uptime for Enterprise customers. However, strictly necessary maintenance or force majeure events may cause downtime. We do not warrant that the service will be uninterrupted, timely, secure, or error-free."
    },
    {
      title: "6. User Generated Content",
      icon: <Users size={24} className="text-orange-600" />,
      content: "You retain ownership of all content (schedules, employee data) you post to the Service. However, you grant CrewControl a worldwide, royalty-free license to use, host, store, and display your content solely as required to provide the Service to you."
    },
    {
      title: "7. Intellectual Property",
      icon: <Copyright size={24} className="text-pink-600" />,
      content: "The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of CrewControl and its licensors. The Service is protected by copyright, trademark, and other laws."
    },
    {
      title: "8. Termination",
      icon: <ShieldAlert size={24} className="text-rose-600" />,
      content: "We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease."
    },
    {
      title: "9. Limitation of Liability",
      icon: <AlertCircle size={24} className="text-amber-600" />,
      content: "In no event shall CrewControl, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses."
    },
    {
      title: "10. Governing Law",
      icon: <Globe size={24} className="text-cyan-600" />,
      content: "These Terms shall be governed and construed in accordance with the laws of the European Union and the local jurisdiction of our headquarters, without regard to its conflict of law provisions."
    }
  ];

  // --- PDF GENERATION LOGIC ---
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    let yPos = 20; // Start position

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
      // Check if we need a new page
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = 20;
      }

      // Section Title
      doc.setFont("helvetica", "bold");
      doc.text(section.title, 20, yPos);
      yPos += 7;

      // Section Content (Split text to fit width)
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const splitText = doc.splitTextToSize(section.content, 170); // 170mm width
      doc.text(splitText, 20, yPos);
      
      // Calculate new Y position based on text lines
      yPos += (splitText.length * 5) + 10; 
    });

    // Footer
    doc.setFontSize(10);
    doc.text("© 2026 CrewControl Inc. All rights reserved.", 20, pageHeight - 10);

    // Save
    doc.save("CrewControl_Terms_of_Service.pdf");
  };

  return (
    <div className="min-h-screen bg-[#fcfaff] relative overflow-hidden">
      
      {/* --- BACKGROUND DECORATION --- */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[15%] left-[-5%] w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[-5%] w-[600px] h-[600px] bg-purple-200/20 rounded-full blur-[130px]"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#4338ca 1px, transparent 1px), linear-gradient(90deg, #4338ca 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      {/* --- HEADER --- */}
      <header className="bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 mb-6">
            <FileWarning size={32} className="text-indigo-300" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-300">Service</span></h1>
          <p className="text-indigo-200 text-lg font-medium">Please review our rules and regulations. Last updated: {lastUpdated}</p>
        </div>

        {/* Separator */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none translate-y-[1px]">
          <svg className="relative block w-full h-[60px] md:h-[100px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-1.11,1200,0.47V120H0Z" fill="#fcfaff"></path>
          </svg>
        </div>
      </header>

      {/* --- CONTENT --- */}
      <main className="max-w-6xl mx-auto px-6 py-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-6">
          {legalSections.map((section, idx) => (
            <div 
              key={idx} 
              className="group bg-white/70 backdrop-blur-md p-8 rounded-[2rem] border border-white shadow-xl shadow-indigo-900/5 hover:shadow-indigo-900/10 hover:-translate-y-1 transition-all duration-500 flex flex-col"
            >
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-indigo-50 shadow-sm group-hover:scale-110 transition-transform duration-500">
                  {section.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">{section.title}</h2>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {section.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Card */}
        <div className="mt-16 bg-slate-900 text-white p-10 rounded-[2.5rem] text-center max-w-3xl mx-auto shadow-2xl shadow-slate-900/30 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
           
           <h3 className="text-2xl font-bold mb-4 relative z-10">Need a hard copy?</h3>
           <p className="text-slate-400 mb-8 max-w-lg mx-auto relative z-10">
             You can download the full legal agreement as a PDF file for your company records.
           </p>
           
           <button 
             onClick={generatePDF}
             className="relative z-10 flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-full font-bold hover:bg-indigo-50 transition-colors cursor-pointer mx-auto shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 duration-300"
           >
             Download Official PDF <ArrowRight size={18} />
           </button>
        </div>
      </main>
    </div>
  );
};

export default TermsPage;