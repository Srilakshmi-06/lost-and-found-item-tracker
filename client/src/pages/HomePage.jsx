import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, CheckCircle, ArrowRight } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 gradient-bg -skew-y-6 origin-top-left scale-150 -translate-y-20 z-10"></div>
        <div className="relative z-20 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-fade-in">
            Lost it? Found it? <br/>
            <span className="text-primary-100">Let's Match it.</span>
          </h1>
          <p className="text-xl md:text-2xl text-primary-50 mb-10 opacity-90 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            The smartest digital lost and found platform for your campus community.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Link to="/report" className="btn bg-white text-primary-700 hover:bg-primary-50 px-8 py-4 text-lg">
              Report an Item <ArrowRight size={20} />
            </Link>
            <Link to="/gallery" className="btn border-2 border-primary-300 text-white hover:bg-white/10 px-8 py-4 text-lg">
              Browse Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How it Works</h2>
            <div className="h-1.5 w-20 bg-primary-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: <Search className="text-blue-500" />, title: "Report", desc: "Easily report a lost or found item with details and images." },
              { icon: <MapPin className="text-red-500" />, title: "Match", desc: "Our smart algorithm compares location, tags, and dates to find matches." },
              { icon: <CheckCircle className="text-green-500" />, title: "Recover", desc: "Get notified of potential matches and recover your items securely." }
            ].map((step, idx) => (
              <div key={idx} className="card p-8 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6 scale-125">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
                <div className="text-4xl font-extrabold text-primary-600 mb-1">500+</div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Items Reported</div>
            </div>
            <div className="text-center">
                <div className="text-4xl font-extrabold text-primary-600 mb-1">85%</div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Recovery Rate</div>
            </div>
            <div className="text-center">
                <div className="text-4xl font-extrabold text-primary-600 mb-1">1200+</div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Active Users</div>
            </div>
            <div className="text-center">
                <div className="text-4xl font-extrabold text-primary-600 mb-1">24/7</div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Support</div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
