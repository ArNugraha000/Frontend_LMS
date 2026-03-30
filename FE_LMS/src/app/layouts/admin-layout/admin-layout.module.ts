import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms"; // 👈 UPDATE

import { AdminLayoutRoutes } from "./admin-layout.routing";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { UserComponent } from "../../pages/user/user.component";
import { TableComponent } from "../../pages/table/table.component";
import { TypographyComponent } from "../../pages/typography/typography.component";
import { TrainingComponent } from "../../pages/Training/training.component";
import { MapsComponent } from "../../pages/maps/maps.component";
import { NotificationsComponent } from "../../pages/notifications/notifications.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ProfileComponent } from "app/pages/profile/profile.component";
import { MyTrainingComponent } from "../../pages/mytraining/mytraining.component";

import { AboutComponent } from "../../general-pages/about/about.component";
import { LoginComponent } from "../../general-pages/login/login.component";
import { LandingPageComponent } from "../../general-pages/landing-page/landingpage.component";
import { CreateAccountComponent } from "../../general-pages/create-account/createaccount.component";
import { LogoutComponent } from "../../pages/logout/logout.component";
import { ConfigurationComponent } from "../../pages/configuration/configuration.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
  ],
  declarations: [
    DashboardComponent,
    UserComponent,
    TableComponent,
    ProfileComponent,
    TypographyComponent,
    TrainingComponent,
    MapsComponent,
    NotificationsComponent,
    MyTrainingComponent,
    AboutComponent,
    LoginComponent,
    LandingPageComponent,
    CreateAccountComponent,
    LogoutComponent,
    ConfigurationComponent,
  ],
})
export class AdminLayoutModule {}
