import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { MapPin, Calendar, Tag, User, ChevronLeft, ArrowRight, Loader2, Info, Sparkles } from 'lucide-react';

const ItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const itemRes = await API.get(`/items/${id}`);
        setItem(itemRes.data);
        
        const matchRes = await API.get(`/items/match/${id}`);
        setMatches(matchRes.data);
      } catch (err) {
        console.error('Error fetching details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
        <p className="text-slate-500">Loading details...</p>
    </div>
  );

  if (!item) return <div className="text-center py-20">Item not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Link to="/gallery" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 mb-8 font-medium transition-colors">
        <ChevronLeft size={20} /> Back to Gallery
      </Link>

      <div className="grid lg:grid-cols-2 gap-12 mb-20 animate-fade-in">
        {/* Image Section */}
        <div className="aspect-square rounded-3xl overflow-hidden bg-white shadow-2xl border border-slate-100">
          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
        </div>

        {/* Content Section */}
        <div className="flex flex-col space-y-8">
          <div>
             <div className="flex items-center gap-4 mb-4">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                  item.type === 'lost' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                }`}>
                  {item.type}
                </span>
                <span className="text-slate-400 font-medium tracking-wide uppercase text-xs">{item.category}</span>
             </div>
             <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4">{item.title}</h1>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-primary-600">
                    <MapPin size={20} />
                </div>
                <div>
                   <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Location</p>
                   <p className="text-slate-700 font-medium">{item.location}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-primary-600">
                    <Calendar size={20} />
                </div>
                <div>
                   <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Date Reported</p>
                   <p className="text-slate-700 font-medium">{new Date(item.date).toLocaleDateString()}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-primary-600">
                    <User size={20} />
                </div>
                <div>
                   <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Reported By</p>
                   <p className="text-slate-700 font-medium">{item.userId.name} ({item.userId.email})</p>
                </div>
            </div>
          </div>

          <div className="space-y-4">
             <h3 className="text-xl font-bold flex items-center gap-2">
                <Info className="text-primary-600" size={20} /> Description
             </h3>
             <p className="text-slate-600 leading-relaxed text-lg">{item.description}</p>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-2">
            {item.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-lg font-medium">
                <Tag size={12} /> {tag}
              </span>
            ))}
          </div>

          <div className="pt-6">
             <a 
               href={`mailto:${item.userId.email}?subject=Regarding ${item.title}`}
               className="btn btn-primary w-full py-4 text-lg shadow-primary-600/50"
              >
                Contact Owner
             </a>
          </div>
        </div>
      </div>

      {/* Matching Algorithm Section */}
      <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center gap-3 mb-10">
          <Sparkles className="text-amber-500 fill-amber-500" size={28} />
          <h2 className="text-3xl font-extrabold text-slate-900">Smart Potential Matches</h2>
          <span className="ml-4 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">Algo Match Score</span>
        </div>

        {matches.length === 0 ? (
          <div className="bg-slate-50 border border-slate-100 p-12 rounded-3xl text-center">
             <p className="text-slate-500">No high-probability matches found yet. We'll keep checking!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {matches.map(({ item: m, score }) => (
              <Link key={m._id} to={`/items/${m._id}`} className="group relative bg-white border border-slate-200 rounded-3xl p-4 hover:shadow-xl transition-all flex gap-6">
                <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100">
                    <img src={m.imageUrl} alt={m.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 py-1">
                    <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-900 truncate pr-2">{m.title}</h4>
                        <div className="bg-primary-600 text-white text-[10px] px-2 py-1 rounded-md font-bold">
                            {(score * 100).toFixed(0)}% Match
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1"><MapPin size={12} /> {m.location}</p>
                    <p className="text-primary-600 text-xs font-bold mt-3 flex items-center gap-1">
                        View Match <ArrowRight size={12} />
                    </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ItemDetails;
