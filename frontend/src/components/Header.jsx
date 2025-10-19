import React from 'react';

export default function Header() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-6">
      <div className="text-lg font-semibold">Dashboard</div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-700">{user?.username || user?.name || '—'}</div>
      </div>
    </header>
  );
}
