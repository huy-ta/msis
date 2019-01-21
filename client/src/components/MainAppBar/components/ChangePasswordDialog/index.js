import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';

import { openSnackbar } from 'GlobalComponents/Notification';

const styles = theme => ({
  root: {
    padding: theme.spacing.unit
  },
  progress: {
    position: 'absolute',
    width: '100%',
    left: '0',
    bottom: '0',
    zIndex: 5
  },
  overlay: {
    position: 'absolute',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: theme.palette.grey[200],
    zIndex: 4,
    opacity: 0.7
  }
});

class ChangePasswordDialog extends React.Component {
  state = {
    currentPassword: '',
    newPassword: '',
    newPassword2: '',
    errors: {},
    isLoading: false
  };

  handleInputChange = prop => e => {
    const { value } = e.target;
    this.setState(() => ({ [prop]: value }));
  };

  handleReset = () => {
    this.setState(() => ({
      currentPassword: '',
      newPassword: '',
      newPassword2: '',
      errors: {},
      isLoading: false
    }));

    const { handleClose } = this.props;
    handleClose();
  };

  handleChangePassword = async e => {
    e.preventDefault();

    const { currentPassword, newPassword, newPassword2 } = this.state;
    const { userId } = this.props;

    this.setState(() => ({ isLoading: true }));

    if (newPassword !== newPassword2) {
      this.setState(() => ({
        errors: {
          newPassword: 'Xác nhận mật khẩu mới không trùng khớp.',
          newPassword2: 'Xác nhận mật khẩu mới không trùng khớp.'
        }
      }));
    } else {
      const changePasswordRequest = {
        password: currentPassword,
        newPassword
      };

      try {
        const response = await axios.put(`/api/users/${userId}/password`, changePasswordRequest);

        if (response.data.success) {
          this.handleReset();

          openSnackbar('Đổi mật khẩu thành công.');
        }
      } catch (error) {
        this.setState(() => ({
          errors: {
            currentPassword: 'Mật khẩu không chính xác'
          }
        }));
      }
    }

    this.setState(() => ({ isLoading: false }));
  };

  render() {
    const { currentPassword, newPassword, newPassword2, errors, isLoading } = this.state;
    const { open, handleClose, classes } = this.props;

    return (
      <Dialog open={open} onClose={handleClose} className={classes.root}>
        {isLoading && (
          <React.Fragment>
            <div className={classes.overlay} />
            <LinearProgress className={classes.progress} color="secondary" />
          </React.Fragment>
        )}
        <DialogTitle>Đổi mật khẩu</DialogTitle>
        <DialogContent>
          <DialogContentText>Để tiến hành đổi mật khẩu, xin vui lòng nhập mật khẩu hiện tại.</DialogContentText>
          <form onSubmit={this.handleChangePassword}>
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <TextField
                  required
                  label="Mật khẩu hiện tại"
                  fullWidth
                  autoFocus
                  value={currentPassword}
                  onChange={this.handleInputChange('currentPassword')}
                  error={!!errors.currentPassword}
                  helperText={errors.currentPassword}
                  type="password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  label="Mật khẩu mới"
                  fullWidth
                  value={newPassword}
                  onChange={this.handleInputChange('newPassword')}
                  error={!!errors.newPassword}
                  helperText={errors.newPassword}
                  type="password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  label="Xác nhận mật khẩu mới"
                  fullWidth
                  value={newPassword2}
                  onChange={this.handleInputChange('newPassword2')}
                  error={!!errors.newPassword2}
                  helperText={errors.newPassword2}
                  type="password"
                />
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary" type="submit">
                  Đổi mật khẩu
                </Button>
              </Grid>
              <Grid item>
                <Button onClick={this.handleReset} color="primary" type="reset">
                  Hủy bỏ
                </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
}

ChangePasswordDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
  userId: PropTypes.number.isRequired
};

export default withStyles(styles)(ChangePasswordDialog);
