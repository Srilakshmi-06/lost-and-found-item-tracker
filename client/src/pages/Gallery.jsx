import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { Search, Filter, MapPin, Calendar, ArrowRight, Loader2, PackageSearch } from 'lucide-react';

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ q: '', category: '', type: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.q) params.append('q', filters.q);
      if (filters.category) params.append('category', filters.category);
      if (filters.type) params.append('type', filters.type);

      const { data } = await API.get(`/items?${params.toString()}`);
      setItems(data);
    } catch (err) {
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [filters]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters({ ...filters, q: searchTerm });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Recovered Items</h1>
          <p className="text-slate-500 mt-1">Browse and search for lost or found belongings</p>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex-1 w-full max-w-lg">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search by keywords (e.g. 'iphone', 'blue wallet')..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>
      </div>

      <div className="flex flex-wrap gap-4 mb-10">
        <select 
          className="btn btn-secondary text-sm py-2 px-6"
          value={filters.type}
          onChange={(e) => setFilters({...filters, type: e.target.value})}
        >
          <option value="">All Types</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>

        <select 
          className="btn btn-secondary text-sm py-2 px-6"
          value={filters.category}
          onChange={(e) => setFilters({...filters, category: e.target.value})}
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="accessories">Accessories</option>
          <option value="books">Books</option>
          <option value="clothing">Clothing</option>
          <option value="others">Others</option>
        </select>

        {(filters.q || filters.category || filters.type) && (
          <button 
            onClick={() => {setFilters({q:'', category:'', type:''}); setSearchTerm('');}}
            className="text-primary-600 font-bold text-sm hover:underline py-2 px-4"
          >
            Clear Filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Loading items...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-slate-200">
          <PackageSearch size={64} className="text-slate-300 mb-6" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No items found</h3>
          <p className="text-slate-500">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {items.map((item) => (
            <Link key={item._id} to={`/items/${item._id}`} className="group card hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="relative aspect-square overflow-hidden bg-slate-100">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  item.type === 'lost' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                }`}>
                  {item.type}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1">{item.title}</h3>
                <div className="mt-4 flex flex-col gap-2 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-slate-400" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400" />
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                   <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{item.category}</span>
                   <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-all">
                      <ArrowRight size={16} />
                   </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;
