import React from 'react';
import PropTypes from 'prop-types';
import { Prompt } from 'react-router';
import axios from 'axios';
import _ from 'lodash';

import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Paper from '@material-ui/core/Paper';

import Section from 'Shells/Section';
import ModuleBaseInfoForm from './components/ModuleBaseInfoForm';
import ModuleRequisiteForm from './components/ModuleRequisiteForm';
import CreateModuleReview from './components/CreateModuleReview';
import SuccessNotice from './components/SuccessNotice';

// FIXME: This screen needs serious refactoring (Lift state up)

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    position: 'relative'
  },
  stepper: {
    background: 'none',
    padding: `${theme.spacing.unit}px 0 ${theme.spacing.unit * 2}px`
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-start'
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit
  }
});

const checkIfAllObjectPropertiesEmpty = obj => {
  let isAllPropertiesEmpty = true;
  Object.keys(obj).forEach(key => {
    if (obj[key] !== null && obj[key] !== '') {
      isAllPropertiesEmpty = false;
    }
  });
  return isAllPropertiesEmpty;
};

class CreateModule extends React.Component {
  state = {
    steps: ['Thông tin cơ bản', 'Thông tin điều kiện', 'Xác nhận tạo học phần'],
    activeStep: 0,
    moduleBaseInfo: {},
    moduleRequisiteInfo: {},
    shouldBlockNavigation: false
  };

  componentWillUnmount() {
    this.unblockNavigation();
  }

  resetState = () => {
    this.setState(() => ({
      moduleBaseInfo: {},
      moduleRequisiteInfo: {},
      shouldBlockNavigation: false
    }));
  };

  moveOneStepForward = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1
    }));
  };

  moveOneStepBackward = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }));
  };

  moveToInitialStep = () => {
    this.setState(() => ({
      activeStep: 0
    }));
  };

  unblockNavigation = () => {
    this.setState(() => ({ shouldBlockNavigation: false }));
    window.onbeforeunload = undefined;
  };

  blockNavigation = () => {
    this.setState(() => ({ shouldBlockNavigation: true }));
    window.onbeforeunload = () => true;
  };

  updateModuleBaseInfoForReview = moduleBaseInfo => {
    if (_.isEmpty(moduleBaseInfo)) {
      this.unblockNavigation();
    } else if (checkIfAllObjectPropertiesEmpty(moduleBaseInfo)) {
      this.unblockNavigation();
    } else {
      this.blockNavigation();
    }

    this.setState(() => ({ moduleBaseInfo }));
  };

  updateModuleRequisiteInfoForReview = moduleRequisiteInfo => {
    this.setState(() => ({ moduleRequisiteInfo }));
  };

  submitCreateModuleForm = async () => {
    try {
      const { moduleBaseInfo, moduleRequisiteInfo } = this.state;
      let coRequisiteModuleIds = [];
      let readRequisiteModuleIds = [];
      let passRequisiteModuleIds = [];

      if (!_.isEmpty(moduleRequisiteInfo) && !checkIfAllObjectPropertiesEmpty(moduleRequisiteInfo)) {
        coRequisiteModuleIds = moduleRequisiteInfo.coRequisiteModules.map(module => module.split(' - ')[0]);
        readRequisiteModuleIds = moduleRequisiteInfo.readRequisiteModules.map(module => module.split(' - ')[0]);
        passRequisiteModuleIds = moduleRequisiteInfo.passRequisiteModules.map(module => module.split(' - ')[0]);
      }

      const createModuleRequestPayload = {
        moduleId: moduleBaseInfo.moduleId,
        name: moduleBaseInfo.name,
        numOfCredits: parseInt(moduleBaseInfo.numOfCredits, 10),
        numOfFeeCredits: parseFloat(moduleBaseInfo.numOfFeeCredits),
        weight: parseFloat(moduleBaseInfo.weight),
        coRequisiteModuleIds,
        readRequisiteModuleIds,
        passRequisiteModuleIds
      };

      const response = await axios.post('/api/modules', createModuleRequestPayload);

      if (response.data.success) {
        this.resetState();
        this.moveOneStepForward();
      }
    } catch (error) {
      const doNothing = () => {};
      doNothing();
    }
  };

  render() {
    const { classes } = this.props;
    const { steps, activeStep, moduleBaseInfo, moduleRequisiteInfo, shouldBlockNavigation } = this.state;
    return (
      <React.Fragment>
        <Prompt when={shouldBlockNavigation} message="Bạn vẫn còn những thay đổi chưa đuơcj lưu, bạn có chắc chắn muốn rời đi không?" />
        <Section header="HỌC PHẦN" subheader="TẠO HỌC PHẦN">
          <Paper className={classes.root} elevation={1}>
            <Stepper activeStep={activeStep} className={classes.stepper}>
              {steps.map(label => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <React.Fragment>
              {activeStep === steps.length ? (
                <SuccessNotice parentClasses={classes} handleReset={this.moveToInitialStep} />
              ) : (
                <React.Fragment>
                  <ModuleBaseInfoForm
                    parentClasses={classes}
                    handleNext={this.moveOneStepForward}
                    show={activeStep === 0}
                    updateModuleBaseInfoForReview={this.updateModuleBaseInfoForReview}
                  />
                  <ModuleRequisiteForm
                    parentClasses={classes}
                    handleNext={this.moveOneStepForward}
                    handleBack={this.moveOneStepBackward}
                    show={activeStep === 1}
                    updateModuleRequisiteInfoForReview={this.updateModuleRequisiteInfoForReview}
                  />
                  <CreateModuleReview
                    parentClasses={classes}
                    submitCreateModuleForm={this.submitCreateModuleForm}
                    handleBack={this.moveOneStepBackward}
                    moduleBaseInfo={moduleBaseInfo}
                    moduleRequisiteInfo={moduleRequisiteInfo}
                    show={activeStep === 2}
                  />
                </React.Fragment>
              )}
            </React.Fragment>
          </Paper>
        </Section>
      </React.Fragment>
    );
  }
}

CreateModule.propTypes = {
  classes: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(CreateModule);
