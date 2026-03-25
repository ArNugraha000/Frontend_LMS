import { Routes } from "@angular/router";
import { LandingPageComponent } from "./general-pages/landing-page/landingpage.component";
import { HomeComponent } from "./general-pages/home/home.component";
import { AboutComponent } from "./general-pages/about/about.component";
import { LoginComponent } from "./general-pages/login/login.component";
import { CreateAccountComponent } from "./general-pages/create-account/createaccount.component";

export const AppRoutes: Routes = [
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
];
