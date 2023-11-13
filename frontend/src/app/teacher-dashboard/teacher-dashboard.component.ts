import { Component } from '@angular/core';
import {end} from "@popperjs/core";


@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.css']
})
export class TeacherDashboardComponent {
  $NewExam: any = "New Exam";
  protected readonly end = end;
}
