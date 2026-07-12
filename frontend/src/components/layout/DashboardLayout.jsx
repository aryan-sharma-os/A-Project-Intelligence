import React from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 flex font-sans antialiased selection:bg-emerald-500/30">
      <Sidebar />
      <main className="flex-1 ml-60 min-w-0">
        <div className="max-w-[1600px] mx-auto p-6 h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
