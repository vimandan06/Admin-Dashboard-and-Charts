import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function ChartCard({ title, dataSeries }) {
  // dataSeries: { users:[], sales:[], conversions:[] }
  if (!dataSeries) return null;

  // Merge by date (use users series as base)
  const users = dataSeries.users || [];
  const sales = dataSeries.sales || [];
  const conversions = dataSeries.conversions || [];

  const map = {};
  users.forEach(u => { map[u.date] = { date: u.date, users: u.value }; });
  sales.forEach(s => { if (!map[s.date]) map[s.date] = { date: s.date }; map[s.date].sales = s.value; });
  conversions.forEach(c => { if (!map[c.date]) map[c.date] = { date: c.date }; map[c.date].conversions = c.value; });

  const merged = Object.values(map).sort((a,b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">{title}</h3>
      {merged.length === 0 ? <div className="text-gray-500">No data</div> :
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={merged}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#3b82f6" name="Users" strokeWidth={2} />
              <Line type="monotone" dataKey="sales" stroke="#10b981" name="Sales" strokeWidth={2} />
              <Line type="monotone" dataKey="conversions" stroke="#f59e0b" name="Conversions" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      }
    </div>
  );
}
