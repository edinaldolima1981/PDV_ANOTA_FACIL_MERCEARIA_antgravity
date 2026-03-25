const API_URL = '/api';

// Em produção, isso viria de uma configuração de subdomínio ou login
const getStoreId = () => localStorage.getItem('store_id') || 'emporio-organico';

export const api = {
    get: async (endpoint: string) => {
        const res = await fetch(`${API_URL}${endpoint}`, {
            headers: { 'X-Store-ID': getStoreId() }
        });
        if (!res.ok) throw new Error(`Error fetching ${endpoint}`);
        return res.json();
    },
    post: async (endpoint: string, data: any) => {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-Store-ID': getStoreId()
            },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(`Error posting ${endpoint}`);
        return res.json();
    },
    delete: async (endpoint: string) => {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE',
            headers: { 'X-Store-ID': getStoreId() }
        });
        if (!res.ok) throw new Error(`Error deleting ${endpoint}`);
        return res.json();
    }
};
