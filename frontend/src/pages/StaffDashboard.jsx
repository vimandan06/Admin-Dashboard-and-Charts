import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ChartCard from '../components/ChartCard';
import { fetchTimeSeries, fetchKPIs } from '../services/api';

export default function StaffDashboard() {
  const [series, setSeries] = useState({ sales: [], conversions: [] });
  const [kpis, setKpis] = useState({ total: {}, today: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // ✅ Try fetching KPI data (with fallback)
        const resKpis = await fetchKPIs();
        setKpis(resKpis?.data || { total: { sales: 0, conversions: 0 }, today: { conversions: 0 } }); 

        // ✅ Fetch time series for staff analytics
        const names = ['sales', 'conversions'];
        const tempSeries = {};
        for (const name of names) {
          try {
            const res = await fetchTimeSeries({ name, period: '30d' });
            tempSeries[name] = res?.data?.data || [];
          } catch {
            tempSeries[name] = [];
          }
        }
        setSeries(tempSeries);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-6 bg-gray-100 flex-1">
          {/* Staff KPI Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded shadow">
              <h4 className="text-sm text-gray-500">Your Total Sales</h4>
              <div className="text-2xl font-bold">
                {kpis?.total?.sales ?? 0}
              </div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h4 className="text-sm text-gray-500">Products Sold Today</h4>
              <div className="text-2xl font-bold">
                {kpis?.today?.conversions ?? 0}
              </div>
            </div>
          </section>

          {/* Staff Analytics Charts */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <ChartCard title="Your Sales (Last 30 Days)" dataSeries={series.sales} />
            <ChartCard title="Your Conversions (Last 30 Days)" dataSeries={series.conversions} />
          </section>
        </main>
      </div>
    </div>
  );
}
