import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { withStyles } from '@material-ui/core/styles';

import AccountCircle from '@material-ui/icons/AccountCircle';
import Lock from '@material-ui/icons/Lock';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import LinearProgress from '@material-ui/core/LinearProgress';

import FormValidator from 'Utils/FormValidator';
import { openSnackbar } from 'GlobalComponents/Notification';

const styles = theme => ({
  root: {
    zIndex: 2,
    width: '100%'
  },
  progress: {
    position: 'absolute',
    width: '100%',
    left: '0',
    bottom: '0'
  },
  form: {
    display: 'flex',
    marginTop: `${theme.spacing.unit * 0.1}rem`,
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    zIndex: 100
  },
  input: {
    marginBottom: `${theme.spacing.unit * 0.1}rem`
  },
  action: {
    alignItems: 'center',
    display: 'flex',
    marginTop: `${theme.spacing.unit * 0.1}rem`,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  button: {
    textTransform: 'none',
    marginBottom: `${theme.spacing.unit * 0.08}rem`
  }
});

class LoginForm extends React.Component {
  validator = new FormValidator([
    {
      field: 'username',
      method: 'isEmpty',
      validWhen: false,
      message: 'Bạn cần phải nhập tài khoản.'
    },
    {
      field: 'password',
      method: 'isEmpty',
      validWhen: false,
      message: 'Bạn cần phải nhập mật khẩu.'
    }
  ]);

  state = {
    username: '',
    password: '',
    showPassword: false,
    errors: {},
    isLoading: false,
    validation: this.validator.valid(),
    hasEverSubmitted: false
  };

  isMounted = false;

  componentDidMount() {
    this.isMounted = true;
  }

  componentDidUpdate(prevProps, prevState) {
    const { errors } = this.state;
    this.showSnackbarIfDifferentMessage(prevState.errors.notificationMsg, errors.notificationMsg);
  }

  componentWillUnmount() {
    this.isMounted = false;
  }

  showSnackbarIfDifferentMessage = (prevMessage, currentMessage) => {
    if (prevMessage !== currentMessage) {
      openSnackbar(currentMessage);
    }
  };

  handleChange = prop => e => {
    const { value } = e.target;
    this.setState(() => ({ [prop]: value }));
  };

  handleMouseDownPassword = e => {
    e.preventDefault();
  };

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  performClientSideValidation = () => {
    const validation = this.validator.validate(this.state);

    this.setState(() => ({
      errors: {},
      validation,
      hasEverSubmitted: true
    }));

    return validation;
  };

  triggerLoadingState = () => {
    this.setState(() => ({
      errors: {},
      isLoading: true
    }));
  };

  turnOffLoadingState = () => {
    this.setState(() => ({ isLoading: false }));
  };

  showSubmitErrors = errors => {
    this.setState(() => ({
      errors
    }));
  };

  getUserData = () => {
    const { username, password } = this.state;

    return {
      username,
      password
    };
  };

  submitUserDataToServer = async () => {
    this.triggerLoadingState();

    const userData = this.getUserData();
    const { postUserDataToServer } = this.props;
    const errors = await postUserDataToServer(userData);

    if (this.isMounted) {
      if (!isEmpty(errors)) {
        this.showSubmitErrors(errors);
      }
      this.turnOffLoadingState();
    }
  };

  handleSubmit = e => {
    e.preventDefault();

    const clientSideValidation = this.performClientSideValidation();

    if (clientSideValidation.isValid) {
      this.submitUserDataToServer();
    }
  };

  render() {
    const {
      errors,
      hasEverSubmitted,
      username,
      password,
      showPassword,
      isLoading,
      validation: stateValidation
    } = this.state;
    const { classes } = this.props;

    const validation = hasEverSubmitted ? this.validator.validate(this.state) : stateValidation;

    const usernameInputField = (
      <FormControl error={!!errors.username || validation.username.isInvalid} className={classes.input}>
        <InputLabel htmlFor="username">Tài khoản</InputLabel>
        <Input
          id="username"
          value={username}
          onChange={this.handleChange('username')}
          disabled={isLoading}
          startAdornment={
            <InputAdornment position="start">
              <AccountCircle />
            </InputAdornment>
          }
        />
        <FormHelperText id="username-error-text">{errors.username || '' || validation.username.message}</FormHelperText>
      </FormControl>
    );

    const passwordInputField = (
      <FormControl error={!!errors.password || validation.password.isInvalid} className={classes.input}>
        <InputLabel htmlFor="password">Mật khẩu</InputLabel>
        <Input
          id="password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={this.handleChange('password')}
          disabled={isLoading}
          startAdornment={
            <InputAdornment position="start">
              <Lock />
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="Toggle password visibility"
                onClick={this.handleClickShowPassword}
                onMouseDown={this.handleMouseDownPassword}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        <FormHelperText id="password-error-text">{errors.password || '' || validation.password.message}</FormHelperText>
      </FormControl>
    );

    const buttonGroup = (
      <div className={classes.action}>
        <Button
          type="submit"
          className={classes.button}
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading}
        >
          Đăng nhập
        </Button>
        <Button type="button" className={classes.button} color="primary" disabled={isLoading}>
          Quên mật khẩu?
        </Button>
      </div>
    );

    const progressBar = isLoading && <LinearProgress className={classes.progress} color="secondary" />;

    return (
      <div className={classes.root}>
        <form className={classes.form} onSubmit={this.handleSubmit}>
          {usernameInputField}
          {passwordInputField}
          {buttonGroup}
        </form>
        {progressBar}
      </div>
    );
  }
}

LoginForm.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  postUserDataToServer: PropTypes.func.isRequired
};

const StyledLoginForm = withStyles(styles)(LoginForm);

export { LoginForm, StyledLoginForm };

export default StyledLoginForm;
