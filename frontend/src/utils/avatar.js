const PALETTE = [
  "linear-gradient(135deg, #FF8AB0, #FF5F8F)",
  "linear-gradient(135deg, #A289FF, #7C5CFF)",
  "linear-gradient(135deg, #FFCB5C, #FFB627)",
  "linear-gradient(135deg, #4ADE80, #22C55E)",
  "linear-gradient(135deg, #67E8F9, #06B6D4)",
];

export const initialOf = (name) => (name || "?").charAt(0).toUpperCase();

export const avatarGradient = (name) => {
  let h = 0;
  for (let i = 0; i < (name || "").length; i++) {
    h = (h * 31 + name.charCodeAt(i)) >>> 0;
  }
  return PALETTE[h % PALETTE.length];
};
