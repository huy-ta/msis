import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Section from 'Shells/Section';
import { APP_LINKS } from 'Config/routers/appLinks';
import CreateTermForm from './components/CreateTermForm';


const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    position: 'relative',
    overflow: 'hidden'
  },
  button: {
    marginTop: theme.spacing.unit * 0.7,
    marginRight: theme.spacing.unit * 0.7
  }
});


class CreateTerm extends React.Component {

  state = {
    successMessageOn: false
  };

  turnOnSuccessMessage = () => {
    this.setState(() => ({ successMessageOn: true }));
  };

  turnOffSuccessMessage = () => {
    this.setState(() => ({ successMessageOn: false }));
  };

  render() {
    const { classes, history } = this.props;
    const {successMessageOn} = this.state;

    let SuccessMessage;
    if (successMessageOn) {
      SuccessMessage = () => (
        <React.Fragment>
          <Typography variant="body1">
            Tạo học kỳ thành công. Bạn có thể tiếp tục tạo học kỳ hoặc đến trang danh sách học kỳ.
          </Typography>
          <Button 
            className={classes.button} 
            variant="contained" 
            type="button" 
            color="primary"
            onClick={() => {history.push(APP_LINKS.LIST_TERM);}}
          >
            Đến trang danh sách học kỳ
          </Button>
          <Button
            className={classes.button}
            variant="text"
            type="button"
            color="primary"
            onClick={this.turnOffSuccessMessage}
          >
            Tiếp tục tạo học kỳ
          </Button>
        </React.Fragment>
      );
    }

    return (
      <Section header="KỲ HỌC" subheader="TẠO KỲ HỌC">
      <Paper className={classes.root}>
        <Typography variant="body2">Nhập thông tin kỳ học</Typography>
        {!successMessageOn && <CreateTermForm turnOnSuccessMessage={this.turnOnSuccessMessage}/>}
        {successMessageOn && <SuccessMessage />}
      </Paper>
    </Section>
    );
  }
}


CreateTerm.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(CreateTerm);
