import { Component, OnInit } from "@angular/core";
import { PelatihanBatchService } from "../../Service/trainingBatch.service";
import { TrainingBatch } from "../../models/trainingBatch.model";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "icons-cmp",
  templateUrl: "./training.component.html",
  styleUrls: ["./training.component.css"],
})
export class TrainingComponent implements OnInit {
  filteredData: TrainingBatch[] = [];
  pagedData: TrainingBatch[] = [];

  searchText: string = "";

  currentPage: number = 1;
  totalPages: number = 1;
  pageSizeOptions: number[] = [2, 3, 5, 10];
  pageSize: number = 3;

  // ===== MODAL KONFIRMASI =====
  showDeleteModal: boolean = false;
  deleteId: number | null = null;
  deleteItemName: string = "";

  constructor(
    private pelatihanBatchService: PelatihanBatchService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    console.log("TrainingComponent Loaded");
    this.loadPelatihanBatch();
  }

  // ✅ PERBAIKAN: Load data dari API pelatihan-batch
  loadPelatihanBatch() {
    // Ambil semua batch dengan join (dapat nama kursus)
    this.pelatihanBatchService.getAllWithJoin(0, 100).subscribe({
      next: (res: any) => {
        console.log("FULL RESPONSE API:", res);

        let data: TrainingBatch[] = [];
        if (res && res.code === 200 && res.data) {
          // Jika response pakai DtoResponseL3
          if (res.data.content) {
            data = res.data.content;
          } else if (Array.isArray(res.data)) {
            data = res.data;
          } else {
            data = [];
          }
        } else if (res && Array.isArray(res)) {
          data = res;
        }

        this.filteredData = data;
        console.log("DATA PELATIHAN BATCH:", this.filteredData);
        this.updatePagination();
      },
      error: (err) => {
        console.error("ERROR API:", err);
        this.showErrorModal(
          "Gagal Memuat Data",
          "Terjadi kesalahan saat memuat data batch pelatihan",
        );
      },
    });
  }

  // ✅ Helper: Ambil teks status
  getStatusText(status: number): string {
    switch (status) {
      case 0:
        return "NONAKTIF";
      case 1:
        return "AKTIF";
      default:
        return "-";
    }
  }

  // ✅ Helper: Ambil class badge
  getStatusBadgeClass(status: number): string {
    return status === 1 ? "badge-success" : "badge-secondary";
  }

  updatePagination() {
    let data = this.filteredData;

    if (this.searchText) {
      const lower = this.searchText.toLowerCase();
      data = this.filteredData.filter(
        (item) =>
          item.plbNamaBatch?.toLowerCase().includes(lower) ||
          item.kursusNama?.toLowerCase().includes(lower),
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

  deleteKursus(id: number, nama: string) {
    this.openDeleteModal(id, nama);
  }

  // ========== ACTIONS ==========
  isiKehadiran(item: TrainingBatch) {
    console.log("Isi Kehadiran:", item.plbNamaBatch);
    this.showSuccessModal(
      "Info",
      `Daftar Lanjutan Pelatihan ${item.plbNamaBatch}`,
    );
  }

  lihatRiwayat(item: TrainingBatch) {
    console.log("Riwayat:", item.plbNamaBatch);
    this.showSuccessModal(
      "Info",
      `Kelola Riwayat Pelatihan ${item.plbNamaBatch}`,
    );
  }

  detailBatch(item: any) {
    console.log("Data batch:", item);

    // Gunakan properti yang benar dari data
    const plbId = item.plbId;
    const krsId = item.plbKrsId; // Perhatikan: ini plbKrsId, bukan krsId

    console.log("Detected IDs - plbId:", plbId, "krsId:", krsId);

    if (plbId && krsId) {
      // Navigasi dengan state untuk mengirim data tambahan
      this.router.navigate(["/penjadwalan", plbId, krsId], {
        state: {
          batchName: item.plbNamaBatch || item.namaBatch || item.nama,
          plbId: plbId,
          krsId: krsId,
        },
      });
    } else {
      console.error("Missing required IDs:", {
        plbId,
        krsId,
        originalItem: item,
      });
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Data pelatihan tidak lengkap! Tidak dapat mengakses jadwal materi.",
        confirmButtonText: "OK",
      });
    }
  }
  // ========== MODAL ALERT CUSTOM ==========
  showSuccessModal(title: string, message: string) {
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
    Swal.fire({
      icon: "error",
      title: title,
      text: message,
      confirmButtonColor: "#ba0403",
      confirmButtonText: "OK",
      background: "#fff",
    });
  }

  // ========== NAVIGATION ==========
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
