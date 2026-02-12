<template>
  <div class="px-2 md:px-8 w-full mx-auto pt-2 md:pt-6 text-base-content">
    
    <div class="flex justify-between items-center mb-3 px-1 md:px-0">
      <h1 class="text-xl md:text-2xl font-bold tracking-tight">Contents Draft</h1>
      <button class="btn btn-primary btn-sm">
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
              <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
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
            <template v-if="isLoading">
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
              <tr v-for="(item, index) in paginatedData" :key="item.id" class="hover:bg-base-200/50 transition-colors">
                <td class="text-center font-medium text-[11px] px-1 text-base-content/50 bg-base-100">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="px-2 py-2.5 bg-base-100">
                  <div class="flex flex-col max-w-[160px] sm:max-w-none">
                    <span class="text-[9px] text-base-content/40 font-mono">ID: {{ item.id }}</span>
                    <span class="text-[10px] font-extrabold text-primary uppercase leading-tight">{{ item.rubrikasi }}</span>
                    <span class="text-sm font-bold leading-snug truncate">
                      {{ item.judul }}
                    </span>
                    <span class="md:hidden text-[10px] text-base-content/50 font-medium mt-0.5">
                      {{ formatDateLabel(item.tanggal) }} • {{ item.jam }}
                    </span>
                  </div>
                </td>
                <td class="hidden md:table-cell px-4 bg-base-100">
                  <div class="flex flex-col text-sm">
                    <span class="font-semibold text-base-content/80">{{ formatDateLabel(item.tanggal) }}</span>
                    <span class="text-xs text-base-content/40">{{ item.jam }} WIB</span>
                  </div>
                </td>
                <td class="px-1 md:px-4 text-center md:text-left bg-base-100">
                  <div :data-tip="item.status" class="tooltip tooltip-primary md:tooltip-top">
                    <div 
                      :class="[
                        'badge text-[9px] md:text-xs font-bold border-none h-5 px-2 capitalize cursor-help w-16 md:w-24 flex justify-center', 
                        getStatusClass(item.status)
                      ]"
                    >
                      <span class="truncate">{{ item.status }}</span>
                    </div>
                  </div>
                </td>
                <td class="text-center px-1 md:px-4 bg-base-100">
                  <button class="btn btn-ghost btn-xs btn-square text-info">
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
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { Plus, Search, Filter, Pencil, SearchX, ArrowUpNarrowWide, ArrowDownWideNarrow } from 'lucide-vue-next';

// --- State ---
const isLoading = ref(true);
const showExtraFilter = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const sortOrder = ref('asc'); // 'asc' untuk terlama ke terbaru, 'desc' untuk terbaru ke terlama

const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
// --- Perubahan Logic Tahun Dinamis ---
const years = computed(() => {
  // Mengambil tahun unik dari dummyDrafts, diurutkan dari yang terbaru
  const extractedYears = dummyDrafts.value.map(item => item.tanggal.getFullYear());
  const uniqueYears = [...new Set(extractedYears)].sort((a, b) => b - a);
  
  // Memastikan tahun yang sedang dipilih tetap ada di list agar tidak error
  return uniqueYears;
});
const statusOptions = ['Draft', 'Ready to Edit', 'Published', 'Archived'];

const filterBulan = ref(new Date().getMonth()); 
const filterTahun = ref(new Date().getFullYear());
const filterStatus = ref('all');

// --- Dummy Data (Menggunakan objek Date agar filter berfungsi akurat) ---
const dummyDrafts = ref([
  { id: 'CNT-001', rubrikasi: 'News', judul: 'Update Harga Bahan Pokok Ramadhan', jam: '09:00', status: 'Draft', tanggal: new Date(2026, 1, 12) }, // Feb
  { id: 'CNT-002', rubrikasi: 'Lifestyle', judul: 'Tips Kesehatan Musim Hujan', jam: '14:00', status: 'Ready to Edit', tanggal: new Date(2026, 1, 13) },
  { id: 'CNT-003', rubrikasi: 'Tech', judul: 'Gadget Terkini 2026', jam: '10:00', status: 'Published', tanggal: new Date(2026, 2, 10) }, // Mar
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `CNT-0${i + 10}`, 
    rubrikasi: 'General', 
    judul: `Konten Dummy Ke-${i + 1}`, 
    jam: '12:00', 
    status: 'Draft', 
    tanggal: new Date(2026, 1, 20) // Feb 2026
  }))
]);

// --- Logic Perbaikan Filter & Sorting ---
const filteredData = computed(() => {
  // 1. Filter data terlebih dahulu
  let results = dummyDrafts.value.filter(item => {
    const d = item.tanggal;
    const matchesMonth = filterBulan.value === 'all' || d.getMonth() === filterBulan.value;
    const matchesYear = d.getFullYear() === filterTahun.value;
    const matchesStatus = filterStatus.value === 'all' || item.status === filterStatus.value;
    const query = searchQuery.value.toLowerCase();
    const matchesSearch = item.judul.toLowerCase().includes(query) || 
                          item.id.toLowerCase().includes(query) ||
                          item.rubrikasi.toLowerCase().includes(query);

    return matchesMonth && matchesYear && matchesStatus && matchesSearch;
  });

  // 2. Urutkan berdasarkan tanggal rilis (dan jam rilis)
  return results.sort((a, b) => {
    // Gabungkan tanggal dan jam untuk perbandingan yang presisi
    const dateTimeA = new Date(a.tanggal);
    const [hoursA, minsA] = a.jam.split(':');
    dateTimeA.setHours(hoursA, minsA);

    const dateTimeB = new Date(b.tanggal);
    const [hoursB, minsB] = b.jam.split(':');
    dateTimeB.setHours(hoursB, minsB);

    if (sortOrder.value === 'asc') {
      return dateTimeA - dateTimeB; // Terlama ke Terbaru
    } else {
      return dateTimeB - dateTimeA; // Terbaru ke Terlama
    }
  });
});

// Fungsi toggle sort
const toggleSort = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
};

// Reset ke halaman 1 jika filter berubah
watch([searchQuery, filterBulan, filterTahun, filterStatus], () => {
  currentPage.value = 1;
});

// --- Pagination ---
const totalPages = computed(() => Math.max(1, Math.ceil(filteredData.value.length / itemsPerPage)));
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredData.value.slice(start, start + itemsPerPage);
});

// --- Helpers ---
const formatDateLabel = (date) => {
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const getStatusClass = (status) => {
  const s = status.toLowerCase();
  // Menggunakan utility class daisyUI yang lebih adaptif
  if (s === 'draft') return 'bg-base-300 text-base-content';
  if (s === 'ready to edit') return 'badge-warning text-warning-content';
  if (s === 'published') return 'badge-info text-info-content';
  return 'badge-ghost';
};

onMounted(() => setTimeout(() => isLoading.value = false, 1000));
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: all 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-5px); }
</style>