import { Component, OnInit } from "@angular/core";

export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  {
    path: "/dashboard",
    title: "Beranda",
    icon: "nc-chart-bar-32",
    class: "",
  },

  {
    path: "/mytraining",
    title: "Kursus, Saya",
    icon: "nc-book-bookmark",
    class: "",
  },
  {
    path: "/profile",
    title: "Profil, Saya",
    icon: "nc-single-02",
    class: "",
  },

  { path: "/training", title: "Kursus", icon: "nc-hat-3", class: "" },
  {
    path: "/pendaftaran",
    title: "Pendaftaran Peserta",
    icon: "nc-badge",
    class: "",
  },
  {
    path: "/pengajuanforml3",
    title: "Pengajuan Form L3",
    icon: "nc-paper",
    class: "",
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
  {
    path: "/configuration",
    title: "konfigurasi",
    icon: "nc-settings",
    class: "active-pro",
  },
];

@Component({
  moduleId: module.id,
  selector: "sidebar-cmp",
  templateUrl: "sidebar.component.html",
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];
  ngOnInit() {
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
  }
}
