import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { getStaff } from '../services/api';

export default function Leaderboard(){
  const [staff, setStaff] = useState([]);

  useEffect(()=>{ (async()=>{ const res = await getStaff(); setStaff(res.data); })(); },[]);

  // For demo we sort by createdAt (replace with real weekly sales/earnings)
  const ranked = [...staff].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <h2 className="text-xl mb-4">Leaderboard (week)</h2>
          <div className="bg-white p-4 rounded shadow">
            <ol className="space-y-3">
              {ranked.map((s, idx) => (
                <li key={s.id} className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{idx+1}. {s.username} ({s.name})</div>
                    <div className="text-sm text-gray-500">{s.email}</div>
                  </div>
                  <div className="text-sm text-gray-700">Sales: 0 • Earnings: $0</div>
                </li>
              ))}
            </ol>
          </div>
        </main>
      </div>
    </div>
  );
}
