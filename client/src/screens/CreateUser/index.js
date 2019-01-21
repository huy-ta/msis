import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Section from 'Shells/Section';
import { APP_LINKS } from 'Config/routers/appLinks';
import CreateUserForm from './components/CreateUserForm';


const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    position: 'relative',
    overflow: 'hidden'
  },
  button: {
    marginTop: theme.spacing.unit * 0.7,
    marginRight: theme.spacing.unit * 0.7
  }
});


class CreateUser extends React.Component {

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
    const {successMessageOn} = this.state;

    let SuccessMessage;
    if (successMessageOn) {
      SuccessMessage = () => (
        <React.Fragment>
          <Typography variant="body1">
            Tạo tài khoản thành công. Bạn có thể tiếp tục tạo tài khoản hoặc đến trang danh sách người dùng.
          </Typography>
          <Button 
            className={classes.button} 
            variant="contained" 
            type="button" 
            color="primary"
            onClick={() => {history.push(APP_LINKS.LIST_USER);}}
          >
            Đến trang danh sách người dùng
          </Button>
          <Button
            className={classes.button}
            variant="text"
            type="button"
            color="primary"
            onClick={this.turnOffSuccessMessage}
          >
            Tiếp tục tạo tài khoản
          </Button>
        </React.Fragment>
      );
    }

    return (
      <Section header="TTÀI KHOẢN" subheader="TẠO TÀI KHOẢN">
      <Paper className={classes.root}>
        <Typography variant="body2">Nhập thông tin tài khoản</Typography>
        {!successMessageOn && <CreateUserForm turnOnSuccessMessage={this.turnOnSuccessMessage}/>}
        {successMessageOn && <SuccessMessage />}
      </Paper>
    </Section>
    );
  }
}


CreateUser.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(CreateUser);
