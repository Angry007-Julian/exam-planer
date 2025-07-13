export class Colors {
  static reset = '\x1b[0m';
  static bright = '\x1b[1m';
  static dim = '\x1b[2m';
  
  static red = '\x1b[31m';
  static green = '\x1b[32m';
  static yellow = '\x1b[33m';
  static blue = '\x1b[34m';
  static magenta = '\x1b[35m';
  static cyan = '\x1b[36m';
  static white = '\x1b[37m';
  
  static bgRed = '\x1b[41m';
  static bgGreen = '\x1b[42m';
  static bgYellow = '\x1b[43m';
  static bgBlue = '\x1b[44m';
  static bgMagenta = '\x1b[45m';
  static bgCyan = '\x1b[46m';
}

export function clearScreen() {
  console.clear();
}

export function printHeader() {
  console.log(`${Colors.bright}${Colors.cyan}
  ╔══════════════════════════════════════════════╗
  ║                 📚 EXAM PLANNER              ║
  ║               Manage your exams              ║
  ╚══════════════════════════════════════════════╝${Colors.reset}\n`);
}

export function printSeparator() {
  console.log(`${Colors.dim}${'─'.repeat(50)}${Colors.reset}`);
}

export function promptUser(message: string): string {
  console.log(`${Colors.yellow}${message}${Colors.reset}`);
  const input = prompt(`${Colors.dim}> ${Colors.reset}`) || '';
  return input.trim();
}

export function convertGermanDateToISO(germanDate: string): string {
  const parts = germanDate.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid date format');
  }
  
  const day = parts[0].padStart(2, '0');
  const month = parts[1].padStart(2, '0');
  const year = parts[2];
  
  return `${year}-${month}-${day}`;
}

export function convertISOToGermanDate(isoDate: string): string {
  const parts = isoDate.split('-');
  if (parts.length !== 3) {
    return isoDate;
  }
  
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];
  
  return `${day}.${month}.${year}`;
}

export function formatTimeRemaining(examDate: Date): string {
  const now = new Date();
  const diff = examDate.getTime() - now.getTime();
  
  if (diff < 0) {
    return `${Colors.red}Already passed${Colors.reset}`;
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days > 7) {
    return `${Colors.green}${days} days${Colors.reset}`;
  } else if (days > 3) {
    return `${Colors.yellow}${days} days${Colors.reset}`;
  } else if (days >= 0) {
    return `${Colors.red}${days} days${Colors.reset}`;
  } else {
    return `${Colors.red}${Colors.bright}Today${Colors.reset}`;
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
