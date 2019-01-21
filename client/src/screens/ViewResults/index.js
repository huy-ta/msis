import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';

import Section from 'Shells/Section';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import { getLetterGrade } from 'Utils/getLetterGrade';

import LookUpTable from './components/LookUpTable';

const styles = theme => ({
  root: {
    width: '100%',
    padding: theme.spacing.unit,
    paddingBottom: theme.spacing.unit * 1.2
  },
  loadingPaper: {
    marginTop: theme.spacing.unit,
    padding: theme.spacing.unit * 2
  }
});

class ViewResults extends React.Component {
  state = {
    moduleGrades: [],
    filters: {
      moduleId: '',
      name: ''
    },
    isLoading: false
  };

  isMounted = false;

  async componentDidMount() {
    this.isMounted = true;

    this.triggerLoadingState();

    try {
      const { auth } = this.props;

      const response = await axios.get(`/api/students/${auth.user.username}/modules/grades`, {
        timeout: 10000
      });

      if (this.isMounted) {
        const { grades } = response.data.details;

        let moduleGrades = [];

        grades.forEach(grade => {
          const moduleNumberGrade =
            grade.midTermGrade * (1 - grade.module.weight) + grade.finalGrade * grade.module.weight;

          let moduleGrade = {
            moduleId: grade.module.moduleId,
            name: grade.module.name,
            numOfCredits: grade.module.numOfCredits,
            midTermGrade: grade.midTermGrade,
            finalGrade: grade.finalGrade,
            moduleGrade: getLetterGrade(moduleNumberGrade)
          };
          moduleGrades.push(moduleGrade);
        });

        this.setState(() => ({ moduleGrades }));
      }
    } catch (error) {
      const doNothing = () => {};
      doNothing();
    }

    this.turnOffLoadingState();
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

  handleFilterInputChange = prop => e => {
    const { filters } = this.state;
    const tempFilters = filters;
    tempFilters[prop] = e.target.value;
    if (prop === 'moduleId') {
      tempFilters[prop] = tempFilters[prop].toUpperCase();
    }
    this.setState(() => ({ filters: tempFilters }));
  };

  render() {
    const { classes, auth } = this.props;
    const { moduleGrades, filters, isLoading } = this.state;

    const Loading = () => (
      <Paper className={classes.loadingPaper}>
        <Grid container spacing={24} direction="column" justify="center" alignItems="center">
          <Grid item xs={12}>
            <CircularProgress />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">Đang tải dữ liệu từ server, vui lòng chờ...</Typography>
          </Grid>
        </Grid>
      </Paper>
    );

    return (
      <Section header="HỌC PHẦN" subheader="KẾT QUẢ HỌC PHẦN">
        <Paper className={classes.root}>
          <Typography variant="body2">Xem kết quả học phần</Typography>
          <Typography variant="body1">
            Sinh viên: {auth.user.name}. Mã số sinh viên: {auth.user.username}.
          </Typography>
          <Grid container spacing={24}>
            <Grid item xs={6}>
              <TextField
                label="Mã học phần"
                fullWidth
                value={filters.moduleId}
                onChange={this.handleFilterInputChange('moduleId')}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Tên học phần"
                fullWidth
                value={filters.name}
                onChange={this.handleFilterInputChange('name')}
              />
            </Grid>
          </Grid>
        </Paper>
        {isLoading ? <Loading /> : <LookUpTable data={moduleGrades} filters={filters} />}
      </Section>
    );
  }
}

ViewResults.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  auth: PropTypes.shape({}).isRequired
};

const mapStateToProps = ({ auth }) => ({
  auth
});

export default connect(mapStateToProps)(withStyles(styles)(ViewResults));
