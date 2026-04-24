import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MateriService } from "../../Service/materi.service";
import { CookieService } from "ngx-cookie-service";
import Swal from "sweetalert2";

@Component({
  selector: "icons-cmp",
  templateUrl: "materi.component.html",
  styleUrls: ["./materi.component.css"],
})
export class MateriComponent implements OnInit {
  constructor(
    private router: Router,
    private service: MateriService,
    private cookies: CookieService,
  ) {}

  data: any[] = [];
  filteredData: any[] = [];
  pagedData: any[] = [];

  searchText: string = "";

  currentPage: number = 1;
  pageSize: number = 2;
  pageSizeOptions = [2, 5, 10];
  totalPages: number = 1;

  // ========== PROPERTIES UNTUK MODAL ==========
  showModal: boolean = false;
  isEditMode: boolean = false;
  editId: number | null = null;
  isSaving: boolean = false;

  // Form data
  formData: any = {
    judulMateri: "",
    jenisMateri: "pdf",
    isiMateri: "", // ← MATERI INTI (isi konten utama)
    informasiMateri: "", // ← INFORMASI TAMBAHAN (deskripsi, catatan)
    adaLink: "",
    waktuMelihat: 0,
    waktuQuiz: 0,
  };

  // Untuk file
  selectedFile: File | null = null;
  fileName: string = "";

  jenisMateriOptions = [
    { value: "pdf", label: "PDF" },
    { value: "ppt", label: "PPT" },
    { value: "video", label: "Video" },
    { value: "paragraf", label: "Paragraf" },
    { value: "link", label: "Link" },
    { value: "quiz", label: "Quiz" },
    { value: "pretest", label: "Pre-Test" },
    { value: "posttest", label: "Post-Test" },
  ];

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.service.getAll().subscribe((res) => {
      this.data = res.filter((x) => x.status === 0);
      this.filteredData = [...this.data];
      this.setupPagination();
    });
  }

  onSearch() {
    const val = this.searchText.toLowerCase();
    this.filteredData = this.data.filter(
      (x) =>
        x.judulMateri?.toLowerCase().includes(val) ||
        x.jenisMateri?.toLowerCase().includes(val),
    );
    this.currentPage = 1;
    this.setupPagination();
  }

  setupPagination() {
    this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);
    this.updatePagedData();
  }

  updatePagedData() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedData = this.filteredData.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedData();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedData();
    }
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.setupPagination();
  }

  // ========== MODAL METHODS ==========

  openCreateModal() {
    this.resetForm();
    this.isEditMode = false;
    this.editId = null;
    this.showModal = true;
  }

  openEditModal(item: any) {
    this.resetForm();
    this.isEditMode = true;
    this.editId = item.id;

    this.formData = {
      judulMateri: item.judulMateri,
      jenisMateri: item.jenisMateri,
      isiMateri: item.isiMateri || "",
      informasiMateri: item.informasiMateri || "",
      adaLink: item.adaLink || "",
      waktuMelihat: item.waktuMelihat || 0,
      waktuQuiz: item.waktuQuiz || 0, // ✅ Pastikan ini terisi
    };

    this.fileName = item.fileDokumen || "";
    this.selectedFile = null;

    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  resetForm() {
    this.formData = {
      judulMateri: "",
      jenisMateri: "pdf",
      isiMateri: "",
      informasiMateri: "",
      adaLink: "",
      waktuMelihat: 0,
      waktuQuiz: 0,
    };
    this.selectedFile = null;
    this.fileName = "";
    this.isEditMode = false;
    this.editId = null;
    this.isSaving = false;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileName = file.name;
    }
  }

  validateForm(): boolean {
    if (!this.formData.judulMateri || this.formData.judulMateri.trim() === "") {
      Swal.fire("Error", "Judul materi wajib diisi!", "error");
      return false;
    }

    // ✅ KASUS PRETEST / POSTTEST
    if (this.isTest(this.formData.jenisMateri)) {
      // waktuQuiz wajib diisi minimal 1 menit
      if (!this.formData.waktuQuiz || this.formData.waktuQuiz <= 0) {
        Swal.fire(
          "Error",
          `Durasi ${this.getTestLabel(this.formData.jenisMateri)} wajib diisi minimal 1 menit!`,
          "error",
        );
        return false;
      }
      // ✅ Set waktuMelihat = 0 untuk test (tidak digunakan)
      this.formData.waktuMelihat = 0;
    }
    // ✅ KASUS MATERI BIASA
    else {
      if (this.formData.waktuMelihat < 0) {
        Swal.fire(
          "Error",
          "Durasi melihat materi tidak boleh negatif!",
          "error",
        );
        return false;
      }
      if (this.formData.waktuQuiz < 0) {
        Swal.fire("Error", "Durasi quiz tidak boleh negatif!", "error");
        return false;
      }
    }

    return true;
  }

  saveMateri() {
    if (!this.validateForm()) {
      return;
    }

    this.isSaving = true;
    const userName = this.cookies.get("userName") || "SYSTEM";

    // ✅ PERBAIKAN: Kirim data sesuai dengan yang diterima backend
    const materiData = {
      judulMateri: this.formData.judulMateri,
      jenisMateri: this.formData.jenisMateri,
      isiMateri: this.formData.isiMateri || "",
      informasiMateri: this.formData.informasiMateri || "",
      adaLink: this.formData.adaLink || "",
      waktuMelihat: this.formData.waktuMelihat || 0,
      waktuQuiz: this.formData.waktuQuiz || 0,
    };

    console.log("Data dikirim ke backend:", materiData);
    console.log("File:", this.selectedFile);
    console.log("UserName:", userName);

    // ✅ File hanya untuk materi biasa (bukan test)
    const fileToUpload = this.isTest(this.formData.jenisMateri)
      ? null
      : this.selectedFile;

    if (this.isEditMode && this.editId) {
      this.service
        .update(this.editId, materiData, fileToUpload, userName)
        .subscribe({
          next: (response) => {
            console.log("Update response:", response);
            Swal.fire("Sukses!", "Materi berhasil diperbarui", "success");
            this.closeModal();
            this.loadData();
            this.isSaving = false;
          },
          error: (err) => {
            console.error("Update error:", err);
            Swal.fire(
              "Error!",
              "Gagal memperbarui materi: " +
                (err.error?.message || err.message),
              "error",
            );
            this.isSaving = false;
          },
        });
    } else {
      this.service.create(materiData, fileToUpload, userName).subscribe({
        next: (response) => {
          console.log("Create response:", response);
          Swal.fire("Sukses!", "Materi baru berhasil ditambahkan", "success");
          this.closeModal();
          this.loadData();
          this.isSaving = false;
        },
        error: (err) => {
          console.error("Create error:", err);
          Swal.fire(
            "Error!",
            "Gagal menambahkan materi: " + (err.error?.message || err.message),
            "error",
          );
          this.isSaving = false;
        },
      });
    }
  }

  delete(id: number, item: any) {
    const userName = this.cookies.get("userName") || "SYSTEM";

    Swal.fire({
      title: `Hapus materi "${item.judulMateri}"?`,
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      customClass: {
        confirmButton: "swal-confirm",
        cancelButton: "swal-cancel",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.delete(id, userName).subscribe({
          next: () => {
            Swal.fire("Terhapus!", "Materi berhasil dihapus", "success");
            this.loadData();
          },
          error: (err) => {
            console.error(err);
            Swal.fire("Error!", "Gagal menghapus materi", "error");
          },
        });
      }
    });
  }

  getFileUrl(file: string) {
    return this.service.getFile(file);
  }

  goTo(menu: string) {
    switch (menu) {
      case "profil":
        this.router.navigate(["/profile"]);
        break;
      case "beranda":
        this.router.navigate(["/dashboard"]);
        break;
      case "pelatihan":
        this.router.navigate(["/training"]);
        break;
      case "materi":
        this.openCreateModal();
        break;
    }
  }

  getIcon(jenis: string): string {
    switch (jenis?.toLowerCase()) {
      case "quiz":
        return "bi bi-chat-left-text";
      case "pdf":
        return "bi bi-file-earmark-pdf";
      case "ppt":
        return "bi bi-file-earmark-ppt";
      case "paragraf":
        return "bi bi-book";
      case "video":
        return "bi bi-camera-video";
      case "link":
        return "bi bi-code-slash";
      case "pretest":
      case "posttest":
        return "bi bi-link-45deg";
      default:
        return "bi bi-file-earmark";
    }
  }

  isTest(jenis: string): boolean {
    return ["pretest", "posttest"].includes(jenis?.toLowerCase());
  }

  getLabelTest(jenis: string): string {
    if (jenis?.toLowerCase() === "pretest") return "Pre-Test";
    if (jenis?.toLowerCase() === "posttest") return "Post-Test";
    return "Test";
  }

  formatWaktu(menit: number): string {
    if (!menit) return "0 Menit";
    const jam = Math.floor(menit / 60);
    const sisaMenit = menit % 60;
    if (jam > 0 && sisaMenit > 0) {
      return `${jam} Jam ${sisaMenit} Menit`;
    } else if (jam > 0) {
      return `${jam} Jam`;
    } else {
      return `${sisaMenit} Menit`;
    }
  }
  // Tambahkan di dalam class MateriComponent
  private scrollTimeout: any;

  // Method untuk handle scroll dengan smooth
  onModalScroll(event: any) {
    // Clear timeout sebelumnya
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    // Optional: tambahkan class untuk indikasi scroll
    this.scrollTimeout = setTimeout(() => {
      // Do something if needed
    }, 100);
  }

  // TAMBAHKAN method ini untuk mendapatkan label waktu yang dinamis
  getWaktuLabel(): string {
    if (this.isTest(this.formData.jenisMateri)) {
      const testLabel = this.getTestLabel(this.formData.jenisMateri);
      return `Waktu untuk menyelesaikan ${testLabel}`;
    }
    return "Waktu Melihat Materi";
  }

  // TAMBAHKAN method untuk mendapatkan label test
  getTestLabel(jenis: string): string {
    if (jenis?.toLowerCase() === "pretest") return "Pre-Test";
    if (jenis?.toLowerCase() === "posttest") return "Post-Test";
    return "Test";
  }

  // TAMBAHKAN method ini untuk cek apakah perlu menampilkan upload file
  showFileUpload(): boolean {
    return !this.isTest(this.formData.jenisMateri);
  }

  onJenisMateriChange() {
    if (this.isTest(this.formData.jenisMateri)) {
      // Reset waktuMelihat ke 0 (tidak digunakan)
      this.formData.waktuMelihat = 0;
      // Set default waktuQuiz = 60 jika kosong atau 0
      if (!this.formData.waktuQuiz || this.formData.waktuQuiz <= 0) {
        this.formData.waktuQuiz = 60;
      }
      // Reset file karena test tidak perlu file
      this.selectedFile = null;
      this.fileName = "";
    } else {
      // Reset waktuQuiz ke 0 untuk materi biasa (opsional)
      if (!this.formData.waktuQuiz) {
        this.formData.waktuQuiz = 0;
      }
    }
  }

  goToQuiz(materiId: number): void {
    if (materiId) {
      this.router.navigate(["/quiz-list", materiId]);
    } else {
      console.error("ID materi tidak valid");
    }
  }
}
