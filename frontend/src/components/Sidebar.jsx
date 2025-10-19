import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded ${
      isActive ? 'bg-blue-600 text-white' : 'text-gray-200 hover:bg-blue-700 hover:text-white'
    }`;

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 bg-blue-900 min-h-screen text-white flex flex-col">
      <div className="p-6 text-center border-b border-blue-800">
        <h1 className="text-xl font-bold">Manifest</h1>
        <div className="text-xs mt-1 opacity-75">
          {isAdmin ? 'Admin Panel' : 'Staff Panel'}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {isAdmin ? (
          <>
            <NavLink to="/admin/dashboard" className={linkClass}>Dashboard</NavLink>
            <NavLink to="/admin/staffs" className={linkClass}>Staffs</NavLink>
            <NavLink to="/admin/leaderboard" className={linkClass}>Leaderboard</NavLink>
            <NavLink to="/admin/products" className={linkClass}>Products</NavLink>
            <NavLink to="/admin/earnings" className={linkClass}>Earnings</NavLink>
            <NavLink to="/admin/contact" className={linkClass}>Contact</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/staff/dashboard" className={linkClass}>Dashboard</NavLink>
            <NavLink to="/staff/sales" className={linkClass}>Sales</NavLink>
            <NavLink to="/staff/leaderboard" className={linkClass}>Leaderboard</NavLink>
            <NavLink to="/staff/products" className={linkClass}>Products</NavLink>
            <NavLink to="/staff/earnings" className={linkClass}>Earnings</NavLink>
            <NavLink to="/staff/contact" className={linkClass}>Contact</NavLink>
          </>
        )}

        <button
          onClick={logout}
          className="w-full text-left block px-4 py-2 rounded text-gray-200 hover:bg-blue-700 hover:text-white"
        >
          Log out
        </button>
      </nav>

      <div className="p-4 text-xs text-gray-300 border-t border-blue-800">
        © Manifest
      </div>
    </aside>
  );
}
