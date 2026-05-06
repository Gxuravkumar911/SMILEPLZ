import { playPop, playChime, playCombo } from "./sound";

const SOUND_KEY = "smileplz.sound";

const isSoundOn = () => localStorage.getItem(SOUND_KEY) !== "off";

const vibrate = (pattern) => {
  try { navigator.vibrate?.(pattern); } catch (_) { /* ignore */ }
};

export const feedbackSmile = () => {
  if (isSoundOn()) playPop();
  vibrate(15);
};

export const feedbackPB = () => {
  if (isSoundOn()) playChime();
  vibrate([20, 30, 80]);
};

export const feedbackCombo = (level) => {
  if (isSoundOn()) playCombo(level);
  vibrate([10, 20, 10]);
};
