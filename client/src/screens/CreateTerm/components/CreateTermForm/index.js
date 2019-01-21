import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withStyles } from '@material-ui/core';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import FormHelperText from '@material-ui/core/FormHelperText';

import FormValidator from 'Utils/FormValidator';
import { openSnackbar } from 'GlobalComponents/Notification';

const termStatus = [
  { id: 'ABOUT_TO_START', name: 'Chuẩn bị bắt đầu' },
  { id: 'MODULES_REGISTERING', name: 'Đang đăng ký' }
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
  status: '',
  termId: ''
});

class CreateTermForm extends React.Component {
  validator = new FormValidator([
    {
      field: 'termId',
      method: 'isEmpty',
      validWhen: false,
      message: 'Kỳ học không được bỏ trống.'
    },
    {
      field: 'status',
      method: 'isEmpty',
      validWhen: false,
      message: 'Trạng thái không được bỏ trống.'
    }
  ]);

  state = {
    input: defaultInput(),
    statusDropdownOpenState: false,
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

  handleStatusDropdownClose = () => {
    this.setState({ statusDropdownOpenState: false });
  };

  handleStatusDropdownOpen = () => {
    this.setState({ statusDropdownOpenState: true });
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
        await axios.post('/api/terms', input);
        this.turnOffLoadingState();
        console.log('create term');
        this.handleReset();
        turnOnSuccessMessage();
        openSnackbar('Thêm kỳ học thành công.');
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
      statusDropdownOpenState,
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
        {isLoading && <Loading />}
        <form className={classes.root} onSubmit={this.handleSubmit}>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={6}>
              <TextField
                id="termId"
                name='termId'
                label="Kỳ học"
                value={input.termId}
                onChange={this.handleInputChange('termId')}
                error={!!serverErrors.termId || validation.termId.isInvalid}
                helperText={serverErrors.termId || '' || validation.termId.message}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={validation.status.isInvalid}>
                <InputLabel htmlFor="status">Trạng thái</InputLabel>
                <Select
                  value={input.status}
                  onChange={this.handleInputChange('status')}
                  open={statusDropdownOpenState}
                  onClose={this.handleStatusDropdownClose}
                  onOpen={this.handleStatusDropdownOpen}
                  inputProps={{
                    name: 'status',
                    id: 'status'
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {termStatus.map(status => (
                    <MenuItem value={status.id}>{status.name}</MenuItem>
                  ))}
                </Select>
                <FormHelperText>{validation.status.message}</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" className={classes.button} variant="contained" color="primary" >
              Tạo kỳ học
            </Button>
          </Grid>
        </form>
      </React.Fragment>
    );
  }

}

CreateTermForm.propTypes = {
  classes: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(CreateTermForm);