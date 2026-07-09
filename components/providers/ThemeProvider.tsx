"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Theme = "dark" | "light";

type ThemeContextValue = {
  theme: Theme;
  /** True once the client has synced with the DOM — use to avoid SSR icon flashes. */
  ready: boolean;
  toggle: () => void;
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  ready: false,
  toggle: () => {},
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

/**
 * Runs before hydration (injected in <head>) so the correct theme is painted
 * on the very first frame — no flash. Reads a saved choice, else the OS
 * preference, else falls back to the house dark theme.
 */
export const themeInitScript = `(function(){try{var s=localStorage.getItem('theme');var t=s==='light'||s==='dark'?s:(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');var r=document.documentElement;r.setAttribute('data-theme',t);r.style.colorScheme=t;}catch(e){}})();`;

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [ready, setReady] = useState(false);

  // Sync React state with whatever the pre-hydration script already applied.
  useEffect(() => {
    const current =
      (document.documentElement.getAttribute("data-theme") as Theme | null) ??
      "dark";
    setThemeState(current);
    setReady(true);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    const root = document.documentElement;
    // Enable color transitions only for the duration of the switch.
    root.classList.add("theme-transition");
    root.setAttribute("data-theme", next);
    root.style.colorScheme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* private mode / storage disabled — theme still applies for the session */
    }
    setThemeState(next);
    window.setTimeout(() => root.classList.remove("theme-transition"), 500);
  }, []);

  const toggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, ready, toggle, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
