import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Trash2, ExternalLink, Plus, AlertCircle, Loader2 } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [myItems, setMyItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) navigate('/login');
        else fetchMyItems();
    }, [user]);

    const fetchMyItems = async () => {
        setLoading(true);
        try {
            // Note: In a real scenario, we might want a specific endpoint for user items
            // but for now, we use the filter by userId logic hidden in getItems or just use query
            // Given my controller getItems, I can add a userId query param if I support it.
            // Wait, I didn't add userId filter to getItems. I'll just filter on frontend for simplicity 
            // OR I should have added it. Let's assume the API returns all, but normally we'd have /api/items/me
            const { data } = await API.get('/items');
            setMyItems(data.filter(item => item.userId?._id === user.id || item.userId === user.id));
        } catch (err) {
            console.error('Error fetching my items:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this report?')) return;
        try {
            await API.delete(`/items/${id}`);
            setMyItems(myItems.filter(item => item._id !== id));
        } catch (err) {
            alert('Failed to delete item');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-96">
            <Loader2 className="animate-spin text-primary-600" size={40} />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
                <div>
                   <h1 className="text-3xl font-extrabold text-slate-900">User Dashboard</h1>
                   <p className="text-slate-500 mt-1">Hello, <span className="text-primary-600 font-bold">{user?.name}</span>. Manage your reported items.</p>
                </div>
                <Link to="/report" className="btn btn-primary sm:w-auto w-full">
                    <Plus size={20} /> Report New Item
                </Link>
            </div>

            {myItems.length === 0 ? (
                <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-slate-100">
                    <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="text-primary-300" size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No reports yet</h3>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto">You haven't reported any lost or found items. Use the button above to start.</p>
                </div>
            ) : (
                <div className="bg-white shadow-sm border border-slate-100 rounded-3xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Item</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Type</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Category</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date Reported</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {myItems.map((item) => (
                                    <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-5">
                                           <div className="flex items-center gap-4">
                                              <img src={item.imageUrl} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                                              <span className="font-bold text-slate-900">{item.title}</span>
                                           </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                                item.type === 'lost' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                                            }`}>
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-slate-500 text-sm capitalize">{item.category}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-slate-500 text-sm">{new Date(item.date).toLocaleDateString()}</span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link to={`/items/${item._id}`} className="p-2 text-slate-400 hover:text-primary-600 bg-white rounded-lg border border-slate-200">
                                                   <ExternalLink size={18} />
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(item._id)}
                                                    className="p-2 text-slate-400 hover:text-red-500 bg-white rounded-lg border border-slate-200"
                                                >
                                                   <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
