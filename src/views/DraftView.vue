<template>
  <div class="px-2 md:px-8 w-full mx-auto pt-2 md:pt-6 text-base-content">
    
    <div class="flex justify-between items-center mb-3 px-1 md:px-0">
      <h1 class="text-xl md:text-2xl font-bold tracking-tight">Contents Draft</h1>
      <button class="btn btn-primary btn-sm" @click="goToCreate">
        <Plus :size="18" />
        <span class="hidden md:inline ml-1">Tambah konten baru</span>
      </button>
    </div>

    <div class="flex flex-col gap-2 mb-4 px-1 md:px-0">
      <div class="flex gap-2">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" :size="16" />
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Cari ID, Rubrikasi, atau judul..." 
            class="input input-bordered input-sm md:input-md w-full pl-9 bg-base-100"
          />
        </div>
        <button 
          @click="showExtraFilter = !showExtraFilter" 
          :class="['btn btn-sm md:btn-md btn-square border-base-300', showExtraFilter ? 'btn-primary' : 'bg-base-100']"
        >
          <Filter :size="18" />
        </button>
      </div>

      <transition name="fade">
        <div v-if="showExtraFilter" class="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-base-200 rounded-xl border border-base-300 shadow-inner">
          <div v-for="label in ['Bulan', 'Tahun', 'Status']" :key="label" class="form-control w-full">
            <label class="label py-0 mb-1">
              <span class="label-text font-bold text-[11px] text-base-content/70">{{ label }}</span>
            </label>
            
            <select v-if="label === 'Bulan'" v-model="filterBulan" class="select select-bordered select-sm w-full bg-base-100">
              <option value="all">Semua Bulan</option> 
              <option v-for="(m, idx) in months" :key="idx" :value="idx">{{ m }}</option>
            </select>
            
            <select v-else-if="label === 'Tahun'" v-model="filterTahun" class="select select-bordered select-sm w-full bg-base-100">
              <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
            </select>
            
            <select v-else v-model="filterStatus" class="select select-bordered select-sm w-full bg-base-100">
              <option value="all">Semua Status</option>
              <template v-if="statusStore.options && statusStore.options.length > 0">
                <option v-for="s in statusStore.options" :key="s" :value="s">{{ s }}</option>
              </template>
            </select>
          </div>
        </div>
      </transition>
    </div>

    <div class="bg-base-100 rounded-lg md:rounded-xl shadow-sm border border-base-300 overflow-hidden -mx-8 md:mx-0">
      <div class="overflow-x-auto">
        <table class="table table-compact w-full border-separate border-spacing-0">
          <thead class="bg-neutral text-neutral-content">
            <tr>
              <th class="w-10 text-center px-1 border-b border-base-content/10">No</th>
              <th class="px-2 border-b border-base-content/10">Detil Konten</th>
              <th 
                class="hidden md:table-cell border-b border-base-content/10 cursor-pointer hover:bg-neutral-focus transition-colors"
                @click="toggleSort"
              >
                <div class="flex items-center gap-1">
                  Tanggal Rilis
                  <component :is="sortOrder === 'asc' ? ArrowUpNarrowWide : ArrowDownWideNarrow" :size="14" />
                </div>
              </th>
              <th class="px-2 border-b border-base-content/10">Status</th>
              <th class="text-center px-2 border-b border-base-content/10 font-bold">Aksi</th>
            </tr>
          </thead>
          
          <tbody class="divide-y divide-base-300">
            <template v-if="isPageLoading">
              <tr v-for="i in 5" :key="i">
                <td colspan="5" class="p-4 bg-base-100">
                  <div class="skeleton h-10 w-full rounded-md opacity-50"></div>
                </td>
              </tr>
            </template>

            <template v-else-if="filteredData.length === 0">
              <tr>
                <td colspan="5" class="py-12 text-center bg-base-200/50">
                  <div class="flex flex-col items-center justify-center text-base-content/40 gap-2">
                    <SearchX :size="48" stroke-width="1.5" />
                    <p class="text-sm font-semibold text-base-content/60">Tidak ada data ditemukan</p>
                    <p class="text-[10px]">Coba sesuaikan filter Anda</p>
                  </div>
                </td>
              </tr>
            </template>

            <template v-else>
              <tr v-for="(item, index) in paginatedData" :key="item.ID" class="hover:bg-base-200/50 transition-colors">
                <td class="text-center font-medium text-[11px] px-1 text-base-content/50 bg-base-100">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="px-2 py-2.5 bg-base-100">
                  <div class="flex flex-col max-w-[160px] sm:max-w-none">
                    <span class="text-[9px] text-base-content/40 font-mono">ID: {{ item.ID }}</span>
                    <span class="text-[10px] font-extrabold text-primary uppercase leading-tight">{{ item.Rubrikasi }}</span>
                    <span class="text-sm font-bold leading-snug truncate">
                      {{ item.Judul_Cover }}
                    </span>
                    <span class="md:hidden text-[10px] text-base-content/50 font-medium mt-0.5">
                      {{ formatDateLabel(item.Tanggal_Rilis) }} • {{ item.Jam_Rilis }}
                    </span>
                  </div>
                </td>
                <td class="hidden md:table-cell px-4 bg-base-100">
                  <div class="flex flex-col text-sm">
                    <span class="font-semibold text-base-content/80">{{ formatDateLabel(item.Tanggal_Rilis) }}</span>
                    <span class="text-xs text-base-content/40">{{ item.Jam_Rilis }} WIB</span>
                  </div>
                </td>
                <td class="px-1 md:px-4 text-center md:text-left bg-base-100">
                  <div :data-tip="item.Status" class="tooltip tooltip-primary md:tooltip-top">
                    <div 
                      :class="[
                        'badge text-[9px] md:text-xs font-bold border-none h-5 px-2 capitalize cursor-help w-16 md:w-24 flex justify-center', 
                        statusStore.getConfig(item.Status).Badge_Class
                      ]"
                    >
                      <span class="truncate">{{ item.Status }}</span>
                    </div>
                  </div>
                </td>
                <td class="text-center px-1 md:px-4 bg-base-100">
                  <button class="btn btn-ghost btn-xs btn-square text-info" @click="goToEdit(item)">
                    <Pencil :size="15" />
                  </button>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="filteredData.length > 0" class="flex justify-center mt-5 mb-8">
      <div class="join border border-base-300 bg-base-100 shadow-sm">
        <button class="join-item btn btn-xs md:btn-sm px-2" :disabled="currentPage === 1" @click="currentPage--">«</button>
        <button class="join-item btn btn-xs md:btn-sm no-animation bg-base-100 text-base-content pointer-events-none px-3 font-bold text-[11px]">
          {{ currentPage }} / {{ totalPages }}
        </button>
        <button class="join-item btn btn-xs md:btn-sm px-2" :disabled="currentPage === totalPages" @click="currentPage++">»</button>
      </div>
    </div>
  </div>
  <!-- SAFELIST UNTUK STATUS DARI DATABASE 
  Tailwind v4 akan memindai komentar ini dan menyertakan class-nya ke dalam build. -->
  <!-- <div class="hidden" aria-hidden="true">
  <div class="badge-ghost badge-error badge-primary badge-secondary badge-warning badge-accent badge-success badge-info badge-neutral"></div>
  <div class="bg-base-300 bg-error/10 bg-primary/10 bg-secondary/10 bg-warning/10 bg-accent/10 bg-success/10 bg-info/10 bg-neutral/10"></div>
  <div class="bg-warning/20 bg-warning/5 bg-warning/60 bg-error/20 bg-error/5 bg-error/60"></div>
  <div class="text-warning-content text-error-content border-warning/30 border-error/30"></div>
  </div> -->
  <!-- end of Safety -->
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { Plus, Search, Filter, Pencil, SearchX, ArrowUpNarrowWide, ArrowDownWideNarrow } from 'lucide-vue-next';
import { useAuthStore } from '@/stores'; // Impor store untuk integrasi auth
import { useMetadataStatusStore } from '@/stores/metadataStatus';
import { useContentStore } from '@/stores/content';
import { useRouter } from 'vue-router';

// --- State ---
const authStore = useAuthStore();
const statusStore = useMetadataStatusStore(); 
const contentStore = useContentStore(); // Store untuk data konten, bisa digunakan untuk fetch/update data
const isLoading = ref(true);
const showExtraFilter = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const sortOrder = ref('asc'); // Default terlama ke terbaru untuk list draft
const contentData = ref([]); // State utama untuk menampung data dari backend
const router = useRouter();

const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const statusOptions = ['Draft', 'On Editing', 'Published', 'Content Approved', 'Archived'];

// Filter State
const filterBulan = ref(new Date().getMonth()); 
const filterTahun = ref(new Date().getFullYear());
const filterStatus = ref('all');

// --- 1. Hybrid Load Data Mechanism (Standardized with Calendar.vue) ---
const loadData = async () => {
  isLoading.value = true;
  
  // --- MODE PRODUKSI (GOOGLE APPS SCRIPT) ---
  if (typeof google !== 'undefined') {
    google.script.run
      .withSuccessHandler((data) => {
        const rawData = typeof data === 'string' ? JSON.parse(data) : data;
        // Konversi string tanggal dari GAS menjadi objek Date agar filter berfungsi
        contentData.value = rawData.map(item => ({
          ...item,
          Tanggal_Rilis: new Date(item.Tanggal_Rilis)
        }));
        isLoading.value = false;
        contentStore.setItems(contentData);
      })
      .withFailureHandler((error) => {
        console.error("GAS Error (Draft):", error);
        isLoading.value = false;
      })
      .getContentPlanData(); // Memanggil fungsi yang sama dengan Calendar
    return;
  }

  // --- MODE DEVELOPMENT (LOKAL) ---
  try {
    const data = await fetchDummyData();
    contentData.value = data;
  } catch (error) {
    console.error("Local Fetch error:", error);
  } finally {
    isLoading.value = false;
  }
};

// --- 2. Mockup Backend dengan Skema Kolom Lengkap ---
const fetchDummyData = () => {
  return new Promise((resolve) => {
    const fullSchemaData = [
      { 
        ID: 'CONT-2026-001',
        Tanggal_Rilis: new Date(), 
        Jam_Rilis: '09:00',
        Pilar: 'Transformasi Digital',
        Rubrikasi: 'News',
        Jenis_Media: 'Instagram',
        Ide_Konten: 'Pemanfaatan AI di lingkup pemerintahan',
        Referensi: 'https://example.com',
        Judul_Cover: 'Implementasi Agentic AI 2026',
        Link_Hasil: 'https://kalteng.go.id',
        Pj_Editor: 'Budi Darmawan',
        Status: 'waiting approval',
        Kamedsos_Approval: true,
        Kahumas_Approval: true,
        Kabag_Approval: true,
        Madya_Approval: true,
        Kepala_Approval: true,
        Catatan: 'Segera diposting di semua platform',
        is_Rescheduled: false
      },
      // Loop untuk generate data tambahan
      ...Array.from({ length: 15 }, (_, i) => ({
        ID: `CONT-2026-0${i + 10}`,
        Tanggal_Rilis: new Date(2026, 1, 10 + i), 
        Jam_Rilis: '10:00',
        Pilar: 'Sosial',
        Rubrikasi: 'General',
        Jenis_Media: 'TikTok',
        Ide_Konten: `Ide konten dummy ke-${i+1}`,
        Referensi: '',
        Judul_Cover: `Judul Konten Dummy ${i+1}`,
        Link_Hasil: '',
        Pj_Editor: 'Staf Humas',
        Status: 'Draft',
        Kamedsos_Approval: false,
        Kahumas_Approval: false,
        Kabag_Approval: false,
        Madya_Approval: false,
        Kepala_Approval: false,
        Catatan: '',
        is_Rescheduled: i % 5 === 0
      }))
    ];
    setTimeout(() => resolve(fullSchemaData), 1000);
  });
};

// --- 3. Logic Filter & Sorting ---
// Menggunakan data asli dari contentData sesuai kolom database
const years = computed(() => {
  if (contentData.value.length === 0) return [new Date().getFullYear()];
  const extractedYears = contentData.value.map(item => item.Tanggal_Rilis.getFullYear());
  return [...new Set(extractedYears)].sort((a, b) => b - a);
});

const filteredData = computed(() => {
  let results = contentData.value.filter(item => {
    const d = item.Tanggal_Rilis;
    const matchesMonth = filterBulan.value === 'all' || d.getMonth() === filterBulan.value;
    const matchesYear = d.getFullYear() === filterTahun.value;
    const matchesStatus = filterStatus.value === 'all' || item.Status.toLowerCase() === filterStatus.value.toLowerCase();
    
    const query = searchQuery.value.toLowerCase();
    // PERBAIKAN UTAMA: Paksa semua field menjadi String sebelum toLowerCase()
    // Gunakan optional chaining atau fallback string kosong ''
    const matchesSearch = 
      String(item.Judul_Cover || '').toLowerCase().includes(query) || 
      String(item.ID || '').toLowerCase().includes(query) ||
      String(item.Rubrikasi || '').toLowerCase().includes(query) ||
      String(item.Pj_Editor || '').toLowerCase().includes(query);

    return matchesMonth && matchesYear && matchesStatus && matchesSearch;
  });

  return results.sort((a, b) => {
    const dateTimeA = new Date(a.Tanggal_Rilis);
    const [hA, mA] = a.Jam_Rilis.split(':');
    dateTimeA.setHours(hA, mA);

    const dateTimeB = new Date(b.Tanggal_Rilis);
    const [hB, mB] = b.Jam_Rilis.split(':');
    dateTimeB.setHours(hB, mB);

    return sortOrder.value === 'asc' ? dateTimeA - dateTimeB : dateTimeB - dateTimeA;
  });
});

const toggleSort = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
};

// --- 4. Pagination ---
const totalPages = computed(() => Math.max(1, Math.ceil(filteredData.value.length / itemsPerPage)));
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredData.value.slice(start, start + itemsPerPage);
});

// --- 5. Helpers ---
const formatDateLabel = (date) => {
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

const getStatusClass = (status) => {
  const s = status?.toLowerCase() || '';
  if (s === 'draft') return 'bg-base-300 text-base-content';
  if (s === 'on editing') return 'badge-warning text-warning-content';
  if (s === 'published') return 'badge-info text-info-content';
  if (s === 'content approved') return 'badge-success text-success-content';
  return 'badge-ghost';
};

// Reset ke halaman 1 jika filter berubah
watch([searchQuery, filterBulan, filterTahun, filterStatus], () => {
  currentPage.value = 1;
});

// Refresh data jika status login berubah
watch(() => authStore.isLoggedIn, () => {
  loadData();
});

// onMounted(() => {
//   loadData();
// });

// Update pada logic isLoading agar mempertimbangkan store metadata
const isPageLoading = computed(() => {
  return isLoading.value || statusStore.isLoading;
});

onMounted(async () => {
  // Pastikan metadata sudah terambil sebelum menjalankan loadData
  if (!statusStore.isLoaded) {
    await statusStore.fetchSettings();
  }
  await loadData();
});

const goToCreate = () => {
  router.push({ name: 'contentForm' }); 
  // URL: /contentForm
};

const goToEdit = (item) => {
  router.push({ 
    name: 'contentForm', 
    query: { 
      id: item.ID,
      // Kita bisa selipkan data lain di query, tapi disarankan 
      // ambil dari store berdasarkan ID saat di ContentForm
    } 
  });
  // URL: /contentForm?id=ABCD.0226
};
</script>