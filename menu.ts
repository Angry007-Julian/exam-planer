import { ExamManager } from './examManager.ts';
import { Colors, clearScreen, printHeader, printSeparator, promptUser, formatTimeRemaining, formatDate, convertGermanDateToISO, convertISOToGermanDate } from './utils.ts';

export class MenuSystem {
  private examManager: ExamManager;

  constructor() {
    this.examManager = new ExamManager();
  }

  async initialize(): Promise<void> {
    await this.examManager.loadExams();
  }

  async showMainMenu(): Promise<void> {
    while (true) {
      clearScreen();
      printHeader();
      
      console.log(`${Colors.bright}${Colors.white}Main Menu:${Colors.reset}`);
      console.log(`${Colors.green}1.${Colors.reset} Show exams`);
      console.log(`${Colors.green}2.${Colors.reset} Add exam`);
      console.log(`${Colors.green}3.${Colors.reset} Edit exam`);
      console.log(`${Colors.green}4.${Colors.reset} Delete exam`);
      console.log(`${Colors.yellow}5.${Colors.reset} Delete all exams`);
      console.log(`${Colors.red}6.${Colors.reset} Exit program`);
      
      printSeparator();
      
      const choice = promptUser('Select an option (1-6):');
      
      switch (choice) {
        case '1':
          this.showExams();
          break;
        case '2':
          await this.addExam();
          break;
        case '3':
          await this.editExam();
          break;
        case '4':
          await this.deleteExam();
          break;
        case '5':
          await this.deleteAllExams();
          break;
        case '6':
          console.log(`${Colors.green}Goodbye! 👋${Colors.reset}`);
          Deno.exit(0);
          break;
        default:
          console.log(`${Colors.red}Invalid input. Please select 1-6.${Colors.reset}`);
          this.pressEnterToContinue();
      }
    }
  }

  private showExams(): void {
    clearScreen();
    printHeader();
    
    const exams = this.examManager.getAllExams();
    
    if (exams.length === 0) {
      console.log(`${Colors.yellow}📝 No exams available yet.${Colors.reset}\n`);
    } else {
      console.log(`${Colors.bright}${Colors.white}📚 Your exams:${Colors.reset}\n`);
      
      exams.forEach((exam, index) => {
        const examDate = new Date(exam.date);
        const timeRemaining = formatTimeRemaining(examDate);
        const formattedDate = formatDate(exam.date);
        
        console.log(`${Colors.bright}${index + 1}. ${exam.name}${Colors.reset}`);
        console.log(`   ${Colors.dim}📅 ${formattedDate}${Colors.reset}`);
        console.log(`   ${Colors.dim}⏰ Time remaining: ${timeRemaining}${Colors.reset}\n`);
      });
    }
    
    printSeparator();
    this.pressEnterToContinue();
  }

  private async addExam(): Promise<void> {
    clearScreen();
    printHeader();
    
    console.log(`${Colors.bright}${Colors.white}➕ Add new exam${Colors.reset}\n`);
    
    const name = promptUser('Exam name:');
    if (!name.trim()) {
      console.log(`${Colors.red}Error: Name cannot be empty.${Colors.reset}`);
      this.pressEnterToContinue();
      return;
    }
    
    console.log(`${Colors.dim}Format: DD.MM.YYYY (e.g. 03.09.2025)${Colors.reset}`);
    const dateInput = promptUser('Date:');
    
    if (!this.isValidGermanDateFormat(dateInput)) {
      console.log(`${Colors.red}Error: Invalid date format.${Colors.reset}`);
      this.pressEnterToContinue();
      return;
    }
    
    const isoDate = convertGermanDateToISO(dateInput);
    this.examManager.addExam(name.trim(), isoDate);
    await this.examManager.saveExams();
    
    console.log(`${Colors.green}✅ Exam "${name}" was successfully added!${Colors.reset}`);
    this.pressEnterToContinue();
  }

  private async editExam(): Promise<void> {
    clearScreen();
    printHeader();
    
    const exams = this.examManager.getAllExams();
    
    if (exams.length === 0) {
      console.log(`${Colors.yellow}📝 No exams available to edit.${Colors.reset}`);
      this.pressEnterToContinue();
      return;
    }
    
    console.log(`${Colors.bright}${Colors.white}✏️ Edit exam${Colors.reset}\n`);
    
    exams.forEach((exam, index) => {
      console.log(`${Colors.green}${index + 1}.${Colors.reset} ${exam.name} - ${formatDate(exam.date)}`);
    });
    
    printSeparator();
    const choice = promptUser('Which exam would you like to edit? (Number):');
    const examIndex = parseInt(choice) - 1;
    
    if (examIndex < 0 || examIndex >= exams.length) {
      console.log(`${Colors.red}Invalid selection.${Colors.reset}`);
      this.pressEnterToContinue();
      return;
    }
    
    const selectedExam = exams[examIndex];
    
    console.log(`\n${Colors.bright}Current data:${Colors.reset}`);
    console.log(`Name: ${selectedExam.name}`);
    console.log(`Date: ${formatDate(selectedExam.date)}\n`);
    
    const newName = promptUser(`New name (leave empty for "${selectedExam.name}"):`);
    const newDate = promptUser(`New date (leave empty for current date, Format: DD.MM.YYYY):`);
    
    if (newDate.trim() && !this.isValidGermanDateFormat(newDate)) {
      console.log(`${Colors.red}Error: Invalid date format.${Colors.reset}`);
      this.pressEnterToContinue();
      return;
    }
    
    const isoDate = newDate.trim() ? convertGermanDateToISO(newDate) : undefined;
    
    this.examManager.updateExam(
      selectedExam.id,
      newName.trim() || undefined,
      isoDate
    );
    await this.examManager.saveExams();
    
    console.log(`${Colors.green}✅ Exam was successfully edited!${Colors.reset}`);
    this.pressEnterToContinue();
  }

  private async deleteExam(): Promise<void> {
    clearScreen();
    printHeader();
    
    const exams = this.examManager.getAllExams();
    
    if (exams.length === 0) {
      console.log(`${Colors.yellow}📝 No exams available to delete.${Colors.reset}`);
      this.pressEnterToContinue();
      return;
    }
    
    console.log(`${Colors.bright}${Colors.white}🗑️ Delete exam${Colors.reset}\n`);
    
    exams.forEach((exam, index) => {
      console.log(`${Colors.green}${index + 1}.${Colors.reset} ${exam.name} - ${formatDate(exam.date)}`);
    });
    
    printSeparator();
    const choice = promptUser('Which exam would you like to delete? (Number):');
    const examIndex = parseInt(choice) - 1;
    
    if (examIndex < 0 || examIndex >= exams.length) {
      console.log(`${Colors.red}Invalid selection.${Colors.reset}`);
      this.pressEnterToContinue();
      return;
    }
    
    const selectedExam = exams[examIndex];
    
    console.log(`\n${Colors.yellow}⚠️ Are you sure you want to delete "${selectedExam.name}"?${Colors.reset}`);
    const confirmation = promptUser('Confirm with "yes":');
    
    if (confirmation.toLowerCase() === 'yes') {
      this.examManager.removeExam(selectedExam.id);
      await this.examManager.saveExams();
      console.log(`${Colors.green}✅ Exam "${selectedExam.name}" was deleted.${Colors.reset}`);
    } else {
      console.log(`${Colors.blue}Deletion cancelled.${Colors.reset}`);
    }
    
    this.pressEnterToContinue();
  }

  private async deleteAllExams(): Promise<void> {
    clearScreen();
    printHeader();
    
    const exams = this.examManager.getAllExams();
    
    if (exams.length === 0) {
      console.log(`${Colors.yellow}📝 No exams available to delete.${Colors.reset}`);
      this.pressEnterToContinue();
      return;
    }
    
    console.log(`${Colors.bright}${Colors.white}🗑️ Delete all exams${Colors.reset}\n`);
    console.log(`${Colors.yellow}You have ${exams.length} exam(s) saved:${Colors.reset}\n`);
    
    exams.forEach((exam, index) => {
      console.log(`${Colors.dim}${index + 1}. ${exam.name} - ${formatDate(exam.date)}${Colors.reset}`);
    });
    
    console.log(`\n${Colors.red}${Colors.bright}⚠️ WARNING: This action cannot be undone!${Colors.reset}`);
    console.log(`${Colors.red}All ${exams.length} exams will be permanently deleted.${Colors.reset}\n`);
    
    printSeparator();
    
    const confirmation1 = promptUser('Are you sure? Type "DELETE ALL":');
    
    if (confirmation1 !== 'DELETE ALL') {
      console.log(`${Colors.blue}Deletion cancelled.${Colors.reset}`);
      this.pressEnterToContinue();
      return;
    }
    
    const confirmation2 = promptUser('Final confirmation - type "YES":');
    
    if (confirmation2.toLowerCase() === 'yes') {
      this.examManager.removeAllExams();
      await this.examManager.saveExams();
      
      console.log(`${Colors.green}✅ All ${exams.length} exams were successfully deleted.${Colors.reset}`);
      console.log(`${Colors.green}The file has been cleared and is ready for new entries.${Colors.reset}`);
    } else {
      console.log(`${Colors.blue}Deletion cancelled.${Colors.reset}`);
    }
    
    this.pressEnterToContinue();
  }

  private isValidGermanDateFormat(dateString: string): boolean {
    const regex = /^\d{2}\.\d{2}\.\d{4}$/;
    if (!regex.test(dateString)) {
      return false;
    }
    
    try {
      const isoDate = convertGermanDateToISO(dateString);
      const date = new Date(isoDate);
      return !isNaN(date.getTime());
    } catch {
      return false;
    }
  }

  private pressEnterToContinue(): void {
    console.log(`\n${Colors.dim}Press Enter to continue...${Colors.reset}`);
    prompt('');
  }
}
