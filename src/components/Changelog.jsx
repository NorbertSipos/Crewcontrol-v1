import React from 'react';
import { Calendar, Tag, ChevronRight } from 'lucide-react';

/**
 * ChangelogPage Component
 * Displays product updates in a timeline format.
 */
const ChangelogPage = () => {
  const updates = [
    {
      version: "v2.4.0",
      date: "March 10, 2024",
      title: "AI Forecasting & Smart Scheduling",
      description: "We've introduced intelligent forecasting to help you plan labor needs based on historical data patterns.",
      category: "Feature",
      tags: ["AI", "Enterprise"]
    },
    {
      version: "v2.3.5",
      date: "February 28, 2024",
      title: "Faster Mobile Access & Bug Fixes",
      description: "Optimized mobile app loading speeds and improved the reliability of shift-swap notifications.",
      category: "Improvement",
      tags: ["Mobile", "Performance"]
    },
    {
      version: "v2.3.0",
      date: "February 12, 2024",
      title: "Public API Beta Launch",
      description: "External API access is now available for Enterprise clients. You can now sync your internal systems seamlessly.",
      category: "API",
      tags: ["Integration", "Enterprise"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- HEADER --- */}
      <header className="bg-gradient-to-r from-purple-900 to-indigo-950 py-24 relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">Changelog</h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Stay up to date with the latest features, improvements, and fixes in CrewControl.
          </p>
        </div>
        
        {/* Curved Separator*/}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
             <svg 
                 className="relative block w-full h-[60px] md:h-[100px]" 
                    viewBox="0 0 1200 120" 
                    preserveAspectRatio="none"
            >
    <path 
      d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-1.11,1200,0.47V120H0Z" 
      fill="#f9fafb"
    ></path>
  </svg>
</div>
      </header>

      {/* --- TIMELINE CONTENT --- */}
      <main className="max-w-4xl mx-auto px-4 py-20">
        <div className="relative border-l-2 border-purple-200 ml-4 md:ml-0">
          {updates.map((update, index) => (
            <div key={index} className="mb-16 ml-8 relative">
              {/* Timeline Indicator Dot */}
              <div className="absolute -left-[41px] top-1 w-5 h-5 bg-purple-600 rounded-full border-4 border-white shadow-sm"></div>
              
              {/* Update Card */}
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {update.category}
                  </span>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Calendar size={14} className="mr-1.5" />
                    {update.date}
                  </div>
                  <span className="text-gray-300 hidden md:inline">•</span>
                  <span className="text-gray-500 font-mono text-sm font-medium">{update.version}</span>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center group cursor-default">
                  {update.title}
                  <ChevronRight size={20} className="ml-2 text-purple-400 group-hover:translate-x-1 transition-transform" />
                </h3>
                
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {update.description}
                </p>

                {/* Tags Section */}
                <div className="flex flex-wrap gap-2">
                  {update.tags.map(tag => (
                    <span key={tag} className="text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1 rounded-lg text-xs font-semibold">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- NEWSLETTER CTA --- */}
        <div className="mt-24 text-center bg-white rounded-[2rem] p-10 md:p-16 border border-gray-100 shadow-xl shadow-purple-900/5">
          <h4 className="text-2xl font-bold text-gray-900 mb-3">Want to stay in the loop?</h4>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Get notified whenever we ship new features or major improvements to the platform.
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-grow px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 transition-all" 
            />
            <button className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-purple-700 active:scale-95 transition-all shadow-lg shadow-purple-200 cursor-pointer">
              Subscribe
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChangelogPage;