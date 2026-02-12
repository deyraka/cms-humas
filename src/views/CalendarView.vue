<template>
  <div class="px-1 md:px-2 w-full mx-auto pt-1 md:pt-1 text-base-content">
    
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
      <div class="w-full md:w-auto text-center md:text-left">
        <h1 class="text-2xl font-bold tracking-tight">Content Calendar</h1>
      </div>

      <div class="flex flex-row justify-center items-center gap-4 w-full md:w-auto">
        <div class="join bg-base-100 border border-base-300 shadow-sm">
          <button 
            @click="viewMode = 'monthly'" 
            :disabled="isMobile"
            :class="['join-item btn btn-sm border-none', viewMode === 'monthly' ? 'btn-primary' : 'btn-ghost']"
          >Monthly</button>
          <button 
            @click="viewMode = 'weekly'" 
            :class="['join-item btn btn-sm border-none', viewMode === 'weekly' ? 'btn-primary' : 'btn-ghost']"
          >Weekly</button>
        </div>
        <div class="form-control">
          <label class="label cursor-pointer gap-3 bg-base-100 px-4 py-2 rounded-lg border border-base-300 shadow-sm">
            <span class="label-text font-bold text-[10px] sm:text-xs whitespace-nowrap">Spill Detail</span> 
            <input type="checkbox" v-model="spillDetail" class="toggle toggle-primary toggle-sm" />
          </label>
        </div>
      </div>
    </div>

    <div class="w-full">
      <div class="flex flex-col gap-4 w-full mb-6">
        <div class="flex flex-row justify-center items-center gap-2 border-t border-base-300 pt-4">
          <div class="join shrink-0 shadow-sm">
            <button @click="prevRange" class="btn btn-sm join-item btn-ghost border border-base-300">
              <ChevronLeft :size="18" />
            </button>
            <button class="btn btn-sm join-item bg-base-200 no-animation w-32 sm:w-40 md:w-56 border-x-0 border-base-300 text-base-content font-bold text-[10px] sm:text-xs">
              {{ currentRangeLabel }}
            </button>
            <button @click="nextRange" class="btn btn-sm join-item btn-ghost border border-base-300">
              <ChevronRight :size="18" />
            </button>
          </div>
          <button @click="goToday" class="btn btn-sm btn-ghost border border-base-300 font-bold hover:bg-base-300 transition-colors shrink-0">
            Hari Ini
          </button>
        </div>
      </div>

      <div class="bg-base-300 md:rounded-xl shadow-xl overflow-hidden border border-base-300 w-auto -mx-8 md:mx-0 rounded-lg">
        
        <div v-if="!(isMobile && viewMode === 'weekly')" class="grid grid-cols-7 bg-neutral text-neutral-content font-bold text-center py-3 text-xs md:text-sm">
          <div v-for="day in weekDays" :key="day">{{ isMobile ? day.substring(0,3) : day }}</div>
        </div>

        <div :class="[
          viewMode === 'monthly' ? 'grid grid-cols-7' : (isMobile ? 'flex flex-col gap-[1px]' : 'grid grid-cols-7'),
          'bg-base-300 gap-[1px]'
        ]">
          <template v-if="isLoading">
            <div v-for="n in (viewMode === 'monthly' ? 42 : 7)" :key="'skeleton-'+n" 
                class="min-h-[120px] p-2 bg-base-100 flex flex-col gap-2">
              <div class="skeleton h-4 w-8"></div>
              <div class="skeleton h-3 w-full"></div>
              <div class="skeleton h-3 w-3/4"></div>
            </div>
          </template>

          <template v-else>
            <div v-for="cell in calendarCells" :key="cell.dateKey"
                :class="[
                  'min-h-[120px] p-2 flex flex-col transition-colors relative overflow-hidden',
                  cell.isCurrentMonth ? 'bg-base-100' : 'bg-base-200/50 text-base-content/40',
                  isToday(cell.date) && isMobile && viewMode === 'weekly' ? 'ring-2 ring-primary ring-inset' : ''
                ]">
              
              <div class="flex justify-between items-start mb-2">
                <span :class="[
                  'text-xs font-bold px-2 py-0.5 rounded-md transition-all',
                  isToday(cell.date) ? 'bg-primary text-primary-content shadow-md' : 'bg-base-300 text-base-content/70'
                ]">
                  <span v-if="isMobile && viewMode === 'weekly'" class="mr-1">{{ weekDays[cell.date.getDay()] }},</span>
                  {{ cell.dayNumber }} 
                  <span v-if="isMobile && viewMode === 'weekly'">{{ months[cell.date.getMonth()] }}</span>
                </span>
                <button 
                  v-if="canAddContent" 
                  @click="addItem(cell.date)" 
                  class="btn btn-ghost btn-xs btn-circle text-primary hover:bg-primary/10 transition-all"
                  title="Tambah Konten"
                >
                  <Plus :size="16" />
                </button>         
              </div>

              <div class="flex flex-col gap-1.5 overflow-hidden">
                <template v-if="spillDetail">
                  <div v-for="content in getContents(cell.dateKey)" :key="content.ID"
                      @click="showDetail(content)"
                        class="cursor-pointer hover:scale-[1.02] active:scale-95 text-[10px] p-1.5 rounded border leading-tight transition-all flex items-center shadow-sm w-full overflow-hidden"
                      :class="getStatusBadgeClass(content.Status)">
                    <div class="truncate whitespace-nowrap w-full">
                      <span class="font-black mr-1 uppercase text-[9px]">{{ content.Jam_Rilis }}</span>
                      <span class="opacity-70">[{{ content.Rubrikasi }}]</span> {{ content.Judul_Cover }}
                    </div>
                  </div>
                </template>
                
                <template v-else>
                  <div class="flex flex-wrap gap-1.5 mt-auto pb-1 px-1">
                    <div v-for="content in getContents(cell.dateKey)" :key="content.ID"
                        @click="showDetail(content)"
                          class="cursor-pointer hover:scale-125 w-2.5 h-2.5 rounded-full ring-1 ring-base-100 shadow-sm"
                        :class="getStatusColor(content.Status)">
                    </div>
                  </div>
                </template>
              </div>

            </div>
          </template>
        </div>
      </div>
    </div>

    <ContentModal :content="selectedContent" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { useAuthStore } from '@/stores';
import ContentModal from '../components/ContentModal.vue';

// --- Pinia & State ---
const authStore = useAuthStore();
const isLoading = ref(true);
const contentData = ref([]); 
const selectedContent = ref(null);

const weekDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const currentDate = ref(new Date());
const selectedMonth = ref(currentDate.value.getMonth());
const selectedYear = ref(currentDate.value.getFullYear());
const viewMode = ref('monthly');
const spillDetail = ref(true);
const isMobile = ref(false);

// --- 1. Mockup Backend GAS ---
const fetchContentFromGAS = () => {
  return new Promise((resolve) => {
    // Data dummy lengkap untuk simulasi
    const dummyData = [
      { 
        ID: "CONT-001", 
        Tanggal_Rilis: new Date().toISOString(), 
        Jam_Rilis: '09:00', 
        Status: 'published', 
        Rubrikasi: 'News', 
        Judul_Cover: 'Peluncuran Fitur Baru',
        Referensi: 'https://google.com',
        Link_Hasil: 'https://kalteng.go.id'
      },
      { 
        ID: "CONT-002", 
        Tanggal_Rilis: new Date().toISOString(), 
        Jam_Rilis: '14:30', 
        Status: 'on editing', 
        Rubrikasi: 'Social', 
        Judul_Cover: 'Konten Edukasi Mingguan',
        Referensi: 'https://instagram.com',
        Link_Hasil: ''
      },
      { 
        ID: "CONT-003", 
        Tanggal_Rilis: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), 
        Jam_Rilis: '10:00', 
        Status: 'draft', 
        Rubrikasi: 'Ads', 
        Judul_Cover: 'Campaign Ramadhan',
        Referensi: '',
        Link_Hasil: ''
      }
    ];
    setTimeout(() => resolve(dummyData), 1200); // Simulasi delay
  });
};

// --- 2. Logic Loading Data ---
const loadData = async () => {
  isLoading.value = true;
  
  // --- MODE PRODUKSI (GOOGLE APPS SCRIPT) ---
  // Silakan uncomment bagian ini saat akan dideploy ke GAS
  
  if (typeof google !== 'undefined') {
    google.script.run
      .withSuccessHandler((data) => {
        // Data yang dikirim dari GAS harus dalam format JSON string atau Array/Object
        contentData.value = typeof data === 'string' ? JSON.parse(data) : data;
        isLoading.value = false;
      })
      .withFailureHandler((error) => {
        console.error("GAS Error:", error);
        isLoading.value = false;
      })
      .getContentPlanData(); // Memanggil fungsi di Code.gs
    return;
  }

  // --- MODE DEVELOPMENT (LOKAL) ---
  try {
    const data = await fetchContentFromGAS();
    contentData.value = data;
  } catch (error) {
    console.error("Local Fetch error:", error);
  } finally {
    isLoading.value = false;
  }
};

// --- 3. Modal Logic ---
async function showDetail(content) {
  selectedContent.value = content;
  await nextTick();
  const modal = document.getElementById('content_detail_modal');
  if (modal) modal.showModal();
}

// --- Permissions ---
const canAddContent = computed(() => {
  const allowedRoles = ['superadmin', 'konseptor', 'editor', 'statmin', 'kamedsos'];
  return authStore.isLoggedIn && allowedRoles.includes(authStore.userRole);
});

// --- Calendar Logic ---
const calendarCells = computed(() => {
  const year = selectedYear.value;
  const month = selectedMonth.value;
  
  if (viewMode.value === 'weekly') {
    const tempDate = new Date(currentDate.value);
    const day = tempDate.getDay();
    const diff = tempDate.getDate() - day;
    const startOfWeek = new Date(tempDate.setDate(diff));
    
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      return createCell(d, true);
    });
  }
  
  const firstDayOfMonth = new Date(year, month, 1);
  const startDay = firstDayOfMonth.getDay();
  const startDate = new Date(year, month, 1 - startDay);
  
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    return createCell(d, d.getMonth() === month);
  });
});

const currentRangeLabel = computed(() => {
  if (viewMode.value === 'monthly') {
    return `${months[selectedMonth.value]} ${selectedYear.value}`;
  }
  const cells = calendarCells.value;
  if (!cells.length) return "";
  const start = cells[0].date;
  const end = cells[6].date;
  return `${start.getDate()} ${months[start.getMonth()].substring(0,3)} - ${end.getDate()} ${months[end.getMonth()].substring(0,3)} ${end.getFullYear()}`;
});

// --- Helper Functions ---
function createCell(date, isCurrentMonth) {
  const d = new Date(date);
  return {
    date: d,
    dateKey: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
    dayNumber: d.getDate(),
    isCurrentMonth
  };
}

function getContents(dateKey) {
  return contentData.value.filter(item => {
    if (!item.Tanggal_Rilis) return false; // Integrasi: Safety check jika Tanggal_Rilis undefined
    const d = new Date(item.Tanggal_Rilis);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return key === dateKey;
  });
}

function getStatusColor(s) {
  const status = s?.toLowerCase() || '';
  const colors = {
    'draft': 'bg-neutral-content',
    'on editing': 'bg-warning',
    'published': 'bg-info',
    'content approved': 'bg-success'
  };
  return colors[status] || 'bg-base-300';
}

function getStatusBadgeClass(s) {
  const status = s?.toLowerCase().trim() || '';
  const classes = {
    'draft': 'bg-base-200 text-base-content/70 border-base-300',
    'on editing': 'bg-warning/10 text-warning border-warning/20',
    'published': 'bg-info/10 text-info border-info/20',
    'content approved': 'bg-success/10 text-success border-success/20'
  };
  return classes[status] || 'bg-base-200 text-base-content/40 border-base-300';
}

function isToday(date) {
  return date.toDateString() === new Date().toDateString();
}

// --- Navigation ---
function nextRange() {
  if (viewMode.value === 'weekly') {
    currentDate.value = new Date(currentDate.value.setDate(currentDate.value.getDate() + 7));
    syncSelectors();
  } else {
    if (selectedMonth.value === 11) {
      selectedMonth.value = 0; selectedYear.value++;
    } else {
      selectedMonth.value++;
    }
  }
}

function prevRange() {
  if (viewMode.value === 'weekly') {
    currentDate.value = new Date(currentDate.value.setDate(currentDate.value.getDate() - 7));
    syncSelectors();
  } else {
    if (selectedMonth.value === 0) {
      selectedMonth.value = 11; selectedYear.value--;
    } else {
      selectedMonth.value--;
    }
  }
}

function syncSelectors() {
  selectedMonth.value = currentDate.value.getMonth();
  selectedYear.value = currentDate.value.getFullYear();
}

function goToday() {
  currentDate.value = new Date();
  syncSelectors();
}

function addItem(date) {
  const title = prompt("Masukkan Judul Konten:");
  if (title) {
    contentData.value.push({
      ID: `CONT-${Date.now()}`,
      Tanggal_Rilis: date.toISOString(),
      Jam_Rilis: '12:00',
      Status: 'draft',
      Rubrikasi: 'General',
      Judul_Cover: title
    });
  }
}

// --- Watchers & Lifecycle ---
watch([selectedMonth, selectedYear], ([newM, newY]) => {
  const d = new Date(currentDate.value);
  d.setFullYear(newY);
  d.setMonth(newM);
  currentDate.value = d;
});

// Integrasi: Menambahkan watcher agar data di-refresh otomatis jika status login berubah (misal user logout di halaman kalender)
watch(() => authStore.isLoggedIn, () => {
  loadData();
}); 

let mq;
onMounted(() => {
  // Load Data
  loadData();

  // Responsive Handler
  mq = window.matchMedia('(max-width: 768px)');
  const update = (e) => {
    isMobile.value = e.matches;
    if (isMobile.value) viewMode.value = 'weekly';
  };
  update(mq);
  mq.addEventListener('change', update);
});

onBeforeUnmount(() => {
  if (mq) mq.removeEventListener('change', () => {});
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: hsl(var(--bc) / 0.2); border-radius: 10px; }
.transition-all { transition: all 0.2s ease-in-out; }
</style>