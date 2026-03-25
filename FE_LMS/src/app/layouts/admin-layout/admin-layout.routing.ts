import { Routes } from "@angular/router";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { UserComponent } from "../../pages/user/user.component";
import { TableComponent } from "../../pages/table/table.component";
import { TypographyComponent } from "../../pages/typography/typography.component";
import { TrainingComponent } from "../../pages/Training/training.component";
import { MapsComponent } from "../../pages/maps/maps.component";
import { NotificationsComponent } from "../../pages/notifications/notifications.component";
import { ProfileComponent } from "../../pages/profile/profile.component";
import { MyTrainingComponent } from "../../pages/mytraining/mytraining.component";

import { AboutComponent } from "../../general-pages/about/about.component";
import { LoginComponent } from "../../general-pages/login/login.component";
import { LandingPageComponent } from "../../general-pages/landing-page/landingpage.component";
import { CreateAccountComponent } from "../../general-pages/create-account/createaccount.component";

export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "user", component: UserComponent },

  { path: "profile", component: ProfileComponent },
  { path: "table", component: TableComponent },
  { path: "typography", component: TypographyComponent },
  { path: "training", component: TrainingComponent },
  { path: "maps", component: MapsComponent },
  { path: "mytraining", component: MyTrainingComponent },
  { path: "notifications", component: NotificationsComponent },
  { path: "about", component: AboutComponent },
  { path: "login", component: LoginComponent },
  { path: "landingpage", component: LandingPageComponent },
  { path: "register", component: CreateAccountComponent },
  ,
];
