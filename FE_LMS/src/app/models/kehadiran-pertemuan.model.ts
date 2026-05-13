export interface KehadiranPertemuan {
  kptId?: number;
  kptNama: string;
  kptTglAksesMulai?: Date | string | null;
  kptTglAksesSelesai?: Date | string | null;
  kptStatus?: number;
  kptCreateBy?: string;
  kptCreateDate?: Date;
  kptModifBy?: string;
  kptModifDate?: Date;
}

export interface KehadiranPertemuanRequest {
  kptId?: number;
  kptNama: string;
  kptTglAksesMulai?: Date | string | null;
  kptTglAksesSelesai?: Date | string | null;
  kptStatus?: number;
  user: string;
}

export interface KehadiranPertemuanResponse {
  status: string;
  data: KehadiranPertemuan[] | KehadiranPertemuan;
  message?: string;
}
