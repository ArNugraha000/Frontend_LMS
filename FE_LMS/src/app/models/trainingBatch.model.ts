export interface TrainingBatch {
  plbId?: number;
  plbKrsId: number;
  plbNamaBatch: string;
  plbStatus: number;
  plbCreateBy?: string;
  plbCreateDate?: string;
  plbModifBy?: string;
  plbModifDate?: string;

  // Join fields dari MS_KURSUS
  kursusNama?: string;
  kursusGambar?: string;
  kursusGambarUrl?: string;
  kursusJenis?: string; // ✅ tambah jika perlu
  kursusDurasi?: number; // ✅ tambah jika perlu
  statusText?: string;
  batchNumber?: number;
}

export interface PageResponseTrainingBatch {
  content: TrainingBatch[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface DtoResponseTrainingBatch {
  code: number;
  message: string;
  data: any;
}
