import { MenuSystem } from './menu.ts';

async function main() {
  try {
    const menuSystem = new MenuSystem();
    await menuSystem.initialize();
    await menuSystem.showMainMenu();
  } catch (error) {
    console.error('Error starting application:', error);
    Deno.exit(1);
  }
}

if (import.meta.main) {
  main();
}
