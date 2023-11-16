import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherDashboardComponent } from './teacher-dashboard/teacher-dashboard.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { QuestionCreationComponent } from './question-creation/question-creation.component';
import { BrowseQuestionsComponent } from './browse-questions/browse-questions.component';
import { ContactComponent } from './contact/contact.component';
import { ExamListsComponent } from './exam-lists/exam-lists.component';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: TeacherDashboardComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
      { path: 'question-creation', component: QuestionCreationComponent },
      { path: 'jsonquestions', component: BrowseQuestionsComponent },
      { path: 'contactus', component: ContactComponent },
      { path: 'examlists', component: ExamListsComponent },

      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
