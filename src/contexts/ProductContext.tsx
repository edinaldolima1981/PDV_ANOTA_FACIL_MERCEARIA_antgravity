import { useState, useEffect, createContext, useContext, useCallback, type ReactNode } from "react";
import type { Product, Category } from "@/data/products";
import { api } from "@/lib/api";

export interface CustomUnit {
  id: string;
  label: string;
  short: string;
}

const DEFAULT_UNITS: CustomUnit[] = [
  { id: "un", label: "Unidade", short: "un" },
  { id: "kg", label: "Quilograma", short: "kg" },
  { id: "L", label: "Litro", short: "L" },
  { id: "m", label: "Metro", short: "m" },
  { id: "m2", label: "Metro²", short: "m²" },
  { id: "peca", label: "Peça", short: "pç" },
  { id: "par", label: "Par", short: "par" },
  { id: "saco", label: "Saco", short: "sc" },
  { id: "duzia", label: "Dúzia", short: "dz" },
  { id: "cx", label: "Caixa", short: "cx" },
];

export type ProductUnit = string;

export const UNIT_LABELS: Record<string, string> = {};
export const UNIT_SHORT: Record<string, string> = {};
DEFAULT_UNITS.forEach((u) => {
  UNIT_LABELS[u.id] = u.label;
  UNIT_SHORT[u.id] = u.short;
});

interface ProductContextType {
  products: Product[];
  categories: Category[];
  units: CustomUnit[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addUnit: (unit: Omit<CustomUnit, "id">) => void;
  deleteUnit: (id: string) => void;
  getUnitShort: (id: string) => string;
  isLoading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<CustomUnit[]>(DEFAULT_UNITS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/products').catch(() => []),
      api.get('/categories').catch(() => [])
    ])
    .then(([fetchedProducts, fetchedCategories]) => {
      setProducts(fetchedProducts || []);
      setCategories(fetchedCategories || []);
    })
    .finally(() => setIsLoading(false));
  }, []);

  const addProduct = useCallback(async (product: Omit<Product, "id">) => {
    const tempId = `p${Date.now()}`;
    const newProduct = { ...product, id: tempId } as Product;
    // Optimistic UI update
    setProducts((prev) => [...prev, newProduct]);
    
    try {
        const res = await api.post('/products', newProduct);
        if (res.id && res.id !== tempId) {
             setProducts((prev) => prev.map(p => p.id === tempId ? { ...p, id: res.id } : p));
        }
    } catch (e) {
        console.error("Failed to save product to DB", e);
    }
  }, []);

  const updateProduct = useCallback(async (id: string, data: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
    try {
        const productToUpdate = products.find(p => p.id === id);
        if (productToUpdate) {
            await api.post('/products', { ...productToUpdate, ...data });
        }
    } catch (e) {
        console.error("Failed to update product in DB", e);
    }
  }, [products]);

  const deleteProduct = useCallback(async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
        await api.delete(`/products/${id}`);
    } catch (e) {
        console.error("Failed to delete product from DB", e);
    }
  }, []);

  const addCategory = useCallback((category: Category) => {
    setCategories((prev) => [...prev, category]);
    // DB categories normally read-only from migration, but UI allows. Assuming local for now if not supported in API fully.
  }, []);

  const updateCategory = useCallback((id: string, data: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const addUnit = useCallback((unit: Omit<CustomUnit, "id">) => {
    const id = `u_${unit.short.toLowerCase().replace(/[^a-z0-9]/g, "")}${Date.now()}`;
    const newUnit = { ...unit, id };
    setUnits((prev) => [...prev, newUnit]);
    UNIT_LABELS[id] = unit.label;
    UNIT_SHORT[id] = unit.short;
  }, []);

  const deleteUnit = useCallback((id: string) => {
    setUnits((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const getUnitShort = useCallback((id: string) => {
    const unit = units.find((u) => u.id === id);
    return unit?.short || UNIT_SHORT[id] || id;
  }, [units]);

  return (
    <ProductContext.Provider
      value={{ products, categories, units, addProduct, updateProduct, deleteProduct, addCategory, updateCategory, deleteCategory, addUnit, deleteUnit, getUnitShort, isLoading }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProducts must be used within ProductProvider");
  return context;
};
