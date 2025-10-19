import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ChartCard from '../components/ChartCard';
import { fetchKPIs, fetchTimeSeries } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Dashboard(){
  const [series, setSeries] = useState({ users:[], sales:[], conversions:[] });
  const [kpis, setKpis] = useState({ total:{}, today:{} });
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const kp = await fetchKPIs();
        setKpis(kp.data || { total:{}, today:{} });

        const res = await fetchTimeSeries({ period: '30d' });
        setSeries(res.data.data || { users: [], sales: [], conversions: [] });
      } catch (err) {
        console.error(err);
      } finally { setLoading(false); }
    };
    load();
  }, []);

  const getKpi = (obj, key) => obj?.[key] ?? 0;

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Dashboard</h2>
            <div className="flex gap-2">
              <button onClick={()=>nav('/add-user')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">+ Add User</button>
            </div>
          </div>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded shadow">
              <h4 className="text-sm text-gray-500">Total Users</h4>
              <div className="text-2xl font-bold">{getKpi(kpis.total, 'totalUsers')}</div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h4 className="text-sm text-gray-500">Total Sales</h4>
              <div className="text-2xl font-bold">${getKpi(kpis.total, 'sales')}</div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h4 className="text-sm text-gray-500">New Users Today</h4>
              <div className="text-2xl font-bold">{getKpi(kpis.today, 'newUsers')}</div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
            <ChartCard title="Last 30 Days Analytics" dataSeries={series} />
          </section>

          <section className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Quick Insights</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>Total users today: {getKpi(kpis.today,'totalUsers')}</li>
              <li>Total sales today: ${getKpi(kpis.today,'sales')}</li>
              <li>New users today: {getKpi(kpis.today,'newUsers')}</li>
              <li>Export charts to CSV/PDF (future)</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
