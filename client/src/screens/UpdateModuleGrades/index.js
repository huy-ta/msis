import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import { openSnackbar } from 'GlobalComponents/Notification';
import Section from 'Shells/Section';

import { getLetterGrade } from 'Utils/getLetterGrade';

import LookUpTable from './components/LookUpTable';

const styles = theme => ({
  root: {
    width: '100%',
    padding: theme.spacing.unit,
    paddingBottom: theme.spacing.unit * 1.2,
    marginBottom: theme.spacing.unit
  },
  loadingPaper: {
    marginTop: theme.spacing.unit,
    padding: theme.spacing.unit * 2
  }
});

class UpdateModuleGrades extends React.Component {
  state = {
    moduleGrades: [],
    studentId: '',
    currentStudentId: '',
    studentName: '',
    filters: {
      moduleId: '',
      name: ''
    },
    updateModuleId: '',
    updateMidTermGrade: '',
    updateFinalGrade: '',
    isLoading: false,
    errors: {}
  };

  isMounted = false;

  async componentDidMount() {
    this.isMounted = true;
  }

  componentWillUnmount() {
    this.isMounted = false;
  }

  getStudentModuleGrades = async studentId => {
    this.triggerLoadingState();

    try {
      const response = await axios.get(`/api/students/${studentId}/modules/grades`, {
        timeout: 10000
      });

      const { grades, student } = response.data.details;

      this.setState(() => ({
        studentName: student.name,
        currentStudentId: studentId
      }));

      if (grades.length > 0) {
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
      const { errors } = error.response.data;
      if (errors.studentId) {
        this.setState(() => ({
          errors: {
            studentId: 'Không tồn tại sinh viên này.'
          }
        }));
      }
    }

    this.turnOffLoadingState();
  };

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

  handleInputChange = prop => e => {
    const { value } = e.target;

    if (prop === 'updateMidTermGrade' || prop === 'updateFinalGrade') {
      if (!value.match(/^[0-9]{0,2}(\.\d{0,1})?$/)) return;
      if (parseFloat(value) > 10.0) return;
    }

    this.setState(() => ({ [prop]: value }));
  };

  showStudentModuleGrades = async () => {
    this.setState(() => ({
      errors: {},
      moduleGrades: [],
      studentName: '',
      currentStudentId: ''
    }));

    const { studentId } = this.state;

    await this.getStudentModuleGrades(studentId);
  };

  updateStudentModuleGrades = async () => {
    const { currentStudentId, updateModuleId, updateMidTermGrade, updateFinalGrade } = this.state;

    try {
      const payload = {
        midTermGrade: updateMidTermGrade,
        finalGrade: updateFinalGrade
      };

      this.setState(() => ({
        errors: {},
        moduleGrades: []
      }));

      await axios.put(`/api/students/${currentStudentId}/modules/${updateModuleId}`, payload);

      openSnackbar('Cập nhật điểm học phần thành công!');

      this.getStudentModuleGrades(currentStudentId);
    } catch (err) {
      const { errors } = err.response.data;
      if (errors.moduleId) {
        this.setState({
          errors: {
            updateModuleId: 'Không tồn tại mã học phần này.'
          }
        });
      }
    }
  };

  render() {
    const { classes } = this.props;
    const {
      moduleGrades,
      filters,
      isLoading,
      studentId,
      currentStudentId,
      studentName,
      errors,
      updateModuleId,
      updateMidTermGrade,
      updateFinalGrade
    } = this.state;

    const Loading = () => (
      <div className={classes.loadingPaper}>
        <Grid container spacing={24} direction="column" justify="center" alignItems="center">
          <Grid item xs={12}>
            <CircularProgress />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">Đang tải dữ liệu từ server, vui lòng chờ...</Typography>
          </Grid>
        </Grid>
      </div>
    );

    return (
      <Section header="HỌC PHẦN" subheader="SỬA ĐIỂM HỌC PHẦN">
        <Paper className={classes.root}>
          <Typography variant="body2">Lựa chọn sinh viên</Typography>
          <Grid container spacing={24} justify="flex-start" alignItems="center">
            <Grid item>
              <TextField
                label="Mã số sinh viên"
                fullWidth
                value={studentId}
                onChange={this.handleInputChange('studentId')}
                error={!!errors.studentId}
                helperText={errors.studentId}
              />
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={this.showStudentModuleGrades} color="primary">
                Hiển thị điểm học phần
              </Button>
            </Grid>
          </Grid>
        </Paper>
        {!!studentName && (
          <Paper className={classes.root}>
            <Typography variant="body2">Cập nhật điểm học phần</Typography>
            <Grid container spacing={24} justify="flex-start" alignItems="center">
              <Grid item>
                <TextField
                  label="Mã học phần"
                  fullWidth
                  value={updateModuleId}
                  onChange={this.handleInputChange('updateModuleId')}
                  error={!!errors.updateModuleId}
                  helperText={errors.updateModuleId}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Điểm giữa kỳ"
                  fullWidth
                  value={updateMidTermGrade}
                  onChange={this.handleInputChange('updateMidTermGrade')}
                  error={!!errors.updateMidTermGrade}
                  helperText={errors.updateMidTermGrade}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Điểm cuối kỳ"
                  fullWidth
                  value={updateFinalGrade}
                  onChange={this.handleInputChange('updateFinalGrade')}
                  error={!!errors.updateFinalGrade}
                  helperText={errors.updateFinalGrade}
                />
              </Grid>
              <Grid item>
                <Button variant="contained" onClick={this.updateStudentModuleGrades} color="primary">
                  Cập nhật điểm học phần
                </Button>
              </Grid>
            </Grid>
          </Paper>
        )}
        <Paper className={classes.root}>
          <Typography variant="body2">Xem kết quả học phần</Typography>
          <Typography variant="body1">
            {!!studentName && `Sinh viên: ${studentName}. Mã số sinh viên: ${currentStudentId}.`}
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
          {isLoading ? <Loading /> : <LookUpTable data={moduleGrades} filters={filters} />}
        </Paper>
      </Section>
    );
  }
}

UpdateModuleGrades.propTypes = {
  classes: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(UpdateModuleGrades);
