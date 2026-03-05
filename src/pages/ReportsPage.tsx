import { useState, useMemo } from "react";
import {
    TrendingUp,
    DollarSign,
    ShoppingBag,
    Users,
    BarChart3,
    Calendar,
    Search,
    Filter,
    ArrowRight,
    User,
    Clock
} from "lucide-react";
import PosLayout from "@/components/pdv/PosLayout";
import { useSales } from "@/contexts/SaleContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const fmt = (v: number) => `R$ ${v.toFixed(2).replace(".", ",")}`;

const ReportsPage = () => {
    const { sales } = useSales();
    const [dateFilter, setDateFilter] = useState(new Date().toISOString().split("T")[0]);
    const [searchQuery, setSearchQuery] = useState("");

    // Filtered sales
    const filteredSales = useMemo(() => {
        return sales.filter(sale => {
            const matchDate = sale.timestamp.startsWith(dateFilter);
            const matchSearch = sale.operatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (sale.customerName?.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchDate && matchSearch;
        });
    }, [sales, dateFilter, searchQuery]);

    // Statistics
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

        return {
            totalToday,
            totalWeek,
            ticketMedio,
            count: sales.length,
            filteredCount: filteredSales.length,
            filteredTotal: filteredSales.reduce((acc, s) => acc + s.total, 0)
        };
    }, [sales, filteredSales]);

    return (
        <PosLayout>
            <div className="flex-1 flex flex-col overflow-hidden bg-background">
                <header className="bg-sidebar border-b border-sidebar-border px-5 py-4 flex-shrink-0 z-10 flex items-center justify-between">
                    <div>
                        <h1 className="font-display text-lg font-bold text-sidebar-foreground">Relatórios de Vendas</h1>
                        <p className="text-[11px] text-sidebar-foreground/40 font-body">Histórico completo e análise de desempenho</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="pl-10 pr-4 h-10 rounded-xl bg-card border border-border text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-5 pb-32 md:pb-10 space-y-5 scrollbar-none">
                    {/* Stat Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="p-4 border-none shadow-soft bg-gradient-to-br from-primary to-accent text-primary-foreground">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 bg-white/20">
                                <DollarSign className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <p className="text-[11px] font-bold font-body uppercase tracking-wider mb-1 text-primary-foreground/70">Vendas Hoje</p>
                            <p className="text-[19px] font-black font-display tracking-tight">{fmt(stats.totalToday)}</p>
                        </Card>

                        <Card className="p-4 border border-border/50 shadow-soft bg-card">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 bg-secondary/50">
                                <TrendingUp className="w-5 h-5 text-primary" />
                            </div>
                            <p className="text-[11px] font-bold font-body uppercase tracking-wider mb-1 text-muted-foreground">Vendas na Semana</p>
                            <p className="text-[19px] font-black font-display tracking-tight text-foreground">{fmt(stats.totalWeek)}</p>
                        </Card>

                        <Card className="p-4 border border-border/50 shadow-soft bg-card">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 bg-secondary/50">
                                <ShoppingBag className="w-5 h-5 text-primary" />
                            </div>
                            <p className="text-[11px] font-bold font-body uppercase tracking-wider mb-1 text-muted-foreground">Ticket Médio</p>
                            <p className="text-[19px] font-black font-display tracking-tight text-foreground">{fmt(stats.ticketMedio)}</p>
                        </Card>

                        <Card className="p-4 border border-border/50 shadow-soft bg-card">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 bg-secondary/50">
                                <Users className="w-5 h-5 text-primary" />
                            </div>
                            <p className="text-[11px] font-bold font-body uppercase tracking-wider mb-1 text-muted-foreground">Total de Vendas</p>
                            <p className="text-[19px] font-black font-display tracking-tight text-foreground">{stats.count}</p>
                        </Card>
                    </div>

                    {/* List and Filters Section */}
                    <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <h2 className="text-[16px] font-bold text-foreground font-body">Vendas em {new Date(dateFilter).toLocaleDateString("pt-BR")}</h2>

                            <div className="flex flex-1 max-w-md gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        placeholder="Buscar colaborador ou cliente..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 h-10 rounded-xl bg-background border border-border text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                </div>
                                <div className="bg-primary/10 text-primary px-4 rounded-xl flex items-center justify-center font-bold font-body text-xs">
                                    {stats.filteredCount} vendas
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto overflow-y-hidden">
                            <table className="w-full border-separate border-spacing-y-2">
                                <thead>
                                    <tr className="text-left">
                                        <th className="px-4 py-2 text-[10px] uppercase font-black text-muted-foreground tracking-widest font-body">Horário</th>
                                        <th className="px-4 py-2 text-[10px] uppercase font-black text-muted-foreground tracking-widest font-body">Colaborador</th>
                                        <th className="px-4 py-2 text-[10px] uppercase font-black text-muted-foreground tracking-widest font-body">Cliente</th>
                                        <th className="px-4 py-2 text-[10px] uppercase font-black text-muted-foreground tracking-widest font-body">Met. Pagamento</th>
                                        <th className="px-4 py-2 text-right text-[10px] uppercase font-black text-muted-foreground tracking-widest font-body">Valor Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSales.length > 0 ? (
                                        filteredSales.map((sale) => (
                                            <tr key={sale.id} className="bg-background/50 hover:bg-background transition-colors group">
                                                <td className="px-4 py-4 rounded-l-xl border-y border-l border-border/40 font-body">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-3.5 h-3.5 text-muted-foreground/60" />
                                                        <span className="text-sm font-bold text-foreground">
                                                            {new Date(sale.timestamp).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 border-y border-border/40 font-body">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary uppercase">
                                                            {sale.operatorName.charAt(0)}
                                                        </div>
                                                        <span className="text-sm font-medium text-foreground">{sale.operatorName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 border-y border-border/40 font-body">
                                                    <span className="text-sm text-foreground/70">{sale.customerName || "Consumidor"}</span>
                                                </td>
                                                <td className="px-4 py-4 border-y border-border/40 font-body">
                                                    <span className="text-xs font-bold uppercase tracking-wider bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">
                                                        {sale.paymentMethod}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 rounded-r-xl border-y border-r border-border/40 text-right font-body">
                                                    <span className="text-sm font-black text-foreground">{fmt(sale.total)}</span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Filter className="w-12 h-12 text-muted-foreground/20" />
                                                    <p className="text-sm font-medium text-muted-foreground font-body">Nenhuma venda encontrada para os filtros aplicados.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {filteredSales.length > 0 && (
                            <div className="mt-8 pt-6 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="text-sm font-body text-muted-foreground">
                                    Mostrando <span className="font-bold text-foreground">{filteredSales.length}</span> de <span className="font-bold text-foreground">{stats.count}</span> vendas totais
                                </div>
                                <div className="bg-primary/5 px-6 py-4 rounded-2xl flex items-center gap-8">
                                    <div className="text-center">
                                        <p className="text-[10px] uppercase font-black text-muted-foreground font-body leading-none mb-1">Total Filtrado</p>
                                        <p className="text-lg font-black text-primary font-display leading-none">{fmt(stats.filteredTotal)}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </PosLayout>
    );
};

export default ReportsPage;
