import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { register } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function AddUser() {
  const [form, setForm] = useState({ username:'', name:'', email:'', password:'', phone:'', role:'staff' });
  const [msg, setMsg] = useState(''); const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      setMsg('User added. Redirecting...');
      setTimeout(()=>nav('/'),1000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to add user');
    }
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6">
          <div className="max-w-lg bg-white p-6 rounded shadow mx-auto">
            <h2 className="text-xl mb-4">Add New Staff</h2>
            {msg && <div className="mb-3 text-sm">{msg}</div>}
            <form onSubmit={submit} className="space-y-3">
              <input placeholder="Username" value={form.username} onChange={e=>setForm({...form, username:e.target.value})} className="w-full p-2 border rounded" required />
              <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="w-full p-2 border rounded" />
              <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} className="w-full p-2 border rounded" required />
              <input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} className="w-full p-2 border rounded" required />
              <input placeholder="Phone" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} className="w-full p-2 border rounded" />
              <select value={form.role} onChange={e=>setForm({...form, role:e.target.value})} className="w-full p-2 border rounded">
                <option value="staff">Staff</option><option value="admin">Admin</option>
              </select>
              <button className="w-full bg-blue-600 text-white py-2 rounded">Create</button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
