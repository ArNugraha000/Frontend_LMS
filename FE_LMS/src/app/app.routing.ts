import { Routes } from "@angular/router";
import { LandingPageComponent } from "./general-pages/landing-page/landingpage.component";
import { HomeComponent } from "./general-pages/home/home.component";
import { AboutComponent } from "./general-pages/about/about.component";
import { LoginComponent } from "./general-pages/login/login.component";
import { CreateAccountComponent } from "./general-pages/create-account/createaccount.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { AuthGuard } from "./guards/auth.guard";

export const AppRoutes: Routes = [
  // 🌐 PUBLIC (sebelum login)
  {
    path: "",
    component: LandingPageComponent,
    children: [
      { path: "", component: HomeComponent },
      { path: "about", component: AboutComponent },
      { path: "login", component: LoginComponent },
      { path: "register", component: CreateAccountComponent },
    ],
  },

  // 🔐 PRIVATE (setelah login)
  {
    path: "",
    component: AdminLayoutComponent,
    canActivate: [AuthGuard], // 🔥 proteksi di sini
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./layouts/admin-layout/admin-layout.module").then(
            (m) => m.AdminLayoutModule,
          ),
      },
    ],
  },

  // fallback
  {
    path: "**",
    redirectTo: "",
  },
];
