import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";

import FormValidator from "Utils/FormValidator";

const styles = theme => ({
  progress: {
    position: "absolute",
    width: "100%",
    left: "0",
    bottom: "0",
    zIndex: 5
  },
  overlay: {
    position: "absolute",
    top: "0",
    right: "0",
    bottom: "0",
    left: "0",
    width: "100%",
    height: "100%",
    background: theme.palette.grey[200],
    zIndex: 4,
    opacity: 0.7
  }
});

class ModuleBaseInfoForm extends React.Component {
  validator = new FormValidator([
    {
      field: "moduleId",
      method: "isEmpty",
      validWhen: false,
      message: "Mã học phần không được bỏ trống."
    },
    {
      field: "moduleId",
      method: "matches",
      args: [/^[A-Z]{2,3}[0-9]{4}$/],
      validWhen: true,
      message: "Mã học phần phải đúng định dạng."
    },
    {
      field: "name",
      method: "isEmpty",
      validWhen: false,
      message: "Tên học phần không được bỏ trống."
    },
    {
      field: "numOfCredits",
      method: "isEmpty",
      validWhen: false,
      message: "Số tín chỉ không được bỏ trống."
    },
    {
      field: "numOfFeeCredits",
      method: "isEmpty",
      validWhen: false,
      message: "Số tín chỉ học phí không được bỏ trống."
    },
    {
      field: "weight",
      method: "isEmpty",
      validWhen: false,
      message: "Trọng số không được bỏ trống."
    }
  ]);

  state = {
    input: {
      moduleId: "",
      name: "",
      numOfCredits: "",
      numOfFeeCredits: "",
      weight: ""
    },
    serverErrors: {},
    hasEverSubmitted: false,
    validation: this.validator.valid(),
    isLoading: false
  };

  triggerLoadingState = () => {
    this.setState(() => ({ isLoading: true }));
  };

  turnOffLoadingState = () => {
    this.setState(() => ({ isLoading: false }));
  };

  performClientSideValidation = () => {
    const { input } = this.state;
    const validation = this.validator.validate(input);

    this.setState(() => ({
      validation,
      serverErrors: {},
      hasEverSubmitted: true
    }));

    return validation;
  };

  handleInputChange = fieldName => e => {
    const { updateModuleBaseInfoForReview } = this.props;
    let { value } = e.target;
    if (fieldName === "name" && value.length > 0) {
      value = value.replace(value[0], value[0].toUpperCase());
    }
    if (fieldName === "numOfCredits") if (!value.match(/^\d{0,2}$/)) return;
    if (fieldName === "numOfFeeCredits")
      if (!value.match(/^\d{0,2}(\.\d{0,1})?$/)) return;
    if (fieldName === "weight")
      if (!value.match(/^0{0,1}(\.\d{0,2})?$/)) return;

    const { input } = this.state;
    input[fieldName] = value;
    this.setState(() => ({ input }));
    updateModuleBaseInfoForReview(input);
  };

  checkIfModuleIdDuplicated = async () => {
    const { input } = this.state;
    const { moduleId } = input;

    try {
      const response = await axios.get(`/api/modules/${moduleId}`);

      if (response.data.success) {
        return true;
      }
    } catch (error) {
      return false;
    }
  };

  handleClickNext = async () => {
    const { handleNext, updateModuleBaseInfoForReview } = this.props;

    this.triggerLoadingState();

    const clientSideValidation = this.performClientSideValidation();

    if (clientSideValidation.isValid) {
      const { input } = this.state;

      const isModuleIdDuplicated = await this.checkIfModuleIdDuplicated();
      if (!isModuleIdDuplicated) {
        updateModuleBaseInfoForReview(input);
        handleNext();
      } else {
        this.setState(() => ({
          serverErrors: { moduleId: "Mã học phần này đã tồn tại rồi." }
        }));
      }
    }

    this.turnOffLoadingState();
  };

  render() {
    const {
      input,
      validation: stateValidation,
      hasEverSubmitted,
      serverErrors,
      isLoading
    } = this.state;
    const { parentClasses, show, classes } = this.props;

    const clientSideValidation = hasEverSubmitted
      ? this.validator.validate(input)
      : stateValidation;

    if (show) {
      return (
        <React.Fragment>
          <Typography variant="h6" gutterBottom>
            Thông tin cơ bản
          </Typography>
          <form>
            <Grid container spacing={24}>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  id="module-id"
                  name="module-id"
                  label="Mã học phần"
                  fullWidth
                  autoFocus
                  value={input.moduleId}
                  onChange={this.handleInputChange("moduleId")}
                  error={
                    !!serverErrors.moduleId ||
                    clientSideValidation.moduleId.isInvalid
                  }
                  helperText={
                    serverErrors.moduleId ||
                    "" ||
                    clientSideValidation.moduleId.message
                  }
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  required
                  id="name"
                  name="name"
                  label="Tên học phần"
                  fullWidth
                  value={input.name}
                  onChange={this.handleInputChange("name")}
                  error={clientSideValidation.name.isInvalid}
                  helperText={clientSideValidation.name.message}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  id="num-of-credits"
                  name="num-of-credits"
                  label="Số tín chỉ"
                  fullWidth
                  value={input.numOfCredits}
                  onChange={this.handleInputChange("numOfCredits")}
                  error={clientSideValidation.numOfCredits.isInvalid}
                  helperText={clientSideValidation.numOfCredits.message}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  id="num-of-fee-credits"
                  name="num-of-fee-credits"
                  label="Số tín chỉ học phí"
                  fullWidth
                  value={input.numOfFeeCredits}
                  onChange={this.handleInputChange("numOfFeeCredits")}
                  error={clientSideValidation.numOfCredits.isInvalid}
                  helperText={clientSideValidation.numOfCredits.message}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  id="weight"
                  name="weight"
                  label="Trọng số"
                  fullWidth
                  value={input.weight}
                  onChange={this.handleInputChange("weight")}
                  error={clientSideValidation.weight.isInvalid}
                  helperText={clientSideValidation.weight.message}
                />
              </Grid>
            </Grid>
          </form>
          <div className={parentClasses.buttons}>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleClickNext}
              className={parentClasses.button}
            >
              Tiếp tục
            </Button>
          </div>
          {isLoading && (
            <React.Fragment>
              <div className={classes.overlay} />
              <LinearProgress className={classes.progress} color="secondary" />
            </React.Fragment>
          )}
        </React.Fragment>
      );
    }

    return null;
  }
}

ModuleBaseInfoForm.propTypes = {
  parentClasses: PropTypes.shape({}).isRequired,
  handleNext: PropTypes.func.isRequired,
  updateModuleBaseInfoForReview: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  classes: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(ModuleBaseInfoForm);
