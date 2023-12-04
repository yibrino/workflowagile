import { Question } from "./question-creation/question.model";

export interface Teacher {
    first_name: string;
    last_name: string;
    email: string;
}

export interface Exam {
    exam_id: number;
    title: string;
    description: string;
    is_active: boolean;
    questions: Question[];
}

export interface ActiveExam {
  active_exam_id : number;
  exam: Exam;
  start_date: Date;
  end_date: Date;
  token: string;
  duration: string;
  }
