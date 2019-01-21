import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import deburr from 'lodash/deburr';
import Downshift from 'downshift';
import axios from 'axios';
import { withStyles } from '@material-ui/core';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
// import Radio from '@material-ui/core/Radio';
// import RadioGroup from '@material-ui/core/RadioGroup';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
// import FormLabel from '@material-ui/core/FormLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import FormValidator from 'Utils/FormValidator';
import { openSnackbar } from 'GlobalComponents/Notification';
import RegisterModuleTable from './components/RegisterModuleTable';

let suggestions = [];

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
  },
  container: {
    flexGrow: 1,
    position: 'relative'
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0
  },
  inputRoot: {
    flexWrap: 'wrap'
  },
  inputInput: {
    width: 'auto',
    flexGrow: 1
  }
});

function renderInput(inputProps) {
  const { InputProps, classes, ref, ...other } = inputProps;

  return (
    <TextField
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
          input: classes.inputInput
        },
        ...InputProps
      }}
      {...other}
    />
  );
}

function renderSuggestion({ suggestion, index, itemProps, highlightedIndex }) {
  const isHighlighted = highlightedIndex === index;
  // const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.label}
      selected={isHighlighted}
      component="div"
      // style={{
      //   fontWeight: isSelected ? 500 : 400
      // }}
    >
      {suggestion.label}
    </MenuItem>
  );
}



function getSuggestions(value) {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : suggestions.filter(suggestion => {
      const keep =
        count < 5 && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

      if (keep) {
        count += 1;
      }

      return keep;
    });
}

class RegisterModuleForm extends React.Component {
  validator = new FormValidator([
    {
      field: 'termId',
      method: 'isEmpty',
      validWhen: false,
      message: 'Kỳ học không được bỏ trống.'
    },
    {
      field: 'moduleId',
      method: 'isEmpty',
      validWhen: false,
      message: 'Mã học phần không được bỏ trống.'
    }
  ]);

  state = {
    terms: [],
    modules: [],
    moduleIds: [],
    input: {
      moduleId: '',
      termId: ''
    },
    clientSideValidation: this.validator.valid(),
    hasEverClicked: false,
    hasEverSubmitted: false,
    isLoading: false,
    serverErrors: {},
    errors: {},
    totalNumOfCredits: 0
    // suggestions: {}
  };

  isMounted = false;

  async componentDidMount() {
    this.isMounted = true;

    try {
      const resTerm = await axios.get('/api/terms/status', {
        timeout: 100000
      });

      const resModule = await axios.get('/api/modules', {
        timeout: 100000
      });

      if (this.isMounted) {
        const { terms } = resTerm.data.details;

        suggestions = resModule.data.details.modules.map(module => {
          let tempModule = module;
          tempModule.value = module.moduleId;
          tempModule.label = `${module.moduleId} - ${module.name}`;
          return tempModule;
        });

        this.setState(() => ({
          terms
          // suggestions
        }));
      }
    } catch (error) {
      console.log(error);
    }
  }

  componentWillUnmount() {
    this.isMounted = false;
  }

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
      clientSideValidation: this.validator.valid(),
      hasEverClicked: false,
      hasEverSubmitted: false,
      serverErrors: {},
      errors: {}
    }));
  };

  handleDelete = moduleId => {
    const { moduleIds, modules } = this.state;
    const tempModuleIds = moduleIds.filter(n => n !== moduleId);
    const tempModules = modules.filter(n => n.module.moduleId !== moduleId);

    this.setState(() => ({ moduleIds: tempModuleIds, modules: tempModules }));
  };

  handleResetSubmit = () => {
    this.setState(() => ({
      terms: [],
      modules: [],
      moduleIds: [],
      input: {
        moduleId: '',
        termId: ''
      },
      clientSideValidation: this.validator.valid(),
      hasEverClicked: false,
      hasEverSubmitted: false,
      isLoading: false,
      serverErrors: {},
      errors: {}
    }));
  };

  handleInputChange = prop => e => {
    const { input } = this.state;
    const inputTemp = input;
    inputTemp[prop] = e.target.value;
    if (prop === 'moduleId') {
      inputTemp[prop] = inputTemp[prop].toUpperCase();
    }
    this.setState(() => ({ input: inputTemp }));
  };

  handleClickRegister = async e => {
    e.preventDefault();
    this.triggerLoadingState();

    this.setState(() => ({
      hasEverClicked: true,
      errors: {}
    }));

    const clientSideValidation = this.performClientSideValidation();
    this.setState(() => ({ clientSideValidation }));

    if (clientSideValidation.isValid) {
      const { auth } = this.props;
      const { input, modules, moduleIds, totalNumOfCredits } = this.state;
      const tempModules = [...modules];
      const tempModuleIds = [...moduleIds];
      let tempTotalNumOfCredits = totalNumOfCredits;
      const createStudentRegistrationRequestPayload = {
        moduleIds,
        termId: input.termId
      };

      if (tempModuleIds.indexOf(input.moduleId) !== -1) {
        this.turnOffLoadingState();
        this.setState(() => ({
          errors: {
            moduleId: 'Học phần này đã được chọn.'
          }
        }));
      } 
      
      else {
        try {
          console.log(`/api/students/${auth.user.sub}/${input.moduleId}`);
          const response = await axios.post(
            `/api/students/${auth.user.sub}/${input.moduleId}`,
            createStudentRegistrationRequestPayload
          );
          this.turnOffLoadingState();
          if (!response.data.success) {
            this.setState(() => ({ serverErrors: response.data.message }));
          } else {
            const responseGetModule = await axios.get(`/api/modules/${input.moduleId}`, {
              timeout: 10000
            });

            tempTotalNumOfCredits += responseGetModule.data.details.module.numOfCredits;

            if(tempTotalNumOfCredits > 24){
              this.turnOffLoadingState();
              this.setState(() => ({
                errors: {
                  moduleId: 'Không thể đăng ký thêm. Bạn đã đăng ký vượt quá số tín chỉ cho phép.'
                }
              }));
            }
            else{
            tempModules.push(responseGetModule.data.details);
            tempModuleIds.push(input.moduleId);
            

            this.setState(() => ({ modules: tempModules, moduleIds: tempModuleIds, totalNumOfCredits: tempTotalNumOfCredits }));
            this.handleReset();
            }
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
    }
    this.turnOffLoadingState();
  };

  handleSubmit = async e => {
    e.preventDefault();

    this.triggerLoadingState();

    this.setState(() => ({
      hasEverSubmitted: true,
      errors: {}
    }));

    const clientSideValidation = this.performClientSideValidation();
    this.setState(() => ({ clientSideValidation }));

    if (clientSideValidation.isValid) {
      const { auth, turnOnSuccessMessage } = this.props;
      const { moduleIds, input } = this.state;
      const createStudentRegistrationRequestPayload = {
        moduleIds,
        termId: input.termId
      };
      try {
        await axios.post(`/api/students/${auth.user.sub}/register-modules`, createStudentRegistrationRequestPayload);
        this.turnOffLoadingState();
        this.handleResetSubmit();
        turnOnSuccessMessage();
      } catch (err) {
        const { response } = err;
        if (response.status === 504) {
          openSnackbar('Máy chủ hiện không phản hồi. Vui lòng thử lại sau');
        } else {
          this.setState(() => ({ serverErrors: response.data.errors }));
        }
      }
    }

    this.turnOffLoadingState();
  };

  turnOnSuccessMessage = () => {
    this.setState(() => ({ successMessageOn: true }));
  };

  turnOffSuccessMessage = () => {
    this.setState(() => ({ successMessageOn: false }));
  };

  handleDownshiftChange = selection => {
    const { input } = this.state;
    const inputTemp = input;
    inputTemp.moduleId = selection.value;
    this.setState(() => ({ input: inputTemp }));
    console.log(input);
  };

  render() {
    console.log(suggestions);
    const { classes } = this.props;
    const {
      input,
      terms,
      modules,
      hasEverClicked,
      hasEverSubmitted,
      clientSideValidation,
      isLoading,
      serverErrors,
      errors, 
      totalNumOfCredits
      // suggestions
    } = this.state;
    console.log(input);

    let validation = hasEverSubmitted || hasEverClicked ? this.validator.validate(input) : clientSideValidation;

    const Loading = () => (
      <React.Fragment>
        <div className={classes.overlay} />
        <LinearProgress className={classes.progress} color="secondary" />
      </React.Fragment>
    );

    return (
      <React.Fragment>
        {isLoading && <Loading />}
        <Grid container spacing={24}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth error={validation.termId.isInvalid}>
              <InputLabel htmlFor="termId">Kỳ học</InputLabel>
              <Select
                value={input.termId}
                onChange={this.handleInputChange('termId')}
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
            {/* <TextField
              id="modelId"
              label="Mã học phần"
              fullWidth
              value={input.moduleId}
              onChange={this.handleInputChange('moduleId')}
              error={!!errors.moduleId || !!serverErrors.moduleId || validation.moduleId.isInvalid}
              helperText={errors.moduleId || serverErrors.moduleId || '' || validation.moduleId.message}
            /> */}
            <Downshift
              id="downshift-simple"
              onChange={this.handleDownshiftChange}
              itemToString={item => (item ? item.value : '')}
            >
              {({
                getInputProps,
                getItemProps,
                getMenuProps,
                highlightedIndex,
                inputValue,
                isOpen,
                selectedItem
                // getLabelProps
              }) => (
                  <div className={classes.container}>

                    {renderInput({
                      fullWidth: true,
                      classes,
                      InputProps: getInputProps({
                        placeholder: 'Mã học phần'
                      }),
                      label: 'Mã học phần',
                      // value: input.moduleId,
                      // onChange: this.handleInputChange('moduleId'),
                      error: !!errors.moduleId || !!serverErrors.moduleId || validation.moduleId.isInvalid,
                      helperText: errors.moduleId || serverErrors.moduleId || '' || validation.moduleId.message
                    })}
                    <div {...getMenuProps()}>
                      {isOpen ? (
                        <Paper className={classes.paper} square>
                          {getSuggestions(inputValue).map((suggestion, index) =>
                            renderSuggestion({
                              suggestion,
                              index,
                              itemProps: getItemProps({ item: suggestion }),
                              highlightedIndex,
                              selectedItem
                            })
                          )}
                        </Paper>
                      ) : null}
                    </div>
                  </div>
                )}
            </Downshift>
          </Grid>

          <Grid item xs={12} sm={2}>
            <Button className={classes.button} variant="contained" color="primary" onClick={this.handleClickRegister}>
              Đăng ký
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            Số tín chỉ đã chọn: {totalNumOfCredits}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            Số tín chỉ đăng ký tối đa: 24
          </Typography>
        </Grid>
        <RegisterModuleTable data={modules} handleDelete={this.handleDelete} />
        <Button className={classes.button} variant="contained" color="primary" onClick={this.handleSubmit}>
          Gửi đăng ký
        </Button>
      </React.Fragment>
    );
  }
}

RegisterModuleForm.propTypes = {
  classes: PropTypes.shape({}).isRequired
};

const mapStateToProps = ({ auth }) => ({
  auth
});

const StyleRegisterModuleForm = withStyles(styles)(RegisterModuleForm);

export default connect(mapStateToProps)(StyleRegisterModuleForm);
