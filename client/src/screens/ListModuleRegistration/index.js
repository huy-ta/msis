import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import axios from 'axios';
import { connect } from 'react-redux';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import LinearProgress from '@material-ui/core/LinearProgress';
import Section from 'Shells/Section';

import ListModuleRegistrationTable from './components/ListModuleRegistrationTable';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 0.7,
    position: 'relative',
    overflow: 'hidden'
  },
  button: {
    marginTop: theme.spacing.unit * 0.7,
    marginRight: theme.spacing.unit * 0.7
  },
  progress:{
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


class ListModuleRegistration extends React.Component {

  state = {
    termId: '',
    terms: [],
    modules: [],
    studentModuleRegistrations: [],
    isLoading: false
  }

  isMounted = false;

  async componentDidMount() {
    this.isMounted = true;

    try {
      const response = await axios.get('/api/terms', {
        timeout: 10000
      });

      if (this.isMounted) {
        const { terms } = response.data.details;

        this.setState(() => ({
          terms
        }));
      }
    } catch (error) {
      console.log(error);
    }
  }

  componentWillUnmount() {
    this.isMounted = false;
  }

  triggerLoadingState = () =>{
    this.setState(() => ({isLoading: true}));
  }

  turnOffLoadingState = () =>{
    this.setState(() => ({isLoading: false}));
  }

  handleInputChange = async e => {
    this.setState({ termId: e.target.value });

    this.triggerLoadingState();

    const {auth} = this.props;
    const {termId} = this.state;
    console.log(termId);
    try {
      const response = await axios.get(`/api/students/${e.target.value}/${auth.user.sub}`, {
        timeout: 10000
      });
      const studentModuleRegistrations = response.data.details;
      console.log(studentModuleRegistrations);
      this.setState({studentModuleRegistrations: studentModuleRegistrations.studentModuleRegistrations});
      const newModules = [];
      studentModuleRegistrations.studentModuleRegistrations.forEach(n => {
        newModules.push(n.module);
      });
      console.log(newModules);
      this.setState({modules: newModules});
    } catch (err) {
      console.log(err);
    }

    this.turnOffLoadingState();
  };

  handleDelete = async moduleId => {
    const {studentModuleRegistrations} = this.state;

    let idDelete;

    studentModuleRegistrations.forEach(n => {
      if(n.module.moduleId === moduleId) {
        idDelete = n.id;
      }
    });

    console.log(moduleId);
    console.log(idDelete);

    try {
      await axios.delete(`api/students/${idDelete}`);
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { classes } = this.props;
    const { 
      termId, 
      terms, 
      modules,
      isLoading
    } = this.state;

    const Loading = () => (
      <React.Fragment>
        <div className={classes.overlay} />
        <LinearProgress className={classes.progress} color="secondary" />
      </React.Fragment>
    );

    return (
      <Section header="HỌC PHẦN" subheader="DANH SÁCH HỌC PHẦN ĐĂNG KÝ">
        {isLoading && <Loading/>}
        <Paper className={classes.root}>
          <Typography variant="body2">Nhập thông tin đăng ký</Typography>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel htmlFor="termId">Kỳ học</InputLabel>
                <Select
                  value={termId}
                  onChange={this.handleInputChange}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {terms.map(term => (
                    <MenuItem value={term.id}>{term.termId}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
        <Paper className={classes.root}>
          <ListModuleRegistrationTable data={modules}/>
        </Paper>
      </Section>
    );
  }
}

ListModuleRegistration.propTypes = {
  classes: PropTypes.shape({}).isRequired
};

const mapStateToProps = ({ auth }) => ({
  auth
});

const StyleListModuleRegistration = withStyles(styles)(ListModuleRegistration);

export default connect(mapStateToProps)(StyleListModuleRegistration);
