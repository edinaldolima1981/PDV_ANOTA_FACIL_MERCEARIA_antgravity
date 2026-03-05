import { useProducts } from "@/contexts/ProductContext";

interface CategoryBarProps {
  selected: string;
  onSelect: (id: string) => void;
}

const CategoryBar = ({ selected, onSelect }: CategoryBarProps) => {
  const { categories } = useProducts();

  return (
    <div className="flex gap-2.5 overflow-x-auto scrollbar-none pb-1">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-[13px] font-semibold font-body transition-all duration-300 ${selected === cat.id
              ? "bg-primary text-primary-foreground shadow-md scale-105"
              : "bg-card text-foreground border border-border/50 hover:bg-secondary/50"
            }`}
        >
          <span className="mr-1.5">{cat.icon}</span>
          {cat.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryBar;
