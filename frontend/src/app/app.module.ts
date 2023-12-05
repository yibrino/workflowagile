import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TeacherDashboardComponent } from './teacher-dashboard/teacher-dashboard.component';
import { RegisterComponent } from './register/register.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from './token.interceptor';
import { QuestionCreationComponent } from './question-creation/question-creation.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BrowseQuestionsComponent } from './browse-questions/browse-questions.component';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './header/header.component';
import { ContactComponent } from './contact/contact.component';
import { ExamListsComponent } from './exam-lists/exam-lists.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HomePageComponent } from './home-page/home-page.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { QuestionImportComponent } from './question-import/question-import.component';
import { ProfileComponent } from './profile/profile.component';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowseExamsComponent } from './browse-exams/browse-exams.component';
import { FormsModule } from '@angular/forms';
import {MatExpansionModule} from '@angular/material/expansion';
import {AutoExamCreationComponent} from './auto-exam-creation/auto-exam-creation.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { ClipboardModule } from '@angular/cdk/clipboard';
import {MatSlideToggleModule} from '@angular/material/slide-toggle'; 
import { QuestionOpenComponent } from './question-open/question-open.component';
import {MatMenuModule} from "@angular/material/menu";
import { CreateExamComponent } from './create-exam/create-exam.component';

@NgModule({
  declarations: [
    AppComponent,
    TeacherDashboardComponent,
    RegisterComponent,
    LoginComponent,
    QuestionCreationComponent,
    BrowseQuestionsComponent,
    LayoutComponent,
    HeaderComponent,
    ContactComponent,
    ExamListsComponent,
    HomePageComponent,
    NotFoundComponent,
    QuestionImportComponent,
    ProfileComponent,
    BrowseExamsComponent,
    AutoExamCreationComponent,
    CreateExamComponent,
    QuestionOpenComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    HttpClientModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    NgbModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatTabsModule,
    FormsModule,
    MatExpansionModule,
    MatAutocompleteModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule,
    ClipboardModule,
    MatSlideToggleModule,
    MatMenuModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
