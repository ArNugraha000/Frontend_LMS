import { Component, OnInit } from "@angular/core";
import Chart from "chart.js";
import { Router } from "@angular/router";

@Component({
  selector: "dashboard-cmp",
  moduleId: module.id,
  templateUrl: "dashboard.component.html",
})
export class DashboardComponent implements OnInit {
  constructor(private router: Router) {}

  // ===== CHART =====
  public canvas: any;
  public ctx;
  public chartColor;
  public chartHours;

  // ===== DATA LIST =====
  courseData = [
    {
      gambar: "assets/img/angular.png",
      judul: "Angular Basic",
      status: "Berjalan",
      progress: 40,
      tanggalMulai: "2026-03-01",
    },
    {
      gambar: "assets/img/angular.png",
      judul: "TypeScript Fundamental",
      status: "Selesai",
      progress: 100,
      tanggalMulai: "2026-02-10",
    },
    {
      gambar: "assets/img/damir-bosnjak.jpg",
      judul: "RxJS Reactive",
      status: "Berjalan",
      progress: 65,
      tanggalMulai: "2026-03-03",
    },
    {
      gambar: "assets/img/damir-bosnjak.jpg",
      judul: "HTML CSS Modern",
      status: "Berjalan",
      progress: 20,
      tanggalMulai: "2026-03-05",
    },
    {
      gambar: "assets/img/damir-bosnjak.jpg",
      judul: "JavaScript ES6",
      status: "Selesai",
      progress: 100,
      tanggalMulai: "2026-01-15",
    },
  ];

  // ===== STATE =====
  searchText = "";
  filteredData: any[] = [];
  currentPage = 1;
  pageSize = 4; // maksimal 4 data per halaman
  pagedData: any[] = [];

  // ===== HARI & MATERI =====
  days = [1, 2, 3, 4, 5, 6];
  materi = [1, 2, 3, 4, 5, 6];
  startDate = new Date("2026-03-01");

  ngOnInit(): void {
    // ==== CHART ====
    this.chartColor = "#FFFFFF";
    this.canvas = document.getElementById("chartHours");
    if (this.canvas) {
      this.ctx = this.canvas.getContext("2d");
      this.chartHours = new Chart(this.ctx, {
        type: "line",
        data: {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
          ],
          datasets: [
            {
              borderColor: "#6bd098",
              backgroundColor: "#6bd098",
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 3,
              data: [300, 310, 316, 322, 330, 326, 333, 345, 338, 354],
            },
          ],
        },
        options: { legend: { display: false } },
      });
    }

    // ==== LIST + PAGINATION ====
    this.filteredData = [...this.courseData];
    this.updatePagedData();
  }

  // ===== HARI AKTIF & PROGRESS =====
  get currentDayIndex(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(this.startDate);
    start.setHours(0, 0, 0, 0);
    const diffDays = Math.floor(
      (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );
    return Math.max(0, Math.min(diffDays, this.days.length - 1));
  }

  get progressPercent(): number {
    if (this.days.length <= 1) return 0;
    return (this.currentDayIndex / (this.days.length - 1)) * 100;
  }

  // ===== SEARCH =====
  onSearch(): void {
    const keyword = this.searchText.toLowerCase();
    if (!keyword) {
      this.filteredData = [...this.courseData];
    } else {
      this.filteredData = this.courseData.filter((x) =>
        x.judul.toLowerCase().includes(keyword),
      );
    }
    this.currentPage = 1;
    this.updatePagedData();
  }

  // ===== PAGINATION =====
  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.pageSize);
  }

  updatePagedData(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedData = this.filteredData.slice(start, end);

    // min-height container setara 4 item
    const listWrapper = document.querySelector(".list-wrapper") as HTMLElement;
    if (listWrapper) {
      const itemHeight = 110 + 1; // min-height + border
      listWrapper.style.minHeight = `${itemHeight * 4}px`;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedData();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedData();
    }
  }

  // ===== ACTION BUTTON =====
  isiKehadiran(item: any): void {
    console.log("Isi kehadiran:", item);
  }

  lihatRiwayat(item: any): void {
    console.log("Lihat riwayat:", item);
  }

  onLeftClick(): void {
    console.log("Mulai kursus");
    this.router.navigate(["/dashboard"]);
  }

  onMiddleClick(): void {
    console.log("Kursus saya");
    this.router.navigate(["/mytraining"]);
  }
}
