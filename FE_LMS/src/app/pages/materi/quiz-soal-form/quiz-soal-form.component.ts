import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { QuizSoalService } from "../../../Service/quizMateriService/quiz-soal.service";
import { QuizPilihanService } from "../../../Service/quizMateriService/quiz-pilihan.service";
import { MateriService } from "../../../Service/materi.service";
import {
  QuizSoal,
  QuizSoalDetail,
} from "../../../models/quizMateriModel/quiz-soal.model";
import { QuizPilihan } from "../../../models/quizMateriModel/quiz-pilihan.model";
import Swal from "sweetalert2";

@Component({
  selector: "app-quiz-soal-form",
  templateUrl: "./quiz-soal-form.component.html",
  styleUrls: ["./quiz-soal-form.component.css"],
})
export class QuizSoalFormComponent implements OnInit {
  materiId: number = 0;
  soalId: number | null = null;
  isEditMode = false;
  materiInfo: any = null;

  soal: QuizSoal = {
    mqsMtrId: 0,
    mqsJenis: "QUIZ",
    mqsNomorSoal: 1,
    mqsTeksSoal: "",
    mqsJawabanBenar: "A",
    mqsPoin: 10,
    mqsCreatedBy: "ADMIN",
  };

  pilihanList: QuizPilihan[] = [
    { qqpKodePilihan: "A", qqpTeksPilihan: "", qqpUrutan: 1 },
    { qqpKodePilihan: "B", qqpTeksPilihan: "", qqpUrutan: 2 },
  ];
  maxPilihan = 6;

  // ✅ Opsi jenis soal
  jenisSoalOptions = [
    { value: "QUIZ", label: "Quiz" },
    { value: "PRETEST", label: "Pre-Test" },
    { value: "POSTTEST", label: "Post-Test" },
  ];

  // ✅ Flag untuk lock dropdown
  isJenisDisabled: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizSoalService: QuizSoalService,
    private quizPilihanService: QuizPilihanService,
    private materiService: MateriService,
  ) {}

  ngOnInit(): void {
    // Ambil materiId dari URL (parameter pertama)
    const materiIdParam = this.route.snapshot.paramMap.get("materiId");
    this.materiId = materiIdParam ? +materiIdParam : 0;

    // Ambil soalId dari URL (parameter kedua, optional)
    const soalIdParam = this.route.snapshot.paramMap.get("soalId");

    console.log("materiId:", this.materiId);
    console.log("soalIdParam:", soalIdParam);

    if (this.materiId <= 0) {
      Swal.fire("Error", "ID materi tidak valid", "error");
      this.router.navigate(["/materi"]);
      return;
    }

    this.soal.mqsMtrId = this.materiId;

    // Cek apakah mode edit (ada soalId)
    if (soalIdParam && soalIdParam !== "new") {
      this.soalId = +soalIdParam;
      this.isEditMode = true;
      console.log("Mode EDIT, soalId:", this.soalId);
      this.loadSoalAndPilihan();
    } else {
      console.log("Mode CREATE baru");
    }

    this.loadMateriInfo();
  }

  loadMateriInfo(): void {
    this.materiService.getById(this.materiId).subscribe({
      next: (res) => {
        // ✅ Karena response langsung object materi
        this.materiInfo = res;

        // Ambil jenis materi (case insensitive, trim, hapus spasi)
        let jenisMateri = this.materiInfo?.jenisMateri?.toLowerCase().trim();
        jenisMateri = jenisMateri?.replace(/\s/g, "");

        console.log("Jenis Materi (clean):", jenisMateri);

        // Tentukan jenis soal berdasarkan jenis materi
        if (jenisMateri === "pretest") {
          this.soal.mqsJenis = "PRETEST";
        } else if (jenisMateri === "posttest") {
          this.soal.mqsJenis = "POSTTEST";
        } else {
          this.soal.mqsJenis = "QUIZ";
        }

        // Dropdown selalu disabled
        this.isJenisDisabled = true;

        console.log("Jenis Soal ditentukan:", this.soal.mqsJenis);
      },
      error: (err) => console.error(err),
    });
  }

  kembali(): void {
    this.router.navigate(["/quiz-list", this.materiId]);
  }

  loadSoalAndPilihan(): void {
    if (!this.soalId) {
      console.error("soalId tidak ada");
      Swal.fire("Error", "ID Soal tidak ditemukan", "error");
      return;
    }

    console.log("Memuat soal dengan ID:", this.soalId);

    this.quizSoalService.getSoalWithPilihan(this.soalId).subscribe({
      next: (res) => {
        console.log("Response getSoalWithPilihan:", res);

        if (res.success && res.data) {
          const data = res.data;

          this.soal = {
            mqsId: data.mqsId || data.soal?.mqsId,
            mqsMtrId: data.mqsMtrId || data.soal?.mqsMtrId || this.materiId,
            mqsNomorSoal: data.mqsNomorSoal || data.soal?.mqsNomorSoal || 1,
            mqsTeksSoal: data.mqsTeksSoal || data.soal?.mqsTeksSoal || "",
            mqsJawabanBenar:
              data.mqsJawabanBenar || data.soal?.mqsJawabanBenar || "A",
            mqsPoin: data.mqsPoin || data.soal?.mqsPoin || 10,
            mqsCreatedBy:
              data.mqsCreatedBy || data.soal?.mqsCreatedBy || "ADMIN",
          };

          this.pilihanList = data.pilihanList || data.soal?.pilihanList || [];

          if (this.pilihanList.length === 0) {
            this.pilihanList = [
              { qqpKodePilihan: "A", qqpTeksPilihan: "", qqpUrutan: 1 },
              { qqpKodePilihan: "B", qqpTeksPilihan: "", qqpUrutan: 2 },
            ];
          } else {
            this.pilihanList.sort(
              (a, b) => (a.qqpUrutan || 0) - (b.qqpUrutan || 0),
            );
          }

          this.isJenisDisabled = true;

          console.log("Soal loaded:", this.soal);
          console.log("Pilihan list:", this.pilihanList);
        } else {
          Swal.fire("Error", res.message || "Gagal memuat data soal", "error");
        }
      },
      error: (err) => {
        console.error(err);
        Swal.fire("Error", "Gagal memuat data soal: " + err.message, "error");
      },
    });
  }

  tambahPilihan(): void {
    if (this.pilihanList.length >= this.maxPilihan) {
      Swal.fire("Peringatan", `Maksimal ${this.maxPilihan} pilihan`, "warning");
      return;
    }
    const newKode = String.fromCharCode(65 + this.pilihanList.length);
    const newUrutan = this.pilihanList.length + 1;
    this.pilihanList.push({
      qqpKodePilihan: newKode,
      qqpTeksPilihan: "",
      qqpUrutan: newUrutan,
    });
  }

  hapusPilihan(index: number): void {
    if (this.pilihanList.length <= 2) {
      Swal.fire("Peringatan", "Minimal 2 pilihan jawaban", "warning");
      return;
    }
    this.pilihanList.splice(index, 1);
    this.pilihanList.forEach((p, idx) => {
      p.qqpUrutan = idx + 1;
      p.qqpKodePilihan = String.fromCharCode(65 + idx);
    });
  }

  simpan(): void {
    if (!this.soal.mqsTeksSoal?.trim()) {
      Swal.fire("Error", "Teks soal wajib diisi", "error");
      return;
    }
    if (this.pilihanList.some((p) => !p.qqpTeksPilihan?.trim())) {
      Swal.fire("Error", "Semua pilihan jawaban harus diisi", "error");
      return;
    }
    if (!this.soal.mqsJawabanBenar) {
      Swal.fire("Error", "Pilih jawaban yang benar", "error");
      return;
    }

    // ✅ PASTIKAN: Untuk mode edit, soal.mqsId harus terisi
    if (this.isEditMode && !this.soal.mqsId) {
      Swal.fire("Error", "ID Soal tidak ditemukan", "error");
      return;
    }

    // ✅ Buat object yang akan dikirim ke API
    const soalToSave = {
      mqsId: this.isEditMode ? this.soal.mqsId : null, // Edit: pakai ID, Create: null
      mqsMtrId: this.soal.mqsMtrId,
      mqsNomorSoal: this.soal.mqsNomorSoal,
      mqsTeksSoal: this.soal.mqsTeksSoal,
      mqsJawabanBenar: this.soal.mqsJawabanBenar,
      mqsPoin: this.soal.mqsPoin,
      mqsCreatedBy: this.soal.mqsCreatedBy || "ADMIN",
    };

    const request = this.isEditMode
      ? this.quizSoalService.updateSoal(soalToSave)
      : this.quizSoalService.createSoal(soalToSave);

    request.subscribe({
      next: (res: any) => {
        if (res.success) {
          let savedSoalId: number;

          if (this.isEditMode) {
            savedSoalId = this.soal.mqsId!;
          } else {
            savedSoalId = res.data?.mqsId || res.data?.id;
          }

          if (!savedSoalId) {
            Swal.fire("Error", "Gagal mendapatkan ID soal", "error");
            return;
          }

          // ✅ KIRIM HANYA DATA YANG DIPERLUKAN
          const pilihanToSave = this.pilihanList.map((p) => ({
            qqpKodePilihan: p.qqpKodePilihan,
            qqpTeksPilihan: p.qqpTeksPilihan,
            qqpUrutan: p.qqpUrutan,
            qqpCreatedBy: "ADMIN",
            // ❌ JANGAN kirim: qqpId, qqpMqsId, qqpCreatedDate, qqpModifDate, qqpModifBy
          }));

          this.quizPilihanService
            .saveAllPilihan(savedSoalId, pilihanToSave)
            .subscribe({
              next: () => {
                Swal.fire(
                  "Sukses",
                  "Soal dan pilihan berhasil disimpan",
                  "success",
                );
                this.router.navigate(["/quiz-list", this.materiId]);
              },
              error: (err) => {
                Swal.fire(
                  "Error",
                  "Gagal simpan pilihan: " + err.message,
                  "error",
                );
              },
            });
        }
      },
    });
  }

  batal(): void {
    this.router.navigate(["/quiz-list", this.materiId]);
  }
}
