import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';

import msisLogo from 'Assets/images/msis-logo.svg';
import hustLogo from 'Assets/images/hust-logo.svg';
import studentUsingLaptop from 'Assets/images/student-using-laptop.svg';

const styles = theme => ({
  root: {
    position: 'relative',
    zIndex: 2,
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  mainContainer: {
    position: 'relative',
    width: '100%',
    minHeight: '45%',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: `
      ${theme.spacing.unit}px 
      ${theme.spacing.unit * 2}px 
      ${theme.spacing.unit}px 
      ${theme.spacing.unit * 2}px
    `,
    overflow: 'hidden'
  },
  leftContainer: {
    display: 'contents'
  },
  hustIcon: {
    position: 'absolute',
    width: `${theme.spacing.unit * 2}px`,
    zIndex: 2,
    top: `${theme.spacing.unit}px`,
    left: `${theme.spacing.unit}px`
  },
  studentImage: {
    marginTop: `${theme.spacing.unit * 2}px`,
    width: '100%'
  }
});

class SignFormContainer extends React.Component {
  toggleLoading = () => {};

  render() {
    const { classes, children } = this.props;
    const { root, mainContainer, leftContainer, studentImage, hustIcon } = classes;

    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, { toggleLoading: this.toggleLoading })
    );

    const leftFrame = (
      <main className={leftContainer}>
        <img src={hustLogo} className={hustIcon} alt="HUST Logo" />
        <Hidden mdDown>
          <Grid item xs={false} lg={5}>
            <Typography variant="h5" align="center">
              Đăng nhập vào mSIS
            </Typography>
            <Typography variant="subtitle1" align="center">
              Hệ thống quản lý sinh viên Đại học Bách Khoa Hà Nội
            </Typography>
            <img className={studentImage} src={studentUsingLaptop} alt="Student Using Laptop" />
          </Grid>
        </Hidden>
      </main>
    );

    const rightFrame = (
      <Grid item xs={12} lg={5} style={{ textAlign: 'center' }}>
        <img src={msisLogo} alt="mSIS Logo" width="30%" />
        {childrenWithProps}
      </Grid>
    );

    return (
      <Grid container justify="center" alignItems="center" className={root}>
        <Grid item xs={10} lg={10}>
          <Paper className={mainContainer} elevation={10}>
            {leftFrame}
            {rightFrame}
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

SignFormContainer.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  children: PropTypes.node.isRequired
};

const StyledSignFormContainer = withStyles(styles)(SignFormContainer);

export { StyledSignFormContainer };

export default StyledSignFormContainer;
