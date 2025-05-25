// 设置字体

export type Font = "system" | "cangerJinkai" | "cangerXuansan";

export const setFont = function(font: Font) {
  let fontFamily = 'var(--default-font-family, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji")';
  if (font === 'cangerJinkai') {
    fontFamily = 'CangerJinkai';
  }
  if (font === 'cangerXuansan') {
    fontFamily = 'CangerXuansan';
  }
  document.documentElement.style.fontFamily = fontFamily;
};
