import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

export interface RouteInfo {
  path: string;
  title: string;
  headerTitle?: string;
  icon: string;
  class: string;
  showInSidebar: boolean;
}

export const ROUTES: RouteInfo[] = [
  {
    path: "/dashboard",
    title: "Beranda",
    icon: "nc-chart-bar-32",
    class: "",
    showInSidebar: true,
  },
  {
    path: "/materi",
    title: "",
    headerTitle: "Materi Pelatihan - Kelola Materi",
    icon: "",
    class: "",
    showInSidebar: false,
  },
  {
    path: "/manage-training/:krsId",
    title: "",
    headerTitle: "Materi Pelatihan - Detail Pelatihan",
    icon: "",
    class: "",
    showInSidebar: false,
  },
  {
    path: "/mytraining",
    title: "Pelatihan, Saya",
    icon: "nc-book-bookmark",
    class: "",
    showInSidebar: true,
  },
  {
    path: "/profile",
    title: "Profil, Saya",
    icon: "nc-single-02",
    class: "",
    showInSidebar: true,
  },

  {
    path: "/training",
    title: "Pelatihan",
    headerTitle: "Materi Pelatihan - Transaksi Pelatihan Per-Batch",
    icon: "nc-hat-3",
    class: "",
    showInSidebar: true,
  },
  {
    path: "/pendaftaran",
    title: "Pendaftaran Peserta",
    icon: "nc-badge",
    class: "",
    showInSidebar: true,
  },
  {
    path: "/pengajuanforml3",
    title: "Pengajuan Form L3",
    icon: "nc-paper",
    class: "",
    showInSidebar: true,
  },
  {
    path: "/manage-training",
    title: "Kelola Pelatihan",
    headerTitle: "Materi Pelatihan - Kelola Pelatihan",
    icon: "nc-hat-3",
    class: "",
    showInSidebar: false,
  },

  {
    path: "/configuration",
    title: "konfigurasi",
    icon: "nc-settings",
    class: "active-pro",
    showInSidebar: true,
  },
  {
    path: "/quiz-soal/:materiId",
    title: "Materi Pelatihan - Tambah Soal",
    icon: "nc-settings",
    class: "active-pro",
    showInSidebar: false,
  },

  {
    path: "/quiz-soal/:materiId/:soalId",
    title: "Materi Pelatihan - Edit Soal",
    icon: "nc-settings",
    class: "active-pro",
    showInSidebar: false,
  },
  {
    path: "/quiz-list/:materiId",
    title: "Materi Pelatihan - Kelola Soal",
    icon: "nc-settings",
    class: "active-pro",
    showInSidebar: false,
  },
  {
    path: "/karyawan",
    title: "Data Karyawan",
    icon: "nc-settings",
    class: "",
    showInSidebar: false,
  },
  {
    path: "/jabatan",
    title: "Data Jabatan",
    icon: "nc-settings",
    class: "",
    showInSidebar: false,
  },
  {
    path: "/penjadwalan/:plbId/:krsId",
    title: "Penjadwalan Materi",
    icon: "nc-settings",
    class: "",
    showInSidebar: false,
  },

  // { path: "/maps", title: "Maps", icon: "nc-pin-3", class: "" },
  // {
  //   path: "/notifications",
  //   title: "Notifications",
  //   icon: "nc-bell-55",
  //   class: "",
  // },
  // { path: "/user", title: "User Profile", icon: "nc-single-02", class: "" },
  // { path: "/table", title: "Table List", icon: "nc-tile-56", class: "" },
  // {
  //   path: "/typography",
  //   title: "Typography",
  //   icon: "nc-caps-small",
  //   class: "",
  // },
];

@Component({
  moduleId: module.id,
  selector: "sidebar-cmp",
  templateUrl: "sidebar.component.html",
})
export class SidebarComponent implements OnInit {
  public menuItems: RouteInfo[] = [];

  ngOnInit() {
    this.menuItems = ROUTES.filter((item) => item.showInSidebar !== false);
  }

  constructor(private router: Router) {}

  isActive(path: string): boolean {
    const currentUrl = this.router.url;

    // mapping: materi dianggap bagian training
    if (path === "/training") {
      return (
        currentUrl.startsWith("/training") ||
        currentUrl.startsWith("/materi") ||
        currentUrl.startsWith("/quiz-list") ||
        currentUrl.startsWith("/quiz-soal") ||
        currentUrl.startsWith("/manage-training") ||
        currentUrl.startsWith("/penjadwalan")
      );
    }

    if (path === "/configuration") {
      return (
        currentUrl.startsWith("/karyawan") ||
        currentUrl.startsWith("/configuration") ||
        currentUrl.startsWith("/jabatan")
      );
    }

    return currentUrl.startsWith(path);
  }
}
