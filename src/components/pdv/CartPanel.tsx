import { useState } from "react";
import { Minus, Plus, Trash2, UserPlus, Printer, ChevronRight, ShoppingCart, UserCheck } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useProducts } from "@/contexts/ProductContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CustomerSelectModal from "./CustomerSelectModal";
import { toast } from "sonner";

const CartPanel = () => {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, selectedCustomer, setSelectedCustomer } = useCart();
  const { getUnitShort } = useProducts();
  const navigate = useNavigate();
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  const handleFinalize = () => {
    if (!selectedCustomer) {
      toast.error("Por favor, identifique o cliente antes de finalizar a venda", {
        description: "É obrigatório selecionar um cliente para prosseguir.",
        duration: 4000,
      });
      setShowCustomerModal(true);
      return;
    }
    navigate("/checkout");
  };

  return (
    <aside className="hidden lg:flex w-[340px] xl:w-[380px] h-screen bg-card border-l border-border flex-col flex-shrink-0 shadow-soft">
      {/* Dark header - matches main header height */}
      <div className="bg-sidebar border-b border-sidebar-border px-5 py-4 flex items-center flex-shrink-0">
        <h2 className="h-11 font-display text-base font-bold text-sidebar-foreground flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-primary" />
          Pedido Atual
        </h2>
      </div>

      {/* Secondary bar - matches category bar height */}
      <div className="px-5 py-4 border-b border-border bg-card/30 backdrop-blur-sm flex-shrink-0">
        <span className="text-[13px] text-muted-foreground font-medium font-body">
          Itens adicionados
        </span>
      </div>

      {/* Items - scrollable area */}
      <div className="flex-1 overflow-y-auto px-5 py-3 space-y-0 scrollbar-none min-h-0">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground/40 py-12">
            <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mb-3">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <p className="text-[13px] font-medium font-body">Carrinho vazio</p>
          </div>
        ) : (
          items.map(({ product, quantity }) => {
            const unitLabel = getUnitShort(product.unit);
            const step = product.unit === "kg" ? 0.1 : 1;
            const subtotal = product.price * quantity;

            return (
              <div key={product.id} className="flex items-center gap-3 py-4 border-b border-border/50 last:border-0 group animate-fade-in">
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-foreground font-body truncate leading-tight">
                    {product.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-medium font-body mt-0.5 uppercase">
                    R$ {product.price.toFixed(2).replace(".", ",")} / {unitLabel}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(product.id, Math.round((quantity - step) * 10) / 10)}
                      className="w-7 h-7 rounded-lg bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-all active:scale-90"
                    >
                      <Minus className="w-3.5 h-3.5 text-foreground" />
                    </button>
                    <span className="text-[13px] font-bold text-foreground font-body min-w-[32px] text-center">
                      {product.unit === "kg" ? quantity.toFixed(1) : quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, Math.round((quantity + step) * 10) / 10)}
                      className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all active:scale-90"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-[14px] font-black text-foreground font-body">
                    R$ {subtotal.toFixed(2).replace(".", ",")}
                  </span>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-destructive/10 text-muted-foreground/40 hover:text-destructive transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer - always visible at bottom */}
      <div className="border-t border-border px-5 py-4 space-y-3 bg-muted/10 flex-shrink-0">
        {/* Summary */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[13px] font-body">
            <span className="text-muted-foreground font-medium">Itens no carrinho</span>
            <span className="font-bold text-foreground uppercase text-[11px]">{totalItems} UN</span>
          </div>

          {/* Customer */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[13px] text-muted-foreground font-medium font-body">Cliente</span>
            {selectedCustomer ? (
              <button
                onClick={() => setShowCustomerModal(true)}
                className="flex items-center gap-1.5 text-[12px] text-success font-bold font-body hover:opacity-80 transition-opacity truncate max-w-[180px]"
              >
                <UserCheck className="w-3.5 h-3.5 flex-shrink-0" />
                {selectedCustomer.name}
              </button>
            ) : (
              <button
                onClick={() => setShowCustomerModal(true)}
                className="flex items-center gap-1.5 text-[12px] text-primary font-bold font-body hover:opacity-80 transition-opacity"
              >
                <UserPlus className="w-3.5 h-3.5" />
                IDENTIFICAR
              </button>
            )}
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <span className="text-[13px] text-muted-foreground font-bold uppercase">Total a Pagar</span>
          <span className="text-[22px] font-black text-foreground font-display tracking-tight">
            R$ {totalPrice.toFixed(2).replace(".", ",")}
          </span>
        </div>

        {/* Finalize button */}
        <Button
          size="lg"
          className="w-full h-12 rounded-2xl gap-2 font-bold bg-primary hover:scale-[1.02] transition-transform shadow-md"
          disabled={items.length === 0}
          onClick={handleFinalize}
        >
          <Printer className="w-4 h-4" />
          FINALIZAR VENDA
          <ChevronRight className="w-4 h-4 ml-auto" />
        </Button>
      </div>

      {showCustomerModal && (
        <CustomerSelectModal
          saleAmount={totalPrice}
          onSelect={(customer) => {
            setSelectedCustomer(customer);
            setShowCustomerModal(false);
            toast.success(`Cliente ${customer.name} identificado`);
          }}
          onClose={() => setShowCustomerModal(false)}
        />
      )}
    </aside>
  );
};

export default CartPanel;
