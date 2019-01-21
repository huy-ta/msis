import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#363c48'
    },
    secondary: {
      main: '#febd49'
    },
    text: {
      primary: '#212121',
      secondary: '#757575'
    }
  },
  typography: {
    htmlFontSize: 8,
    subtitle1: {
      fontWeight: 300
    }
  },
  spacing: {
    minUnit: 8,
    unit: 16,
    maxUnit: 24,
    drawerWidth: {
      xlUp: 340,
      mdUp: 300
    }
  }
});

export default theme;
