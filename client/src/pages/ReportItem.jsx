import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Upload, X, MapPin, Calendar, Tag, AlertCircle, Loader2 } from 'lucide-react';

const categories = ['electronics', 'accessories', 'books', 'clothing', 'others'];

const ReportItem = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'electronics',
    location: '',
    date: new Date().toISOString().split('T')[0],
    type: 'lost',
    image: null
  });

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return;
      }
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      setError('Please upload an image of the item');
      return;
    }

    setLoading(true);
    setError('');

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    try {
      await API.post('/items', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/gallery');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900">Report an Item</h1>
        <p className="text-slate-500 mt-2">Fill in the details to help us match your item</p>
      </div>

      <div className="card animate-fade-in">
        <form onSubmit={handleSubmit} className="p-8 md:p-12 grid md:grid-cols-2 gap-x-12 gap-y-8">
          {error && (
            <div className="col-span-full bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Type</label>
              <div className="flex gap-4 p-1 bg-slate-100 rounded-lg">
                {['lost', 'found'].map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormData({...formData, type: t})}
                    className={`flex-1 py-2 rounded-md font-medium capitalize transition-all ${
                      formData.type === t ? 'bg-white shadow text-primary-600' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Title</label>
              <input
                name="title"
                type="text"
                placeholder="e.g. Black Nike Backpack"
                className="input-field"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Description</label>
              <textarea
                name="description"
                rows="4"
                placeholder="Describe the item details, branding, color, content..."
                className="input-field resize-none"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Category</label>
                <select 
                  name="category"
                  className="input-field capitalize"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Date</label>
                <input
                   name="date"
                   type="date"
                   className="input-field"
                   value={formData.date}
                   onChange={handleChange}
                   required
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
             <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Location</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    name="location"
                    type="text"
                    placeholder="e.g. Central Library, Cafe"
                    className="input-field pl-10"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Image Upload</label>
                <div className="relative group overflow-hidden">
                  {imagePreview ? (
                    <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-slate-200">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {setImagePreview(null); setFormData({...formData, image: null})}}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center aspect-video w-full border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-all hover:border-primary-300 group">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <Upload className="text-primary-600" size={24} />
                        </div>
                        <p className="text-sm text-slate-500 font-medium">Click to upload or drag and drop</p>
                        <p className="text-xs text-slate-400 mt-1">PNG, JPG or JPEG (Max 5MB)</p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  )}
                </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-4 text-lg mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Processing...
                </>
              ) : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportItem;
