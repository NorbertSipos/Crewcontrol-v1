import React, { useState } from 'react';
import { Mail, MessageSquare, Phone, MapPin, Send, CheckCircle, Building2, Headphones, Zap, ArrowRight } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { StructuredData, generateOrganizationSchema, generateWebPageSchema } from './StructuredData';

const ContactPage = () => {
  // SEO Meta Tags
  useSEO({
    title: 'Contact Us - CrewControl | Get in Touch',
    description: 'Get in touch with CrewControl. Contact us for sales inquiries, technical support, or partnership opportunities. We typically respond within 24 hours.',
    keywords: 'contact crewcontrol, workforce management support, employee scheduling help, team management contact',
    ogImage: 'https://crewcontrol.io/dashboard-screenshot.png',
    canonical: 'https://crewcontrol.io/contact',
  });

  // Structured Data
  const organizationSchema = generateOrganizationSchema();
  const webpageSchema = generateWebPageSchema({
    name: 'Contact Us - CrewControl',
    description: 'Get in touch with CrewControl for sales inquiries, technical support, or partnership opportunities.',
    url: 'https://crewcontrol.io/contact',
    breadcrumbs: [
      { name: 'Home', url: 'https://crewcontrol.io/' },
      { name: 'Contact', url: 'https://crewcontrol.io/contact' },
    ],
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Implement actual form submission
    console.log('Contact form submitted:', formData);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          company: '',
          subject: '',
          message: '',
          inquiryType: 'general'
        });
      }, 3000);
    }, 1500);
  };

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry', icon: MessageSquare },
    { value: 'sales', label: 'Sales & Pricing', icon: Building2 },
    { value: 'support', label: 'Technical Support', icon: Headphones },
    { value: 'partnership', label: 'Partnership', icon: Zap }
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Get a response within 24 hours',
      value: 'hello@crewcontrol.io',
      link: 'mailto:hello@crewcontrol.io',
      iconBg: 'bg-purple-500/20',
      iconBorder: 'border-purple-500/30',
      iconColor: 'text-purple-400',
      hoverGlow: 'bg-purple-500/10'
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Mon-Fri, 9am-6pm EST',
      value: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
      iconBg: 'bg-indigo-500/20',
      iconBorder: 'border-indigo-500/30',
      iconColor: 'text-indigo-400',
      hoverGlow: 'bg-indigo-500/10'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      description: 'Our headquarters',
      value: 'San Francisco, CA',
      link: '#',
      iconBg: 'bg-pink-500/20',
      iconBorder: 'border-pink-500/30',
      iconColor: 'text-pink-400',
      hoverGlow: 'bg-pink-500/10'
    }
  ];

  return (
    <>
      {/* Structured Data for SEO Rich Snippets */}
      <StructuredData data={organizationSchema} />
      <StructuredData data={webpageSchema} />
      
      <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden font-sans selection:bg-purple-500/30">
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Ambient Glows */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] mix-blend-screen"></div>
        <div className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[100px] mix-blend-screen"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 pt-32 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-purple-300 text-sm font-semibold mb-8 shadow-[0_0_20px_rgba(168,85,247,0.15)] animate-in fade-in slide-in-from-top-4 duration-1000">
            <MessageSquare size={16} className="text-purple-400" />
            <span>We're here to help</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white drop-shadow-2xl">
            Let's talk about <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">your operations</span>
          </h1>
          
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Whether you're ready to streamline your scheduling or just have questions, we'd love to hear from you.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        
        {/* Contact Methods Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <a
                key={index}
                href={method.link}
                className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 hover:bg-white/[0.08] transition-all duration-500 cursor-pointer"
              >
                {/* Hover Glow */}
                <div className={`absolute top-0 right-0 w-32 h-32 ${method.hoverGlow} rounded-full blur-[50px] -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className={`w-12 h-12 ${method.iconBg} rounded-xl flex items-center justify-center mb-4 border ${method.iconBorder} group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className={method.iconColor} size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{method.title}</h3>
                  <p className="text-sm text-slate-400 mb-3">{method.description}</p>
                  <p className="text-sm text-purple-400 font-medium group-hover:text-purple-300 transition-colors">
                    {method.value}
                  </p>
                </div>
              </a>
            );
          })}
        </div>

        {/* Form Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Left: Form */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
            {/* Inner Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] -mr-20 -mt-20"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-2 text-white">Send us a message</h2>
              <p className="text-slate-400 mb-8">Fill out the form and we'll get back to you within 24 hours.</p>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                    <CheckCircle className="text-emerald-400" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Message sent!</h3>
                  <p className="text-slate-400">We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Inquiry Type */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      What can we help you with?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {inquiryTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <label
                            key={type.value}
                            className={`relative flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                              formData.inquiryType === type.value
                                ? 'bg-purple-500/20 border-purple-500/50 shadow-lg shadow-purple-500/10'
                                : 'bg-black/30 border-white/10 hover:border-white/20'
                            }`}
                          >
                            <input
                              type="radio"
                              name="inquiryType"
                              value={type.value}
                              checked={formData.inquiryType === type.value}
                              onChange={handleChange}
                              className="sr-only"
                            />
                            <Icon 
                              className={formData.inquiryType === type.value ? 'text-purple-400' : 'text-slate-500'} 
                              size={20} 
                            />
                            <span className={`text-sm font-medium ${
                              formData.inquiryType === type.value ? 'text-white' : 'text-slate-400'
                            }`}>
                              {type.label}
                            </span>
                            {formData.inquiryType === type.value && (
                              <div className="absolute top-2 right-2 w-2 h-2 bg-purple-400 rounded-full"></div>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                      placeholder="john@company.com"
                    />
                  </div>

                  {/* Company (Optional) */}
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-slate-300 mb-2">
                      Company <span className="text-slate-500 text-xs">(optional)</span>
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                      placeholder="Your Company"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                      placeholder="What's this about?"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all resize-none"
                      placeholder="Tell us more about your needs..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-white text-slate-950 py-4 rounded-xl font-bold hover:bg-purple-50 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 group mt-6 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right: Info & FAQ */}
          <div className="space-y-6">
            
            {/* Why Contact Us Card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-[60px] -mr-20 -mt-20"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Why reach out?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="text-purple-400" size={14} />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Get a personalized demo</p>
                      <p className="text-slate-400 text-xs">See how CrewControl fits your workflow</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="text-purple-400" size={14} />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Discuss pricing & plans</p>
                      <p className="text-slate-400 text-xs">Find the right plan for your team size</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="text-purple-400" size={14} />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Technical support</p>
                      <p className="text-slate-400 text-xs">Get help with setup or troubleshooting</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="text-purple-400" size={14} />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Partnership opportunities</p>
                      <p className="text-slate-400 text-xs">Explore integrations or collaborations</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Response Time Card */}
            <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center border border-purple-500/30">
                  <Zap className="text-purple-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Fast Response</h3>
                  <p className="text-sm text-slate-400">We typically respond within 24 hours</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                For urgent matters, please call us directly. Our support team is available Monday through Friday, 9am-6pm EST.
              </p>
            </div>

            {/* CTA Card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden group cursor-pointer hover:border-purple-500/30 transition-all duration-500">
              <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/5 rounded-full blur-[60px] -mr-20 -mt-20 group-hover:bg-pink-500/10 transition-colors"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-3">Ready to get started?</h3>
                <p className="text-slate-400 text-sm mb-6">
                  Start your free trial today. No credit card required.
                </p>
                <a href="/pricing" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium text-sm group/link">
                  View Pricing
                  <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
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

export default ContactPage;
