export type Theme = "dark" | "light";

export const SYS_THEME_MATCHER = "(prefers-color-scheme: dark)";
export const STORAGE_KEY = "user-theme";

/**
 * get the theme from localStorage or the system theme
 * @returns The theme saved in localStorage
 */
export function getTheme(): Theme {
  const storage = localStorage.getItem(STORAGE_KEY);
  if (storage) return storage as Theme;

  const sysTheme = typeof window !== "undefined" ? window.matchMedia(SYS_THEME_MATCHER) : null;
  if (sysTheme?.matches) {
    return "dark";
  }

  return "light";
}

/**
 * update the user's theme in localStorage.
 * @param t The new theme
 */
export function setTheme(t: Theme) {
  localStorage.setItem(STORAGE_KEY, t);
  setThemeClass(t);

  return t;
}

/**
 * update the body classList with the new theme.
 * @param t The theme
 */
export function setThemeClass(t: Theme) {
  if (typeof window === "undefined") return;

  if (t === "dark") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
}
