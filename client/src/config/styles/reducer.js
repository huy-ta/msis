import { SET_DEFAULT_THEME, CHANGE_SPACING_UNIT } from './actionTypes';

const initialState = {
  theme: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_DEFAULT_THEME:
      return {
        ...state,
        theme: action.theme
      };
    case CHANGE_SPACING_UNIT:
      return {
        ...state,
        theme: {
          ...state.theme,
          spacing: {
            ...state.theme.spacing,
            unit: action.spacingUnit
          }
        }
      };
    default:
      return state;
  }
};
