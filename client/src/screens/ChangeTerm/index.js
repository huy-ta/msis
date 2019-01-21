import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import axios from 'axios';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

import Section from 'Shells/Section';
import FormValidator from 'Utils/FormValidator';
import { openSnackbar } from 'GlobalComponents/Notification';

const termStatus = [
  { id: 'ABOUT_TO_START', name: 'Chuẩn bị bắt đầu' },
  { id: 'MODULES_REGISTERING', name: 'Đang đăng ký' },
  { id: 'ONGOING', name: 'Đang học' },
  { id: 'FINISHED', name: 'Đã kết thúc' }
];

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    position: 'relative',
    overflow: 'hidden'
  },
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

class ChangeTerm extends React.Component {
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
    terms: [],
    statusDropdownOpenStateTermId: false,
    statusDropdownOpenStateStatus: false,
    clientSideValidation: this.validator.valid(),
    hasEverSubmitted: false,
    isLoading: false,
    currentStatus: '',
    changeStatus: '',
    errors: {}
  };

  isMounted = false;

  async componentDidMount() {
    this.isMounted = true;

    try {
      const response = await axios.get('/api/terms', {
        timeout: 100000
      });

      if (this.isMounted) {
        const { terms } = response.data.details;
        this.setState(() => ({ terms }));
      }
    } catch (err) {
      const { response } = err;
      if (response.status === 504) {
        openSnackbar('Máy chủ hiện không phản hồi. Vui lòng thử lại sau');
      } else {
        this.setState(() => ({ serverErrors: response.data.errors }));
      }
    }
  }

  componentWillUnmount() {
    this.isMounted = false;
  }

  handleInputChange = prop => e => {
    const { input, terms } = this.state;
    const inputTemp = input;
    inputTemp[prop] = e.target.value;
    this.setState(() => ({ input: inputTemp }));
    if(prop === 'termId'){
      terms.forEach(term => {
        if(term.termId === input.termId){
          if(term.status === 'ABOUT_TO_START') this.setState({currentStatus: 'Chuẩn bị bắt đầu'});
          if(term.status === 'MODULES_REGISTERING') this.setState({currentStatus: 'Đang đăng ký'});
          if(term.status === 'ONGOING') this.setState({currentStatus: 'Đang học'});
          if(term.status === 'FINISHED') this.setState({currentStatus: 'Đã kết thúc'});
        }
      })
    }
    if(prop === 'status'){
      if(input.status === 'ABOUT_TO_START') this.setState({changeStatus: 'Chuẩn bị bắt đầu'});
      if(input.status === 'MODULES_REGISTERING') this.setState({changeStatus: 'Đang đăng ký'});
      if(input.status === 'ONGOING') this.setState({changeStatus: 'Đang học'});
      if(input.status === 'FINISHED') this.setState({changeStatus: 'Đã kết thúc'});
    }
  };

  handleStatusDropdownCloseTermId = () => {
    this.setState({ statusDropdownOpenStateTermId: false });
  };

  handleStatusDropdownOpenTermId = () => {
    this.setState({ statusDropdownOpenStateTermId: true });
  };

  handleStatusDropdownCloseStatus = () => {
    this.setState({ statusDropdownOpenStateStatus: false });
  };

  handleStatusDropdownOpenStatus = () => {
    this.setState({ statusDropdownOpenStateStatus: true });
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
      hasEverSubmitted: false
    }));
  };

  handleSubmit = async e => {
    e.preventDefault();

    this.triggerLoadingState();

    this.setState(() => ({
      hasEverSubmitted: true
    }));

    const clientSideValidation = this.performClientSideValidation();
    this.setState(() => ({ clientSideValidation }));

    if (clientSideValidation.isValid) {
      const { input, changeStatus, currentStatus } = this.state;

      if(changeStatus === currentStatus){
        this.turnOffLoadingState();
        this.setState(() => ({
          errors: {
            status: 'Trạng thái thay đổi trùng với trạng thái hiện tại.'
          }
        }))
      }else{
        try {
          await axios.put('/api/terms', input);
          this.turnOffLoadingState();
          this.handleReset();
          openSnackbar('Thay đổi trạng thái kỳ học thành công.');
        } catch (err) {
          const { response } = err;
          if (response.status === 504) {
            openSnackbar('Máy chủ hiện không phản hồi. Vui lòng thử lại sau');
            console.log('open snackbar error');
          } else {
            this.setState(() => ({ serverErrors: response.data.errors }));
          }
      }
      }
    }

    this.turnOffLoadingState();
  };

  render() {
    const { classes } = this.props;
    const {
      terms,
      input,
      statusDropdownOpenStateTermId,
      statusDropdownOpenStateStatus,
      hasEverSubmitted,
      clientSideValidation,
      isLoading,
      currentStatus, 
      errors
    } = this.state;

    let validation = hasEverSubmitted ? this.validator.validate(input) : clientSideValidation;

    const Loading = () => (
      <React.Fragment>
        <div className={classes.overlay} />
        <LinearProgress className={classes.progress} color="secondary" />
      </React.Fragment>
    );

    return (
      <Section header="HỌC KỲ" subheader="THAY ĐỔI TRẠNG THÁI">
        <Paper className={classes.root}>
          {isLoading && <Loading />}
          <form className={classes.root} onSubmit={this.handleSubmit}>
            <Grid container spacing={24}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={validation.termId.isInvalid}>
                  <InputLabel htmlFor="termId">Kỳ học</InputLabel>
                  <Select
                    value={input.termId}
                    onChange={this.handleInputChange('termId')}
                    open={statusDropdownOpenStateTermId}
                    onClose={this.handleStatusDropdownCloseTermId}
                    onOpen={this.handleStatusDropdownOpenTermId}
                    inputProps={{
                      name: 'termId',
                      id: 'termId'
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {terms.map(term => (
                      <MenuItem value={term.termId}>{term.termId}</MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{validation.termId.message}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.status || validation.status.isInvalid}>
                  <InputLabel htmlFor="status">Trạng thái</InputLabel>
                  <Select
                    value={input.status}
                    onChange={this.handleInputChange('status')}
                    open={statusDropdownOpenStateStatus}
                    onClose={this.handleStatusDropdownCloseStatus}
                    onOpen={this.handleStatusDropdownOpenStatus}
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
                  <FormHelperText>{errors.status || validation.status.message}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                Trạng thái kỳ học hiện tại:   {currentStatus}
              </Typography>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" className={classes.button} variant="contained" color="primary">
                Thay đổi trạng thái kỳ học
              </Button>
            </Grid>
          </form>
        </Paper>
      </Section>
    );
  }
}

ChangeTerm.propTypes = {
  classes: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(ChangeTerm);
