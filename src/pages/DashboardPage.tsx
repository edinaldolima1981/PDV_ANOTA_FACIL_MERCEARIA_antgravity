import { TrendingUp, DollarSign, ShoppingBag, Users, BarChart3 } from "lucide-react";
import PosLayout from "@/components/pdv/PosLayout";

const MOCK_STATS = {
  totalToday: 1847.50,
  totalWeek: 8932.00,
  ticketMedio: 42.30,
  totalSales: 44,
  topProducts: [
    { name: "Banana Orgânica", qty: "23.5 kg", revenue: 162.15 },
    { name: "Queijo Minas Frescal", qty: "8.2 kg", revenue: 237.00 },
    { name: "Suco de Laranja", qty: "15 L", revenue: 180.00 },
    { name: "Granola Artesanal", qty: "6.8 kg", revenue: 153.00 },
    { name: "Pão Integral", qty: "12 un", revenue: 138.00 },
  ],
  hourlyData: [
    { hour: "08h", value: 120 },
    { hour: "09h", value: 280 },
    { hour: "10h", value: 350 },
    { hour: "11h", value: 420 },
    { hour: "12h", value: 310 },
    { hour: "13h", value: 180 },
    { hour: "14h", value: 220 },
    { hour: "15h", value: 290 },
    { hour: "16h", value: 380 },
    { hour: "17h", value: 450 },
  ],
};

const maxHourly = Math.max(...MOCK_STATS.hourlyData.map((d) => d.value));

const DashboardPage = () => {
  const statCards = [
    { label: "Vendas Hoje", value: `R$ ${MOCK_STATS.totalToday.toFixed(2).replace(".", ",")}`, icon: DollarSign, accent: true },
    { label: "Vendas Semana", value: `R$ ${MOCK_STATS.totalWeek.toFixed(2).replace(".", ",")}`, icon: TrendingUp, accent: false },
    { label: "Ticket Médio", value: `R$ ${MOCK_STATS.ticketMedio.toFixed(2).replace(".", ",")}`, icon: ShoppingBag, accent: false },
    { label: "Nº de Vendas", value: String(MOCK_STATS.totalSales), icon: Users, accent: false },
  ];

  return (
    <PosLayout>
      <div className="flex-1 flex flex-col overflow-hidden bg-background">
        <header className="bg-sidebar border-b border-sidebar-border px-5 py-4 flex-shrink-0 z-10">
          <h1 className="font-display text-lg font-bold text-sidebar-foreground">Painel de Resumo</h1>
          <p className="text-[11px] text-sidebar-foreground/40 font-body">Visão geral do negócio hoje</p>
        </header>

        <main className="flex-1 overflow-y-auto p-5 pb-32 md:pb-10 space-y-5 scrollbar-none">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className={`rounded-2xl p-4 border transition-all duration-300 shadow-soft hover:shadow-medium ${stat.accent
                      ? "bg-gradient-to-br from-primary to-accent text-primary-foreground border-transparent scale-105"
                      : "bg-card border-border/50"
                    }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-4 ${stat.accent ? "bg-white/20" : "bg-secondary/50"
                    }`}>
                    <Icon className={`w-5 h-5 ${stat.accent ? "text-primary-foreground" : "text-primary"}`} />
                  </div>
                  <p className={`text-[11px] font-bold font-body uppercase tracking-wider mb-1 ${stat.accent ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {stat.label}
                  </p>
                  <p className={`text-[19px] font-black font-display tracking-tight ${stat.accent ? "" : "text-foreground"}`}>
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Hourly Chart */}
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <p className="text-[14px] font-bold text-foreground font-body">Desempenho por Hora</p>
                </div>
              </div>
              <div className="flex items-end gap-2.5 h-40">
                {MOCK_STATS.hourlyData.map((d) => (
                  <div key={d.hour} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full rounded-lg bg-primary/10 hover:bg-primary transition-all duration-300 relative group cursor-pointer"
                      style={{ height: `${(d.value / maxHourly) * 100}%`, minHeight: 6 }}
                    >
                      <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-sidebar text-sidebar-foreground text-[10px] font-bold px-2 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-medium whitespace-nowrap z-20">
                        R$ {d.value}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-sidebar rotate-45" />
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-bold font-body">{d.hour}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
              <p className="text-[14px] font-bold text-foreground font-body mb-6">Top 5 - Mais Vendidos</p>
              <div className="space-y-4">
                {MOCK_STATS.topProducts.map((p, i) => (
                  <div key={p.name} className="flex items-center gap-4 group cursor-default">
                    <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary text-xs font-black flex items-center justify-center font-body transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold text-foreground font-body truncate leading-none mb-1">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground font-medium font-body leading-none">{p.qty}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[14px] font-black text-foreground font-body">
                        R$ {p.revenue.toFixed(2).replace(".", ",")}
                      </p>
                      <div className="w-16 h-1 rounded-full bg-muted/40 mt-1 overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${100 - (i * 15)}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </PosLayout>
  );
};

export default DashboardPage;
