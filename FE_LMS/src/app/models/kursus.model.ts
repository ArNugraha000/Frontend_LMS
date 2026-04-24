export interface Kursus {
  krsId: number;
  krsNama: string;
  krsJenis: string;
  krsDeskripsi: string;
  krsSasaran: string;
  krsGambar: string;
  krsGambarUrl?: string;
  krsStatus: number;
  krsPublishStatus: number;
  krsCreateBy: string;
  krsCreateDate: string;
  krsModifBy: string;
  krsModifDate: string;
}
