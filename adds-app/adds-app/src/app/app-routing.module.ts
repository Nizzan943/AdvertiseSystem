import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ScreenComponent} from "./screen/screen.component";
import {LoginComponent} from "./admin/login/login.component";
import {DashboardComponent} from "./admin/dashboard/dashboard.component";
import {ClientAddsComponent} from "./admin/client-adds/client-adds.component";
import {ChangePasswordComponent} from "./admin/change-password/change-password.component";
import {AuthGuard} from "./auth.guard";

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'screen/:id', component: ScreenComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/password', component: ChangePasswordComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/:id', component: ClientAddsComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/client/:id', component: ClientAddsComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
