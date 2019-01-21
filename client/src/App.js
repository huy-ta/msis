import React from 'react';
import PropTypes from 'prop-types';
import { Provider, connect } from 'react-redux';

import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Notification from './components/Notification';

import AppRouter from './config/routers/AppRouter';

import { changeSpacingUnit } from './config/styles/actions';

class App extends React.Component {
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    const { theme, changeSpacingUnit: dispatchChangeSpacingUnit } = this.props;

    const minWidth = theme.breakpoints.values.sm;
    const maxWidth = theme.breakpoints.values.xl;
    const width = window.innerWidth;

    const ratio = (width - minWidth) / (maxWidth - minWidth);

    // Change Spacing Unit
    let spacingUnit = theme.spacing.unit;
    const minSpacingUnit = theme.spacing.minUnit;
    const maxSpacingUnit = theme.spacing.maxUnit;
    if (ratio > 0) {
      if (ratio > 1) {
        spacingUnit = maxSpacingUnit;
      } else {
        spacingUnit = (maxSpacingUnit - minSpacingUnit) * ratio + minSpacingUnit;
      }
    } else {
      spacingUnit = minSpacingUnit;
    }

    dispatchChangeSpacingUnit(spacingUnit);
  };

  render() {
    const { theme, store } = this.props;

    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Provider store={store}>
          <AppRouter />
        </Provider>
        <Notification />
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  theme: PropTypes.shape({}).isRequired,
  store: PropTypes.shape({}).isRequired,
  changeSpacingUnit: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  theme: state.styles.theme
});

const mapDispatchToProps = dispatch => ({
  changeSpacingUnit: spacingUnit => dispatch(changeSpacingUnit(spacingUnit))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
