import { useState, createContext, useContext, useCallback, type ReactNode } from "react";
import type { CartItem } from "@/data/products";

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
    addSale: (sale: Omit<Sale, "id" | "timestamp">) => Sale;
    getSalesByDate: (date: string) => Sale[];
    getSalesByRange: (start: string, end: string) => Sale[];
    getSalesByOperator: (operatorId: string) => Sale[];
}

const SaleContext = createContext<SaleContextType | undefined>(undefined);

// Initial mock data if needed for display
const INITIAL_SALES: Sale[] = [];

export const SaleProvider = ({ children }: { children: ReactNode }) => {
    const [sales, setSales] = useState<Sale[]>(INITIAL_SALES);

    const addSale = useCallback((data: Omit<Sale, "id" | "timestamp">) => {
        const newSale: Sale = {
            ...data,
            id: `sale-${Date.now()}`,
            timestamp: new Date().toISOString(),
        };
        setSales((prev) => [newSale, ...prev]);

        // In a real app, this would persist to a database or localStorage
        const savedSales = JSON.parse(localStorage.getItem("sales_history") || "[]");
        localStorage.setItem("sales_history", JSON.stringify([newSale, ...savedSales]));

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

    // Load from localStorage on mount
    useState(() => {
        const saved = localStorage.getItem("sales_history");
        if (saved) {
            try {
                setSales(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load sales history", e);
            }
        }
    });

    return (
        <SaleContext.Provider value={{ sales, addSale, getSalesByDate, getSalesByRange, getSalesByOperator }}>
            {children}
        </SaleContext.Provider>
    );
};

export const useSales = () => {
    const context = useContext(SaleContext);
    if (!context) throw new Error("useSales must be used within SaleProvider");
    return context;
};
