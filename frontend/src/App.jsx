import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';
import AddUser from './pages/AddUser';
import Products from './pages/Products';
import Leaderboard from './pages/Leaderboard';
import Earnings from './pages/Earnings';
import Contact from './pages/Contact';
import Staffs from './components/Staffs';
import StaffSales from './pages/StaffSales';

// --- Auth + Role check ---
const RequireAuth = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) return <Navigate to="/login" replace />;

  // If role is specified (admin/staff) and doesn't match, redirect
  if (role && user.role !== role) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'staff') return <Navigate to="/staff/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Public routes --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- ADMIN ROUTES --- */}
        <Route
          path="/admin/dashboard"
          element={
            <RequireAuth role="admin">
              <AdminDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/staffs"
          element={
            <RequireAuth role="admin">
              <Staffs />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/add-user"
          element={
            <RequireAuth role="admin">
              <AddUser />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/products"
          element={
            <RequireAuth role="admin">
              <Products />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/leaderboard"
          element={
            <RequireAuth role="admin">
              <Leaderboard />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/earnings"
          element={
            <RequireAuth role="admin">
              <Earnings />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/contact"
          element={
            <RequireAuth role="admin">
              <Contact />
            </RequireAuth>
          }
        />

       
        {/* --- STAFF ROUTES --- */}
        <Route
          path="/staff/dashboard"
          element={
            <RequireAuth role="staff">
              <StaffDashboard />
            </RequireAuth>
          }
        />

        <Route
          path="/staff/sales"
          element={
            <RequireAuth role="staff">
              <StaffSales />
            </RequireAuth>
          }
        />

        <Route
          path="/staff/leaderboard"
          element={
            <RequireAuth role="staff">
              <Leaderboard />
            </RequireAuth>
          }
        />
        
        <Route
          path="/staff/products"
          element={
            <RequireAuth role="staff">
              <Products />
            </RequireAuth>
          }
        />
        
        <Route
          path="/staff/earnings"
          element={
            <RequireAuth role="staff">
              <Earnings />
            </RequireAuth>
          }
        />
        
        <Route
          path="/staff/contact"
          element={
            <RequireAuth role="staff">
              <Contact />
            </RequireAuth>
          }
        />

        {/* --- Catch-all redirect --- */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
