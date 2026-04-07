import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { LogOut, Home, Grid, PlusCircle, User, LogIn, Search, Shield } from 'lucide-react';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ReportItem from './pages/ReportItem';
import Gallery from './pages/Gallery';
import ItemDetails from './pages/ItemDetails';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 text-primary-600 font-bold text-xl tracking-tight">
            <Search className="w-8 h-8 text-primary-600" strokeWidth={3} />
            <span>CampusLost</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link to="/" className="hover:text-primary-600 transition-colors flex items-center gap-1.5"><Home size={18} /> Home</Link>
            <Link to="/gallery" className="hover:text-primary-600 transition-colors flex items-center gap-1.5"><Grid size={18} /> Gallery</Link>
            <Link to="/report" className="hover:text-primary-600 transition-colors flex items-center gap-1.5"><PlusCircle size={18} /> Report Item</Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                {user?.role === 'admin' ? (
                  <Link to="/admin" className="btn btn-secondary text-sm flex items-center gap-1.5">
                    <Shield size={18} /> Admin
                  </Link>
                ) : null}
                <Link to="/dashboard" className="btn btn-secondary text-sm flex items-center gap-1.5">
                  <User size={18} /> Dashboard
                </Link>
                <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors p-2">
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary text-sm flex items-center gap-1.5">
                <LogIn size={18} /> Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/report" element={<ReportItem />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/items/:id" element={<ItemDetails />} />
        </Routes>
      </main>
      <footer className="py-12 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 text-primary-600 font-bold text-lg mb-4">
            <Search className="w-6 h-6" />
            <span>CampusLost</span>
          </div>
          <p className="text-slate-500 text-sm italic">"Let the community help you find what you've lost."</p>
          <p className="text-slate-400 text-xs mt-6">&copy; {new Date().getFullYear()} Campus Lost and Found Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
