import { useState, useEffect, createContext, useContext, useCallback, type ReactNode } from "react";
import { api } from "@/lib/api";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  cpf?: string;
  limite_credito: number;
  valor_em_aberto: number;
}

export interface CreditSale {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  dueDate: string;
  amount: number;
  status: "pendente" | "pago" | "atrasado";
  paymentMethod?: string;
  paidAt?: string;
  // Admin override info
  adminOverride?: {
    adminId: string;
    date: string;
    amountOverLimit: number;
    reason: string;
  };
}

export interface AdminLog {
  id: string;
  adminId: string;
  action: string;
  date: string;
  details: string;
}

interface CustomerContextType {
  customers: Customer[];
  creditSales: CreditSale[];
  adminLogs: AdminLog[];
  addCustomer: (customer: Omit<Customer, "id" | "valor_em_aberto">) => Promise<Customer>;
  getCustomer: (id: string) => Customer | undefined;
  getCreditoDisponivel: (customerId: string) => number;
  addCreditSale: (sale: Omit<CreditSale, "id" | "date" | "dueDate" | "status">) => Promise<CreditSale>;
  receiveSalePayment: (saleId: string, paymentMethod: string) => void;
  updateCustomerLimit: (customerId: string, newLimit: number, adminId: string) => void;
  logAdminAction: (adminId: string, action: string, details: string) => void;
  checkCreditAvailable: (customerId: string, amount: number) => { available: boolean; limite: number; emAberto: number; disponivel: number };
  isLoading: boolean;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider = ({ children }: { children: ReactNode }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [creditSales, setCreditSales] = useState<CreditSale[]>([]);
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([]); // Admin logs could also be moved to DB later, keeping local/mixed for now
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/customers').catch(() => []),
      api.get('/credit-sales').catch(() => [])
    ])
    .then(([rawCustomers, rawSales]) => {
      // MySQL returns DECIMAL as strings — cast to numbers
      const fetchedCustomers = (rawCustomers || []).map((c: any) => ({
        ...c,
        limite_credito: parseFloat(c.limite_credito) || 0,
        valor_em_aberto: parseFloat(c.valor_em_aberto) || 0,
      }));
      const fetchedSales = (rawSales || []).map((s: any) => ({
        ...s,
        amount: parseFloat(s.amount) || 0,
      }));
      setCustomers(fetchedCustomers);
      setCreditSales(fetchedSales);
    })
    .finally(() => setIsLoading(false));
  }, []);

  const addCustomer = useCallback(async (data: Omit<Customer, "id" | "valor_em_aberto">) => {
    const tempId = `c${Date.now()}`;
    const newCustomer: Customer = {
      ...data,
      id: tempId,
      valor_em_aberto: 0,
    };
    
    // Optimistic update
    setCustomers((prev) => [...prev, newCustomer]);
    
    try {
        const res = await api.post('/customers', newCustomer);
        if (res.id && res.id !== tempId) {
            setCustomers((prev) => prev.map(c => c.id === tempId ? { ...c, id: res.id } : c));
            newCustomer.id = res.id;
        }
    } catch (e) {
        console.error("Failed to save customer to DB", e);
    }
    
    return newCustomer;
  }, []);

  const getCustomer = useCallback((id: string) => {
    return customers.find((c) => c.id === id);
  }, [customers]);

  const getCreditoDisponivel = useCallback((customerId: string) => {
    const customer = customers.find((c) => c.id === customerId);
    if (!customer) return 0;
    return customer.limite_credito - customer.valor_em_aberto;
  }, [customers]);

  const checkCreditAvailable = useCallback((customerId: string, amount: number) => {
    const customer = customers.find((c) => c.id === customerId);
    if (!customer) return { available: false, limite: 0, emAberto: 0, disponivel: 0 };
    const disponivel = Number(customer.limite_credito) - Number(customer.valor_em_aberto);
    return {
      available: amount <= disponivel,
      limite: Number(customer.limite_credito),
      emAberto: Number(customer.valor_em_aberto),
      disponivel,
    };
  }, [customers]);

  const addCreditSale = useCallback(async (data: Omit<CreditSale, "id" | "date" | "dueDate" | "status">) => {
    const now = new Date();
    const due = new Date(now);
    due.setDate(due.getDate() + 30);

    const tempId = `cs${Date.now()}`;
    const sale: CreditSale = {
      ...data,
      id: tempId,
      date: now.toISOString().split("T")[0],
      dueDate: due.toISOString().split("T")[0],
      status: "pendente",
    };

    // Optimistic update
    setCreditSales((prev) => [...prev, sale]);
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === data.customerId
          ? { ...c, valor_em_aberto: Number(c.valor_em_aberto) + Number(data.amount) }
          : c
      )
    );
    
    try {
        const res = await api.post('/credit-sales', sale);
        if (res.id && res.id !== tempId) {
            sale.id = res.id;
            setCreditSales((prev) => prev.map(s => s.id === tempId ? { ...s, id: res.id } : s));
        }
    } catch (e) {
        console.error("Failed to save credit sale to DB", e);
    }

    return sale;
  }, []);

  const receiveSalePayment = useCallback(async (saleId: string, paymentMethod: string) => {
    // Optimistic update
    const sale = creditSales.find((s) => s.id === saleId);
    if (sale) {
        setCustomers((prevC) =>
          prevC.map((c) =>
            c.id === sale.customerId
              ? { ...c, valor_em_aberto: Math.max(0, Number(c.valor_em_aberto) - Number(sale.amount)) }
              : c
          )
        );
    }
    setCreditSales((prev) => prev.map((s) => s.id === saleId ? { ...s, status: "pago" as const, paymentMethod, paidAt: new Date().toISOString() } : s));

    try {
        await api.post(`/credit-sales/${saleId}/pay`, { paymentMethod });
    } catch (e) {
        console.error("Failed to register payment in DB", e);
    }
  }, [creditSales]);

  const logAdminAction = useCallback((adminId: string, action: string, details: string) => {
    setAdminLogs((prev) => [
      ...prev,
      { id: `log${Date.now()}`, adminId, action, date: new Date().toISOString(), details },
    ]);
  }, []);

  const updateCustomerLimit = useCallback(async (customerId: string, newLimit: number, adminId: string) => {
    // Optimistic update
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, limite_credito: newLimit } : c))
    );
    logAdminAction(adminId, "Alteração de limite", `Limite alterado para R$ ${newLimit.toFixed(2)} - Cliente: ${customerId}`);
    
    try {
        const customer = customers.find((c) => c.id === customerId);
        if (customer) {
            await api.post('/customers', { ...customer, limite_credito: newLimit });
        }
    } catch (e) {
        console.error("Failed to update limit in DB", e);
    }
  }, [customers, logAdminAction]);

  return (
    <CustomerContext.Provider
      value={{
        customers, creditSales, adminLogs,
        addCustomer, getCustomer, getCreditoDisponivel,
        addCreditSale, receiveSalePayment, updateCustomerLimit,
        logAdminAction, checkCreditAvailable, isLoading
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomers = () => {
  const context = useContext(CustomerContext);
  if (!context) throw new Error("useCustomers must be used within CustomerProvider");
  return context;
};
