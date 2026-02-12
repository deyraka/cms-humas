import { defineStore } from 'pinia';

export const useMetadataStatusStore = defineStore('metadataStatus', {
    state: () => ({
        settings: [], // Menyimpan array dari sheet Metadata_Status
        isLoading: false,
        isLoaded: false,
    }),

    // src/stores/metadataStatus.js
    getters: {
    getConfig: (state) => (statusName) => {
        // Tambahkan pengecekan jika settings belum ada isinya
        if (!state.settings || state.settings.length === 0) {
        return { Badge_Class: 'badge-ghost', Bg_Class: 'bg-base-200', Dot_Class: 'bg-base-300' };
        }
        const s = String(statusName || '').toLowerCase();
        return state.settings.find(item => 
        String(item.Status_Name || '').toLowerCase() === s
        ) || { Badge_Class: 'badge-ghost', Bg_Class: 'bg-base-200', Dot_Class: 'bg-base-300' };
    },

    options: (state) => {
        // Pastikan mengembalikan array kosong jika settings belum di-load
        return Array.isArray(state.settings) ? state.settings.map(s => s.Status_Name) : [];
    }
    },

    actions: {
        async fetchSettings() {
        if (this.isLoaded) return;
        this.isLoading = true;

        // --- MODE PRODUKSI (GOOGLE APPS SCRIPT) ---
        if (typeof google !== 'undefined') {
            return new Promise((resolve) => {
            google.script.run
                .withSuccessHandler((data) => {
                this.settings = typeof data === 'string' ? JSON.parse(data) : data;
                this.isLoaded = true;
                this.isLoading = false;
                resolve(this.settings);
                })
                .withFailureHandler((err) => {
                console.error("GAS Error (Metadata Status):", err);
                this.isLoading = false;
                resolve([]);
                })
                .getStatusSettings(); // Memanggil fungsi GAS yang sudah kita buat
            });
        }

        // --- MODE DEVELOPMENT (LOKAL) ---
        await new Promise(resolve => setTimeout(resolve, 500));
        this.settings = [
            { Status_Name: 'Draft', Badge_Class: 'badge-ghost', Bg_Class: 'bg-base-300', Dot_Class: 'bg-base-content/30', Sort_Priority: 1 },
            { Status_Name: 'Published', Badge_Class: 'badge-info', Bg_Class: 'bg-info/10', Dot_Class: 'bg-info', Sort_Priority: 10 },
            { Status_Name: 'On Editing', Badge_Class: 'badge-warning', Bg_Class: 'bg-warning/10', Dot_Class: 'bg-warning', Sort_Priority: 5 }
        ];
        this.isLoaded = true;
        this.isLoading = false;
        }
    }
});