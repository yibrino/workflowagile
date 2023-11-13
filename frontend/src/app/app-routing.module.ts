import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TeacherDashboardComponent} from "./teacher-dashboard/teacher-dashboard.component";
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { TempHomePageComponent } from './temp-home-page/temp-home-page.component';

const routes: Routes = [
   { path: 'dashboard', component: TeacherDashboardComponent },
   { path: 'register', component: RegisterComponent },
   { path: 'login', component: LoginComponent },
   { path: 'temp-home-page', component: TempHomePageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
