import { TrendingUp, DollarSign, ShoppingBag, Users, BarChart3 } from "lucide-react";
import PosLayout from "@/components/pdv/PosLayout";
import { useSales } from "@/contexts/SaleContext";
import { useMemo } from "react";

const fmt = (v: number) => `R$ ${v.toFixed(2).replace(".", ",")}`;

const DashboardPage = () => {
  const { sales } = useSales();

  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const todaySales = sales.filter(s => s.timestamp.startsWith(today));
    const totalToday = todaySales.reduce((acc, s) => acc + s.total, 0);

    // Last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const weekSales = sales.filter(s => new Date(s.timestamp) >= sevenDaysAgo);
    const totalWeek = weekSales.reduce((acc, s) => acc + s.total, 0);

    const ticketMedio = sales.length > 0 ? sales.reduce((acc, s) => acc + s.total, 0) / sales.length : 0;

    // Hourly data for today
    const hourlyMap: Record<string, number> = {};
    for (let i = 8; i <= 20; i++) {
        hourlyMap[`${String(i).padStart(2, '0')}h`] = 0;
    }
    
    todaySales.forEach(s => {
        const hour = new Date(s.timestamp).getHours();
        const key = `${String(hour).padStart(2, '0')}h`;
        if (hourlyMap[key] !== undefined) {
            hourlyMap[key] += s.total;
        }
    });

    const hourlyData = Object.entries(hourlyMap).map(([hour, value]) => ({ hour, value }));

    // Top products (simplified from sales items)
    const productMap: Record<string, { name: string, qty: number, revenue: number, unit: string }> = {};
    sales.forEach(s => {
        if (s.items) {
            s.items.forEach(item => {
                if (!productMap[item.product.id]) {
                    productMap[item.product.id] = { 
                        name: item.product.name, 
                        qty: 0, 
                        revenue: 0, 
                        unit: item.product.unit 
                    };
                }
                productMap[item.product.id].qty += item.quantity;
                productMap[item.product.id].revenue += item.product.price * item.quantity;
            });
        }
    });

    const topProducts = Object.values(productMap)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

    return {
      totalToday,
      totalWeek,
      ticketMedio,
      totalSales: sales.length,
      hourlyData,
      topProducts
    };
  }, [sales]);

  const maxHourly = Math.max(...stats.hourlyData.map((d) => d.value), 1);

  const statCards = [
    { label: "Vendas Hoje", value: fmt(stats.totalToday), icon: DollarSign, accent: true },
    { label: "Vendas Semana", value: fmt(stats.totalWeek), icon: TrendingUp, accent: false },
    { label: "Ticket Médio", value: fmt(stats.ticketMedio), icon: ShoppingBag, accent: false },
    { label: "Nº de Vendas", value: String(stats.totalSales), icon: Users, accent: false },
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
                {stats.hourlyData.map((d) => (
                  <div key={d.hour} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full rounded-lg bg-primary/10 hover:bg-primary transition-all duration-300 relative group cursor-pointer"
                      style={{ height: `${(d.value / maxHourly) * 100}%`, minHeight: 6 }}
                    >
                      <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-sidebar text-sidebar-foreground text-[10px] font-bold px-2 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-medium whitespace-nowrap z-20">
                        {fmt(d.value)}
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
                {stats.topProducts.map((p, i) => (
                  <div key={p.name} className="flex items-center gap-4 group cursor-default">
                    <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary text-xs font-black flex items-center justify-center font-body transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold text-foreground font-body truncate leading-none mb-1">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground font-medium font-body leading-none">
                        {p.qty} {p.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[14px] font-black text-foreground font-body">
                        {fmt(p.revenue)}
                      </p>
                      <div className="w-16 h-1 rounded-full bg-muted/40 mt-1 overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${100 - (i * 15)}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
                {stats.topProducts.length === 0 && (
                  <p className="text-sm text-center text-muted-foreground py-10">Nenhuma venda registrada ainda.</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </PosLayout>
  );
};

export default DashboardPage;
