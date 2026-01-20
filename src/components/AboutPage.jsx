import React, { useState, useEffect } from 'react';
import { Target, Users, Zap, Heart, ShieldCheck, BarChart3, Clock, Globe, Sparkles, Layers, Rocket, Code2, TrendingUp } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { StructuredData, generateOrganizationSchema, generateWebPageSchema } from './StructuredData';

const AboutPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // SEO Meta Tags
  useSEO({
    title: 'About Us - CrewControl | Building Better Workforce Management',
    description: 'Learn about CrewControl and our mission to simplify workforce management. We help teams of all sizes streamline scheduling, time tracking, and team communication.',
    keywords: 'about crewcontrol, workforce management company, employee scheduling company, team management software',
    ogImage: 'https://crewcontrol.io/dashboard-screenshot.png',
    canonical: 'https://crewcontrol.io/about',
  });

  // Structured Data
  const organizationSchema = generateOrganizationSchema();
  const webpageSchema = generateWebPageSchema({
    name: 'About Us - CrewControl',
    description: 'Learn about CrewControl and our mission to simplify workforce management.',
    url: 'https://crewcontrol.io/about',
    breadcrumbs: [
      { name: 'Home', url: 'https://crewcontrol.io/' },
      { name: 'About', url: 'https://crewcontrol.io/about' },
    ],
  });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* Structured Data for SEO Rich Snippets */}
      <StructuredData data={organizationSchema} />
      <StructuredData data={webpageSchema} />

      <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden font-sans selection:bg-purple-500/30">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        />
      </div>

      {/* Dynamic Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-0 left-0 w-[800px] h-[800px] bg-purple-500/20 rounded-full blur-[120px] mix-blend-screen transition-all duration-1000"
          style={{
            transform: `translate(${mousePosition.x * 0.05 - 400}px, ${mousePosition.y * 0.05 - 400}px)`
          }}
        />
        <div 
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[100px] mix-blend-screen transition-all duration-1000"
          style={{
            transform: `translate(${mousePosition.x * -0.03 + 300}px, ${mousePosition.y * -0.03 + 300}px)`
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[80px] mix-blend-screen animate-pulse" />
      </div>

      {/* Hero Section */}
      <header className="relative z-10 pt-40 pb-32 px-6 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full mb-8 backdrop-blur-xl">
            <Sparkles className="text-purple-400" size={16} />
            <span className="text-sm text-purple-300 font-medium">Built for Tomorrow's Workforce</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter">
            <span className="block text-white drop-shadow-2xl">We're Building the</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 animate-gradient bg-[length:200%_auto]">
              Operating System
            </span>
            <span className="block text-white drop-shadow-2xl">for Modern Teams</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-12">
            Transforming workforce management from an administrative burden into a strategic advantage—powered by simplicity, speed, and human-centered design.
          </p>

          {/* Floating Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-16">
            <div className="group relative px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">500+</div>
              <div className="text-sm text-slate-400 mt-1">Operations Teams</div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 rounded-2xl transition-all duration-300" />
            </div>
            <div className="group relative px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-indigo-500/50 transition-all duration-300 hover:scale-105">
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">60%</div>
              <div className="text-sm text-slate-400 mt-1">Reduction in No-Shows</div>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 rounded-2xl transition-all duration-300" />
            </div>
            <div className="group relative px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-pink-500/50 transition-all duration-300 hover:scale-105">
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">1000+</div>
              <div className="text-sm text-slate-400 mt-1">Hours Saved Weekly</div>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 to-purple-500/0 group-hover:from-pink-500/10 group-hover:to-purple-500/10 rounded-2xl transition-all duration-300" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        
        {/* Mission Section - Large Card */}
        <section className="mb-32">
          <div className="group relative overflow-hidden">
            {/* Animated Border */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-indigo-500/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-12 md:p-16 hover:border-purple-500/50 transition-all duration-500">
              <div className="flex items-start gap-6 mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/30 rounded-2xl blur-xl" />
                  <div className="relative w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center border border-purple-400/50 shadow-lg">
                    <Target className="text-white" size={32} />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-4xl md:text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200">
                    Our Mission
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                </div>
              </div>
              
              <div className="space-y-6 text-slate-300 text-lg leading-relaxed">
                <p className="text-xl text-white">
                  CrewControl was born from a simple observation: <span className="text-purple-300 font-semibold">managers spend 5–10 hours per week</span> creating schedules using Excel, WhatsApp, and paper. This leads to errors, conflicts, and frustrated teams.
                </p>
                <p>
                  We're here to <span className="text-pink-300 font-semibold">eliminate that chaos</span>. Our platform turns scheduling from a manual, stressful task into a fast, visual, and data-driven operational advantage.
                </p>
                <p>
                  We're not building another HR system. We're building the <span className="text-indigo-300 font-semibold">operating system for modern workforce operations</span>—one that respects people's time, reduces stress, and gives managers control.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section - Timeline Style */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
              Our Story
            </h2>
            <p className="text-slate-400 text-lg">From idea to reality—building the future of workforce management</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                year: "2024",
                title: "The Beginning",
                icon: Rocket,
                color: "purple",
                content: "CrewControl started when operations managers and engineers realized scheduling tools were stuck in the past. While the world moved to modern, visual-first software, workforce scheduling was still dominated by spreadsheets and manual processes."
              },
              {
                year: "Today",
                title: "Growing Impact",
                icon: TrendingUp,
                color: "pink",
                content: "We now serve hundreds of operations teams across restaurants, construction sites, logistics companies, and event-based businesses. We've helped teams save thousands of hours, reduce no-shows by 60%, and eliminate scheduling conflicts entirely."
              },
              {
                year: "Future",
                title: "AI-Powered Vision",
                icon: Sparkles,
                color: "indigo",
                content: "Our vision is to make workforce management a strategic advantage—one where AI predicts staffing needs, schedules optimize themselves, and teams spend less time on administration and more time on what matters."
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              const colorClasses = {
                purple: "from-purple-500 to-indigo-500 border-purple-400/50",
                pink: "from-pink-500 to-purple-500 border-pink-400/50",
                indigo: "from-indigo-500 to-purple-500 border-indigo-400/50"
              };
              
              return (
                <div 
                  key={idx}
                  className="group relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${colorClasses[item.color].split(' ')[0]} ${colorClasses[item.color].split(' ')[1]} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                  
                  <div className={`relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-${item.color}-500/50 transition-all duration-500 h-full`}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`relative bg-gradient-to-br ${colorClasses[item.color]} rounded-xl p-3 border shadow-lg`}>
                        <Icon className="text-white" size={24} />
                      </div>
                      <div>
                        <div className="text-sm text-slate-400 font-medium">{item.year}</div>
                        <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                      </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{item.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Core Values - Enhanced Cards */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
              Core Values
            </h2>
            <p className="text-slate-400 text-lg">The principles that guide everything we build</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Simplicity Over Complexity",
                color: "purple",
                desc: "Visual-first UI that anyone can use. No training required, no feature overload.",
                detail: "We believe powerful tools shouldn't require a manual. Every feature we build is designed to be intuitive, fast, and immediately useful."
              },
              {
                icon: Heart,
                title: "Human-Centered Design",
                color: "pink",
                desc: "Less stress = better teams. We build tools that respect people's time and sanity.",
                detail: "Scheduling shouldn't keep managers up at night. Employees shouldn't miss shifts due to poor communication. We design for real human needs."
              },
              {
                icon: Users,
                title: "Operations-Focused",
                color: "indigo",
                desc: "We focus on scheduling, shifts, and operations—not HR bureaucracy.",
                detail: "CrewControl is built for operations teams, not HR departments. We solve real scheduling problems, not administrative tasks."
              }
            ].map((value, idx) => {
              const Icon = value.icon;
              const colorMap = {
                purple: {
                  gradient: "from-purple-500 to-indigo-500",
                  border: "border-purple-500/50",
                  bg: "bg-purple-500/20",
                  text: "text-purple-300"
                },
                pink: {
                  gradient: "from-pink-500 to-purple-500",
                  border: "border-pink-500/50",
                  bg: "bg-pink-500/20",
                  text: "text-pink-300"
                },
                indigo: {
                  gradient: "from-indigo-500 to-purple-500",
                  border: "border-indigo-500/50",
                  bg: "bg-indigo-500/20",
                  text: "text-indigo-300"
                }
              };
              const colors = colorMap[value.color];
              
              return (
                <div 
                  key={idx}
                  className="group relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
                  
                  <div className={`relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 ${value.color === 'purple' ? 'hover:border-purple-500/50' : value.color === 'pink' ? 'hover:border-pink-500/50' : 'hover:border-indigo-500/50'} transition-all duration-500 h-full transform hover:scale-[1.02] hover:-translate-y-2`}>
                    <div className={`relative w-14 h-14 bg-gradient-to-br ${colors.gradient} rounded-xl flex items-center justify-center mb-6 border shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                      <Icon className="text-white" size={28} />
                    </div>
                    <h3 className={`text-2xl font-bold mb-4 text-white ${value.color === 'purple' ? 'group-hover:text-purple-300' : value.color === 'pink' ? 'group-hover:text-pink-300' : 'group-hover:text-indigo-300'} transition-colors`}>
                      {value.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed mb-4">
                      {value.desc}
                    </p>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {value.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* What Makes Us Different - Grid Layout */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
              What Makes Us Different
            </h2>
            <p className="text-slate-400 text-lg">The features that set us apart</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Clock,
                title: "Built for Speed",
                color: "purple",
                content: "Most scheduling tools require hours of setup and training. CrewControl gets teams productive in minutes, not days. Drag-and-drop scheduling, instant notifications, and one-click publishing make it fast."
              },
              {
                icon: BarChart3,
                title: "Data-Driven Operations",
                color: "pink",
                content: "We believe scheduling should be strategic, not reactive. Our platform provides insights into staffing patterns, predicts needs, and helps optimize labor costs. In the future, AI will automate this entirely."
              },
              {
                icon: ShieldCheck,
                title: "Privacy & Security First",
                color: "indigo",
                content: "Employee data is sensitive. We're SOC 2 certified, GDPR compliant, and built with enterprise-grade security. Your data is encrypted, backed up, and never sold to third parties."
              },
              {
                icon: Globe,
                title: "Works Everywhere",
                color: "emerald",
                content: "Whether your team works remotely, on-site, or across multiple locations, CrewControl adapts. Location-based scheduling for construction sites, flexible shifts for remote teams, and everything in between."
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              const colorMap = {
                purple: { gradient: "from-purple-500 to-indigo-500", border: "border-purple-500/50" },
                pink: { gradient: "from-pink-500 to-purple-500", border: "border-pink-500/50" },
                indigo: { gradient: "from-indigo-500 to-purple-500", border: "border-indigo-500/50" },
                emerald: { gradient: "from-emerald-500 to-teal-500", border: "border-emerald-500/50" }
              };
              const colors = colorMap[item.color];
              
              return (
                <div 
                  key={idx}
                  className="group relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                  
                  <div className={`relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 ${item.color === 'purple' ? 'hover:border-purple-500/50' : item.color === 'pink' ? 'hover:border-pink-500/50' : item.color === 'indigo' ? 'hover:border-indigo-500/50' : 'hover:border-emerald-500/50'} transition-all duration-500`}>
                    <div className="flex gap-6">
                      <div className={`relative w-14 h-14 bg-gradient-to-br ${colors.gradient} rounded-xl flex items-center justify-center flex-shrink-0 border shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="text-white" size={28} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-3 text-white">{item.title}</h3>
                        <p className="text-slate-400 leading-relaxed">{item.content}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Vision Section - CTA Style */}
        <section>
          <div className="relative overflow-hidden group">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-indigo-600/20 rounded-[2rem] blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
            
            <div className="relative bg-gradient-to-br from-purple-900/30 via-indigo-900/30 to-slate-900/50 backdrop-blur-2xl border border-purple-500/30 rounded-[2rem] p-12 md:p-16 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-8 backdrop-blur-xl">
                <Code2 className="text-purple-300" size={20} />
                <span className="text-purple-200 font-medium">The Future is Here</span>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200">
                Our Vision
              </h2>
              
              <p className="text-slate-200 text-xl leading-relaxed max-w-3xl mx-auto mb-8">
                Workforce management should not feel like administration. CrewControl aims to turn scheduling and staffing into a strategic, data-driven advantage.
              </p>
              
              <p className="text-slate-300 text-lg leading-relaxed max-w-3xl mx-auto mb-8">
                In the future, AI will predict staffing needs based on historical demand, reducing overstaffing and unnecessary costs. Schedules will optimize themselves. Managers will spend time leading teams, not filling spreadsheets.
              </p>
              
              <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                We're building that future, one schedule at a time.
              </p>
            </div>
          </div>
        </section>
      </main>
      </div>
    </>
  );
};

export default AboutPage;
