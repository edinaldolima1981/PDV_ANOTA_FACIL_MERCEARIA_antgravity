import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, LogOut, Store, Plus, Search, Edit2, Trash2, X, Activity, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSysAdmin, SystemStore } from "@/contexts/SysAdminContext";

const SuperAdminPanel = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logout, stores, addStore, updateStore, deleteStore } = useSysAdmin();
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStore, setEditingStore] = useState<SystemStore | null>(null);

    // Form state
    const [name, setName] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [plan, setPlan] = useState<"Básico" | "Pro" | "Ilimitado">("Básico");
    const [status, setStatus] = useState<"Ativo" | "Inativo" | "Bloqueado">("Ativo");
    const [ownerName, setOwnerName] = useState("");
    const [ownerPhone, setOwnerPhone] = useState("");
    const [dueDate, setDueDate] = useState("");

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const openNewStoreModal = () => {
        setEditingStore(null);
        setName("");
        setCnpj("");
        setPlan("Básico");
        setStatus("Ativo");
        setOwnerName("");
        setOwnerPhone("");
        setDueDate("");
        setIsModalOpen(true);
    };

    const openEditModal = (store: SystemStore) => {
        setEditingStore(store);
        setName(store.name);
        setCnpj(store.cnpj);
        setPlan(store.plan);
        setStatus(store.status);
        setOwnerName(store.ownerName);
        setOwnerPhone(store.ownerPhone || "");
        setDueDate(store.dueDate || "");
        setIsModalOpen(true);
    };

    const handleSaveStore = () => {
        if (!name.trim() || !cnpj.trim()) return;

        if (editingStore) {
            updateStore(editingStore.id, { name, cnpj, plan, status, ownerName, ownerPhone, dueDate });
        } else {
            addStore({ name, cnpj, plan, status, ownerName, ownerPhone, dueDate });
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Tem certeza que deseja remover este estabelecimento do sistema?")) {
            deleteStore(id);
        }
    };

    const filteredStores = stores.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.cnpj.includes(searchTerm)
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Ativo": return "bg-success/20 text-success border-success/30";
            case "Inativo": return "bg-muted text-muted-foreground border-border";
            case "Bloqueado": return "bg-destructive/20 text-destructive border-destructive/30";
            default: return "bg-secondary text-foreground border-border";
        }
    };

    const handleSendWhatsApp = (store: SystemStore) => {
        if (!store.ownerPhone) {
            alert("Proprietário não possui telefone cadastrado.");
            return;
        }
        const phone = store.ownerPhone.replace(/\D/g, "");
        if (phone.length < 10) {
            alert("Telefone inválido.");
            return;
        }
        const message = `Olá ${store.ownerName}, notamos constar um atraso na fatura do seu plano ${store.plan} no sistema PDV Anota Fácil. Por favor, regularize para evitar o bloqueio do sistema.`;
        const waLink = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`;
        window.open(waLink, "_blank");
    }

    if (!isAuthenticated) return null; // Prevent flash before redirect

    return (
        <div className="min-h-screen bg-background flex flex-col font-body">
            {/* Navbar */}
            <header className="bg-card border-b border-border sticky top-0 z-20 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                        <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="font-display font-bold text-foreground">Super Administrador</h1>
                        <p className="text-xs text-muted-foreground">Gestão da Plataforma</p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20 transition-colors"
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair do Painel
                </Button>
            </header>

            <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-muted-foreground font-medium mb-1">Total de Lojas</p>
                                <p className="font-display text-3xl font-bold">{stores.length}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Store className="w-5 h-5 text-primary" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-muted-foreground font-medium mb-1">Lojas Ativas</p>
                                <p className="font-display text-3xl font-bold text-success">
                                    {stores.filter(s => s.status === "Ativo").length}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                                <Activity className="w-5 h-5 text-success" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex items-center justify-center">
                        <Button onClick={openNewStoreModal} className="w-full h-full rounded-xl py-4 shadow-md gap-2 font-medium text-base">
                            <Plus className="w-5 h-5" />
                            Cadastrar Nova Loja
                        </Button>
                    </div>
                </div>

                {/* Store List */}
                <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                    <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h2 className="font-display font-semibold text-lg">Estabelecimentos Cadastrados</h2>
                        <div className="relative w-full sm:w-72">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Buscar por nome ou CNPJ..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-muted/50 text-muted-foreground text-sm font-medium">
                                    <th className="py-4 px-5 font-medium">Loja</th>
                                    <th className="py-4 px-5 font-medium">CNPJ / Tel</th>
                                    <th className="py-4 px-5 font-medium">Proprietário</th>
                                    <th className="py-4 px-5 font-medium">Venc. / Plano</th>
                                    <th className="py-4 px-5 font-medium">Status</th>
                                    <th className="py-4 px-5 font-medium text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStores.length > 0 ? (
                                    filteredStores.map((store) => (
                                        <tr key={store.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                                            <td className="py-4 px-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                                                        <Store className="w-5 h-5 text-muted-foreground" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-foreground">{store.name}</p>
                                                        <p className="text-xs text-muted-foreground">ID: {store.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-5">
                                                <p className="text-sm text-foreground">{store.cnpj}</p>
                                                <p className="text-xs text-muted-foreground">{store.ownerPhone || "-"}</p>
                                            </td>
                                            <td className="py-4 px-5 text-sm">{store.ownerName || "-"}</td>
                                            <td className="py-4 px-5">
                                                <p className="text-sm text-foreground mb-1">{store.dueDate ? new Date(store.dueDate).toLocaleDateString('pt-BR') : "-"}</p>
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium bg-secondary text-foreground border border-border">
                                                    {store.plan}
                                                </span>
                                            </td>
                                            <td className="py-4 px-5">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(store.status)}`}>
                                                    {store.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-5">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        title="Cobrar pelo WhatsApp"
                                                        className="h-8 w-8 rounded-lg text-success hover:bg-success/10 hover:border-success/30 transition-colors"
                                                        onClick={() => handleSendWhatsApp(store)}
                                                    >
                                                        <MessageCircle className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
                                                        onClick={() => openEditModal(store)}
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10 hover:border-destructive/30 transition-colors"
                                                        onClick={() => handleDelete(store.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-muted-foreground">
                                            Nenhum estabelecimento encontrado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Cadastro / Edição Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm animate-fade-in" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-card w-full max-w-md rounded-3xl p-6 md:p-8 shadow-elevated border border-border animate-fade-up" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-display text-xl font-bold">
                                {editingStore ? "Editar Estabelecimento" : "Novo Estabelecimento"}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
                                <X className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="text-sm font-medium text-foreground mb-1 block">Nome da Loja <span className="text-destructive">*</span></label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                                    placeholder="Ex: Mercadinho São José"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-foreground mb-1 block">CNPJ <span className="text-destructive">*</span></label>
                                <input
                                    type="text"
                                    value={cnpj}
                                    onChange={e => setCnpj(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                                    placeholder="00.000.000/0000-00"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-foreground mb-1 block">Nome do Proprietário</label>
                                <input
                                    type="text"
                                    value={ownerName}
                                    onChange={e => setOwnerName(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                                    placeholder="Nome do cliente/dono"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-1 block">Telefone (WhatsApp)</label>
                                    <input
                                        type="text"
                                        value={ownerPhone}
                                        onChange={e => setOwnerPhone(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                                        placeholder="(11) 99999-9999"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-1 block">Data de Vencimento</label>
                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={e => setDueDate(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-1 block">Plano</label>
                                    <select
                                        value={plan}
                                        onChange={e => setPlan(e.target.value as any)}
                                        className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all appearance-none"
                                    >
                                        <option value="Básico">Básico</option>
                                        <option value="Pro">Pro</option>
                                        <option value="Ilimitado">Ilimitado</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-1 block">Status</label>
                                    <select
                                        value={status}
                                        onChange={e => setStatus(e.target.value as any)}
                                        className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all appearance-none"
                                    >
                                        <option value="Ativo">Ativo</option>
                                        <option value="Inativo">Inativo</option>
                                        <option value="Bloqueado">Bloqueado</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1 rounded-xl py-6" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                            <Button className="flex-1 rounded-xl py-6" onClick={handleSaveStore} disabled={!name.trim() || !cnpj.trim()}>
                                {editingStore ? "Salvar Alterações" : "Cadastrar Loja"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default SuperAdminPanel;
