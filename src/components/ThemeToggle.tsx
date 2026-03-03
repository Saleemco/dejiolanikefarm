import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-[#E6F6F2] dark:hover:bg-[#264D4D] transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-[#0B3C3C] dark:text-[#E6F6F2]" />
      ) : (
        <Sun className="w-5 h-5 text-[#E6F6F2]" />
      )}
    </button>
  );
}