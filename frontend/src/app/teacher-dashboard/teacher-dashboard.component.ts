import {Component} from '@angular/core';
import {end} from "@popperjs/core";
import {AuthService} from '../auth.service';


@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.css']
})
export class TeacherDashboardComponent {
  $NewExam: any = "New Exam";
  isChildVisible: boolean = false;
  protected readonly end = end;

  constructor(private authService: AuthService) {
  }

  logout() {
    this.authService.logout();
  }

  showChildComponent() {
    this.isChildVisible = true;
  }

}
