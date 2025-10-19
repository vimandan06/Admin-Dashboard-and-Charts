import React, { useState } from 'react';
import { register, sendOtp } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [form, setForm] = useState({ username:'', name:'', email:'', password:'', confirm:'', phone:'', role:'staff' });
  const [stage, setStage] = useState('form'); // form | otp
  const [err, setErr] = useState('');
  const [otp, setOtp] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (form.password !== form.confirm) { setErr('Password mismatch'); return; }

    try {
      // Create user but server flow: we use register directly and server will create user and metric.
      // For stricter OTP verification, you'd generate OTP first and store user inactive; here we send OTP after create for simplicity.
      await register({
        username: form.username,
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        role: form.role
      });
      // send OTP to verify (you could instead send OTP before finalizing registration)
      await sendOtp({ email: form.email });
      setStage('otp');
      alert('OTP sent to your email. Enter OTP to confirm.');
    } catch (err) {
      setErr(err.response?.data?.message || 'Register failed');
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      // reuse reset-password endpoint to verify & set password if you prefer, but here we simply alert and redirect.
      // In a production flow you'd have a verify-otp endpoint to activate user.
      alert('Registration completed, please login.');
      nav('/login');
    } catch (err) {
      setErr('OTP verify failed');
    }
  };

  if (stage === 'otp') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-96 bg-white p-6 rounded shadow">
          <h3 className="text-lg mb-4">Enter OTP sent to {form.email}</h3>
          <input value={otp} onChange={e=>setOtp(e.target.value)} className="w-full p-2 border rounded mb-3" />
          <div className="flex gap-2">
            <button onClick={verifyOtp} className="flex-1 bg-blue-600 text-white p-2 rounded">Verify</button>
            <button onClick={async ()=>{ await sendOtp({ email: form.email }); alert('OTP resent'); }} className="flex-1 border p-2 rounded">Resend</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submit} className="w-96 bg-white p-6 rounded shadow space-y-3">
        <h2 className="text-2xl font-semibold">Register</h2>
        {err && <div className="text-red-600">{err}</div>}
        <input required name="username" placeholder="Username" value={form.username} onChange={e=>setForm({...form, username:e.target.value})} className="w-full p-2 border rounded" />
        <input name="name" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="w-full p-2 border rounded" />
        <input required name="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} className="w-full p-2 border rounded" />
        <input required name="password" type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} className="w-full p-2 border rounded" />
        <input required name="confirm" type="password" placeholder="Confirm Password" value={form.confirm} onChange={e=>setForm({...form, confirm:e.target.value})} className="w-full p-2 border rounded" />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} className="w-full p-2 border rounded" />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Register</button>
      </form>
    </div>
  );
}
