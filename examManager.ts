import { Exam, ExamData } from './types.ts';

export class ExamManager {
  private dataFile = 'exams.json';
  private exams: Exam[] = [];

  async loadExams(): Promise<void> {
    try {
      const data = await Deno.readTextFile(this.dataFile);
      const examData: ExamData = JSON.parse(data);
      this.exams = examData.exams || [];
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        this.exams = [];
        await this.saveExams();
      } else {
        throw error;
      }
    }
  }

  async saveExams(): Promise<void> {
    const examData: ExamData = { exams: this.exams };
    await Deno.writeTextFile(this.dataFile, JSON.stringify(examData, null, 2));
  }

  getAllExams(): Exam[] {
    return [...this.exams].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  addExam(name: string, date: string): void {
    const exam: Exam = {
      id: crypto.randomUUID(),
      name,
      date
    };
    this.exams.push(exam);
  }

  removeExam(id: string): boolean {
    const index = this.exams.findIndex(exam => exam.id === id);
    if (index !== -1) {
      this.exams.splice(index, 1);
      return true;
    }
    return false;
  }

  updateExam(id: string, name?: string, date?: string): boolean {
    const exam = this.exams.find(exam => exam.id === id);
    if (exam) {
      if (name !== undefined) exam.name = name;
      if (date !== undefined) exam.date = date;
      return true;
    }
    return false;
  }

  getExamById(id: string): Exam | undefined {
    return this.exams.find(exam => exam.id === id);
  }

  removeAllExams(): void {
    this.exams = [];
  }
}
