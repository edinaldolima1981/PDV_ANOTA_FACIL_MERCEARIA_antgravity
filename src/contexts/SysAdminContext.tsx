import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface SystemStore {
    id: string;
    name: string;
    cnpj: string;
    plan: "Básico" | "Pro" | "Ilimitado";
    status: "Ativo" | "Inativo" | "Bloqueado";
    ownerName: string;
    ownerPhone?: string;
    dueDate?: string;
    features?: {
        restaurant?: boolean;
        inventory_advanced?: boolean;
    };
    createdAt: string;
}

interface SysAdminContextType {
    isAuthenticated: boolean;
    login: (pin: string) => boolean;
    logout: () => void;
    stores: SystemStore[];
    addStore: (store: Omit<SystemStore, "id" | "createdAt">) => void;
    updateStore: (id: string, store: Partial<Omit<SystemStore, "id" | "createdAt">>) => void;
    deleteStore: (id: string) => void;
}

const SysAdminContext = createContext<SysAdminContextType | undefined>(undefined);

// Some mock initial stores so the panel isn't empty
const INITIAL_STORES: SystemStore[] = [
    {
        id: "store-1",
        name: "Empório Orgânico",
        cnpj: "12.345.678/0001-90",
        plan: "Pro",
        status: "Ativo",
        ownerName: "João Silva",
        ownerPhone: "11999999999",
        dueDate: "2026-03-10",
        features: { restaurant: true },
        createdAt: "2026-01-10T10:00:00Z"
    },
    {
        id: "store-2",
        name: "Mercadinho da Esquina",
        cnpj: "98.765.432/0001-10",
        plan: "Básico",
        status: "Ativo",
        ownerName: "Maria Oliveira",
        ownerPhone: "11988888888",
        dueDate: "2026-02-15",
        createdAt: "2026-02-15T14:30:00Z"
    }
];

export const SysAdminProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [stores, setStores] = useState<SystemStore[]>(INITIAL_STORES);

    const login = useCallback((pin: string) => {
        // Hardcoded master PIN for simplicity (in a real app this would call an API)
        if (pin === "9999") {
            setIsAuthenticated(true);
            return true;
        }
        return false;
    }, []);

    const logout = useCallback(() => {
        setIsAuthenticated(false);
    }, []);

    const addStore = useCallback((storeData: Omit<SystemStore, "id" | "createdAt">) => {
        const newStore: SystemStore = {
            ...storeData,
            id: `store-${Date.now()}`,
            createdAt: new Date().toISOString()
        };
        setStores((prev) => [...prev, newStore]);
    }, []);

    const updateStore = useCallback((id: string, storeData: Partial<Omit<SystemStore, "id" | "createdAt">>) => {
        setStores((prev) => prev.map(s => s.id === id ? { ...s, ...storeData } : s));
    }, []);

    const deleteStore = useCallback((id: string) => {
        setStores((prev) => prev.filter(s => s.id !== id));
    }, []);

    return (
        <SysAdminContext.Provider value={{
            isAuthenticated,
            login,
            logout,
            stores,
            addStore,
            updateStore,
            deleteStore
        }}>
            {children}
        </SysAdminContext.Provider>
    );
};

export const useSysAdmin = () => {
    const context = useContext(SysAdminContext);
    if (!context) {
        throw new Error("useSysAdmin must be used within a SysAdminProvider");
    }
    return context;
};
