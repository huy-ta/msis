import { CHANGE_SPACING_UNIT, SET_DEFAULT_THEME } from './actionTypes';

const changeSpacingUnit = (spacingUnit = 16) => ({
  type: CHANGE_SPACING_UNIT,
  spacingUnit
});

const setDefaultTheme = theme => ({
  type: SET_DEFAULT_THEME,
  theme
});

export { changeSpacingUnit, setDefaultTheme };
