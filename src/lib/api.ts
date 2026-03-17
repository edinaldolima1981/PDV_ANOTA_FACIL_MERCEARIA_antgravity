const API_URL = '/api'; // Configured via Vite proxy or direct on VPS

export const api = {
    get: async (endpoint: string) => {
        const res = await fetch(`${API_URL}${endpoint}`);
        if (!res.ok) throw new Error(`Error fetching ${endpoint}`);
        return res.json();
    },
    post: async (endpoint: string, data: any) => {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(`Error posting ${endpoint}`);
        return res.json();
    },
    delete: async (endpoint: string) => {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error(`Error deleting ${endpoint}`);
        return res.json();
    }
};
