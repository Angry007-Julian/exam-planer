export interface Exam {
  id: string;
  name: string;
  date: string;
}

export interface ExamData {
  exams: Exam[];
}
