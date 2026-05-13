// models/jabatan.model.ts
export interface Jabatan {
  jbnId?: number;
  jbnKode: string;
  jbnNama: string;
  jbnLevelJabatan?: number;
  jbnLevelText?: string;
  deskripsi?: string;
  jbnStatus?: number;
  jbnStatusText?: string;
  jbnCreateBy?: string;
  jbnCreateDate?: string;
  jbnModifBy?: string;
  jbnModifDate?: string;
}

export interface JabatanPageResponse {
  success: boolean;
  data: {
    content: Jabatan[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
  message?: string;
}

export interface JabatanListResponse {
  success: boolean;
  data: Jabatan[];
  message?: string;
}

export interface JabatanResponse {
  success: boolean;
  data: Jabatan;
  message?: string;
}

export interface JabatanDeleteResponse {
  success: boolean;
  message?: string;
}
