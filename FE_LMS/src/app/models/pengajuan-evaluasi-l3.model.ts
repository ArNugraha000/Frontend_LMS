// models/pengajuan-evaluasi-l3.model.ts

export interface PengajuanEvaluasiL3 {
  evaId?: number;
  evaPlbId: number; // ✅ PERUBAHAN: dulu evaKrsId, sekarang evaPlbId (FK ke LMS_PELATIHAN_BATCH)
  evaKryId: number;
  evaEfektifitasSebelum: string;
  evaEfektifitasSesudah: string;
  evaStatus: number; // ✅ 0 = DRAFT, 1 = PENINJAUAN, 2 = SUBMITTED
  evaCreatedBy?: string;
  evaCreatedDate?: string;
  evaModifBy?: string;
  evaModifDate?: string;

  // Additional fields from join (dari native query)
  karyawanName?: string;
  karyawanUsername?: string;
  karyawanNamaDpn?: string; // ✅ tambahan
  karyawanNamaBkg?: string; // ✅ tambahan
  batchNama?: string; // ✅ PERUBAHAN: dulu kursusJudul, sekarang batchNama
  statusText?: string;
}

export interface PageResponsePengajuan<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface DtoResponseL3<T> {
  code: number;
  message: string;
  data: T;
}
