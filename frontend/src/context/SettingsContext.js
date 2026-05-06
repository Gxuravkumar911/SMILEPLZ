import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

const SOUND_KEY = "smileplz.sound";

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(
    () => localStorage.getItem(SOUND_KEY) !== "off"
  );

  useEffect(() => {
    localStorage.setItem(SOUND_KEY, soundEnabled ? "on" : "off");
  }, [soundEnabled]);

  const toggleSound = useCallback(() => setSoundEnabled((v) => !v), []);

  const value = useMemo(
    () => ({ soundEnabled, toggleSound }),
    [soundEnabled, toggleSound]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
};
