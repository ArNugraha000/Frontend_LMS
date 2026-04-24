import { QuizPilihan } from "./quiz-pilihan.model";

export interface QuizSoal {
  mqsId?: number;
  mqsMtrId: number;
  mqsJenis?: string;
  mqsNomorSoal: number;
  mqsTeksSoal: string;
  mqsJawabanBenar: string; // kode pilihan (A, B, C, ...)
  mqsPoin: number;
  mqsCreatedBy?: string;
  pilihanList?: QuizPilihan[];
}

export interface QuizSoalDetail extends QuizSoal {
  pilihanList: QuizPilihan[];
  totalPoin?: number;
}
