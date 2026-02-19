<template>
  <div id="app" class="w-full max-w-4xl mx-auto p-2 sm:p-4 pb-20">
    
    <div class="flex justify-between items-center mb-4 sm:mb-6 px-2">
      <div class="flex items-center gap-2 sm:gap-3">
        <div class="p-2 sm:p-3 bg-primary/10 rounded-xl text-primary">
          <PenTool class="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div>
          <h1 class="text-lg sm:text-2xl font-bold text-base-content flex items-center gap-2">
            {{ isEditMode ? 'Edit' : 'Input' }} Konten
            <span class="badge badge-primary badge-outline text-[10px] sm:text-xs gap-1 px-1 h-5">
              <Sparkles class="w-2 h-2 sm:w-3 sm:h-3" /> AI powered
            </span>
          </h1>
          <p class="text-[10px] sm:text-sm text-base-content/60">Lengkapi detail konten produksi di bawah ini.</p>
        </div>
      </div>
    </div>

    <div class="card bg-base-100 shadow-xl border border-base-300 -mx-8">
      <div class="card-body p-4 sm:p-8">
        <form @submit.prevent="onSaveClick">
          
          <div class="grid grid-cols-12 gap-3 sm:gap-6 mb-4 sm:mb-6">
            <div class="form-control col-span-12 md:col-span-4">
              <label class="label pt-0 pb-1">
                <span class="label-text text-[10px] uppercase font-bold text-base-content/50">Content ID</span>
              </label>
              <div class="flex items-center gap-2 px-3 py-2 sm:py-3 bg-base-200 rounded-lg text-base-content/60 cursor-not-allowed border border-transparent">
                <Hash class="w-3 h-3 sm:w-4 sm:h-4" />
                <span class="text-xs sm:text-sm font-mono">{{ isEditMode ? formData.ID : 'NEW' }}</span>
              </div>
            </div>

            <div class="form-control col-span-8 md:col-span-4">
              <label class="label pt-0 pb-1">
                <span class="label-text text-[10px] uppercase font-bold text-base-content/50">Tanggal</span>
              </label>
              <input type="date" v-model="formData.Tanggal_Rilis" class="input input-bordered input-sm sm:input-md w-full focus:input-primary text-xs rounded-lg" required />
            </div>

            <div class="form-control col-span-4 md:col-span-4">
              <label class="label pt-0 pb-1">
                <span class="label-text text-[10px] uppercase font-bold text-base-content/50">Jam</span>
              </label>
              <input type="time" v-model="formData.Jam_Rilis" class="input input-bordered input-sm sm:input-md w-full focus:input-primary text-xs px-1 rounded-lg" required />
            </div>
          </div>

          <div class="divider text-[10px] text-base-content/40 my-2 uppercase tracking-widest">Klasifikasi</div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 mb-4 sm:mb-6">
            <div class="form-control w-full">
              <label class="label pt-0 pb-1">
                <span class="label-text text-[10px] uppercase font-bold text-base-content/50">Pilar</span>
              </label>
              <select v-model="formData.Pilar" class="select select-bordered select-sm sm:select-md w-full focus:select-primary font-normal text-xs rounded-lg" required>
                <option value="">Pilih Pilar</option>
                <option v-for="opt in metaStore.pilarOptions" :key="opt" :value="opt">{{ opt }}</option>
              </select>
            </div>

            <div class="form-control w-full">
              <label class="label pt-0 pb-1">
                <span class="label-text text-[10px] uppercase font-bold text-base-content/50">Rubrikasi</span>
              </label>
              <select v-model="formData.Rubrikasi" class="select select-bordered select-sm sm:select-md w-full focus:select-primary font-normal text-xs rounded-lg" required>
                <option value="">Pilih Rubrik</option>
                <option v-for="opt in metaStore.rubrikOptions" :key="opt" :value="opt">{{ opt }}</option>
              </select>
            </div>

            <div class="form-control w-full">
              <label class="label pt-0 pb-1">
                <span class="label-text text-[10px] uppercase font-bold text-base-content/50">Media</span>
              </label>
              <select v-model="formData.Jenis_Media" class="select select-bordered select-sm sm:select-md w-full focus:select-primary font-normal text-xs rounded-lg" required>
                <option value="">Pilih Media</option>
                <option v-for="opt in metaStore.mediaOptions" :key="opt" :value="opt">{{ opt }}</option>
              </select>
            </div>
          </div>

          <div class="divider text-[10px] text-base-content/40 my-2 uppercase tracking-widest">Detail Konten</div>

          <div class="flex justify-end mb-4 -mt-2">
            <a href="https://docs.google.com/spreadsheets/d/1ADoz4kvtddh3dyD_p_3NCjijx6TReJeR/edit?usp=sharing" target="_blank" class="btn btn-xs btn-ghost text-primary gap-1 font-normal">
              <FileSpreadsheet class="w-3 h-3" />
              <span class="text-[10px]">Template Storyboard</span>
            </a>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div class="relative w-full">
              <div class="flex justify-between items-center absolute right-2 top-2 z-20">
                <button type="button" @click="generateAI('ide')" :disabled="isGenerating || !formData.Pilar" class="btn btn-[10px] h-7 min-h-7 btn-outline btn-accent gap-1 px-2">
                  <Sparkles v-if="!isGenerating" class="w-2 h-2" />
                  <span v-else class="loading loading-spinner loading-[10px]"></span>
                  AI Bantu
                </button>
              </div>
              <textarea id="ide" v-model="formData.Ide_Konten" placeholder=" " class="textarea textarea-bordered w-full peer focus:textarea-primary min-h-[100px] pt-8 text-xs sm:text-sm leading-relaxed rounded-lg" required></textarea>
              <label for="ide" class="floating-label absolute text-base-content/60 duration-300 transform top-4 left-4 z-10 origin-[0] peer-placeholder-shown:top-4 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:scale-75 peer-focus:text-primary pointer-events-none flex items-center gap-1 text-xs">
                <Lightbulb class="w-3 h-3" /> Ide Konten
              </label>
            </div>

            <div class="relative w-full">
              <input type="text" id="judul" v-model="formData.Judul_Cover" placeholder=" " class="input input-bordered w-full peer focus:input-primary h-12 sm:h-14 pr-12 text-xs sm:text-sm rounded-lg" required />
              <label for="judul" class="floating-label absolute text-base-content/60 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-primary pointer-events-none text-xs">
                <Type class="w-3 h-3 inline mr-1" /> Judul Cover
              </label>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="relative w-full">
                <input type="url" id="ref" v-model="formData.Referensi" placeholder=" " class="input input-bordered w-full peer focus:input-primary h-12 sm:h-14 text-xs rounded-lg" />
                <label for="ref" class="floating-label absolute text-base-content/60 duration-300 transform top-4 left-4 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-primary pointer-events-none text-xs">
                  <Link2 class="w-3 h-3 inline mr-1" /> Link Ref
                </label>
              </div>
              <div class="relative w-full">
                <input type="url" id="hasil" v-model="formData.Link_Hasil" placeholder=" " class="input input-bordered w-full peer focus:input-primary h-12 sm:h-14 text-xs rounded-lg" />
                <label for="hasil" class="floating-label absolute text-base-content/60 duration-300 transform top-4 left-4 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-primary pointer-events-none text-xs">
                  <ExternalLink class="w-3 h-3 inline mr-1" /> Link Hasil
                </label>
              </div>
            </div>
          </div>

          <div class="bg-base-200/50 rounded-xl p-3 sm:p-5 border border-base-200">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <textarea v-model="formData.Catatan_Production" class="textarea textarea-bordered w-full focus:textarea-warning min-h-[60px] text-xs leading-relaxed rounded-lg" placeholder="Catatan produksi (talent, lokasi, dll)..."></textarea>
              </div>

              <div class="grid grid-cols-2 gap-3 md:col-span-1">
                <div class="form-control">
                  <label class="label cursor-pointer flex-col items-start gap-1 border border-base-300 rounded-lg p-2 bg-base-100 h-full">
                    <div class="flex items-center gap-2">
                      <input type="checkbox" v-model="formData.Kamedsos_Approval" @change="handleApprovalChange" class="checkbox checkbox-success checkbox-xs" />
                      <span class="label-text font-bold text-[10px] sm:text-xs text-success">Approved</span>
                    </div>
                    <span class="label-text-alt text-[8px] opacity-50 uppercase">Kamedsos</span>
                  </label>
                </div>

                <div class="form-control">
                  <label class="label cursor-pointer flex-col items-start gap-1 border border-error/30 rounded-lg p-2 bg-base-100 h-full">
                    <div class="flex items-center gap-2">
                      <input type="checkbox" v-model="formData.is_Rescheduled" class="checkbox checkbox-error checkbox-xs" />
                      <span class="label-text font-bold text-[10px] sm:text-xs text-error">Reschedule</span>
                    </div>
                    <span class="label-text-alt text-[8px] opacity-50 uppercase">Status Jadwal</span>
                  </label>
                </div>
              </div>

              <div class="form-control">
                <label class="label pt-0 pb-1">
                  <span class="label-text text-[10px] uppercase font-bold text-base-content/50">Status Konten</span>
                </label>
                <select v-model="formData.Status" class="select select-bordered select-sm w-full text-xs font-normal rounded-lg">
                  <option v-for="opt in statusStore.options" :key="opt" :value="opt">{{ opt }}</option>
                </select>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end mt-6 sm:mt-8 gap-2">
            <button type="button" class="btn btn-sm sm:btn-md btn-ghost text-xs" @click="router.back()">Batal</button>
            <button type="submit" class="btn btn-sm sm:btn-md btn-primary px-6 sm:px-8 text-white shadow-lg shadow-primary/30 text-xs" :disabled="isSaving">
              <Save v-if="!isSaving" class="w-3 h-3 sm:w-4 sm:h-4" />
              <span v-else class="loading loading-spinner loading-xs"></span>
              Simpan Data
            </button>
          </div>
        </form>
      </div>
    </div>

    <dialog id="confirm_modal" class="modal modal-bottom sm:modal-middle">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Konfirmasi Simpan</h3>
        <p class="py-4 text-sm opacity-70">Apakah data rencana konten ini sudah benar dan siap diproses?</p>
        <div class="modal-action">
          <form method="dialog"><button class="btn btn-ghost btn-sm sm:btn-md text-xs">Periksa Lagi</button></form>
          <button @click="doSave" class="btn btn-primary btn-sm sm:btn-md px-6 text-xs">Ya, Simpan</button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  PenTool, Sparkles, Hash, Lightbulb, Type, Link2, 
  ExternalLink, FileSpreadsheet, Save, FileText 
} from 'lucide-vue-next'

// Import Stores
import { useMetadataStore } from '@/stores/metadata'
import { useMetadataStatusStore } from '@/stores/metadataStatus'
import { useContentStore } from '@/stores/content'

const router = useRouter()
const route = useRoute()
const metaStore = useMetadataStore()
const statusStore = useMetadataStatusStore()
const contentStore = useContentStore()

const isSaving = ref(false)
const isGenerating = ref(false)
const isEditMode = computed(() => !!route.query.id)

const formData = ref({
  ID: '',
  Tanggal_Rilis: '',
  Jam_Rilis: '17:55',
  Pilar: '',
  Rubrikasi: '',
  Jenis_Media: '',
  Ide_Konten: '',
  Referensi: '',
  Judul_Cover: '',
  Link_Hasil: '',
  Pj_Editor: '',
  Status: 'Draft',
  Kamedsos_Approval: false,
  Catatan_Production: '',
  is_Rescheduled: false
})

onMounted(async () => {
  // 1. Pastikan metadata (Rubrikasi, Pilar, Media) sudah siap
  if (!metaStore.isLoaded) {
    try {
      await metaStore.fetchAllMetadata();
    } catch (e) {
      // MOCKUP METADATA: Jika gagal fetch (dev mode), isi dengan data dummy agar UI tidak kosong
      metaStore.pilar = ['Edukasi', 'Hiburan', 'Promosi', 'Inspirasi'];
      metaStore.rubrikasi = ['Tips & Trik', 'Behind The Scene', 'Testimoni', 'Quiz'];
      metaStore.jenisMedia = ['Reels / TikTok', 'Single Image Feed', 'Carousel', 'Story'];
      metaStore.isLoaded = true;
    }
  }

  // 2. Logic Edit vs Create
  if (isEditMode.value) {
    const targetId = route.query.id;
    const existing = contentStore.getContentById(targetId);

    if (existing) {
      formData.value = { ...existing };
      // Format date for HTML input (YYYY-MM-DD)
      if (formData.value.Tanggal_Rilis) {
        formData.value.Tanggal_Rilis = new Date(formData.value.Tanggal_Rilis).toISOString().split('T')[0];
      }
    } else {
      // MOCKUP EDIT DATA: Jika ID tidak ditemukan di store (saat dev), isi data dummy untuk testing UI
      if (typeof google === 'undefined') {
        console.warn("Dev Mode: ID tidak ditemukan, memuat data mockup edit...");
        formData.value = {
          ID: targetId,
          Judul_Cover: "Mockup Judul dari Development",
          Ide_Konten: "Ini adalah konten contoh untuk keperluan testing UI development.",
          Tanggal_Rilis: new Date().toISOString().split('T')[0],
          Jam_Rilis: '10:00',
          Pilar: 'Edukasi',
          Rubrikasi: 'Tips & Trik',
          Jenis_Media: 'Carousel',
          Status: 'Draft'
        };
      } else {
        alert("Data tidak ditemukan.");
        router.push('/draft');
      }
    }
  } else if (route.query.date) {
    formData.value.Tanggal_Rilis = route.query.date;
  }
});

// --- PERBAIKAN LOGIC SIMPAN (DEV VS PROD) ---
const doSave = async () => {
  document.getElementById('confirm_modal').close();
  isSaving.value = true;
  
  try {
    if (typeof google !== 'undefined' && google.script?.run) {
      // --- MODE PRODUCTION (GAS) ---
      await new Promise((resolve, reject) => {
        google.script.run
          .withSuccessHandler(res => resolve(res))
          .withFailureHandler(err => reject(err))
          .saveContentPlan(formData.value);
      });
      alert("Data berhasil disimpan ke Spreadsheet!");
    } else {
      // --- MODE DEVELOPMENT (MOCKUP) ---
      console.log("SIMULASI SIMPAN (DEV MODE):", formData.value);
      
      // Simulasi loading 2 detik
      await new Promise(r => setTimeout(r, 2000));
      
      alert("Dev Mode: Simulasi berhasil! Data dicetak di console.");
    }
    router.push('/draft');
  } catch (e) {
    alert("Gagal menyimpan: " + e.message);
  } finally {
    isSaving.value = false;
  }
};

const handleApprovalChange = () => {
  if (formData.value.Kamedsos_Approval) {
    formData.value.Status = 'Prepare to Production'
  } else if (!isEditMode.value) {
    formData.value.Status = 'Draft'
  }
}

const onSaveClick = () => {
  document.getElementById('confirm_modal').showModal()
}

const generateAI = async (type) => {
  isGenerating.value = true
  // Mock AI behavior
  await new Promise(r => setTimeout(r, 1500))
  if (type === 'ide') formData.value.Ide_Konten = "Contoh ide konten AI berdasarkan pilar " + formData.value.Pilar
  isGenerating.value = false
}
</script>

<style scoped>
.floating-label {
  pointer-events: none;
  transition: all 0.2s ease-out;
}
textarea:focus ~ .floating-label,
textarea:not(:placeholder-shown) ~ .floating-label {
  transform: translateY(-1.5rem) scale(0.85);
  color: hsl(var(--p));
}
</style>