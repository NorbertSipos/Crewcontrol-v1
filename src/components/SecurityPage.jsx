import React from 'react';
import { jsPDF } from "jspdf";
import { ShieldCheck, Lock, Server, Eye, FileCheck, Smartphone, Check, ArrowRight, Shield } from 'lucide-react';

const SecurityPage = () => {
  
  // --- WHITEPAPER CONTENT (Unchanged Data) ---
  const whitepaperData = [
    {
      title: "1. Executive Summary",
      body: "CrewControl serves mission-critical operations for enterprise organizations globally. This document outlines our Defense-in-Depth strategy, detailing the physical, network, application, and operational security controls implemented to protect customer data. Our security posture is validated by third-party audits including SOC 2 Type II and ISO 27001 certifications."
    },
    {
      title: "2. Cloud Infrastructure & Physical Security",
      body: "CrewControl is hosted on Amazon Web Services (AWS) within Virtual Private Clouds (VPC). We utilize multiple Availability Zones (AZ) for high availability.\n\n- Data Center Security: AWS data centers feature perimeter fencing, 24/7 guarded access, biometric scanning, and video surveillance.\n- Network Segregation: Production environments are strictly separated from testing and development environments. We use public and private subnets with Network Access Control Lists (NACLs) and Security Groups acting as virtual firewalls."
    },
    {
      title: "3. Data Encryption Standards",
      body: "We maintain a strict 'encrypt-everything' policy.\n\n- Data at Rest: All persistent data volumes (EBS), databases (RDS), and object storage (S3) are encrypted using FIPS 140-2 compliant AES-256 algorithms. Keys are managed via AWS Key Management Service (KMS).\n- Data in Transit: All data transmitted between clients and our servers is protected using TLS 1.3 protocols. We enforce HSTS (HTTP Strict Transport Security) to prevent protocol downgrade attacks."
    },
    {
      title: "4. Access Control & Authentication",
      body: "CrewControl implements strict Role-Based Access Control (RBAC) and the Principle of Least Privilege.\n\n- Internal Access: CrewControl engineers access production systems only via VPN with Multi-Factor Authentication (MFA). Access logs are immutable and stored for 365 days.\n- Customer Access: We support SAML 2.0 and OIDC for Single Sign-On (SSO) integration with providers like Okta, Azure AD, and OneLogin. Brute-force protection and rate limiting are applied to all authentication endpoints."
    },
    {
      title: "5. Vulnerability Management",
      body: "Security is a continuous process, not a one-time check.\n\n- Automated Scanning: We use static code analysis (SAST) and dynamic application security testing (DAST) in our CI/CD pipelines.\n- Penetration Testing: We engage independent third-party security firms to conduct gray-box penetration testing on our application and infrastructure annually.\n- Bug Bounty: We maintain a private bug bounty program to incentivize responsible disclosure of vulnerabilities."
    },
    {
      title: "6. Business Continuity & Disaster Recovery",
      body: "Our infrastructure is designed to withstand catastrophic failures.\n\n- Backups: Database backups are performed continuously (Point-in-Time Recovery) and retained for 35 days. Encrypted snapshots are replicated to a separate geographic region daily.\n- RTO & RPO: Our Recovery Time Objective (RTO) is 4 hours, and our Recovery Point Objective (RPO) is 15 minutes.\n- Failover Testing: We conduct disaster recovery simulations twice a year to verify the integrity of our failover procedures."
    },
    {
      title: "7. Compliance & Regulatory Alignment",
      body: "CrewControl adheres to global data protection standards.\n\n- GDPR: We act as a Data Processor. We provide Data Processing Addendums (DPA) and support the Standard Contractual Clauses (SCC) for data transfers outside the EU.\n- SOC 2 Type II: Our report covers the Trust Services Criteria for Security, Availability, and Confidentiality. The full audit report is available upon request under NDA."
    },
    {
      title: "8. Incident Response Plan",
      body: "In the event of a security breach, CrewControl follows a strict Incident Response Plan (IRP) based on NIST SP 800-61.\n\n- Detection: 24/7 monitoring via SIEM tools.\n- Containment: Isolation of affected systems.\n- Eradication: Removal of threats and patching of vulnerabilities.\n- Notification: Affected customers are notified within 72 hours of a confirmed breach involving personal data."
    }
  ];

  // --- PDF GENERATION ENGINE ---
  const generateWhitepaper = () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    let yPos = 0;

    // --- COVER PAGE ---
    // Dark Background Block
    doc.setFillColor(2, 6, 23); // Slate-950 color
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(30);
    doc.setFont("helvetica", "bold");
    doc.text("SECURITY ARCHITECTURE", 20, 100);
    doc.text("WHITEPAPER", 20, 115);
    
    // Subtitle
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(52, 211, 153); // Emerald-400
    doc.text("Defense-in-Depth Strategy & Compliance", 20, 130);

    // Meta Info
    doc.setTextColor(148, 163, 184); // Slate-400
    doc.setFontSize(10);
    doc.text(`Version: 2.4 | Date: January 14, 2026`, 20, pageHeight - 30);
    doc.text("© 2026 CrewControl Inc. - Strictly Confidential", 20, pageHeight - 20);

    // --- CONTENT PAGES ---
    doc.addPage();
    yPos = 20;
    doc.setTextColor(0, 0, 0); // Keep content text black for readability in PDF

    whitepaperData.forEach((section, index) => {
      if (yPos > pageHeight - 60) {
        doc.addPage();
        yPos = 20;
      }

      // Section Title
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(2, 6, 23); // Slate-950
      doc.text(section.title, 20, yPos);
      yPos += 10;

      // Section Body
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85); // Slate-700
      
      const splitText = doc.splitTextToSize(section.body, 170);
      doc.text(splitText, 20, yPos);
      
      yPos += (splitText.length * 5) + 15;
    });

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text("CrewControl Security Whitepaper - Page " + doc.internal.getNumberOfPages(), pageWidth / 2, pageHeight - 10, { align: "center" });

    // Save
    doc.save("CrewControl_Security_Whitepaper_2026.pdf");
  };

  const securityFeatures = [
    {
      title: "Bank-Grade Encryption",
      icon: <Lock size={26} className="text-emerald-400" />,
      desc: "Data at rest is encrypted using AES-256. Data in transit is protected via TLS 1.3. Your information is unreadable to anyone without the key."
    },
    {
      title: "Secure Infrastructure",
      icon: <Server size={26} className="text-blue-400" />,
      desc: "Hosted on AWS (Amazon Web Services) in data centers that are ISO 27001, SOC 1 and SOC 2 compliant, ensuring physical and digital security."
    },
    {
      title: "Continuous Monitoring",
      icon: <Eye size={26} className="text-purple-400" />,
      desc: "Our automated systems monitor for suspicious activity 24/7. We perform regular penetration testing and vulnerability scans."
    },
    {
      title: "Access Control (RBAC)",
      icon: <Smartphone size={26} className="text-orange-400" />,
      desc: "Granular permission settings allow you to control exactly who sees what. Support for Two-Factor Authentication (2FA) and SSO."
    }
  ];

  const complianceBadges = [
    { name: "GDPR Compliant", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    { name: "SOC 2 Type II", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    { name: "ISO 27001", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
    { name: "99.99% Uptime", color: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden font-sans selection:bg-emerald-500/30">
      
      {/* --- AMBIENT BACKGROUND GLOWS --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[-5%] w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px] mix-blend-screen"></div>
        {/* Tech Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* --- HEADER --- */}
      <header className="relative z-10 pt-32 pb-24 px-6 text-center">
        
        {/* Live Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-950/50 border border-emerald-500/30 rounded-full backdrop-blur-md mb-8 shadow-[0_0_15px_rgba(16,185,129,0.2)] animate-in fade-in slide-in-from-top-4 duration-1000">
           <span className="relative flex h-2 w-2">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
           </span>
           <span className="text-emerald-400 text-xs font-bold tracking-widest uppercase">Systems Operational</span>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center justify-center p-5 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 mb-8 shadow-2xl shadow-emerald-500/10">
            <ShieldCheck size={48} className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white drop-shadow-2xl">
            Uncompromising <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Security</span>
          </h1>
          
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            We protect your workforce data with the same level of encryption and protocol used by global financial institutions.
          </p>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        
        {/* Compliance Badges Strip */}
        <div className="flex flex-wrap justify-center gap-4 mb-20">
          {complianceBadges.map((badge) => (
            <div key={badge.name} className={`px-6 py-2.5 rounded-full font-bold text-sm border flex items-center gap-2 backdrop-blur-sm transition-transform hover:scale-105 ${badge.color}`}>
              <Check size={16} strokeWidth={3} />
              {badge.name}
            </div>
          ))}
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-24">
          {securityFeatures.map((feature, idx) => (
            <div 
              key={idx} 
              className="group bg-white/[0.02] backdrop-blur-xl p-8 rounded-[2rem] border border-white/5 hover:border-emerald-500/30 hover:bg-white/[0.04] transition-all duration-500 relative overflow-hidden"
            >
              {/* Hover Gradient Blob */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[50px] -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="flex flex-col sm:flex-row gap-6 relative z-10">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:border-emerald-500/30 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-500">
                    {feature.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    {feature.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* "Whitepaper" CTA Section */}
        <div className="relative group">
           <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
           
           <div className="bg-slate-900/90 backdrop-blur-2xl rounded-[3rem] p-10 md:p-16 relative overflow-hidden border border-white/10 shadow-2xl">
              {/* Inner ambient light */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="text-left max-w-xl">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold mb-4 uppercase tracking-widest text-xs">
                    <Shield size={16} /> Technical Documentation
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
                    Audit-ready security. <br/>
                    <span className="text-slate-400">Verified by experts.</span>
                  </h2>
                  <p className="text-slate-400 text-lg leading-relaxed">
                    Download our comprehensive Security Whitepaper. It covers our penetration testing results, disaster recovery plans, and data handling policies in detail.
                  </p>
                </div>
                
                <div className="flex-shrink-0">
                  <button 
                    onClick={generateWhitepaper}
                    className="group/btn bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] cursor-pointer flex items-center gap-3"
                  >
                    <FileCheck size={20} />
                    Download Whitepaper 
                    <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
           </div>
        </div>

      </main>
    </div>
  );
};

export default SecurityPage;