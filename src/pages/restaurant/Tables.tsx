import React from 'react';
import { Button } from "@/components/ui/button";

const RestaurantTables = () => {
  return (
    <div className="bg-[#11131c] min-h-screen text-on-surface font-sans selection:bg-primary/30 pb-24">
      <header className="fixed top-0 w-full z-50 bg-[#11131c] flex justify-between items-center px-6 h-16 border-b border-white/5">
        <div className="flex items-center gap-4">
          <h1 className="text-[#66dd8b] font-black tracking-tighter text-xl">Nocturnal</h1>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex gap-4">
            <Button variant="ghost" className="text-[#66dd8b]">Dashboard</Button>
            <Button variant="ghost" className="text-primary bg-primary/10">Tables</Button>
            <Button variant="ghost" className="text-slate-400">Orders</Button>
          </nav>
        </div>
      </header>

      <main className="pt-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <span className="text-secondary tracking-widest uppercase mb-2 block text-[10px]">Real-time Visualization</span>
            <h2 className="text-4xl font-bold text-on-surface">Main Dining Floor</h2>
          </div>
          <div className="flex flex-wrap gap-3">
             <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full">
                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(102,221,139,0.5)]"></div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Available</span>
              </div>
              <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full">
                <div className="w-2 h-2 rounded-full bg-tertiary shadow-[0_0_8px_rgba(255,181,156,0.5)]"></div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Occupied</span>
              </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {/* Mock Tables */}
          {[
            { id: 'T-04', guests: 4, status: 'Occupied', type: 'tertiary', time: '1h 12m' },
            { id: 'T-12', guests: 2, status: 'Bill Requested', type: 'secondary', time: '48m' },
            { id: 'T-08', guests: 6, status: 'Available', type: 'primary', time: '' },
            { id: 'T-21', guests: 4, status: 'Reserved', type: 'blue-400', time: '19:30' },
            { id: 'T-02', guests: 4, status: 'Available', type: 'primary', time: '' },
          ].map((t) => (
            <div key={t.id} className="group relative bg-surface-container-high rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden">
               <div className={`absolute left-0 top-0 bottom-0 w-1 bg-${t.type}`}></div>
               <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-extrabold text-on-surface">{t.id}</h3>
                    <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">{t.guests} Guests</p>
                  </div>
                  <span className={`bg-${t.type}/10 text-${t.type} px-2 py-1 rounded text-[10px] font-bold uppercase`}>{t.status}</span>
               </div>
               {t.status === 'Available' ? (
                 <div className="flex flex-col justify-center items-center py-4 text-slate-600">
                    <span className="material-symbols-outlined text-3xl mb-1">restaurant</span>
                    <span className="text-[10px] font-bold uppercase">Ready to Seat</span>
                 </div>
               ) : (
                 <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">{t.status === 'Reserved' ? 'Arrival' : 'Duration'}</span>
                      <span className="font-bold text-on-surface">{t.time}</span>
                    </div>
                 </div>
               )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default RestaurantTables;
