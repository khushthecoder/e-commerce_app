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
