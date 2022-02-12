import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ScreenComponent } from './screen/screen.component';
import {AppRoutingModule} from "./app-routing.module";
import {HttpClientModule} from "@angular/common/http";
import { LoginComponent } from './admin/login/login.component';
import {ReactiveFormsModule} from "@angular/forms";
import {AuthService} from "./admin/auth.service";
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MaterialModule} from "./material.module";
import {ClientAddsComponent} from "./admin/client-adds/client-adds.component";
import {ChangePasswordComponent} from "./admin/change-password/change-password.component";
import {DeleteAddComponent} from "./admin/client-adds/delete-add/delete-add.component";
import {EditAddComponent} from "./admin/client-adds/edit-add/edit-add.component";
import {AddComercialComponent} from "./admin/client-adds/add-comercial/add-comercial.component";
import {AuthGuard} from "./auth.guard";
import {ToolbarComponent} from "./toolbar/toolbar.component";


@NgModule({
  declarations: [
    AppComponent,
    ScreenComponent,
    LoginComponent,
    DashboardComponent,
    ClientAddsComponent,
    ChangePasswordComponent,
    DeleteAddComponent,
    EditAddComponent,
    AddComercialComponent,
    ToolbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialModule,
    BrowserAnimationsModule,
  ],
  providers: [AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
