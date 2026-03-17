import { useState, useEffect, createContext, useContext, useCallback, type ReactNode } from "react";
import type { CartItem } from "@/data/products";
import { api } from "@/lib/api";

export interface Sale {
    id: string;
    items: CartItem[];
    total: number;
    timestamp: string;
    paymentMethod: string;
    operatorId: string;
    operatorName: string;
    customerId?: string;
    customerName?: string;
}

interface SaleContextType {
    sales: Sale[];
    addSale: (sale: Omit<Sale, "id" | "timestamp">) => Promise<Sale>;
    getSalesByDate: (date: string) => Sale[];
    getSalesByRange: (start: string, end: string) => Sale[];
    getSalesByOperator: (operatorId: string) => Sale[];
    isLoading: boolean;
}

const SaleContext = createContext<SaleContextType | undefined>(undefined);

export const SaleProvider = ({ children }: { children: ReactNode }) => {
    const [sales, setSales] = useState<Sale[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.get('/sales')
            .then(data => setSales(data || []))
            .catch(err => console.error("Failed to load sales history from DB", err))
            .finally(() => setIsLoading(false));
    }, []);

    const addSale = useCallback(async (data: Omit<Sale, "id" | "timestamp">) => {
        const tempId = `sale-${Date.now()}`;
        const newSale: Sale = {
            ...data,
            id: tempId,
            timestamp: new Date().toISOString(),
        };
        
        // Optimistic UI update
        setSales((prev) => [newSale, ...prev]);

        try {
            const res = await api.post('/sales', newSale);
            if (res.id && res.id !== tempId) {
                newSale.id = res.id;
                setSales((prev) => prev.map(s => s.id === tempId ? { ...s, id: res.id } : s));
            }
        } catch (e) {
            console.error("Failed to save sale to DB", e);
            // Rollback optimistic update
            setSales((prev) => prev.filter(s => s.id !== tempId));
            throw e;
        }

        return newSale;
    }, []);

    const getSalesByDate = useCallback((date: string) => {
        return sales.filter((s) => s.timestamp.startsWith(date));
    }, [sales]);

    const getSalesByRange = useCallback((start: string, end: string) => {
        const startTime = new Date(start).getTime();
        const endTime = new Date(end).getTime();
        return sales.filter((s) => {
            const t = new Date(s.timestamp).getTime();
            return t >= startTime && t <= endTime;
        });
    }, [sales]);

    const getSalesByOperator = useCallback((operatorId: string) => {
        return sales.filter((s) => s.operatorId === operatorId);
    }, [sales]);

    return (
        <SaleContext.Provider value={{ sales, addSale, getSalesByDate, getSalesByRange, getSalesByOperator, isLoading }}>
            {children}
        </SaleContext.Provider>
    );
};

export const useSales = () => {
    const context = useContext(SaleContext);
    if (!context) throw new Error("useSales must be used within SaleProvider");
    return context;
};
