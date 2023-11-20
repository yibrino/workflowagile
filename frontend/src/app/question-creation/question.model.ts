

export interface Answer {
    answer_id?:number;
    text: string;
    correct: boolean;
    latest_version: boolean;
  }
  
  export interface Topic {
    name: string;
  }
  
  export interface Question {
    question_id:number;
    text: string;
    score:number;
    answers: Answer[];
    latest_version:boolean;
    topic: Topic | null; // Topic can be null when a new topic is typed
  }
  
  