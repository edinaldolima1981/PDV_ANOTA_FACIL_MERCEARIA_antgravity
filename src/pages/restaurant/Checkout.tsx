import React from 'react';
import { Button } from "@/components/ui/button";

const RestaurantCheckout = () => {
  return (
    <div className="bg-[#11131c] min-h-screen text-on-surface font-sans selection:bg-primary/30 pb-32">
       <header className="fixed top-0 w-full z-50 bg-[#11131c] flex justify-between items-center px-6 h-16 border-b border-white/5">
        <div className="flex items-center gap-4">
          <h1 className="text-[#66dd8b] font-black tracking-tighter text-xl uppercase">Nocturnal</h1>
        </div>
      </header>

      <main className="pt-24 px-6 md:ml-0 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          <section className="flex-1 space-y-8">
             <header className="space-y-1">
                <div className="flex items-center gap-2 text-secondary text-[10px] font-bold uppercase tracking-widest">
                  <span className="material-symbols-outlined text-sm">table_restaurant</span>
                  TABLE 24 • MAIN LOUNGE
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight">Final Bill Review</h2>
             </header>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-surface-container rounded-3xl p-6 border-l-4 border-primary relative overflow-hidden">
                   <h3 className="font-bold text-lg">Midnight Espresso Martini</h3>
                   <div className="mt-6 text-xl font-black text-on-surface">$54.00</div>
                </div>
                <div className="bg-surface-container rounded-3xl p-6 border-l-4 border-secondary relative overflow-hidden">
                   <h3 className="font-bold text-lg">Wagyu Truffle Sliders</h3>
                   <div className="mt-6 text-xl font-black text-on-surface">$82.00</div>
                </div>
             </div>
          </section>

          <section className="w-full lg:w-[400px]">
             <div className="bg-surface-container-high rounded-[2.5rem] p-8 shadow-2xl border border-white/5">
                <h3 className="font-bold text-xl mb-6">Payment Flow</h3>
                <div className="flex p-1 bg-surface-container-lowest rounded-2xl mb-8">
                  <button className="flex-1 py-3 text-xs font-bold uppercase tracking-widest bg-surface-container text-primary rounded-xl">Equally</button>
                  <button className="flex-1 py-3 text-xs font-bold uppercase tracking-widest text-on-surface-variant">By Item</button>
                </div>
                
                <div className="pt-6 border-t border-white/5 space-y-6">
                  <div className="flex justify-between items-end">
                    <span className="text-on-surface-variant text-sm">TOTAL AMOUNT</span>
                    <span className="text-4xl font-black text-on-surface">$167.28</span>
                  </div>
                  <Button className="w-full bg-primary text-[#00210c] font-black py-8 rounded-2xl shadow-lg shadow-primary/20">
                    COMPLETE PAYMENT
                  </Button>
                </div>
             </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default RestaurantCheckout;
