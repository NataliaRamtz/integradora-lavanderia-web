'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './button';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Inicializar con modo oscuro como predeterminado
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = stored || 'dark';
    
    // Aplicar tema inmediatamente antes de setState
    const root = document.documentElement;
    if (initialTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    root.style.colorScheme = initialTheme;
    
    setTheme(initialTheme);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    
    // Aplicar el nuevo tema
    if (newTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.style.colorScheme = 'light';
    }
    
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Forzar re-render de componentes que dependen del tema
    window.dispatchEvent(new Event('themechange'));
  };

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-9 w-9 p-0"
        aria-label="Cambiar tema"
        disabled
      >
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="h-9 w-9 p-0 transition-all hover:scale-110"
      aria-label="Cambiar tema"
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4 text-yellow-400" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700" />
      )}
    </Button>
  );
}

