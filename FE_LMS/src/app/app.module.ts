import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ToastrModule } from "ngx-toastr";

import { SidebarModule } from "./sidebar/sidebar.module";
import { FooterModule } from "./shared/footer/footer.module";
import { NavbarModule } from "./shared/navbar/navbar.module";
import { FixedPluginModule } from "./shared/fixedplugin/fixedplugin.module";
import { ReactiveFormsModule } from "@angular/forms"; // ← ini import FormsModule
import { AppComponent } from "./app.component";
import { AppRoutes } from "./app.routing";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";

import { CourseListComponent } from "./components/course-list/course-list.component";
import { TrainingComponent } from "./pages/Training/training.component";
import { HttpClientModule } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    // TrainingComponent, ← hapus ini
    AdminLayoutComponent,
    CourseListComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(AppRoutes, { useHash: true }),
    SidebarModule,
    NavbarModule,
    ToastrModule.forRoot(),
    FooterModule,
    FixedPluginModule,
    ReactiveFormsModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
