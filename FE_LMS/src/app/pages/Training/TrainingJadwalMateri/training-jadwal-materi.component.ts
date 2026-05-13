import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { KehadiranPertemuanService } from "../../../Service/kehadiran-pertemuan.service";
import { TglAksesMateriService } from "../../../Service/tgl-akses-materi.service";
import { MateriService } from "../../../Service/materi.service";
import { DetailTrainingService } from "../../../Service/detailTrainingService/detail-training.service";
import { PelatihanBatchService } from "../../../Service/trainingBatch.service";
import { KursusService } from "../../../Service/kursus.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-manage-training-jadwal-materi",
  templateUrl: "./training-jadwal-materi.component.html",
  styleUrls: ["./training-jadwal-materi.component.css"],
})
export class TrainingJadwalmateriComponent implements OnInit {
  plbId!: number;
  krsId!: number;
  batchName: string = "";
  kursusNama: string = "";
  courseImageUrl: string = "";
  pertemuanList: any[] = [];
  allMateri: any[] = [];
  availableMateri: any[] = [];
  usedMateriIds: Set<number> = new Set();

  // Statistics
  totalMateriCount: number = 0;
  videoCount: number = 0;
  quizCount: number = 0;
  // Tambahan untuk statistik jenis materi lainnya (opsional)
  pdfCount: number = 0;
  pptCount: number = 0;
  paragrafCount: number = 0;
  linkCount: number = 0;
  pretestCount: number = 0;
  posttestCount: number = 0;

  // Modal states
  showPertemuanModal = false;
  showMateriModal = false;
  showDeleteModal = false;
  showPilihMateriModal = false;
  mode: "add" | "edit" = "add";
  deleteTarget: any = null;

  selectedPertemuan: any = {
    kptId: null,
    kptNama: "",
    kptTglAksesMulai: "",
    kptTglAksesSelesai: "",
    nomorPertemuan: null,
  };

  tempMateriList: any[] = [];
  loading: boolean = false;

  // Validation
  isPertemuanDatesValid: boolean = true;
  isMateriDatesValid: boolean = true;
  dateErrorMsg: string = "";
  dateOverlapError: string = "";
  conflictingMeeting: any = null;
  showValidation: boolean = false;

  // Untuk custom pilih materi modal
  searchMateriText: string = "";
  filteredAvailableMateri: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pertemuanService: KehadiranPertemuanService,
    private tglAksesMateriService: TglAksesMateriService,
    private materiService: MateriService,
    private detailService: DetailTrainingService,
    private pelatihanBatchService: PelatihanBatchService,
    private kursusService: KursusService,
  ) {}

  // Method untuk mendapatkan icon (8 jenis sesuai permintaan)
  getIcon(jenis: string): string {
    switch (jenis?.toLowerCase()) {
      case "video":
        return "bi bi-camera-video";
      case "quiz":
        return "bi bi-chat-left-text";
      case "pdf":
        return "bi bi-file-earmark-pdf";
      case "ppt":
        return "bi bi-file-earmark-ppt";
      case "paragraf":
        return "bi bi-book";
      case "link":
        return "bi bi-code-slash";
      case "pretest":
        return "bi bi-link-45deg";
      case "posttest":
        return "bi bi-link-45deg";
      default:
        return "bi bi-file-earmark";
    }
  }

  // Method untuk update statistics - menghitung 8 jenis materi
  updateStatistics() {
    // Reset semua counter
    this.totalMateriCount = 0;
    this.videoCount = 0;
    this.quizCount = 0;
    this.pdfCount = 0;
    this.pptCount = 0;
    this.paragrafCount = 0;
    this.linkCount = 0;
    this.pretestCount = 0;
    this.posttestCount = 0;

    // Looping semua pertemuan dan materi
    this.pertemuanList.forEach((pertemuan) => {
      if (pertemuan.materiList && Array.isArray(pertemuan.materiList)) {
        this.totalMateriCount += pertemuan.materiList.length;

        pertemuan.materiList.forEach((materi: any) => {
          const jenisMateri = materi.jenisMateri?.toLowerCase();

          // Hitung berdasarkan 8 jenis materi
          switch (jenisMateri) {
            case "video":
              this.videoCount++;
              break;
            case "quiz":
              this.quizCount++;
              break;
            case "pdf":
              this.pdfCount++;
              break;
            case "ppt":
              this.pptCount++;
              break;
            case "paragraf":
              this.paragrafCount++;
              break;
            case "link":
              this.linkCount++;
              break;
            case "pretest":
              this.pretestCount++;
              break;
            case "posttest":
              this.posttestCount++;
              break;
            default:
              // Jenis lain tidak dihitung
              console.log("Jenis materi tidak dikenal:", materi.jenisMateri);
              break;
          }
        });
      }
    });

    // Debug: tampilkan hasil perhitungan
    console.log("📊 STATISTIK MATERI:", {
      Total: this.totalMateriCount,
      "🎬 Video": this.videoCount,
      "📝 Quiz": this.quizCount,
      "📄 PDF": this.pdfCount,
      "📊 PPT": this.pptCount,
      "📖 Paragraf": this.paragrafCount,
      "🔗 Link": this.linkCount,
      "📋 Pretest": this.pretestCount,
      "📋 Posttest": this.posttestCount,
    });
  }

  // Method untuk mendapatkan class warna badge
  getBadgeClass(jenis: string): string {
    switch (jenis?.toLowerCase()) {
      case "quiz":
        return "badge-quiz";
      case "pdf":
        return "badge-pdf";
      case "ppt":
        return "badge-ppt";
      case "paragraf":
        return "badge-paragraf";
      case "video":
        return "badge-video";
      case "link":
        return "badge-link";
      case "pretest":
      case "posttest":
        return "badge-test";
      default:
        return "badge-default";
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.plbId = +params["plbId"];
      this.krsId = +params["krsId"];

      if (!this.plbId && params["plb_id"]) {
        this.plbId = +params["plb_id"];
      }
      if (!this.krsId && params["krs_id"]) {
        this.krsId = +params["krs_id"];
      }

      const navigation = this.router.getCurrentNavigation();
      const state = navigation?.extras.state as any;
      if (state) {
        this.batchName = state.batchName || "";
      }

      if (!this.plbId || !this.krsId) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Data pelatihan tidak lengkap!",
          confirmButtonText: "OK",
        }).then(() => {
          this.router.navigate(["/manage-training"]);
        });
        return;
      }

      this.loadCourseInfo();
      this.loadData();
    });
  }

  get nextPertemuanNumber(): number {
    return this.pertemuanList.length + 1;
  }

  getNomorPertemuan(pertemuan: any): string {
    return pertemuan.kptNama || "?";
  }

  // Method untuk cek apakah form valid
  isFormValid(): boolean {
    if (!this.selectedPertemuan.kptNama) return false;
    if (!this.selectedPertemuan.kptTglAksesMulai) return false;
    if (!this.selectedPertemuan.kptTglAksesSelesai) return false;
    if (!this.isPertemuanDatesValid || this.dateOverlapError) return false;
    return true;
  }

  loadCourseInfo() {
    this.kursusService.getById(this.krsId).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.kursusNama = res.data.krsNama || "Pelatihan";
          this.courseImageUrl =
            res.data.krsGambar || "assets/default-course.jpg";
        }
      },
      error: (err) => {
        console.error("Error loading course info:", err);
        this.kursusNama = "Pelatihan";
      },
    });
  }

  loadData() {
    this.loading = true;
    this.loadPertemuan();
    this.loadMateriFromDetailPelatihan();
  }

  loadPertemuan() {
    console.log("Loading pertemuan for plbId:", this.plbId);

    this.pertemuanService.getByPlbId(this.plbId).subscribe({
      next: (res: any) => {
        console.log("RESPONSE API PERTEMUAN:", res);

        if (res && res.status === "success") {
          let data = res.data || [];
          data = data.filter((item: any) => item.kptStatus === 0);

          this.pertemuanList = data.map((item: any) => ({
            ...item,
            nomorPertemuan: item.kptNama,
            kptNama: item.kptNama?.toString() || "",
          }));

          this.pertemuanList.sort((a, b) => {
            return (
              (parseInt(a.nomorPertemuan) || 0) -
              (parseInt(b.nomorPertemuan) || 0)
            );
          });

          this.usedMateriIds.clear();

          // Load materi untuk setiap pertemuan
          const loadPromises = this.pertemuanList.map((pertemuan) => {
            return new Promise((resolve) => {
              this.loadMateriForPertemuan(pertemuan, () => {
                resolve(true);
              });
            });
          });

          // Tunggu semua materi selesai di-load baru update statistics
          Promise.all(loadPromises).then(() => {
            this.updateStatistics();
            this.loading = false;
          });
        } else {
          this.pertemuanList = [];
          this.loading = false;
        }
      },
      error: (err) => {
        console.error("ERROR LOAD PERTEMUAN DETAIL:", err);
        this.loading = false;
        Swal.fire("Error", "Gagal memuat data pertemuan!", "error");
      },
    });
  }

  // PERBAIKAN: Tambahkan callback untuk menunggu loading selesai
  loadMateriForPertemuan(pertemuan: any, callback?: () => void) {
    this.tglAksesMateriService.getByKptId(pertemuan.kptId).subscribe({
      next: (res: any) => {
        if (res.status === "success") {
          const materiList = res.data || [];
          pertemuan.materiList = materiList.map((item: any) => ({
            ...item,
            checked: false,
            tamTglAksesMulaiInput: item.tamTglAksesMulai
              ? this.formatDateTimeForInput(item.tamTglAksesMulai)
              : "",
            tamTglAksesSelesaiInput: item.tamTglAksesSelesai
              ? this.formatDateTimeForInput(item.tamTglAksesSelesai)
              : "",
          }));

          materiList.forEach((item: any) => {
            this.usedMateriIds.add(item.tamMtrId);
          });
        } else {
          pertemuan.materiList = [];
        }

        if (callback) callback();
      },
      error: (err) => {
        console.error(err);
        pertemuan.materiList = [];
        if (callback) callback();
      },
    });
  }

  loadMateriFromDetailPelatihan() {
    this.detailService.getByKursus(this.krsId).subscribe({
      next: (detailList: any) => {
        const materiIds = detailList.map((d: any) => d.idMateri);

        this.materiService.getAll().subscribe({
          next: (allMateri: any) => {
            this.allMateri = allMateri;
            this.availableMateri = allMateri.filter(
              (m: any) =>
                materiIds.includes(m.id) && !this.usedMateriIds.has(m.id),
            );
          },
          error: (err) => {
            console.error(err);
          },
        });
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  validatePertemuanDates() {
    this.dateOverlapError = "";
    this.conflictingMeeting = null;
    this.isPertemuanDatesValid = true;

    const start = this.selectedPertemuan.kptTglAksesMulai;
    const end = this.selectedPertemuan.kptTglAksesSelesai;

    if (!start || !end) {
      this.isPertemuanDatesValid = false;
      return;
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (startDate >= endDate) {
      this.isPertemuanDatesValid = false;
      this.dateOverlapError = "Tanggal selesai harus setelah tanggal mulai!";
      return;
    }

    for (const pertemuan of this.pertemuanList) {
      if (
        this.mode === "edit" &&
        pertemuan.kptId === this.selectedPertemuan.kptId
      ) {
        continue;
      }

      const existingStart = new Date(pertemuan.kptTglAksesMulai);
      const existingEnd = new Date(pertemuan.kptTglAksesSelesai);
      const isOverlap = startDate < existingEnd && endDate > existingStart;

      if (isOverlap) {
        this.isPertemuanDatesValid = false;
        this.conflictingMeeting = pertemuan;
        const conflictStart = this.formatDate(pertemuan.kptTglAksesMulai);
        const conflictEnd = this.formatDate(pertemuan.kptTglAksesSelesai);
        this.dateOverlapError = `Overlap dengan Pertemuan ${pertemuan.nomorPertemuan} (${conflictStart} - ${conflictEnd})`;
        return;
      }
    }
  }

  isConflictWith(pertemuan: any): boolean {
    if (
      !this.selectedPertemuan.kptTglAksesMulai ||
      !this.selectedPertemuan.kptTglAksesSelesai
    ) {
      return false;
    }

    if (
      this.mode === "edit" &&
      pertemuan.kptId === this.selectedPertemuan.kptId
    ) {
      return false;
    }

    const startDate = new Date(this.selectedPertemuan.kptTglAksesMulai);
    const endDate = new Date(this.selectedPertemuan.kptTglAksesSelesai);
    const existingStart = new Date(pertemuan.kptTglAksesMulai);
    const existingEnd = new Date(pertemuan.kptTglAksesSelesai);

    return startDate < existingEnd && endDate > existingStart;
  }

  validateMateriDate(materi: any) {
    materi.dateError = "";

    const materiStart = materi.tamTglAksesMulai;
    const materiEnd = materi.tamTglAksesSelesai;
    const pertemuanStart = this.selectedPertemuan.kptTglAksesMulai;
    const pertemuanEnd = this.selectedPertemuan.kptTglAksesSelesai;

    if (!materiStart && !materiEnd) {
      return;
    }

    if (materiStart && materiEnd) {
      const mStart = new Date(materiStart);
      const mEnd = new Date(materiEnd);
      const pStart = new Date(pertemuanStart);
      const pEnd = new Date(pertemuanEnd);

      if (mStart >= mEnd) {
        materi.dateError = "Tanggal selesai harus setelah tanggal mulai";
        this.isMateriDatesValid = false;
        return;
      }

      if (mStart < pStart || mStart > pEnd) {
        materi.dateError = `Mulai harus dalam rentang (${this.formatDate(pertemuanStart)} - ${this.formatDate(pertemuanEnd)})`;
        this.isMateriDatesValid = false;
        return;
      }

      if (mEnd < pStart || mEnd > pEnd) {
        materi.dateError = `Selesai harus dalam rentang (${this.formatDate(pertemuanStart)} - ${this.formatDate(pertemuanEnd)})`;
        this.isMateriDatesValid = false;
        return;
      }
    }

    this.isMateriDatesValid = !this.tempMateriList.some((m) => m.dateError);
  }

  getMinMateriDate(): string {
    return this.selectedPertemuan.kptTglAksesMulai || "";
  }

  getMaxMateriDate(): string {
    return this.selectedPertemuan.kptTglAksesSelesai || "";
  }

  openPertemuanModal(pertemuan?: any) {
    this.showValidation = false;
    this.dateOverlapError = "";

    if (pertemuan) {
      this.mode = "edit";
      this.selectedPertemuan = {
        ...pertemuan,
        kptTglAksesMulai: pertemuan.kptTglAksesMulai
          ? this.formatDateTimeForInput(pertemuan.kptTglAksesMulai)
          : "",
        kptTglAksesSelesai: pertemuan.kptTglAksesSelesai
          ? this.formatDateTimeForInput(pertemuan.kptTglAksesSelesai)
          : "",
      };
    } else {
      this.mode = "add";
      this.selectedPertemuan = {
        kptId: null,
        kptNama: this.nextPertemuanNumber.toString(),
        kptTglAksesMulai: "",
        kptTglAksesSelesai: "",
      };
    }
    this.isPertemuanDatesValid = true;
    this.showPertemuanModal = true;
  }

  closePertemuanModal() {
    this.showPertemuanModal = false;
  }

  savePertemuan() {
    this.showValidation = true;

    if (!this.isFormValid()) {
      let errorMessage = "Harap lengkapi data berikut:\n";
      if (!this.selectedPertemuan.kptNama) errorMessage += "- Nama pertemuan\n";
      if (!this.selectedPertemuan.kptTglAksesMulai)
        errorMessage += "- Tanggal mulai akses\n";
      if (!this.selectedPertemuan.kptTglAksesSelesai)
        errorMessage += "- Tanggal selesai akses\n";
      if (this.dateOverlapError) errorMessage += `- ${this.dateOverlapError}\n`;

      Swal.fire("Warning", errorMessage, "warning");
      return;
    }

    const request = {
      kptNama: this.selectedPertemuan.kptNama,
      kptPlbId: this.plbId,
      kptTglAksesMulai: this.selectedPertemuan.kptTglAksesMulai,
      kptTglAksesSelesai: this.selectedPertemuan.kptTglAksesSelesai,
      kptStatus: 0,
      user: "admin",
    };

    this.loading = true;

    if (this.mode === "add") {
      this.pertemuanService.create(request).subscribe({
        next: () => {
          Swal.fire("Success", "Pertemuan berhasil dibuat!", "success");
          this.closePertemuanModal();
          this.loadPertemuan();
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          Swal.fire(
            "Error",
            err.error?.message || "Gagal membuat pertemuan!",
            "error",
          );
        },
      });
    } else {
      this.pertemuanService
        .update(this.selectedPertemuan.kptId, request)
        .subscribe({
          next: () => {
            Swal.fire("Success", "Pertemuan berhasil diupdate!", "success");
            this.closePertemuanModal();
            this.loadPertemuan();
            this.loading = false;
          },
          error: (err) => {
            this.loading = false;
            Swal.fire(
              "Error",
              err.error?.message || "Gagal update pertemuan!",
              "error",
            );
          },
        });
    }
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.deleteTarget = null;
  }

  openMateriModal(pertemuan: any) {
    this.selectedPertemuan = pertemuan;
    this.tempMateriList = [];
    this.isMateriDatesValid = true;

    if (pertemuan.materiList && pertemuan.materiList.length > 0) {
      this.tempMateriList = pertemuan.materiList.map((m: any) => ({
        tamId: m.tamId,
        tamMtrId: m.tamMtrId,
        judulMateri: m.judulMateri,
        jenisMateri: m.jenisMateri,
        tamTglAksesMulai: m.tamTglAksesMulaiInput || "",
        tamTglAksesSelesai: m.tamTglAksesSelesaiInput || "",
        isExisting: true,
        dateError: "",
      }));
    }

    this.showMateriModal = true;
  }

  closeMateriModal() {
    this.showMateriModal = false;
    this.tempMateriList = [];
    this.isMateriDatesValid = true;
  }

  addMateriToTemp() {
    const existingTempIds = this.tempMateriList.map((m) => m.tamMtrId);
    const available = this.availableMateri.filter(
      (m) => !existingTempIds.includes(m.id),
    );

    if (available.length === 0) {
      Swal.fire("Info", "Semua materi sudah ditambahkan ke jadwal!", "info");
      return;
    }

    this.searchMateriText = "";
    this.filteredAvailableMateri = available;
    this.showPilihMateriModal = true;
  }

  selectMateri(materi: any) {
    const alreadyInTemp = this.tempMateriList.some(
      (m) => m.tamMtrId === materi.id,
    );

    if (alreadyInTemp) {
      Swal.fire("Info", "Materi sudah ditambahkan!", "info");
      this.closePilihMateriModal();
      return;
    }

    this.tempMateriList.push({
      tamId: null,
      tamMtrId: materi.id,
      judulMateri: materi.judulMateri,
      jenisMateri: materi.jenisMateri,
      tamTglAksesMulai: "",
      tamTglAksesSelesai: "",
      isExisting: false,
      dateError: "",
    });

    this.closePilihMateriModal();

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: `${materi.judulMateri} ditambahkan ke jadwal`,
      timer: 1500,
      showConfirmButton: false,
    });
  }

  refreshAvailableMateriForCurrentPertemuan() {
    const existingTempIds = this.tempMateriList.map((m) => m.tamMtrId);
    const existingSavedIds = Array.from(this.usedMateriIds);
    const allUsedIds = [...existingTempIds, ...existingSavedIds];

    this.filteredAvailableMateri = this.availableMateri.filter(
      (m) => !allUsedIds.includes(m.id),
    );
  }

  closePilihMateriModal() {
    this.showPilihMateriModal = false;
    this.searchMateriText = "";
  }

  filterMateri() {
    const searchLower = this.searchMateriText.toLowerCase();
    const existingIds = this.tempMateriList.map((m) => m.tamMtrId);

    this.filteredAvailableMateri = this.availableMateri.filter(
      (m) =>
        !existingIds.includes(m.id) &&
        !this.usedMateriIds.has(m.id) &&
        (m.judulMateri?.toLowerCase().includes(searchLower) ||
          m.jenisMateri?.toLowerCase().includes(searchLower)),
    );
  }

  removeMateriFromTemp(index: number) {
    const materi = this.tempMateriList[index];

    Swal.fire({
      title: "Konfirmasi",
      text: `Hapus "${materi.judulMateri}" dari daftar jadwal?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        this.tempMateriList.splice(index, 1);
      }
    });
  }

  saveMateriSchedule() {
    if (this.tempMateriList.length === 0) {
      Swal.fire("Warning", "Minimal pilih satu materi!", "warning");
      return;
    }

    let hasError = false;
    for (const materi of this.tempMateriList) {
      this.validateMateriDate(materi);
      if (materi.dateError) {
        hasError = true;
      }
    }

    if (hasError) {
      Swal.fire(
        "Warning",
        "Ada materi dengan tanggal yang tidak valid!",
        "warning",
      );
      return;
    }

    const invalidItems = this.tempMateriList.filter(
      (m) => !m.tamTglAksesMulai || !m.tamTglAksesSelesai,
    );

    if (invalidItems.length > 0) {
      Swal.fire(
        "Warning",
        "Semua materi harus memiliki tanggal mulai dan selesai akses!",
        "warning",
      );
      return;
    }

    const request = {
      tamKptId: this.selectedPertemuan.kptId,
      materiList: this.tempMateriList.map((m) => ({
        tamMtrId: m.tamMtrId,
        tamTglAksesMulai: m.tamTglAksesMulai,
        tamTglAksesSelesai: m.tamTglAksesSelesai,
      })),
      user: "admin",
    };

    this.loading = true;

    this.tglAksesMateriService.save(request).subscribe({
      next: () => {
        this.tempMateriList.forEach((m) => {
          if (!m.isExisting) {
            this.usedMateriIds.add(m.tamMtrId);
          }
        });

        Swal.fire(
          "Success",
          "Jadwal akses materi berhasil disimpan!",
          "success",
        );
        this.closeMateriModal();
        this.loadPertemuan();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        Swal.fire(
          "Error",
          err.error?.message || "Gagal menyimpan jadwal!",
          "error",
        );
      },
    });
  }

  deleteMateriJadwal(tamId: number, pertemuan: any) {
    Swal.fire({
      title: "Konfirmasi Hapus",
      text: "Hapus materi ini dari pertemuan?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.tglAksesMateriService.delete(tamId).subscribe({
          next: () => {
            const deletedMateri = pertemuan.materiList?.find(
              (m: any) => m.tamId === tamId,
            );
            if (deletedMateri) {
              this.usedMateriIds.delete(deletedMateri.tamMtrId);
            }
            Swal.fire(
              "Deleted!",
              "Materi berhasil dihapus dari pertemuan!",
              "success",
            );
            this.loadMateriForPertemuan(pertemuan, () => {
              this.updateStatistics();
            });
            this.loading = false;
          },
          error: (err) => {
            this.loading = false;
            Swal.fire(
              "Error",
              err.error?.message || "Gagal hapus materi!",
              "error",
            );
          },
        });
      }
    });
  }

  formatDateTimeForInput(date: any): string {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 16);
  }

  formatDate(date: any): string {
    if (!date) return "-";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  goBack() {
    this.router.navigate(["/training"]);
  }

  confirmDeletePertemuan(pertemuan: any) {
    this.deleteTarget = pertemuan;
    this.showDeleteModal = true;
  }

  executeDelete() {
    if (!this.deleteTarget) return;

    this.loading = true;
    this.pertemuanService.toggleStatus(this.deleteTarget.kptId).subscribe({
      next: () => {
        const newStatus =
          this.deleteTarget.kptStatus === 0 ? "dinonaktifkan" : "diaktifkan";
        Swal.fire("Success!", `Pertemuan berhasil ${newStatus}!`, "success");
        this.showDeleteModal = false;
        this.deleteTarget = null;
        this.loadPertemuan();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        Swal.fire(
          "Error",
          err.error?.message || "Gagal mengubah status!",
          "error",
        );
      },
    });
  }
}
