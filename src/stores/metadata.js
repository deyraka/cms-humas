import { defineStore } from 'pinia';

export const useMetadataStore = defineStore('metadata', {
  state: () => ({
    rubrikasi: [],
    pilar: [],
    jenisMedia: [],
    isLoading: false,
    isLoaded: false
  }),

  getters: {
    // Mengembalikan list nama saja untuk keperluan dropdown <select>
    rubrikOptions: (state) => state.rubrikasi.map(r => r.Nama_Rubrik),
    pilarOptions: (state) => state.pilar.map(p => p.Nama_Pilar),
    mediaOptions: (state) => state.jenisMedia.map(m => m.Jenis_Media)
  },

  actions: {
    async fetchAllMetadata() {
      if (this.isLoaded) return;
      this.isLoading = true;

      return new Promise((resolve, reject) => {
        if (typeof google !== 'undefined') {
          google.script.run
            .withSuccessHandler((data) => {
              this.rubrikasi = data.rubrikasi || [];
              this.pilar = data.pilar || [];
              this.jenisMedia = data.jenisMedia || [];
              this.isLoaded = true;
              this.isLoading = false;
              resolve(data);
            })
            .withFailureHandler((err) => {
              this.isLoading = false;
              reject(err);
            })
            .getAllMetadata();
        } else {
          // Simulasi Local Development
          setTimeout(() => {
            this.rubrikasi = [{ Nama_Rubrik: 'Makna Data' }, { Nama_Rubrik: 'Tahukah Kamu?' }];
            this.pilar = [{ Nama_Pilar: 'Edukasi' }, { Nama_Pilar: 'Branding' }];
            this.jenisMedia = [{ Jenis_Media: 'reels' }, { Jenis_Media: 'carousel' }];
            this.isLoaded = true;
            this.isLoading = false;
            resolve();
          }, 1000);
        }
      });
    }
  }
});