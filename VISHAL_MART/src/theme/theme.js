// This file is no longer needed as the theming functionality
// has been moved directly into ThemeContext.js
// You can now use useTheme() hook to access theme colors and styles

export const createThemedStyles = (styles) => {
  return (colors) => {
    const themedStyles = {};
    Object.keys(styles).forEach(key => {
      const style = styles[key];
      if (typeof style === 'function') {
        themedStyles[key] = style(colors);
      } else {
        themedStyles[key] = style;
      }
    });
    return themedStyles;
  };
};
