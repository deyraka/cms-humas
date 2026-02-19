<template>
  <dialog id="content_detail_modal" class="modal modal-bottom sm:modal-middle">
    <div v-if="content" class="modal-box bg-base-100 border border-base-300 p-0 overflow-hidden max-w-lg flex flex-col max-h-[90vh]">
      
      <div 
        class="p-4 flex justify-between items-start border-b border-base-300 shrink-0 transition-colors duration-300" 
        :class="statusStore.getConfig(content.Status).Bg_Class"
      >
        <div class="flex flex-col">
          <div class="flex items-center gap-2">
            <FileText class="w-4 h-4" />
            <h3 class="font-bold text-sm uppercase tracking-wider">Ringkasan Konten</h3>
            <div v-if="canEdit" class="flex items-center gap-1 ml-2">
                <div class="tooltip tooltip-bottom tooltip-info" data-tip="Ubah Detil">
                    <button 
                        class="btn btn-ghost btn-xs btn-square text-base-content/70 hover:text-info"
                        @click="router.push({ path: '/contentForm', query: { id: content.ID } })"
                    >
                        <FilePenLine :size="14" />
                    </button>
                </div>

                <div class="tooltip tooltip-bottom tooltip-warning" data-tip="Update Status">
                    <button 
                        class="btn btn-ghost btn-xs btn-square text-base-content/70 hover:text-warning"
                        @click="router.push({ path: '/editStatusForm', query: { id: content.ID } })"
                    >
                        <UserRoundPen :size="14" />
                    </button>
                </div>
            </div>
          </div>
          <span class="text-[10px] font-mono opacity-60 mt-0.5 ml-6 italic">ID: #{{ content.ID }}</span>
        </div>
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost text-lg">✕</button>
        </form>
      </div>

      <div class="p-5 space-y-5 overflow-y-auto custom-scrollbar flex-grow">
        <div>
          <h2 class="text-lg font-extrabold text-base-content leading-tight">
            {{ content.Judul_Cover }}
          </h2>
          <div 
            class="badge badge-sm mt-1.5 font-bold uppercase text-[9px] py-2" 
            :class="statusStore.getConfig(content.Status).Badge_Class"
          >
            status : {{ content.Status }}
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="flex items-center gap-2 bg-base-200 p-2.5 rounded-xl">
            <CalendarIcon class="w-4 h-4 text-primary shrink-0" />
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

        <div :class="['grid gap-3', authStore.isLoggedIn ? 'grid-cols-2' : 'grid-cols-1']">
          <div class="form-control">
            <p class="text-[9px] uppercase font-bold opacity-50 mb-1 ml-1">Referensi</p>
            <a :href="content.Referensi" target="_blank" 
               class="btn btn-xs btn-outline btn-block gap-1 px-1 flex-nowrap"
               :class="!content.Referensi ? 'btn-disabled opacity-50' : ''">
              <LinkIcon class="w-3 h-3 shrink-0" />
              <span class="truncate text-[10px]">Buka Link</span>
            </a>
          </div>

          <div v-if="authStore.isLoggedIn" class="form-control">
            <p class="text-[9px] uppercase font-bold opacity-50 mb-1 ml-1 text-primary">Link Hasil</p>
            <a :href="content.Link_Hasil" target="_blank" 
               class="btn btn-xs btn-primary btn-block gap-1 px-1 flex-nowrap"
               :class="!content.Link_Hasil ? 'btn-disabled opacity-50' : ''">
              <ExternalLink class="w-3 h-3 shrink-0" />
              <span class="truncate text-[10px]">Cek Hasil</span>
            </a>
          </div>
        </div>

        <div class="divider my-0 opacity-20"></div>

        <div class="flex justify-center">
          <button 
            type="button"
            @click.stop="showApproval = !showApproval" 
            class="btn btn-ghost btn-xs gap-2 font-bold text-[10px] uppercase tracking-widest opacity-60 hover:opacity-100"
          >
            <component :is="showApproval ? ChevronUp : ChevronDown" class="w-3 h-3" />
            {{ showApproval ? 'Tutup' : 'Lihat' }} Ringkasan Approval
          </button>
        </div>

        <div v-show="showApproval" class="space-y-3 bg-base-200/80 p-4 rounded-2xl border border-base-300 animate-in fade-in slide-in-from-top-2 duration-300">
            <div class="flex items-center justify-between w-full mb-2">
                <h4 class="text-[9px] uppercase font-black opacity-40 tracking-widest flex items-center gap-2 mb-2">
                    <CheckCircle2 class="w-3 h-3" /> Hierarki Persetujuan
                </h4>
                <button 
                    type="button"
                    @click="showNotes = true"
                    class="btn btn-ghost btn-xs gap-1 text-[10px] h-6 min-h-0 px-2"
                    >
                        <MessageSquareText class="w-3 h-3" />
                        Baca Catatan
                </button>
            </div>
          
          <div class="space-y-2">
            <div class="grid grid-cols-1 gap-2">
              <div v-for="(val, label) in { 'Kepala BPS': content.Kabps_Approval, 'Kabag Umum': content.Kabag_Approval,'Ketua Tim Humas': content.Kahumas_Approval, 'Ketua Bidang Medsos': content.Kamedsos_Approval }" :key="label" 
                   class="flex items-center justify-between bg-base-100 px-3 py-2 rounded-lg border border-base-300/50">
                <span class="text-[11px] font-medium opacity-80">{{ label }}</span>
                <div class="flex items-center">
                  <component v-if="getStatusIcon(val).icon" :is="getStatusIcon(val).icon" :class="['w-4 h-4', getStatusIcon(val).class]" />
                  <span v-else class="text-xs font-bold opacity-30">?</span>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between bg-base-100 px-3 py-2 rounded-lg border border-base-300/50">
              <span class="text-[11px] font-medium opacity-80">Madya</span>
              <div class="flex items-center gap-3">
                <div class="flex items-center gap-1.5">
                  <ThumbsUp class="w-3.5 h-3.5 text-success" />
                  <span class="badge badge-success text-white text-[10px] font-bold h-5 min-h-0 px-2">{{ content.Madya_Approval || 0 }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <ThumbsDown class="w-3.5 h-3.5 text-error" />
                  <span class="badge badge-error text-white text-[10px] font-bold h-5 min-h-0 px-2">{{ content.Madya_Disapproval || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="canApprove || isMadya" class="p-4 bg-base-200 border-t border-base-300 shrink-0">
            <div class="flex gap-3">
            <template v-if="canApprove">
                <button 
                @click="handleAction('reject')" 
                class="btn btn-outline btn-error flex-1 gap-2"
                >
                <XCircle class="w-4 h-4" /> Tolak
                </button>
                <button 
                @click="handleAction('approve')" 
                class="btn btn-primary flex-1 gap-2 text-white shadow-lg shadow-primary/20"
                >
                <CheckCircle2 class="w-4 h-4" /> Setujui
                </button>
            </template>
            <template v-else-if="isMadya">
                <button 
                @click="handleAction('vote_down')" 
                class="btn btn-outline btn-error flex-1 gap-2"
                >
                <ThumbsDown class="w-4 h-4" /> Vote -
                </button>
                <button 
                @click="handleAction('vote_up')" 
                class="btn btn-success flex-1 gap-2 text-white shadow-lg shadow-success/20"
                >
                <ThumbsUp class="w-4 h-4" /> Vote +
                </button>
            </template>
            </div>
        </div>

        <div v-else class="bg-base-200 py-2 border-t border-base-300 shrink-0"></div>

      </div>      
      <div class="bg-base-200 py-2 border-t border-base-300 shrink-0"></div>
    </div>
    
    <form method="dialog" class="modal-backdrop bg-black/60 backdrop-blur-[2px]">
      <button>close</button>
    </form>

    <div v-if="showNotes" class="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="bg-base-100 w-full max-w-sm rounded-2xl shadow-2xl border border-base-300 flex flex-col overflow-hidden animate-in zoom-in duration-200 max-h-[75vh]">
        
        <div class="p-3 border-b border-base-300 bg-base-200 flex justify-between items-center shrink-0">
          <span class="text-[10px] font-bold uppercase tracking-widest opacity-60">Riwayat Catatan</span>
          <button @click="showNotes = false" class="btn btn-ghost btn-xs btn-circle font-bold">✕</button>
        </div>
        
        <div class="p-4 max-h-72 overflow-y-auto custom-scrollbar flex-1 bg-base-100">
            <div v-if="parsedNotes.length > 0" class="space-y-4">
                <div v-for="(item, index) in parsedNotes" :key="index" class="text-xs border-b border-base-200 last:border-0 pb-3 last:pb-0">
                    <template v-if="item.isFormatted">
                        <div class="flex flex-wrap gap-x-2 gap-y-1 mb-1 items-center">
                            <span class="text-[10px] font-mono font-bold bg-primary/10 px-1.5 py-0.5 rounded italic">
                                {{ item.timestamp }}
                            </span>
                            <span class="font-medium text-blue-600 tracking-tighter">
                                {{ item.name }} : 
                            </span>
                        </div>
                        <p class="text-base-content leading-relaxed whitespace-pre-line mt-1 font-medium">
                            {{ item.message }}
                        </p>
                    </template>
                    
                    <template v-else>
                        <p class="italic opacity-70 whitespace-pre-line">{{ item.raw }}</p>
                    </template>
                </div>
            </div>
            <div v-else class="text-center py-10 opacity-40 text-xs italic">
                Tidak ada catatan tersimpan.
            </div>
        </div>

        <div class="p-3 bg-base-200 border-t border-base-300 flex justify-end shrink-0">
          <button @click="showNotes = false" class="btn btn-primary btn-sm px-6 font-bold shadow-lg shadow-primary/20">Tutup</button>
        </div>
      </div>
    </div>

    <div v-if="showRejectModal" class="absolute inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div class="bg-base-100 w-full max-w-sm rounded-2xl shadow-2xl border border-base-300 flex flex-col overflow-hidden animate-in zoom-in duration-200">
            
            <div :class="['p-4 border-b border-base-300 flex items-center gap-2', isApproving ? 'bg-success/10' : 'bg-error/10']">
            <component :is="isApproving ? CheckCircle2 : XCircle" :class="['w-5 h-5', isApproving ? 'text-success' : 'text-error']" />
            <span :class="['font-bold text-sm uppercase tracking-tight', isApproving ? 'text-success' : 'text-error']">
                Konfirmasi {{ isApproving ? 'Persetujuan' : 'Penolakan' }}
            </span>
            </div>
            
            <div class="p-4 space-y-4">
            <div v-if="props.content.Catatan_Approval" class="space-y-1">
                <label class="text-[10px] font-bold uppercase opacity-50 ml-1">Catatan Lain:</label>
                <!-- <div class="p-3 bg-base-200 rounded-lg text-[11px] leading-relaxed max-h-24 overflow-y-auto custom-scrollbar border border-base-300 italic whitespace-pre-line text-base-content/70">
                {{ props.content.Catatan_Approval }}
                </div> -->
                <div class="p-3 bg-base-200 rounded-lg text-[11px] leading-relaxed max-h-48 overflow-y-auto custom-scrollbar border border-base-300 italic whitespace-pre-line text-base-content/70">
                    <div v-if="parsedNotes.length > 0" class="space-y-4">
                        <div v-for="(item, index) in parsedNotes" :key="index" class="text-xs border-b border-base-300 last:border-0 pb-3 last:pb-0">
                            <template v-if="item.isFormatted">
                                <div class="flex flex-wrap gap-x-2 gap-y-1 mb-1 items-center">
                                    <span class="text-[10px] font-mono font-bold bg-primary/10 px-1.5 py-0.5 rounded italic">
                                        {{ item.timestamp }}
                                    </span>
                                    <span class="font-medium text-blue-600 tracking-tighter">
                                        {{ item.name }} : 
                                    </span>
                                </div>
                                <p class="text-base-content leading-relaxed whitespace-pre-line mt-1 font-medium">
                                    {{ item.message }}
                                </p>
                            </template>
                            
                            <template v-else>
                                <p class="italic opacity-70 whitespace-pre-line">{{ item.raw }}</p>
                            </template>
                        </div>
                    </div>
                    <div v-else class="text-center py-10 opacity-40 text-xs italic">
                        Tidak ada catatan tersimpan.
                    </div>
                </div>
            </div>

            <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase opacity-50 ml-1">
                {{ isApproving ? 'Tambahkan Catatan (Opsional):' : 'Alasan Penolakan (Wajib):' }}
                </label>
                <textarea 
                v-model="rejectionNote" 
                :class="['textarea textarea-bordered w-full h-24 text-sm rounded-lg', isApproving ? 'focus:textarea-success' : 'focus:textarea-error']" 
                :placeholder="isApproving ? 'Tambahkan pesan tambahan jika ada...' : 'Tuliskan alasan penolakan...'"
                ></textarea>
            </div>
            </div>

            <div class="p-4 bg-base-200 flex gap-2">
            <button @click="showRejectModal = false" class="btn btn-ghost btn-sm flex-1" :disabled="isProcessing">Batal</button>
            
            <button 
                @click="submitApproval(rejectionNote)" 
                :class="['btn btn-sm flex-1 text-white', isApproving ? 'btn-success' : 'btn-error']"
                :disabled="isProcessing || (!isApproving && !rejectionNote)"
            >
                <span v-if="isProcessing" class="loading loading-spinner loading-xs"></span>
                {{ isApproving ? 'Setujui' : 'Tolak' }} & Simpan
            </button>
            </div>
        </div>
    </div>

  </dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { FileText, Calendar as CalendarIcon, Clock, Link as LinkIcon, ExternalLink, FilePenLine, UserRoundPen, CheckCircle2, XCircle, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp, MessageSquareText } from 'lucide-vue-next';
import { useAuthStore } from '@/stores';
import { useMetadataStatusStore } from '@/stores/metadataStatus'; // Import store metadata
import { useContentStore } from '@/stores/content'; // Sesuaikan path store Anda
import { useRouter } from 'vue-router';

const props = defineProps(['content']);
const authStore = useAuthStore();
const statusStore = useMetadataStatusStore(); // Inisialisasi store metadata
const contentStore = useContentStore(); // Inisialisasi store konten
const router = useRouter();
const showApproval = ref(false);
const showNotes = ref(false);
const showRejectModal = ref(false);
const rejectionNote = ref('');
const isProcessing = ref(false);
const isApproving = ref(false); // [TAMBAH] Untuk membedakan mode modal

// Gunakan onMounted untuk mengisi nilai default dari props saat modal dibuka
onMounted(() => {
  if (props.content?.Catatan_Approval) {
    rejectionNote.value = props.content.Catatan_Approval;
  }
});

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

const canEdit = computed(() => {
  const allowedRoles = ['kamedsos', 'konseptor', 'editor', 'statmin', 'superadmin'];
  // Normalisasi ke lowercase untuk menghindari kesalahan typo data dari backend
  return authStore.isLoggedIn && allowedRoles.includes(authStore.userRole?.toLowerCase());
});

// Helper diperkuat untuk menangani string 'true'/'false' dari backend GAS
const getStatusIcon = (val) => {
  if (val === true || String(val).toLowerCase() === 'true') {
    return { icon: CheckCircle2, class: 'text-success' };
  }
  if (val === false || String(val).toLowerCase() === 'false') {
    return { icon: XCircle, class: 'text-error' };
  }
  return { icon: null, text: '?' };
};

// [TAMBAH] Pengecekan role untuk tombol Setujui/Tolak (Petinggi)
const canApprove = computed(() => {
  const approverRoles = ['kabps', 'kabag', 'kahumas', 'kamedsos', 'superadmin'];
  return authStore.isLoggedIn && approverRoles.includes(authStore.userRole?.toLowerCase());
});

// [TAMBAH] Pengecekan role khusus Madya untuk tombol Vote
const isMadya = computed(() => {
  return authStore.isLoggedIn && authStore.userRole?.toLowerCase() === 'madya';
});

// Fungsi placeholder untuk aksi (bisa Anda hubungkan ke GAS nanti)
// const handleAction = async (type) => {
//   console.log(`Aksi: ${type} untuk ID: ${props.content.ID}`);
//   // Integrasi google.script.run bisa dilakukan di sini
//   // 1. Jika klik Setujui oleh Kabps
//   if (type === 'approve' && authStore.userRole?.toLowerCase() === 'superadmin') {
//     await submitApproval(true, '');
//   } 
//   // 2. Jika klik Tolak, buka modal catatan dulu
//   else if (type === 'reject') {
//     rejectionNote.value = props.content.Catatan_Approval || '';
//     showRejectModal.value = true;
//   }
// };
const handleAction = (type) => {
  // Reset input catatan setiap kali modal dibuka (opsional, sesuaikan kebutuhan)
  rejectionNote.value = ''; 
  
  if (type === 'approve' || type === 'vote_up') {
    isApproving.value = true;
    showRejectModal.value = true; // Kita gunakan modal yang sama
  } else if (type === 'reject' || type === 'vote_down') {
    isApproving.value = false;
    showRejectModal.value = true;
  }
};

const submitApproval = async (note) => {
  isProcessing.value = true;
  
  const timestamp = getNowFormatted();
  const firstName = authStore.userName?.trim().split(' ')[0] || 'User';
  const oldNote = props.content.Catatan_Approval || '';
  // Jika ada catatan baru, gabungkan. Jika tidak, tetap gunakan yang lama.
  const finalNote = note 
    ? (oldNote ? `${oldNote}\n---\n[${timestamp}] ${firstName} : ${note}` : note) 
    : oldNote;

  const updateData = {
    ID: props.content.ID,
    // // Gunakan isApproving.value untuk menentukan nilai TRUE/FALSE
    // ...(authStore.userRole?.toLowerCase() === 'kabps' && { Kabps_Approval: isApproving.value }),
    Catatan_Approval: finalNote
  };

  // 2. Tentukan nama kolom secara dinamis berdasarkan role user
  const role = authStore.userRole?.toLowerCase();
  
  if (role === 'kabps') {
    if (isApproving.value) {
      updateData.Kabps_Approval = true; // Setujui
      updateData.Status = 'content approved'; // Update status ke "content approved" saat disetujui oleh Kabps
    } else {
      updateData.Kabps_Approval = false; // Tolak
      updateData.Status = 'disapproved'; // Update status ke "disapproved" saat ditolak oleh Kabps
    }
  } else if (role === 'kabag') {
    updateData.Kabag_Approval = isApproving.value;
  } else if (role === 'kahumas') {
    updateData.Kahumas_Approval = isApproving.value;
  } else if (role === 'kamedsos') {
    if (isApproving.value) {
      updateData.Kamedsos_Approval = true; // Setujui
      updateData.Status = 'prepare to production'; // Update status ke "draft approved" saat disetujui oleh Kamedsos
    } else {
      updateData.Kamedsos_Approval = false; // Tolak
      updateData.Status = 'draft rejected'; // Update status ke "draft rejected" saat ditolak oleh Kamedsos
    }
  } else if (role === 'madya') {
    if (isApproving.value) {
      updateData.Madya_Approval = (props.content.Madya_Approval || 0) + 1; // Tambah 1 untuk vote up
    } else {
      updateData.Madya_Disapproval = (props.content.Madya_Disapproval || 0) + 1; // Tambah 1 untuk vote down
    }
  }


  try {
    await new Promise((resolve, reject) => {
      if (typeof google !== 'undefined' && google.script?.run) {
        google.script.run
          .withSuccessHandler(res => {
            // [LOGIKA KRUSIAL] Update Pinia setelah sukses di database
            contentStore.updateContentLocally(updateData);
            // Ini akan menyalin nilai baru ke dalam objek props.content
            Object.assign(props.content, updateData);
            resolve(res);
          })
          .withFailureHandler(err => reject(err))
          .saveContentPlan(updateData); 
      } else {
        setTimeout(() => {
          console.log(`DEV MODE - ${isApproving.value ? 'APPROVE' : 'REJECT'}:`, updateData);
          contentStore.updateContentLocally(updateData);
          // Ini akan menyalin nilai baru ke dalam objek props.content
          Object.assign(props.content, updateData);
          resolve({ success: true });
        }, 1000);
      }
    });

    showRejectModal.value = false;
    rejectionNote.value = '';
    alert(`Berhasil: Konten telah ${isApproving.value ? 'disetujui' : 'ditolak'}`);
  } catch (err) {
    alert("Gagal: " + err.message);
  } finally {
    isProcessing.value = false;
  }
};

/** * Khusus hanya digunakan untuk menampilkan tanggal dan jam pada catatan approval
*/
const getNowFormatted = () => {
  const now = new Date();
  const d = String(now.getDate()).padStart(2, '0');
  const m = String(now.getMonth() + 1).padStart(2, '0'); // Januari adalah 0
  const y = now.getFullYear();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  
  return `${d}/${m}/${y} ${hh}:${mm}`;
};

const parsedNotes = computed(() => {
  if (!props.content.Catatan_Approval) return [];
  
  // Pecah berdasarkan pemisah baris ---
  return props.content.Catatan_Approval.split('\n---\n').map(note => {
    // Regex Baru: [Tanggal] Nama : Pesan
    const regex = /^\[(.*?)\]\s+(.*?)\s+:\s+([\s\S]*)$/;
    const match = note.trim().match(regex);

    if (match) {
      return {
        timestamp: match[1], // Hasil dari (.*?) pertama (Tanggal)
        name: match[2],      // Hasil dari (.*?) kedua (Nama)
        message: match[3],   // Hasil dari ([\s\S]*) ketiga (Pesan)
        isFormatted: true
      };
    }
    // Jika format tidak cocok (misal catatan lama yang berantakan)
    return { raw: note, isFormatted: false };
  });
});


/** * Fungsi getStatusBg dan getStatusBadge dihapus. 
 * Sekarang langsung memanggil statusStore.getConfig(status) di template.
 */
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { 
  background: hsl(var(--bc) / 0.2); 
  border-radius: 10px; 
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: hsl(var(--bc) / 0.3); }
</style>