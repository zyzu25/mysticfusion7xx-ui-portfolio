import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "purple" | "black" | "red";
const ROTATING_THEMES: Theme[] = ["purple", "black", "red"];
const PURPLE_HOLD_MS = 4 * 60_000;
const THEME_ROTATION_MS = 60_000;

interface ThemeCtxValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeCtx = createContext<ThemeCtxValue>({
  theme: "purple",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("purple");

  const setTheme = (next: Theme) => {
    setThemeState(next);
    localStorage.setItem("portfolio-theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    setThemeState("purple");
    localStorage.setItem("portfolio-theme", "purple");
    document.documentElement.setAttribute("data-theme", "purple");

    const advanceTheme = () => {
      setThemeState(current => {
        const currentIndex = ROTATING_THEMES.indexOf(current);
        const next = ROTATING_THEMES[(currentIndex + 1) % ROTATING_THEMES.length];
        localStorage.setItem("portfolio-theme", next);
        document.documentElement.setAttribute("data-theme", next);
        return next;
      });
    };

    let rotationTimer: number | undefined;
    const holdTimer = window.setTimeout(() => {
      advanceTheme();
      rotationTimer = window.setInterval(advanceTheme, THEME_ROTATION_MS);
    }, PURPLE_HOLD_MS);
    return () => {
      window.clearTimeout(holdTimer);
      if (rotationTimer !== undefined) window.clearInterval(rotationTimer);
    };
  }, []);

  return (
    <ThemeCtx.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeCtx);
}
