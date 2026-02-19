<template>
    <div class="w-full max-w-2xl mx-auto p-4 pb-20">
        <div class="flex items-center gap-3 mb-6 px-2">
            <div class="p-3 bg-warning/10 rounded-xl text-warning">
                <UserRoundPen class="w-6 h-6" />
            </div>
            <div>
                <h1 class="text-2xl font-bold text-base-content">Update Status</h1>
                <p class="text-sm text-base-content/60">Perbarui progress dan Nama Editor.</p>
            </div>
        </div>

        <div class="card bg-base-100 shadow-xl border border-base-300 -mx-8">
            <div class="card-body p-6 sm:p-8">
                <form @submit.prevent="handleSave">
                
                    <div class="grid grid-cols-1 gap-4 mb-6">
                        <div class="form-control">
                            <label class="label pt-0 pb-1">
                                <span class="label-text text-[10px] uppercase font-bold text-base-content/50">Content ID & Judul</span>
                            </label>
                            <div class="p-3 bg-base-200 rounded-lg border border-base-300">
                                <div class="text-xs font-mono text-primary font-bold">{{ formData.ID }}</div>
                                <div class="text-sm font-semibold">{{ formData.Judul_Cover }}</div>
                            </div>
                        </div>

                        <div class="relative w-full mt-2">
                            <input 
                                type="text" id="pj" v-model="formData.Pj_Editor" placeholder=" " 
                                class="input input-bordered w-full peer focus:input-primary h-12 text-sm rounded-lg" 
                                required 
                            />
                            <label for="pj" class="floating-label absolute text-base-content/60 duration-300 transform -translate-y-3 scale-75 top-3.5 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-primary pointer-events-none text-xs flex items-center gap-1">
                                <User :size="14" /> Nama PJ Editor
                            </label>
                        </div>

                        <div class="form-control w-full">
                            <label class="label pt-0 pb-1">
                                <span class="label-text text-[10px] uppercase font-bold text-base-content/50">Status Konten</span>
                            </label>
                            <select v-model="formData.Status" class="select select-bordered w-full focus:select-warning text-sm font-normal rounded-lg" required>
                                <option v-for="opt in statusStore.options" :key="opt" :value="opt">{{ opt }}</option>
                            </select>
                        </div>
                    </div>

                    <div class="flex items-center justify-end mt-8 gap-3">
                        <button type="button" class="btn btn-ghost btn-sm sm:btn-md text-xs sm:text-sm" @click="router.back()">
                            Batal
                        </button>
                        <button type="submit" class="btn btn-primary btn-sm sm:btn-md px-6 sm:px-10 text-white shadow-lg shadow-primary/30 text-xs sm:text-sm" :disabled="isSaving">
                            <Save v-if="!isSaving" :size="16" />
                            <span v-else class="loading loading-spinner loading-xs"></span>
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { UserRoundPen, User, Save } from 'lucide-vue-next'
import { useMetadataStatusStore } from '@/stores/metadataStatus'
import { useContentStore } from '@/stores/content'

const router = useRouter()
const route = useRoute()
const statusStore = useMetadataStatusStore()
const contentStore = useContentStore()

const isSaving = ref(false)
const formData = ref({
  ID: '',
  Judul_Cover: '',
  Pj_Editor: '',
  Status: ''
})

onMounted(() => {
  const targetId = route.query.id
  const existing = contentStore.getContentById(targetId)
  
  if (existing) {
    // Ambil hanya data yang diperlukan untuk form ini
    formData.value = {
      ID: existing.ID,
      Judul_Cover: existing.Judul_Cover,
      Pj_Editor: existing.Pj_Editor || '',
      Status: existing.Status
    }
  } else {
    // Fallback Dev Mode / Data not found
    if (typeof google === 'undefined') {
      formData.value = { ID: targetId, Judul_Cover: 'Judul Mockup', Status: 'Draft', Pj_Editor: '' }
    } else {
      router.push('/draft')
    }
  }
})

const handleSave = async () => {
  isSaving.value = true
  try {
    if (typeof google !== 'undefined' && google.script?.run) {
      // MODE PRODUCTION (GAS) - Memanggil fungsi yang sama di backend
      await new Promise((resolve, reject) => {
        google.script.run
          .withSuccessHandler(res => resolve(res))
          .withFailureHandler(err => reject(err))
          .saveContentPlan(formData.value); // Pastikan fungsi di GS mendukung partial update atau kirim objek lengkap
      });
    } else {
      // MODE DEVELOPMENT
      console.log("SIMULASI UPDATE STATUS:", formData.value)
      await new Promise(r => setTimeout(r, 2000))
    }
    router.back() // Kembali ke Draft.vue
  } catch (e) {
    alert("Gagal memperbarui status: " + e.message)
  } finally {
    isSaving.value = false
  }
}
</script>