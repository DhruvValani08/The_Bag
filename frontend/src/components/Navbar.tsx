import React from 'react';
import { NavLink } from 'react-router-dom';
import { Briefcase, ShoppingBag, PlusCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="dashboard-header">
      <div className="header-container">
        <div className="header-logo">
          <Briefcase size={26} className="logo-icon" style={{ color: 'var(--brass)' }} />
          <h1>The Bag</h1>
        </div>

        <nav className="nav-links">
          <NavLink
            to="/bag"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <ShoppingBag size={18} />
            <span>My Bag</span>
          </NavLink>
          <NavLink
            to="/add"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <PlusCircle size={18} />
            <span>Pack New Item</span>
          </NavLink>
        </nav>

        <div className="header-actions">
          {user && <span className="user-email">{user.email}</span>}
          <button className="btn btn-signout" onClick={signOut} title="Sign Out">
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
};
