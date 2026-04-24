import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { QuizSoalService } from "../../../Service/quizMateriService/quiz-soal.service";
import { MateriService } from "../../../Service/materi.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-quiz-soal-list",
  templateUrl: "./quiz-soal-list.component.html",
  styleUrls: ["./quiz-soal-list.component.css"],
})
export class QuizSoalListComponent implements OnInit {
  materiId: number = 0;
  soalList: any[] = [];
  loading = false;
  materiInfo: any = null;
  totalPoin: number = 0;

  // Pagination
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  // Delete modal
  showDeleteModal: boolean = false;
  selectedSoalId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizSoalService: QuizSoalService,
    private materiService: MateriService,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get("materiId");
    this.materiId = idParam ? +idParam : 0;

    if (isNaN(this.materiId) || this.materiId <= 0) {
      Swal.fire("Error", "ID materi tidak valid", "error");
      this.router.navigate(["/materi"]);
      return;
    }

    this.loadMateriInfo();
    this.loadSoal();
  }

  loadMateriInfo(): void {
    console.log("Loading materi info for ID:", this.materiId);

    this.materiService.getById(this.materiId).subscribe({
      next: (res) => {
        console.log("Materi info response:", res);

        // ✅ Karena response langsung object materi (bukan wrapper)
        // Langsung assign ke materiInfo
        this.materiInfo = res;
        console.log("Materi info loaded:", this.materiInfo);
        console.log("Judul:", this.materiInfo?.judulMateri);
        console.log("Jenis:", this.materiInfo?.jenisMateri);
      },
      error: (err) => {
        console.error("Error loading materi info:", err);
        Swal.fire("Error", "Gagal memuat informasi materi", "error");
      },
    });
  }

  loadSoal(): void {
    this.loading = true;
    this.quizSoalService
      .getAllSoalWithPilihanByMateri(this.materiId)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.soalList = (res.data || []).map(
              (item: any) => item.soal || item,
            );
            // Hitung total poin
            this.totalPoin = this.soalList.reduce(
              (sum, soal) => sum + (soal.mqsPoin || 0),
              0,
            );
            this.setupPagination();
          } else {
            Swal.fire("Error", res.message || "Gagal memuat data", "error");
          }
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          Swal.fire("Error", "Gagal memuat data soal", "error");
          this.loading = false;
        },
      });
  }

  setupPagination() {
    this.totalPages = Math.ceil(this.soalList.length / this.pageSize);
  }

  get pagedData() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.soalList.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  kembaliKeMateri(): void {
    this.router.navigate(["/materi"]);
  }

  tambahSoal(): void {
    this.router.navigate(["/quiz-soal", this.materiId]);
  }

  editSoal(soalId: number): void {
    this.router.navigate(["/quiz-soal", this.materiId, soalId]);
  }

  hapusSoal(soalId: number): void {
    this.selectedSoalId = soalId;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedSoalId = null;
  }

  confirmDelete(): void {
    if (this.selectedSoalId) {
      this.quizSoalService.deleteSoal(this.selectedSoalId).subscribe({
        next: (res) => {
          if (res.success) {
            Swal.fire("Terhapus!", "Soal berhasil dihapus", "success");
            this.loadSoal();
          } else {
            Swal.fire("Error", res.message || "Gagal menghapus soal", "error");
          }
          this.closeDeleteModal();
        },
        error: (err) => {
          console.error(err);
          Swal.fire("Error", "Gagal menghapus soal", "error");
          this.closeDeleteModal();
        },
      });
    }
  }

  // ✅ Cek apakah materi adalah PRETEST atau POSTTEST
  isPretestOrPosttest(): boolean {
    if (!this.materiInfo?.jenisMateri) return false;
    const jenis = this.materiInfo.jenisMateri.toLowerCase().trim();
    return jenis === "pretest" || jenis === "posttest";
  }

  // ✅ Ambil label jenis materi (Pre-Test / Post-Test)
  getJenisMateriLabel(): string {
    if (!this.materiInfo?.jenisMateri) return "Test";
    const jenis = this.materiInfo.jenisMateri.toLowerCase().trim();
    if (jenis === "pretest") return "Pre-Test";
    if (jenis === "posttest") return "Post-Test";
    return "Test";
  }
  getBadgeClass(): string {
    const jenis = this.materiInfo?.jenisMateri?.toLowerCase();
    switch (jenis) {
      case "video":
        return "banner-badge video";
      case "pdf":
        return "banner-badge pdf";
      case "ppt":
        return "banner-badge ppt";
      case "quiz":
        return "banner-badge quiz";
      case "pretest":
        return "banner-badge pretest";
      case "posttest":
        return "banner-badge posttest";
      default:
        return "banner-badge";
    }
  }
}
