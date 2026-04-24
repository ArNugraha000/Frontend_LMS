import { Component, OnInit } from "@angular/core";
import { KursusService } from "../../Service/kursus.service";
import { Kursus } from "../../models/kursus.model";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "icons-cmp",
  templateUrl: "./training.component.html",
  styleUrls: ["./training.component.css"],
})
export class TrainingComponent implements OnInit {
  filteredData: Kursus[] = [];
  pagedData: Kursus[] = [];

  searchText: string = "";

  currentPage: number = 1;
  totalPages: number = 1;
  pageSizeOptions: number[] = [2, 3, 5, 10];
  pageSize: number = 5;

  // ===== MODAL KONFIRMASI =====
  showDeleteModal: boolean = false;
  deleteId: number | null = null;
  deleteItemName: string = "";

  constructor(
    private kursusService: KursusService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    console.log("TrainingComponent Loaded");
    this.loadKursus();
  }

  loadKursus() {
    // Panggil getUnpublished() karena krsStatus = 2 (Draft)
    this.kursusService.getUnpublished().subscribe({
      next: (res: any) => {
        console.log("FULL RESPONSE API:", res);

        let data = [];
        if (res && res.status === 200) {
          data = res.data || [];
        } else if (res && Array.isArray(res)) {
          data = res;
        } else if (res && res.data) {
          data = res.data;
        } else {
          data = [];
        }

        // Data yang muncul adalah yang krsStatus = 2 (Unpublished/Draft)
        this.filteredData = data;
        console.log("DATA KURSUS (Unpublished/Draft):", this.filteredData);
        this.updatePagination();
      },
      error: (err) => {
        console.error("ERROR API:", err);
        this.showErrorModal(
          "Gagal Memuat Data",
          "Terjadi kesalahan saat memuat data pelatihan",
        );
      },
    });
  }

  updatePagination() {
    let data = this.filteredData;

    if (this.searchText) {
      const lower = this.searchText.toLowerCase();
      data = this.filteredData.filter((item) =>
        item.krsNama?.toLowerCase().includes(lower),
      );
    }

    this.totalPages = Math.ceil(data.length / this.pageSize) || 1;

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedData = data.slice(start, end);
  }

  onSearch() {
    this.currentPage = 1;
    this.updatePagination();
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.updatePagination();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  // ========== MODAL KONFIRMASI HAPUS ==========
  openDeleteModal(id: number, nama: string) {
    this.deleteId = id;
    this.deleteItemName = nama;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.deleteId = null;
    this.deleteItemName = "";
  }

  confirmDelete() {
    if (this.deleteId) {
      this.kursusService.delete(this.deleteId, "admin").subscribe({
        next: (res: any) => {
          if (res && res.status === 200) {
            this.closeDeleteModal();
            this.showSuccessModal(
              "Terhapus!",
              "Data pelatihan berhasil dihapus",
            );
            this.loadKursus();
          } else {
            this.showErrorModal(
              "Gagal!",
              res?.message || "Gagal menghapus data",
            );
          }
        },
        error: (err) => {
          console.error(err);
          this.showErrorModal(
            "Error!",
            "Terjadi kesalahan saat menghapus data",
          );
        },
      });
    }
  }

  deleteKursus(id: number, nama: string) {
    this.openDeleteModal(id, nama);
  }

  // ========== MODAL ALERT CUSTOM ==========
  showSuccessModal(title: string, message: string) {
    // Gunakan SweetAlert2 untuk success (toast style)
    Swal.fire({
      icon: "success",
      title: title,
      text: message,
      timer: 1500,
      showConfirmButton: false,
      background: "#fff",
    });
  }

  showErrorModal(title: string, message: string) {
    // Gunakan modal custom untuk error
    Swal.fire({
      icon: "error",
      title: title,
      text: message,
      confirmButtonColor: "#ba0403",
      confirmButtonText: "OK",
      background: "#fff",
    });
  }

  showWarningModal(title: string, message: string) {
    Swal.fire({
      icon: "warning",
      title: title,
      text: message,
      confirmButtonColor: "#ba0403",
      confirmButtonText: "OK",
      background: "#fff",
    });
  }

  // ========== ACTIONS ==========
  isiKehadiran(item: Kursus) {
    console.log("Isi Kehadiran:", item.krsNama);
    this.showSuccessModal("Info", `Isi kehadiran untuk ${item.krsNama}`);
  }

  lihatRiwayat(item: Kursus) {
    console.log("Riwayat:", item.krsNama);
    this.showSuccessModal("Info", `Riwayat pelatihan ${item.krsNama}`);
  }

  onLeftClick(): void {
    console.log("Mulai kursus");
    this.router.navigate(["/mytraining"]);
  }

  onMiddleClick(): void {
    console.log("Profil saya");
    this.router.navigate(["/profile"]);
  }

  goTo(menu: string) {
    switch (menu) {
      case "profil":
        this.router.navigate(["/profile"]);
        break;
      case "beranda":
        this.router.navigate(["/dashboard"]);
        break;
      case "materi":
        this.router.navigate(["/materi"]);
        break;
      case "pelatihan":
        this.router.navigate(["/manage-training"]);
        break;
      default:
        console.log("Menu tidak dikenali:", menu);
    }
  }
}
