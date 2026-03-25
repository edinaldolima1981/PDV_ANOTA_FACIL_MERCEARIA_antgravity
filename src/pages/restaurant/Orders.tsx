import React from 'react';
import { Button } from "@/components/ui/button";

const RestaurantOrders = () => {
  return (
    <div className="bg-[#11131c] min-h-screen text-on-surface font-sans selection:bg-primary/30 pb-24">
      <header className="fixed top-0 w-full z-50 bg-[#11131c] flex justify-between items-center px-6 h-16 border-b border-white/5">
        <div className="flex items-center gap-4">
          <span className="text-[#66dd8b] font-black tracking-tighter text-xl">Nocturnal</span>
        </div>
      </header>

      <main className="pt-24 px-6 lg:px-12 max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <p className="text-secondary text-[10px] font-bold uppercase tracking-[0.2em]">Active Command</p>
            <h1 className="font-extrabold text-4xl text-on-surface tracking-tight">Table 14 <span className="text-primary opacity-50 ml-2 font-medium text-2xl">Main Floor</span></h1>
          </div>
        </section>

        <section className="lg:col-span-8 space-y-8">
          <div className="flex gap-4 overflow-x-auto pb-2">
            <Button className="rounded-full bg-primary/10 text-primary border-none">Drinks</Button>
            <Button variant="ghost" className="rounded-full text-slate-400">Appetizers</Button>
            <Button variant="ghost" className="rounded-full text-slate-400">Main Course</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="group bg-surface-container-low p-6 rounded-3xl hover:bg-surface-container transition-all cursor-pointer relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-40"></div>
               <div className="flex justify-between items-start mb-4">
                  <div className="bg-surface-container-high w-12 h-12 rounded-2xl flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">local_bar</span>
                  </div>
                  <span className="text-primary font-bold">$18</span>
               </div>
               <h3 className="font-bold text-lg leading-tight mb-1">Old Fashioned</h3>
               <p className="text-slate-500 text-xs mb-6">Bourbon, sugar, bitters, orange zest</p>
               <Button className="w-full bg-surface-container-highest group-hover:bg-primary group-hover:text-[#00210c] py-6 rounded-2xl transition-all">
                  Add to Order
               </Button>
            </div>
          </div>
        </section>

        <aside className="lg:col-span-4">
           <div className="bg-surface-container p-6 rounded-[2rem] border border-white/[0.03] sticky top-24">
              <h2 className="font-extrabold text-xl mb-8">Order Summary</h2>
              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <span className="font-bold text-primary">2×</span>
                    <div>
                      <p className="font-bold text-sm leading-none mb-1">Old Fashioned</p>
                      <p className="text-slate-500 text-[11px]">Extra bitters</p>
                    </div>
                  </div>
                  <p className="font-bold text-sm">$36.00</p>
                </div>
              </div>
              <div className="bg-surface-container-low p-6 rounded-2xl mb-8">
                <div className="flex justify-between font-extrabold text-xl text-on-surface">
                  <span>Total</span>
                  <span>$36.00</span>
                </div>
              </div>
              <Button className="w-full bg-primary text-[#00210c] py-8 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                Send to Kitchen
              </Button>
           </div>
        </aside>
      </main>
    </div>
  );
};

export default RestaurantOrders;
