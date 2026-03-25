import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const RestaurantDashboard = () => {
  return (
    <div className="bg-[#11131c] min-h-screen text-on-surface font-sans selection:bg-primary/30 pb-20 md:pb-0">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-[#11131c] flex justify-between items-center px-6 h-16 shadow-none border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden border border-white/5">
            <img 
              alt="Manager" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAALe3egXTW42WBAq9kDR_1TpuQyrdb5xfV3H8pZpbSVdJjSyA2pA2Vtnam9C-jkJ1Kiy7JmhFscr4Ur44xz-m4tE3PAT4jUr-cgjD_1UmMphhqZf6PbgXepNe7-X6_ogK-EqHB0-g4U0y3BpbhC_6YgXsngAjT_sySkuLrBI2MPDIPpBCmJxztZF_9bhsWb-nBDyynrxxwQ8xYbQbFm4BFgQv9g6d-M_cXDWTWzAe7mdAOpJIM81276dsafhYMzkXRwEbDLLitVx4" 
            />
          </div>
          <h1 className="text-[#66dd8b] font-bold tracking-tighter text-xl uppercase">Nocturnal</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-[#66dd8b] hover:bg-[#1d1f29]">
            <span className="material-symbols-outlined">notifications</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-32 px-6 md:px-10 lg:px-16 max-w-7xl mx-auto">
        {/* KPI Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-surface-container-low p-8 rounded-[2rem] border-none flex flex-col justify-between group hover:bg-surface-container transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <span className="text-xs uppercase tracking-widest text-on-surface-variant">Nightly Revenue</span>
              <span className="material-symbols-outlined text-primary">monetization_on</span>
            </div>
            <div>
              <h2 className="font-bold text-4xl text-on-surface tracking-tight">$12,482.50</h2>
              <p className="text-primary text-sm mt-2 font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">trending_up</span>
                +14.2% from last week
              </p>
            </div>
          </Card>

          <Card className="bg-surface-container-low p-8 rounded-[2rem] border-none flex flex-col justify-between group hover:bg-surface-container transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <span className="text-xs uppercase tracking-widest text-on-surface-variant">Active Tables</span>
              <span className="material-symbols-outlined text-secondary">restaurant</span>
            </div>
            <div>
              <h2 className="font-bold text-4xl text-on-surface tracking-tight">18 / 24</h2>
              <div className="w-full bg-surface-container-highest h-1.5 mt-4 rounded-full overflow-hidden">
                <div className="bg-secondary h-full w-[75%] rounded-full"></div>
              </div>
            </div>
          </Card>

          <Card className="bg-surface-container-low p-8 rounded-[2rem] border-none flex flex-col justify-between group hover:bg-surface-container transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <span className="text-xs uppercase tracking-widest text-on-surface-variant">Avg. Bill Time</span>
              <span className="material-symbols-outlined text-tertiary">timer</span>
            </div>
            <div>
              <h2 className="font-bold text-4xl text-on-surface tracking-tight">72 min</h2>
              <p className="text-on-surface-variant text-sm mt-2 font-medium">Optimal turnover pace</p>
            </div>
          </Card>
        </section>

        {/* Floor Status */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-2xl text-on-surface">Main Dining Floor</h3>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> 12 Available
                </span>
                <span className="px-3 py-1 rounded-full bg-tertiary/10 text-tertiary text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> 6 Seated
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[1, 3, 7].map((num) => (
                <div key={num} className="aspect-square bg-surface-container-high p-5 rounded-xl relative overflow-hidden group cursor-pointer active:scale-95 transition-all">
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-tertiary rounded-r shadow-[0_0_12px_rgba(255,181,156,0.4)]"></div>
                  <span className="font-extrabold text-2xl text-on-surface">T0{num}</span>
                  <div className="mt-auto">
                    <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Party of 4</p>
                    <p className="text-tertiary text-xs font-bold">Main Course</p>
                  </div>
                </div>
              ))}
              {[2, 4, 6, 8].map((num) => (
                <div key={num} className="aspect-square bg-surface-container-low p-5 rounded-xl relative overflow-hidden group cursor-pointer hover:bg-surface-bright active:scale-95 transition-all">
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r"></div>
                  <span className="font-extrabold text-2xl text-on-surface/40">T0{num}</span>
                  <div className="mt-auto">
                    <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">2 Seats</p>
                    <p className="text-primary text-xs font-bold">Ready</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="bg-surface-container-low rounded-3xl p-8 sticky top-24">
              <h3 className="font-bold text-xl text-on-surface mb-6">Live Kitchen Queue</h3>
              <div className="space-y-6">
                 {/* Order Item */}
                <div className="flex items-start gap-4 p-4 bg-surface-container-lowest rounded-2xl">
                  <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center flex-shrink-0 text-tertiary">
                    <span className="material-symbols-outlined">skillet</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="text-on-surface font-bold text-sm">Pan-Seared Scallops</h4>
                      <span className="text-[10px] font-bold text-tertiary uppercase tracking-widest">In Prep</span>
                    </div>
                    <p className="text-on-surface-variant text-xs mt-1 italic">Table 01 • Server: Marcus</p>
                  </div>
                </div>
              </div>
              <Button className="w-full mt-10 py-6 rounded-xl font-bold text-sm text-[#00210c] bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                View All Active Orders
              </Button>
            </div>
          </aside>
        </div>
      </main>

      {/* Bottom Bar Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-safe h-20 bg-[#11131c] border-t border-white/5 z-50">
        <div className="flex flex-col items-center justify-center text-[#66dd8b] bg-[#66dd8b]/10 rounded-xl px-3 py-1">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Dash</span>
        </div>
        <div className="flex flex-col items-center justify-center text-slate-500">
          <span className="material-symbols-outlined">table_restaurant</span>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Tables</span>
        </div>
        <div className="flex flex-col items-center justify-center text-slate-500">
          <span className="material-symbols-outlined">receipt_long</span>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Orders</span>
        </div>
      </nav>
    </div>
  );
};

export default RestaurantDashboard;
