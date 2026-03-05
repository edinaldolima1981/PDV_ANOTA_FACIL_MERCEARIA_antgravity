import type { Product } from "@/data/products";
import { useProducts } from "@/contexts/ProductContext";
import { Plus } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

const ProductCard = ({ product, onAdd }: ProductCardProps) => {
  const { categories, getUnitShort } = useProducts();
  const unitLabel = getUnitShort(product.unit);
  const category = categories.find((c) => c.id === product.category);
  const emoji = category?.icon || "📦";

  return (
    <button
      onClick={() => onAdd(product)}
      className="bg-card rounded-2xl p-3 flex flex-col gap-2 border border-border/50 shadow-soft hover:shadow-medium hover:border-primary/30 transition-all duration-300 active:scale-[0.97] text-left group overflow-hidden"
    >
      <div className="w-full aspect-square rounded-xl bg-muted/30 flex items-center justify-center text-3xl overflow-hidden relative">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        ) : (
          <span className="opacity-80">{emoji}</span>
        )}
      </div>
      <div className="flex-1 mt-1">
        <p className="text-[13px] font-semibold text-foreground font-body line-clamp-2 leading-tight h-[2.6em]">
          {product.name}
        </p>
      </div>
      <div className="flex items-center justify-between w-full mt-auto pt-1">
        <div className="flex flex-col">
          <span className="text-[14px] font-bold text-foreground font-body">
            R$ {product.price.toFixed(2).replace(".", ",")}
          </span>
          <span className="text-[10px] font-medium text-muted-foreground uppercase">{unitLabel}</span>
        </div>
        <div className="w-8 h-8 rounded-xl bg-white border border-border flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300">
          <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
        </div>
      </div>
    </button>
  );
};

export default ProductCard;
