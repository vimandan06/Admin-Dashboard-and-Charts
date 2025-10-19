import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function Contact(){
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <div className="bg-white p-6 rounded shadow max-w-lg">
            <h2 className="text-xl mb-4">Contact Us</h2>
            <div className="flex items-center gap-4 mb-3">
              <img src="https://via.placeholder.com/64" alt="admin" className="rounded-full"/>
              <div>
                <div className="font-semibold">Manifest Admin</div>
                <div className="text-sm text-gray-600">admin@manifest.company</div>
                <div className="text-sm text-gray-600">+1 555 123 456</div>
              </div>
            </div>
            <div className="text-sm text-gray-700">
              Address: 123 Manifest St, Example City
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
