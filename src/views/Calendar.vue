<template>
  <div class="p-4">
    <!-- Head -->
    <div class="mb-4">
      <div class="flex items-center justify-between flex-wrap sm:flex-nowrap gap-2">
        <div class="flex items-center gap-3 min-w-0">
          <h1 class="text-xl font-semibold truncate">Content Calendar</h1>
        </div>

        <div class="flex items-center gap-2">
          <button
            class="btn btn-outline btn-sm"
            :class="{ 'opacity-50 cursor-not-allowed': isMobile }"
            :disabled="isMobile"
            @click="viewMode = 'monthly'"
          >
            Monthly
          </button>
          <button class="btn btn-outline btn-sm" @click="viewMode = 'weekly'">Weekly</button>

          <label class="flex items-center gap-2 ml-2">
            <span class="text-sm">Spill Detail</span>
            <input type="checkbox" class="toggle toggle-sm" v-model="spillDetail" />
          </label>
        </div>
      </div>

      <!-- sub-row: filter bulan/tahun + Today button -->
      <div class="mt-3 flex flex-col sm:flex-row sm:items-center gap-2">
        <div class="flex gap-2 items-center">
          <select v-model.number="selectedMonth" class="select select-bordered select-sm">
            <option v-for="(m, i) in months" :key="i" :value="i">{{ m }}</option>
          </select>
          <select v-model.number="selectedYear" class="select select-bordered select-sm">
            <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>

        <div class="sm:ml-auto">
          <button class="btn btn-primary btn-sm" @click="goToday">Hari ini</button>
        </div>
      </div>
    </div>

    <!-- Body: calendar grid -->
    <div>
      <div v-if="viewMode === 'monthly'">
        <div class="grid grid-cols-7 gap-2 text-sm">
          <div class="font-medium text-center">Sun</div>
          <div class="font-medium text-center">Mon</div>
          <div class="font-medium text-center">Tue</div>
          <div class="font-medium text-center">Wed</div>
          <div class="font-medium text-center">Thu</div>
          <div class="font-medium text-center">Fri</div>
          <div class="font-medium text-center">Sat</div>
        </div>

        <div class="grid grid-cols-7 gap-2 mt-2">
          <div
            v-for="cell in monthCells"
            :key="cell.key"
            class="border rounded p-2 h-28 flex flex-col justify-between bg-base-100"
          >
            <div class="flex justify-between items-start">
              <div class="text-xs font-semibold">{{ cell.day }}</div>
              <button class="btn btn-ghost btn-xs" @click="addItem(cell.date)">+</button>
            </div>

            <div class="mt-2">
              <template v-if="spillDetail">
                <div v-for="(item, idx) in cell.items" :key="idx" class="text-xs truncate">
                  {{ item.title }}
                </div>
              </template>
              <template v-else>
                <div class="flex gap-1 justify-end flex-wrap">
                  <span
                    v-for="(item, idx) in cell.items"
                    :key="idx"
                    class="w-3 h-3 rounded-full"
                    :style="{ backgroundColor: statusColor(item.status) }"
                    :title="item.title"
                  ></span>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="viewMode === 'weekly'">
        <div class="grid grid-cols-7 gap-2">
          <div
            v-for="cell in weekCells"
            :key="cell.key"
            class="border rounded p-2 h-36 flex flex-col justify-between bg-base-100"
          >
            <div class="flex justify-between items-start">
              <div class="text-sm font-semibold">{{ cell.weekday }} {{ cell.day }}</div>
              <button class="btn btn-ghost btn-xs" @click="addItem(cell.date)">+</button>
            </div>

            <div class="mt-2">
              <template v-if="spillDetail">
                <div v-for="(item, idx) in cell.items" :key="idx" class="text-xs truncate">
                  {{ item.title }}
                </div>
              </template>
              <template v-else>
                <div class="flex gap-1 justify-end flex-wrap">
                  <span
                    v-for="(item, idx) in cell.items"
                    :key="idx"
                    class="w-3 h-3 rounded-full"
                    :style="{ backgroundColor: statusColor(item.status) }"
                    :title="item.title"
                  ></span>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const months = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const now = new Date();
const selectedMonth = ref(now.getMonth());
const selectedYear = ref(now.getFullYear());
const years = Array.from({ length: 6 }).map((_, i) => now.getFullYear() - 2 + i);

const viewMode = ref('monthly');
const spillDetail = ref(false);

// simple isMobile detection (<=640px)
const isMobile = ref(false);
let mq;
onMounted(() => {
  mq = window.matchMedia('(max-width: 640px)');
  const update = (e) => (isMobile.value = e.matches);
  update(mq);
  mq.addEventListener('change', update);
});
onBeforeUnmount(() => {
  if (mq) mq.removeEventListener('change', () => {});
});

// Dummy content data keyed by YYYY-MM-DD
const dummy = ref({});
function seedDummy() {
  const year = selectedYear.value;
  const month = selectedMonth.value;
  const items = [
    { day: 3, title: 'Perkembangan indikator A', status: 'published' },
    { day: 3, title: 'Rencana konten B', status: 'planned' },
    { day: 8, title: 'Review C', status: 'draft' },
    { day: 15, title: 'Peluncuran kampanye', status: 'published' },
    { day: 22, title: 'Evaluasi', status: 'planned' }
  ];
  dummy.value = {};
  items.forEach((it) => {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(it.day).padStart(2, '0')}`;
    if (!dummy.value[key]) dummy.value[key] = [];
    dummy.value[key].push({ title: it.title, status: it.status });
  });
}
seedDummy();

function statusColor(status) {
  switch (status) {
    case 'published': return '#16a34a';
    case 'planned': return '#0ea5e9';
    case 'draft': return '#f59e0b';
    default: return '#6b7280';
  }
}

const monthCells = computed(() => {
  const y = selectedYear.value;
  const m = selectedMonth.value;
  const first = new Date(y, m, 1);
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const startWeekDay = first.getDay();
  const cells = [];

  // add leading empty cells
  for (let i = 0; i < startWeekDay; i++) {
    cells.push({ key: `empty-${i}`, day: '', date: null, items: [] });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(y, m, d);
    const key = `${y}-${m + 1}-${d}`;
    const iso = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push({ key, day: d, date, items: dummy.value[iso] || [] });
  }
  return cells;
});

const weekCells = computed(() => {
  // current week based on today
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay());
  const cells = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    cells.push({ key: iso, weekday: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()], day: d.getDate(), date: d, items: dummy.value[iso] || [] });
  }
  return cells;
});

function addItem(date) {
  if (!date) return;
  const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  if (!dummy.value[iso]) dummy.value[iso] = [];
  dummy.value[iso].push({ title: `New item ${dummy.value[iso].length + 1}`, status: 'planned' });
}

function goToday() {
  const t = new Date();
  selectedMonth.value = t.getMonth();
  selectedYear.value = t.getFullYear();
  seedDummy();
}
</script>

<style scoped>
.truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style>
