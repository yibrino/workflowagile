import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherDashboardComponent } from './teacher-dashboard/teacher-dashboard.component';
import { QuestionCreationComponent } from './question-creation/question-creation.component';
import { BrowseQuestionsComponent } from './browse-questions/browse-questions.component';
import { ContactComponent } from './contact/contact.component';
import { ExamListsComponent } from './exam-lists/exam-lists.component';
import { AuthGuard } from './auth.guard';
import { HomePageComponent } from './home-page/home-page.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { QuestionImportComponent } from './question-import/question-import.component';
import { ProfileComponent } from './profile/profile.component';
import { BrowseExamsComponent } from './browse-exams/browse-exams.component';
import { AutoExamCreationComponent } from './auto-exam-creation/auto-exam-creation.component';
import { CreateExamComponent } from "./create-exam/create-exam.component";
import {QuestionOpenComponent} from "./question-open/question-open.component";

const routes: Routes = [
  {
    path: 'dashboard',
    component: TeacherDashboardComponent,
    canActivate: [AuthGuard],
    data: { role: 'teacher' },
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'question-import', component: QuestionImportComponent },
      { path: 'question-creation', component: QuestionCreationComponent },
      { path: 'questions-list', component: BrowseQuestionsComponent },
      { path: 'browse-exams', component: BrowseExamsComponent },
      { path: 'auto-exam-creation', component: AutoExamCreationComponent },
      { path: 'create-exam', component: CreateExamComponent },
      { path: 'question-open', component: QuestionOpenComponent },
      {path: "", redirectTo:"browse-exams", pathMatch:"full"},
    ]
  },
  { path: 'contactus', component: ContactComponent },
  { path: 'examlists', component: ExamListsComponent },
  { path: 'home-page', component: HomePageComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/home-page', pathMatch: 'full' },
  { path: '', redirectTo: 'home-page', pathMatch: 'full' },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
