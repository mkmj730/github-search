"use client";

import React, { PropsWithChildren, useMemo, useState, useEffect, createContext, useContext } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { makeStore } from "../lib/store";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

type ThemeMode = "light" | "dark" | "system";
interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ThemeModeContext = createContext<ThemeContextValue>({
  mode: "system",
  setMode: () => {}
});

export const useThemeMode = () => useContext(ThemeModeContext);

const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  const store = useMemo(() => makeStore(), []);
  const [mode, setMode] = useState<ThemeMode>("system");
  const [systemMode, setSystemMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemMode(media.matches ? "dark" : "light");
    const handler = (event: MediaQueryListEvent) => setSystemMode(event.matches ? "dark" : "light");
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  const effectiveMode = mode === "system" ? systemMode : mode;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", effectiveMode);
    document.documentElement.classList.toggle("dark", effectiveMode === "dark");
    document.documentElement.classList.toggle("light", effectiveMode === "light");
    document.documentElement.style.colorScheme = effectiveMode;
  }, [effectiveMode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: effectiveMode
        }
      }),
    [effectiveMode]
  );

  return (
    <ThemeModeContext.Provider value={{ mode, setMode }}>
      <ReduxProvider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ReduxProvider>
    </ThemeModeContext.Provider>
  );
};

export default Providers;
