import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Section from 'Shells/Section';
import { APP_LINKS } from 'Config/routers/appLinks';
import RegisterModelForm from './components/RegisterModuleForm';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    position: 'relative',
    overflow: 'hidden'
  }
});

class RegisterModule extends React.Component {
  state = {
    successMessageOn: false
  };

  turnOnSuccessMessage = () => {
    this.setState(() => ({ successMessageOn: true }));
  };

  turnOffSuccessMessage = () => {
    this.setState(() => ({ successMessageOn: false }));
  };

  render() {
    const { classes, history } = this.props;
    const { successMessageOn } = this.state;

    let SuccessMessage;
    if (successMessageOn) {
      SuccessMessage = () => (
        <React.Fragment>
          <Typography variant="body1">
            Đăng ký học phần thành công. Bạn có thể tiếp tục tạo đăng ký học phần hoặc đến trang danh sách học phần đăng
            ký.
          </Typography>
          <Button
            className={classes.button}
            variant="contained"
            type="button"
            color="primary"
            onClick={() => {
              history.push(APP_LINKS.LIST_MODULE_REGISTRATION);
            }}
          >
            Đến trang danh sách học phần đăng ký
          </Button>
          <Button
            className={classes.button}
            variant="text"
            type="button"
            color="primary"
            onClick={this.turnOffSuccessMessage}
          >
            Tiếp tục tạo đăng ký học phần
          </Button>
        </React.Fragment>
      );
    }

    return (
      <Section header="HỌC PHẦN" subheader="ĐĂNG KÝ HỌC PHẦN">
        <Paper className={classes.root}>
          <Typography variant="body2">Nhập thông tin đăng ký</Typography>
          {!successMessageOn && <RegisterModelForm turnOnSuccessMessage={this.turnOnSuccessMessage} />}
          {successMessageOn && <SuccessMessage />}
        </Paper>
      </Section>
    );
  }
}

RegisterModule.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(RegisterModule);
