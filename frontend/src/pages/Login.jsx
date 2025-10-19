import React, { useState } from 'react';
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('admin@manifest.com');
  const [password, setPassword] = useState('password123');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr('');
    try {
      const res = await login({ email, password });
      const { token, user } = res.data;

      // store token + user info
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // ✅ role-based redirect
      if (user.role === 'admin') {
        nav('/admin/dashboard');
      } else {
        nav('/staff/dashboard');
      }
    } catch (err) {
      console.error(err);
      setErr(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const forgot = async () => {
    const em = prompt('Enter your registered email');
    if (!em) return;
    try {
      const base = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';
      await fetch(`${base}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: em }),
      });

      const otp = prompt('Enter OTP sent to email');
      const newPass = prompt('Enter new password');
      if (otp && newPass) {
        await fetch(`${base}/auth/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: em, otp, newPassword: newPass }),
        });
        alert('Password reset. Please login.');
      }
    } catch (e) {
      alert('Error with forgot password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <form
        onSubmit={submit}
        className="w-96 bg-white p-6 rounded-2xl shadow-lg space-y-4"
      >
        <h2 className="text-3xl font-semibold text-center text-blue-700">
          Manifest Login
        </h2>

        {err && (
          <div className="text-red-600 bg-red-100 border border-red-200 p-2 rounded text-center">
            {err}
          </div>
        )}

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex justify-between text-sm text-blue-600">
          <a href="/register" className="hover:underline">
            Create account
          </a>
          <button type="button" onClick={forgot} className="hover:underline">
            Forgot?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full ${
            loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          } text-white py-2 rounded transition`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
