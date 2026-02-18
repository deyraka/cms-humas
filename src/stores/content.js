import { defineStore } from 'pinia';

export const useContentStore = defineStore('content', {
  state: () => ({
    items: [], // Tempat menyimpan semua data konten
    isLoading: false,
    isLoaded: false
  }),

  actions: {
    // Fungsi untuk set data (dipanggil setelah fetch dari GAS)
    setItems(data) {
      this.items = data;
      this.isLoaded = true;
    },

    // Fungsi sakti untuk mencari satu konten berdasarkan ID
    getContentById(id) {
      return this.items.find(item => item.ID === id);
    }
  }
});