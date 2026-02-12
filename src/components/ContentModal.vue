<template>
  <dialog id="content_detail_modal" class="modal modal-bottom sm:modal-middle">
    <div v-if="content" class="modal-box bg-base-100 border border-base-300 p-0 overflow-hidden max-w-lg">
      
      <div class="p-4 flex justify-between items-start border-b border-base-300" :class="getStatusBg(content.Status)">
        <div class="flex flex-col">
          <div class="flex items-center gap-2">
            <FileText class="w-4 h-4" />
            <h3 class="font-bold text-sm uppercase tracking-wider">Ringkasan Konten</h3>
          </div>
          <span class="text-[10px] font-mono opacity-60 mt-0.5 ml-6 italic">ID: #{{ content.ID }}</span>
        </div>
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost text-lg">✕</button>
        </form>
      </div>

      <div class="p-5 space-y-5">
        <div>
          <h2 class="text-lg font-extrabold text-base-content leading-tight">
            {{ content.Judul_Cover }}
          </h2>
          <div class="badge badge-sm mt-1.5 font-bold uppercase text-[9px]" :class="getStatusBadge(content.Status)">
            {{ content.Status }}
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="flex items-center gap-2 bg-base-200 p-2.5 rounded-xl">
            <Calendar class="w-4 h-4 text-primary shrink-0" />
            <div class="min-w-0">
              <p class="text-[9px] uppercase font-bold opacity-50 leading-none mb-1">Tanggal</p>
              <p class="text-[11px] font-semibold truncate">{{ formatDate(content.Tanggal_Rilis) }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2 bg-base-200 p-2.5 rounded-xl">
            <Clock class="w-4 h-4 text-primary shrink-0" />
            <div class="min-w-0">
              <p class="text-[9px] uppercase font-bold opacity-50 leading-none mb-1">Jam Rilis</p>
              <p class="text-[11px] font-semibold truncate">{{ content.Jam_Rilis }} WIB</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="form-control">
            <p class="text-[9px] uppercase font-bold opacity-50 mb-1 ml-1">Referensi</p>
            <a :href="content.Referensi" target="_blank" 
               class="btn btn-xs btn-outline btn-block gap-1 px-1 flex-nowrap"
               :class="!content.Referensi ? 'btn-disabled opacity-50' : ''">
              <LinkIcon class="w-3 h-3 shrink-0" />
              <span class="truncate text-[10px]">Buka Link</span>
            </a>
          </div>

          <div class="form-control">
            <p class="text-[9px] uppercase font-bold opacity-50 mb-1 ml-1 text-primary">Link Hasil</p>
            <a :href="content.Link_Hasil" target="_blank" 
               class="btn btn-xs btn-primary btn-block gap-1 px-1 flex-nowrap"
               :class="!content.Link_Hasil ? 'btn-disabled opacity-50' : ''">
              <ExternalLink class="w-3 h-3 shrink-0" />
              <span class="truncate text-[10px]">Cek Hasil</span>
            </a>
          </div>
        </div>
      </div>

      <div class="bg-base-200 py-2 border-t border-base-300"></div>
    </div>
    
    <form method="dialog" class="modal-backdrop bg-black/60 backdrop-blur-[2px]">
      <button>close</button>
    </form>
  </dialog>
</template>

<script setup>
import { FileText, Calendar, Clock, Link as LinkIcon, ExternalLink } from 'lucide-vue-next';

defineProps(['content']);

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
};

const getStatusBg = (s) => {
  const status = s?.toLowerCase() || '';
  if (status === 'published') return 'bg-info/10 text-info';
  if (status === 'on editing') return 'bg-warning/10 text-warning';
  if (status === 'content approved') return 'bg-success/10 text-success';
  return 'bg-base-300 text-base-content/70';
};

const getStatusBadge = (s) => {
  const status = s?.toLowerCase() || '';
  if (status === 'published') return 'badge-info';
  if (status === 'on editing') return 'badge-warning';
  if (status === 'content approved') return 'badge-success';
  return 'badge-ghost';
};
</script>