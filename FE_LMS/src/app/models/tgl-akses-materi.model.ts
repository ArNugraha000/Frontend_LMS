export interface MateriItem {
  tamMtrId: number;
  tamTglAksesMulai?: string;
  tamTglAksesSelesai?: string;
}

export interface TglAksesMateriRequest {
  tamId?: number;
  // HAPUS baris ini -> tamPlbId: number;
  tamKptId: number;
  materiList: MateriItem[];
  user: string;
}

export interface TglAksesMateri {
  tamId?: number;
  // HAPUS baris ini -> tamPlbId: number;
  tamMtrId: number;
  tamKptId: number;
  tamUrutan: number;
  tamTglAksesMulai?: string;
  tamTglAksesSelesai?: string;
  tamCreateBy?: string;
  tamCreateDate?: Date | string;
  tamModifBy?: string;
  tamModifDate?: Date | string;
  judulMateri?: string;
  jenisMateri?: string;
  informasiMateri?: string;
  waktuMelihat?: number;
  checked?: boolean;
}
