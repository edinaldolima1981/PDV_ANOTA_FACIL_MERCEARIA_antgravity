import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { CustomerProvider } from "@/contexts/CustomerContext";
import { StoreProvider } from "@/contexts/StoreContext";
import { ProductProvider } from "@/contexts/ProductContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SaleProvider } from "@/contexts/SaleContext";
import LoginPin from "./pages/LoginPin";
import SalesHome from "./pages/SalesHome";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ReceiptPage from "./pages/ReceiptPage";
import StockPage from "./pages/StockPage";
import FiadoPage from "./pages/FiadoPage";
import ReportsPage from "./pages/ReportsPage";
import AdminPage from "./pages/AdminPage";
import ContasReceberPage from "./pages/ContasReceberPage";
import SuperAdminPanel from "./pages/sysadmin/SuperAdminPanel";
import RestaurantDashboard from "./pages/restaurant/Dashboard";
import RestaurantTables from "./pages/restaurant/Tables";
import RestaurantOrders from "./pages/restaurant/Orders";
import RestaurantCheckout from "./pages/restaurant/Checkout";
import NotFound from "./pages/NotFound";
import { SysAdminProvider } from "./contexts/SysAdminContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <CustomerProvider>
          <StoreProvider>
            <ProductProvider>
              <AuthProvider>
                <SaleProvider>
                  <SysAdminProvider>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
                      <Routes>
                        <Route path="/" element={<LoginPin />} />
                        <Route path="/home" element={<SalesHome />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/receipt" element={<ReceiptPage />} />
                        <Route path="/stock" element={<StockPage />} />
                        <Route path="/fiado" element={<FiadoPage />} />
                        <Route path="/contas-receber" element={<ContasReceberPage />} />
                        <Route path="/reports" element={<ReportsPage />} />
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="/sysadmin/painel" element={<SuperAdminPanel />} />
                        
                        {/* Restaurant Module Routes */}
                        <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
                        <Route path="/restaurant/tables" element={<RestaurantTables />} />
                        <Route path="/restaurant/orders" element={<RestaurantOrders />} />
                        <Route path="/restaurant/checkout" element={<RestaurantCheckout />} />

                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </BrowserRouter>
                  </SysAdminProvider>
                </SaleProvider>
              </AuthProvider>
            </ProductProvider>
          </StoreProvider>
        </CustomerProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
