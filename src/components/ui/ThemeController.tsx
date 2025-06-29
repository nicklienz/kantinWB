"use client";
import { useEffect, useState } from "react";

const THEME_KEY = "daisyui-theme";
const THEMES = [
  { value: "greenlight", icon: "sun", label: "Light" },
  { value: "greendark", icon: "moon", label: "Dark" },
];

export default function ThemeController({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(THEME_KEY) || THEMES[0].value;
    }
    return "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  return (
    <label className={`toggle toggle-md md:toggle-xl text-base-content ${className}`}>
      <input
        type="checkbox"
        className="theme-controller"
        checked={theme === "greendark"}
        onChange={() => setTheme(theme === "greendark" ? "greenlight" : "greendark")}
        aria-label="Toggle theme"
      />
      {/* Sun icon */}
      <svg aria-label="sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6">
        <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M12 2v2"></path>
          <path d="M12 20v2"></path>
          <path d="m4.93 4.93 1.41 1.41"></path>
          <path d="m17.66 17.66 1.41 1.41"></path>
          <path d="M2 12h2"></path>
          <path d="M20 12h2"></path>
          <path d="m6.34 17.66-1.41 1.41"></path>
          <path d="m19.07 4.93-1.41 1.41"></path>
        </g>
      </svg>
      {/* Moon icon */}
      <svg aria-label="moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6">
        <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
        </g>
      </svg>
    </label>
  );
}
