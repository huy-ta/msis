import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

import AutoSuggestChipInput from 'GlobalComponents/AutoSuggestChipInput';

const styles = () => ({
  highElevation: {
    zIndex: 3
  },
  lowElevation: {
    zIndex: 2
  },
  lowerElevation: {
    zIndex: 1
  }
});

class ModuleRequisiteForm extends React.Component {
  state = {
    suggestions: [],
    requisiteModules: {
      coRequisiteModules: [],
      readRequisiteModules: [],
      passRequisiteModules: []
    }
  };

  isMounted = false;

  async componentDidMount() {
    this.isMounted = true;
    try {
      const response = await axios.get('/api/modules', {
        timeout: 10000
      });

      if (this.isMounted) {
        const modules = response.data.details.modules.map(module => {
          let tempModule = module;
          tempModule.name = `${module.moduleId} - ${module.name}`;
          return tempModule;
        });

        this.setState(() => ({
          suggestions: modules
        }));
      }
    } catch (error) {
      const doNothing = () => {};
      doNothing();
    }
  }

  componentWillUnmount() {
    this.isMounted = false;
  }

  handleClickBack = () => {
    const { handleBack } = this.props;
    handleBack();
  };

  handleClickNext = () => {
    const { handleNext, updateModuleRequisiteInfoForReview } = this.props;
    const { requisiteModules } = this.state;
    const { coRequisiteModules, readRequisiteModules, passRequisiteModules } = requisiteModules;
    const hasData = coRequisiteModules.length > 0 || readRequisiteModules.length > 0 || passRequisiteModules.length > 0;
    if (hasData) {
      updateModuleRequisiteInfoForReview(requisiteModules);
    }
    handleNext();
  };

  // #FIXME: Needs refactoring

  handleAddRequisiteModule = moduleType => chipValue => {
    const { requisiteModules } = this.state;
    const tempRequisiteModules = requisiteModules;
    tempRequisiteModules[moduleType] = [...tempRequisiteModules[moduleType], chipValue];
    this.setState(() => ({
      requisiteModules: tempRequisiteModules
    }));
  };

  handleDeleteRequisiteModule = moduleType => index => {
    const { requisiteModules } = this.state;
    const tempRequisiteModules = requisiteModules;
    tempRequisiteModules[moduleType].splice(index, 1);
    this.setState(() => ({
      requisiteModules: tempRequisiteModules
    }));
  };

  render() {
    const { suggestions, requisiteModules } = this.state;
    const { classes, show, parentClasses } = this.props;

    const { coRequisiteModules, readRequisiteModules, passRequisiteModules } = requisiteModules;

    const hasData = coRequisiteModules.length > 0 || readRequisiteModules.length > 0 || passRequisiteModules.length > 0;

    const coRequisiteModuleSuggestions = suggestions.filter(
      suggestion => !readRequisiteModules.includes(suggestion.name) && !passRequisiteModules.includes(suggestion.name)
    );
    const readRequisiteModuleSuggestions = suggestions.filter(
      suggestion => !coRequisiteModules.includes(suggestion.name) && !passRequisiteModules.includes(suggestion.name)
    );
    const passRequisiteModuleSuggestions = suggestions.filter(
      suggestion => !coRequisiteModules.includes(suggestion.name) && !readRequisiteModules.includes(suggestion.name)
    );

    const Loading = () => (
      <Grid container spacing={24} direction="column" justify="center" alignItems="center">
        <Grid item xs={12}>
          <CircularProgress />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">Đang tải dữ liệu từ server, vui lòng chờ...</Typography>
        </Grid>
      </Grid>
    );

    if (show) {
      return (
        <React.Fragment>
          {suggestions.length > 0 ? (
            <React.Fragment>
              <Typography variant="h6" gutterBottom>
                Thông tin điều kiện
              </Typography>
              <form>
                <Grid container spacing={24}>
                  <Grid item xs={12} className={classes.highElevation}>
                    <AutoSuggestChipInput
                      label="Danh sách học phần song hành"
                      suggestions={coRequisiteModuleSuggestions}
                      fullWidth
                      chipValues={coRequisiteModules}
                      handleAddChipToForm={this.handleAddRequisiteModule('coRequisiteModules')}
                      handleRemoveChipFromForm={this.handleDeleteRequisiteModule('coRequisiteModules')}
                    />
                  </Grid>
                  <Grid item xs={12} className={classes.lowElevation}>
                    <AutoSuggestChipInput
                      label="Danh sách học phần học trước"
                      suggestions={readRequisiteModuleSuggestions}
                      fullWidth
                      chipValues={readRequisiteModules}
                      handleAddChipToForm={this.handleAddRequisiteModule('readRequisiteModules')}
                      handleRemoveChipFromForm={this.handleDeleteRequisiteModule('readRequisiteModules')}
                    />
                  </Grid>
                  <Grid item xs={12} className={classes.lowerElevation}>
                    <AutoSuggestChipInput
                      label="Danh sách học phần tiên quyết"
                      suggestions={passRequisiteModuleSuggestions}
                      fullWidth
                      chipValues={passRequisiteModules}
                      handleAddChipToForm={this.handleAddRequisiteModule('passRequisiteModules')}
                      handleRemoveChipFromForm={this.handleDeleteRequisiteModule('passRequisiteModules')}
                    />
                  </Grid>
                </Grid>
              </form>
            </React.Fragment>
          ) : (
            <Loading />
          )}
          <div className={parentClasses.buttons}>
            <Button variant="contained" color="primary" onClick={this.handleClickNext} className={parentClasses.button}>
              {hasData ? 'Tiếp tục' : 'Bỏ qua'}
            </Button>
            <Button variant="text" color="primary" onClick={this.handleClickBack} className={parentClasses.button}>
              Quay lại
            </Button>
          </div>
        </React.Fragment>
      );
    }
    return null;
  }
}

ModuleRequisiteForm.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  parentClasses: PropTypes.shape({}).isRequired,
  handleNext: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  updateModuleRequisiteInfoForReview: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired
};

export default withStyles(styles)(ModuleRequisiteForm);
