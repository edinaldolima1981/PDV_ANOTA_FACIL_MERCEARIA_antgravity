import { useNavigate, useLocation } from "react-router-dom";
import { Store, ShoppingCart, Package, Users, BarChart3, Settings, LogOut, Receipt, Utensils } from "lucide-react";
import { useStore } from "@/contexts/StoreContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { features } = useStore();

  const navItems = [
    { path: "/home", label: "Vendas", icon: ShoppingCart },
    ...(features?.restaurant ? [{ path: "/restaurant/dashboard", label: "Restaurante", icon: Utensils }] : []),
    { path: "/stock", label: "Estoque", icon: Package },
    { path: "/fiado", label: "Clientes", icon: Users },
    { path: "/contas-receber", label: "A Prazo", icon: Receipt },
    { path: "/reports", label: "Relatórios", icon: BarChart3 },
    { path: "/admin", label: "Config", icon: Settings },
  ];

  return (
    <aside className="hidden md:flex w-[72px] bg-sidebar flex-col items-center py-5 gap-1 border-r border-sidebar-border flex-shrink-0 z-50">
      {/* Logo */}
      <button
        onClick={() => navigate("/home")}
        className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center mb-6 shadow-md hover:scale-105 transition-transform"
      >
        <Store className="w-5 h-5 text-primary-foreground" />
      </button>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all outline-none ${isActive
                ? "bg-sidebar-accent text-sidebar-foreground shadow-inner"
                : "text-sidebar-foreground opacity-60 hover:opacity-100 hover:bg-sidebar-accent/30"
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] font-medium font-body leading-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={() => navigate("/")}
        className="w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-0.5 text-sidebar-foreground opacity-50 hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
      >
        <LogOut className="w-5 h-5" />
        <span className="text-[9px] font-medium font-body leading-tight">Sair</span>
      </button>
    </aside>
  );
};

export default Sidebar;
