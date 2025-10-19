import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function Earnings(){
  // Real values should be fetched from backend endpoints
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <h2 className="text-xl mb-4">Earnings</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <h4 className="text-sm text-gray-500">Total Earnings</h4>
              <div className="text-2xl font-bold">$240,760</div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h4 className="text-sm text-gray-500">This Month</h4>
              <div className="text-2xl font-bold">$18,200</div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h4 className="text-sm text-gray-500">This Year</h4>
              <div className="text-2xl font-bold">$120,000</div>
            </div>
          </div>

          <div className="mt-6 bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Yearly vs Monthly</h3>
            <p className="text-sm text-gray-600">Chart placeholder — use /analytics endpoints to show actual charts.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
