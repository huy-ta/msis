import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withStyles } from '@material-ui/core';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import LinearProgress from '@material-ui/core/LinearProgress';
import FormHelperText from '@material-ui/core/FormHelperText'

import FormValidator from 'Utils/FormValidator';
import { openSnackbar } from 'GlobalComponents/Notification';

const roleList = [
  { id: 'ROLE_STUDENT', name: 'Sinh viên' },
  { id: 'ROLE_ADMIN', name: 'Quản trị viên' },
  { id: 'ROLE_MANAGER', name: 'Cán bộ phòng đào tạo' }
];

const styles = theme => ({
  root: {},
  textField: {},
  formControl: {},
  button: {
    marginTop: theme.spacing.unit * 0.7,
    marginRight: theme.spacing.unit * 0.7
  },
  progress: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    zIndex: 3
  },
  overlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    background: theme.palette.grey[500],
    opacity: 0.4,
    zIndex: 2
  }
});

const defaultInput = () => ({
  role: '',
  name: '',
  username: '',
  password: ''
});

class CreateUserForm extends React.Component {
  validator = new FormValidator([
    {
      field: 'role',
      method: 'isEmpty',
      validWhen: false,
      message: 'Loại tài khoản không được bỏ trống.'
    },
    {
      field: 'name',
      method: 'isEmpty',
      validWhen: false,
      message: 'Họ tên người dùng không được bỏ trống.'
    },
    {
      field: 'username',
      method: 'isEmpty',
      validWhen: false,
      message: 'Tài khoản không được bỏ trống.'
    },
    {
      field: 'password',
      method: 'isEmpty',
      validWhen: false,
      message: 'Mật khẩu không được bỏ trống.'
    }
  ]);

  state = {
    input: defaultInput(),
    autoCreateState: false,
    roleDropdownOpenState: false,
    clientSideValidation: this.validator.valid(),
    hasEverSubmitted: false,
    isLoading: false,
    serverErrors: {}
  }

  handleInputChange = prop => e => {
    const { input } = this.state;
    const inputTemp = input;
    inputTemp[prop] = e.target.value;
    this.setState(() => ({ input: inputTemp }));
  };

  handleAutoCreateChange = e => {
    this.setState({ autoCreateState: e.target.checked });

    const {autoCreateState, input} = this.state;
    
    let usernameAuto = '';
    let inputTemp = input;
    let max = 999;
    let min = 100;
    let random = Math.floor(Math.random()*(max-min+1)+min);
    let password = random.toString() + random.toString();

    if (!autoCreateState) {
      if (input.name !== '') {
        usernameAuto = input.name.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        usernameAuto = usernameAuto.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        usernameAuto = usernameAuto.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        usernameAuto = usernameAuto.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        usernameAuto = usernameAuto.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        usernameAuto = usernameAuto.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        usernameAuto = usernameAuto.replace(/đ/g, "d");
        usernameAuto = usernameAuto.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        usernameAuto = usernameAuto.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        usernameAuto = usernameAuto.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        usernameAuto = usernameAuto.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        usernameAuto = usernameAuto.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        usernameAuto = usernameAuto.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        usernameAuto = usernameAuto.replace(/Đ/g, "D"); 
        let arr = usernameAuto.split(' ');
        usernameAuto = arr[arr.length - 1];
        usernameAuto = usernameAuto.concat(random);
      }
      
      inputTemp.username = usernameAuto;
      inputTemp.password = password;
      this.setState(() => ({ input: inputTemp}));
    }
    else{
      inputTemp.username = '';
      inputTemp.password = '';
      this.setState(() => ({input: inputTemp}));
    }
  };

  handleStatusDropdownClose = () => {
    this.setState({ roleDropdownOpenState: false });
  };

  handleStatusDropdownOpen = () => {
    this.setState({ roleDropdownOpenState: true });
  };

  triggerLoadingState = () => {
    this.setState(() => ({ isLoading: true }));
  };

  turnOffLoadingState = () => {
    this.setState(() => ({ isLoading: false }));
  };

  performClientSideValidation = () => {
    const { input } = this.state;
    return this.validator.validate(input);
  };

  handleReset = () => {
    this.setState(() => ({
      input: defaultInput(),
      clientSideValidation: this.validator.valid(),
      hasEverSubmitted: false,
      serverErrors: {}
    }));
  };

  handleSubmit = async e => {
    console.log('submit');
    e.preventDefault();
    
    this.triggerLoadingState();
    console.log('start loading');

    this.setState(() => ({
      hasEverSubmitted: true
    }));

    const clientSideValidation = this.performClientSideValidation();
    this.setState(() => ({ clientSideValidation }));

    if (clientSideValidation.isValid) {
      const { turnOnSuccessMessage } = this.props;
      const { input } = this.state;
      try {
        await axios.post('/api/users', input);
        this.turnOffLoadingState();
        console.log('create user');
        this.handleReset();
        turnOnSuccessMessage();
        openSnackbar('Thêm tài khoản thành công.');
        console.log('open snackbar');
      } catch (err) {
        const { response } = err;
        if (response.status === 504) {
          openSnackbar("Máy chủ hiện không phản hồi. Vui lòng thử lại sau");
          console.log('open snackbar error');
        } else {
          this.setState(() => ({ serverErrors: response.data.errors }));
          // console.log(this.state.serverErrors);
        }
      }
    }
    
    this.turnOffLoadingState();
    console.log('stop loading');
  };

  render() {
    const { classes } = this.props;
    const {
      input,
      autoCreateState,
      roleDropdownOpenState,
      hasEverSubmitted,
      clientSideValidation,
      isLoading,
      serverErrors
    } = this.state;

    let validation = hasEverSubmitted ? this.validator.validate(input) : clientSideValidation;

    const Loading = () => (
      <React.Fragment>
        <div className={classes.overlay} />
        <LinearProgress className={classes.progress} color="secondary" />
      </React.Fragment>
    );

    return (
      <React.Fragment>
        {console.log(input)}
        {this.CreateUserAuto}
        {isLoading && <Loading />}
        <form className={classes.root} onSubmit={this.handleSubmit}>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth error={validation.role.isInvalid}>
                <InputLabel htmlFor="role">Loại tài khoản</InputLabel>
                <Select
                  value={input.role}
                  onChange={this.handleInputChange('role')}
                  open={roleDropdownOpenState}
                  onClose={this.handleStatusDropdownClose}
                  onOpen={this.handleStatusDropdownOpen}
                  inputProps={{
                    name: 'role',
                    id: 'role'
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {roleList.map(role => (
                    <MenuItem value={role.id}>{role.name}</MenuItem>
                  ))}
                </Select>
                <FormHelperText>{validation.role.message}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={8}>
              <FormControlLabel
                control={
                  <Checkbox
                    value="autoCreateState"
                    checked={autoCreateState}
                    onChange={this.handleAutoCreateChange}
                    color='primary'
                  />
                }
                label="Tạo tài khoản tự động"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                id="name"
                name="name"
                label="Họ tên"
                value={input.name}
                onChange={this.handleInputChange('name')}
                error={!!serverErrors.name || validation.name.isInvalid}
                helperText={serverErrors.name || '' || validation.name.message}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                id="username"
                name="username"
                label="Tài khoản"
                value={input.username}
                onChange={this.handleInputChange('username')}
                error={!!serverErrors.username || validation.username.isInvalid}
                helperText={serverErrors.username || '' || validation.username.message}
                fullWidth
                inputProps={{
                  disabled: autoCreateState
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                id="password"
                label="Mật khẩu"
                value={input.password}
                onChange={this.handleInputChange('password')}
                error={!!serverErrors.password || validation.password.isInvalid}
                helperText={serverErrors.password || '' || validation.password.message}
                fullWidth
                inputProps={{
                  disabled: autoCreateState
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" className={classes.button} variant="contained" color="primary" >
                Tạo tài khoản
              </Button>
            </Grid>
          </Grid>
        </form>
      </React.Fragment>
    );
  }

}

CreateUserForm.propTypes = {
  classes: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(CreateUserForm);