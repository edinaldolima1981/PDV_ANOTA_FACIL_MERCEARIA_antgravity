import { useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useProducts } from "@/contexts/ProductContext";
import { Button } from "@/components/ui/button";

const CartPage = () => {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart();
  const { getUnitShort } = useProducts();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <ShoppingCart className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <h2 className="font-display text-xl font-bold text-foreground mb-2">
          Carrinho vazio
        </h2>
        <p className="text-sm text-muted-foreground font-body mb-6">
          Adicione produtos para continuar
        </p>
        <Button size="lg" className="rounded-2xl" onClick={() => navigate("/home")}>
          Voltar às compras
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-48">
      {/* Header */}
      <header className="bg-sidebar px-5 pt-7 pb-5 sticky top-0 z-30 border-b border-sidebar-border shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/home")}
            className="w-10 h-10 rounded-xl bg-sidebar-accent flex items-center justify-center hover:bg-sidebar-accent/80 transition-all active:scale-95 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-sidebar-foreground" />
          </button>
          <div>
            <h1 className="font-display text-lg font-black text-sidebar-foreground leading-none mb-1 uppercase tracking-tight">
              Meu Carrinho
            </h1>
            <p className="text-[11px] text-sidebar-foreground/40 font-bold font-body uppercase tracking-wider">
              {totalItems} {totalItems === 1 ? "item" : "itens"} selecionados
            </p>
          </div>
        </div>
      </header>

      {/* Items list */}
      <main className="flex-1 px-5 pt-5 space-y-4 scrollbar-none">
        {items.map(({ product, quantity }) => {
          const unitLabel = getUnitShort(product.unit);
          const step = product.unit === "kg" ? 0.1 : 1;
          const subtotal = product.price * quantity;

          return (
            <div
              key={product.id}
              className="bg-card rounded-2xl p-4 shadow-soft border border-border/50 flex gap-4 items-center animate-fade-in"
            >
              {/* Image/Emoji icon */}
              <div className="w-16 h-16 rounded-xl bg-muted/30 flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden relative border border-border/30">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="opacity-80">
                    {product.category === "acougue" && "🥩"}
                    {product.category === "frutas" && "🍎"}
                    {product.category === "verduras" && "🥬"}
                    {product.category === "laticinios" && "🧀"}
                    {product.category === "bebidas" && "🥤"}
                    {product.category === "graos" && "🌾"}
                    {product.category === "padaria" && "🍞"}
                    {!["acougue", "frutas", "verduras", "laticinios", "bebidas", "graos", "padaria"].includes(product.category) && "📦"}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-foreground font-body truncate leading-tight">
                  {product.name}
                </p>
                <p className="text-[11px] text-muted-foreground font-bold font-body mt-1 uppercase tracking-tighter opacity-70">
                  R$ {product.price.toFixed(2).replace(".", ",")} / {unitLabel}
                </p>

                {/* Quantity controls */}
                <div className="flex items-center gap-4 mt-3">
                  <button
                    onClick={() =>
                      updateQuantity(
                        product.id,
                        Math.round((quantity - step) * 10) / 10
                      )
                    }
                    className="w-9 h-9 rounded-xl bg-secondary/70 flex items-center justify-center active:scale-90 transition-all border border-border/50"
                  >
                    <Minus className="w-4 h-4 text-foreground" />
                  </button>
                  <span className="text-[15px] font-black text-foreground font-body min-w-[44px] text-center">
                    {product.unit === "kg" ? quantity.toFixed(1) : quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(
                        product.id,
                        Math.round((quantity + step) * 10) / 10
                      )
                    }
                    className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center active:scale-90 transition-all text-primary-foreground shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Subtotal & delete */}
              <div className="flex flex-col items-end justify-between h-16 py-0.5">
                <span className="text-[15px] font-black text-primary font-body tracking-tight">
                  R$ {subtotal.toFixed(2).replace(".", ",")}
                </span>
                <button
                  onClick={() => removeItem(product.id)}
                  className="w-8 h-8 rounded-xl bg-destructive/5 flex items-center justify-center hover:bg-destructive/10 transition-colors group"
                >
                  <Trash2 className="w-4 h-4 text-destructive opacity-50 group-hover:opacity-100" />
                </button>
              </div>
            </div>
          );
        })}
      </main>

      {/* Checkout Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/50 p-5 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] z-40 safe-bottom rounded-t-[32px]">
        {/* Summary */}
        <div className="flex items-center justify-between mb-5 px-1">
          <div className="flex flex-col">
            <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest leading-none mb-1">Total Geral</span>
            <span className="text-[13px] font-medium text-muted-foreground leading-none">{totalItems} itens no pedido</span>
          </div>
          <span className="text-3xl font-black text-foreground font-display tracking-tight">
            R$ {totalPrice.toFixed(2).replace(".", ",")}
          </span>
        </div>

        {/* Payment button */}
        <Button
          size="xl"
          className="w-full h-15 rounded-2xl bg-gradient-to-r from-primary to-accent font-black text-[16px] shadow-elevated tracking-wider hover:scale-[1.01] transition-transform"
          onClick={() => navigate("/checkout")}
        >
          FINALIZAR PAGAMENTO
        </Button>
      </div>
    </div>
  );
};

export default CartPage;
