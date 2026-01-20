import React from 'react';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { StructuredData, generateOrganizationSchema, generateWebPageSchema } from './StructuredData';

const BlogPage = () => {
  // SEO Meta Tags
  useSEO({
    title: 'Blog - CrewControl | Workforce Management Insights & Resources',
    description: 'Read articles, guides, and insights about workforce management, employee scheduling, team management best practices, and industry trends.',
    keywords: 'workforce management blog, scheduling tips, team management articles, hr insights, workforce planning',
    ogImage: 'https://crewcontrol.io/dashboard-screenshot.png',
    canonical: 'https://crewcontrol.io/blog',
  });

  // Structured Data
  const organizationSchema = generateOrganizationSchema();
  const webpageSchema = generateWebPageSchema({
    name: 'Blog - CrewControl',
    description: 'Read articles and insights about workforce management and employee scheduling.',
    url: 'https://crewcontrol.io/blog',
    breadcrumbs: [
      { name: 'Home', url: 'https://crewcontrol.io/' },
      { name: 'Blog', url: 'https://crewcontrol.io/blog' },
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
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] mix-blend-screen"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 pt-32 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-purple-300 text-sm font-semibold mb-8">
            <BookOpen size={16} className="text-purple-400" />
            <span>Resources & Insights</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white drop-shadow-2xl">
            CrewControl <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">Blog</span>
          </h1>
          
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Industry insights, best practices, and stories from operations teams around the world.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        <div className="text-center py-20">
          <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12">
            <BookOpen className="text-purple-400 mx-auto mb-6" size={64} />
            <h2 className="text-3xl font-bold mb-4">Blog Coming Soon</h2>
            <p className="text-slate-400 mb-8">
              We're working on creating valuable content about workforce management, scheduling best practices, and industry insights.
            </p>
            <p className="text-sm text-slate-500">
              Check back soon for articles, case studies, and tips from operations leaders.
            </p>
          </div>
        </div>
      </main>
      </div>
    </>
  );
};

export default BlogPage;
