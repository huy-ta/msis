import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = theme => ({
  listItem: {
    padding: `${theme.spacing.unit * 0.5}px 0`
  },
  listItemText: {
    width: 'auto'
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

class CreateModuleReview extends React.Component {
  state = {
    isLoading: false
  };

  triggerLoadingState = () => {
    this.setState(() => ({ isLoading: true }));
  };

  turnOffLoadingState = () => {
    this.setState(() => ({ isLoading: false }));
  };

  handleClickBack = () => {
    const { handleBack } = this.props;
    handleBack();
  };

  handleSubmitCreateModuleForm = async () => {
    this.triggerLoadingState();

    const { submitCreateModuleForm } = this.props;
    await submitCreateModuleForm();

    // this.turnOffLoadingState();
  };

  render() {
    const { classes, show, parentClasses, moduleBaseInfo, moduleRequisiteInfo } = this.props;
    const { isLoading } = this.state;

    const moduleFields1 = [
      { name: 'Mã học phần', value: moduleBaseInfo.moduleId },
      { name: 'Tên học phần', value: moduleBaseInfo.name },
      { name: 'Số tín chỉ', value: moduleBaseInfo.numOfCredits },
      { name: 'Số tín chỉ học phí', value: moduleBaseInfo.numOfFeeCredits }
    ];

    let coRequisiteModules = [];
    let readRequisiteModules = [];
    let passRequisiteModules = [];
    try {
      coRequisiteModules = moduleRequisiteInfo.coRequisiteModules.map(module => module);
      readRequisiteModules = moduleRequisiteInfo.readRequisiteModules.map(module => module);
      passRequisiteModules = moduleRequisiteInfo.passRequisiteModules.map(module => module);
    } catch (error) {
      const doNothing = () => {};
      doNothing();
    }
    const moduleFields2 = [
      { name: 'Trọng số', value: moduleBaseInfo.weight },
      {
        name: 'Danh sách học phần song hành',
        value: coRequisiteModules.length > 0 ? coRequisiteModules.join(', ') : 'Không có'
      },
      {
        name: 'Danh sách học phần học trước',
        value: readRequisiteModules.length > 0 ? readRequisiteModules.join(', ') : 'Không có'
      },
      {
        name: 'Danh sách học phần tiên quyết',
        value: passRequisiteModules.length > 0 ? passRequisiteModules.join(', ') : 'Không có'
      }
    ];

    if (show) {
      return (
        <React.Fragment>
          <Typography variant="h6" gutterBottom>
            Xác nhận tạo học phần
          </Typography>
          <Grid container>
            <Grid item xs={6}>
              <List disablePadding>
                {moduleFields1.map(moduleField => (
                  <ListItem className={classes.listItem} key={moduleField.name}>
                    <ListItemText
                      className={classes.listItemText}
                      primary={moduleField.name}
                      secondary={moduleField.value}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={6}>
              <List disablePadding>
                {moduleFields2.map(moduleField => (
                  <ListItem className={classes.listItem} key={moduleField.name}>
                    <ListItemText
                      className={classes.listItemText}
                      primary={moduleField.name}
                      secondary={moduleField.value}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
          <div className={parentClasses.buttons}>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleSubmitCreateModuleForm}
              className={parentClasses.button}
            >
              Tạo học phần
            </Button>
            <Button variant="text" color="primary" onClick={this.handleClickBack} className={parentClasses.button}>
              Quay lại
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

CreateModuleReview.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  parentClasses: PropTypes.shape({}).isRequired,
  submitCreateModuleForm: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  moduleBaseInfo: PropTypes.shape({}).isRequired,
  moduleRequisiteInfo: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(CreateModuleReview);
