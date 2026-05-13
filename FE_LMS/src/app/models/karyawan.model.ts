// models/karyawan.model.ts
export interface Karyawan {
  kryId?: number;
  kryUsername: string;
  kryPassword?: string;
  kryNamaDpn: string;
  kryNamaBkg: string;
  kryEmail: string;
  kryTglLahir: string;
  kryProfil?: string;
  kryDivisi?: string;
  kryDep?: string;
  krySesi?: string;
  kryGol?: string;
  kryJabatan?: string;
  kryCreatedBy?: string;
  kryCreatedDate?: string;
  kryModifBy?: string;
  kryModifDate?: string;
  kryStatus: string;
  kryStatusEvaluasi?: number;
  fullName?: string;
}

export interface PageResponse<T> {
  success: boolean;
  data: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  message?: string;
}

export interface SingleResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface DeleteResponse {
  success: boolean;
  message?: string;
}

export interface DtoResponse<T> {
  code: number;
  message: string;
  data: T;
}

// Model untuk dropdown
export interface Divisi {
  divId: number;
  divJudul: string;
  divNama: string;
  divStatus: string;
}

export interface Departemen {
  depId: number;
  depJudul: string;
  depNama: string;
  divId: number;
  divNama?: string;
  depStatus: string;
}

export interface Seksi {
  sekId: number;
  sekJudul: string;
  sekNama: string;
  depId: number;
  depNama?: string;
  sekStatus: string;
}

export interface Jabatan {
  jbnId: number;
  jbnKode: string;
  jbnNama: string;
  jbnLevelJabatan: number;
  jbnStatus: number;
  jbnStatusText?: string;
}
