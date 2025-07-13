# 📚 Exam Planner

A simple terminal-based exam management program with Deno and TypeScript.

## Features

- ✅ Add, edit and delete exams
- 📅 Clear overview of all exams
- ⏰ Automatic calculation of remaining time until exam
- 🎨 Colored terminal output for better overview
- 💾 JSON-based data storage

## Requirements

- [Deno](https://deno.com) must be installed

## Installation & Start

1. Clone or download repository
2. Start project
   ```powershell
   deno task start
   ```

## Usage

The program offers an interactive menu with the following options:

1. **Show exams** - Shows all saved exams with remaining time
2. **Add exam** - Add new exam with name and date
3. **Edit exam** - Change existing exam
4. **Delete exam** - Remove exam (with confirmation)
5. **Delete all exams** - Remove all exams (with double confirmation)
6. **Exit program** - Safe exit

### Date Format

Date must be entered in German format `DD.MM.YYYY`.

Example: `03.09.2025`

## Data Storage

The exams are saved in the file `exams.json` and automatically loaded at startup.

## Project Structure

```
exam-planer/
├── main.ts          # Main entry point
├── menu.ts          # Menu system and user interaction
├── examManager.ts   # Exam management and file operations
├── utils.ts         # Helper functions and terminal styling
├── types.ts         # TypeScript type definitions
├── deno.json        # Deno configuration
├── exams.json       # Data storage for exams
└── README.md        # This file
```

## Example Screenshots

The program shows a colored user interface in the terminal with:
- 🟢 Green highlights for available time (>7 days)
- 🟡 Yellow warnings for medium time (3-7 days)
- 🔴 Red alarms for critical time (<3 days)

## License

This project is under the MIT License.
