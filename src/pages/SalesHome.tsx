import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ScanBarcode, ShoppingCart, User } from "lucide-react";
import { useProducts } from "@/contexts/ProductContext";
import type { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import PosLayout from "@/components/pdv/PosLayout";
import CategoryBar from "@/components/pdv/CategoryBar";
import ProductCard from "@/components/pdv/ProductCard";
import CartPanel from "@/components/pdv/CartPanel";
import { toast } from "sonner";

const SalesHome = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const { addItem, totalItems, totalPrice } = useCart();
  const { products } = useProducts();
  const navigate = useNavigate();

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "todos" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <PosLayout>
      <main className="flex-1 flex flex-col overflow-hidden bg-background">
        <header className="bg-sidebar border-b border-sidebar-border px-5 py-4 flex items-center gap-4 flex-shrink-0 z-10">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-sidebar-foreground/40" />
            <input
              type="text"
              placeholder="Pesquise o código ou nome"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-11 pr-12 rounded-xl bg-sidebar-accent/50 border border-sidebar-border/30 text-[14px] font-body text-sidebar-foreground placeholder:text-sidebar-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all shadow-inner"
            />
            <button className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-sidebar-accent flex items-center justify-center hover:bg-sidebar-accent-foreground/10 transition-colors">
              <ScanBarcode className="w-5 h-5 text-sidebar-foreground/60" />
            </button>
          </div>
          <div className="hidden sm:flex items-center gap-3 ml-auto">
            <div className="flex flex-col items-end mr-1">
              <span className="text-[11px] text-sidebar-foreground/40 font-body leading-none mb-1">Operador</span>
              <span className="text-[13px] font-bold text-sidebar-foreground font-body leading-none">Maria Oliveira</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-sidebar-accent border border-sidebar-border/30 flex items-center justify-center shadow-sm">
              <User className="w-5 h-5 text-sidebar-foreground/70" />
            </div>
          </div>
        </header>

        <div className="px-5 py-4 border-b border-border bg-card/30 backdrop-blur-sm flex-shrink-0">
          <CategoryBar selected={selectedCategory} onSelect={setSelectedCategory} />
        </div>

        <div className="flex-1 overflow-y-auto p-5 pb-32 md:pb-10 scrollbar-none">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={(p) => {
                  addItem(p, 1);
                  toast.success(`${p.name} adicionado ao carrinho`);
                }}
              />
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
                <Search className="w-7 h-7 opacity-20" />
              </div>
              <p className="text-[15px] font-medium font-body opacity-60">Nenhum produto encontrado</p>
            </div>
          )}
        </div>

        {totalItems > 0 && (
          <div className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:bottom-6 left-0 right-0 px-5 z-40 lg:hidden pointer-events-none">
            <button
              onClick={() => navigate("/cart")}
              className="w-full h-15 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-2xl shadow-elevated flex items-center justify-between px-6 active:scale-[0.98] transition-all animate-fade-up pointer-events-auto"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div className="flex flex-col items-start translate-y-[-1px]">
                  <span className="text-[11px] font-medium opacity-80 leading-none mb-1">Ver Carrinho</span>
                  <span className="text-[14px] font-bold leading-none">{totalItems} itens</span>
                </div>
              </div>
              <span className="text-[18px] font-black font-display tracking-tight">
                R$ {totalPrice.toFixed(2).replace(".", ",")}
              </span>
            </button>
          </div>
        )}
      </main>
      <div className="hidden lg:flex h-full">
        <CartPanel />
      </div>
    </PosLayout>
  );
};

export default SalesHome;
