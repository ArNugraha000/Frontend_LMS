export interface Pendaftaran {
  pdtId?: number;
  pdtKryId: number;
  pdtPlbId: number;
  pdtStatus: number; // 0=Belum, 1=Terdaftar, 2=Ditolak
  pdtCreateBy?: string;
  pdtCreateDate?: string;
  pdtModifBy?: string;
  pdtModifDate?: string;

  // Join fields
  karyawanName?: string;
  karyawanUsername?: string;
  karyawanNamaDpn?: string;
  karyawanNamaBkg?: string;
  karyawanEmail?: string;
  karyawanJabatan?: string;
  karyawanDivisi?: string;
  karyawanStatus?: string;
  batchNama?: string;
  statusText?: string;
}

export interface BatchPelatihan {
  plbId: number;
  plbNamaBatch: string;
  plbStatus: number;
}

export interface PageResponsePendaftaran {
  content: Pendaftaran[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface DtoResponsePendaftaran {
  code: number;
  message: string;
  data: any;
}
