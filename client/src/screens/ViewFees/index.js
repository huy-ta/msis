import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Section from "Shells/Section";
import Paper from "@material-ui/core/Paper";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import axios from "axios";

import { openSnackbar } from "GlobalComponents/Notification";

const styles = theme => ({
  root: {
    width: "100%",
    padding: theme.spacing.unit,
    paddingBottom: theme.spacing.unit * 1.2,
    position: "relative"
  },
  loadingPaper: {
    marginTop: theme.spacing.unit,
    padding: theme.spacing.unit * 2
  },
  progress: {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: "100%",
    zIndex: 3
  },
  overlay: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    background: theme.palette.grey[500],
    opacity: 0.4,
    zIndex: 2
  }
});

class ViewFees extends React.Component {
  state = {
    input: {
      termId: ""
    },
    credits: "",
    tuition: "",
    studentid: "",
    amount: "",
    statusDropdownOpenState: false,
    terms: [],
    isLoading: false
  };

  isMounted = false;

  async componentDidMount() {
    this.isMounted = true;
    const { auth } = this.props;
    let userid = auth.user.sub;

    try {
      const response2 = await axios.get("/api/terms", {
        timeout: 10000
      });

      const response1 = await axios.get(`/api/students/${userid}`, {
        timeout: 10000
      });

      if (this.isMounted) {
        const studentidget = response1.data.details.user.username;

        const termsget = response2.data.details.terms;

        this.setState({
          studentid: studentidget,
          amount: 200000,
          terms: termsget
        });
      }
    } catch (error) {
      const doNothing = () => {};
      doNothing();
    }
  }

  componentWillUnmount() {
    this.isMounted = false;
  }

  handleInputChange = prop => e => {
    const { input, amount, studentid } = this.state;
    const inputTemp = input;
    inputTemp[prop] = e.target.value;
    this.setState(() => ({
      input: inputTemp,
      isLoading: true,
      credits: "",
      tuition: ""
    }));
    axios
      .get(`/api/students/${studentid}/fees/${input.termId}/${amount}`)
      .then(res => {
        const creditsget = res.data.details.amount.credits;
        const tuitionget = res.data.details.amount.tuition;
        if (!(creditsget === -1)) {
          this.setState({
            credits: creditsget,
            tuition: tuitionget
          });
        } else {
          openSnackbar("Bạn không có học phí kỳ này.");
        }
        this.setState(() => ({ isLoading: false }));
      })
      .catch(() => {
        openSnackbar("Bạn không có học phí kỳ này.");
        this.setState(() => ({ isLoading: false }));
      });
  };

  handleStatusDropdownClose = () => {
    this.setState({ statusDropdownOpenState: false });
  };

  handleStatusDropdownOpen = () => {
    this.setState({ statusDropdownOpenState: true });
  };

  performClientSideValidation = () => {
    const { input } = this.state;
    return this.validator.validate(input);
  };

  render() {
    const { classes } = this.props;
    const {
      credits,
      input,
      tuition,
      studentid,
      amount,
      statusDropdownOpenState,
      terms,
      isLoading
    } = this.state;

    const Loading = () => (
      <React.Fragment>
        <div className={classes.overlay} />
        <LinearProgress className={classes.progress} color="secondary" />
      </React.Fragment>
    );

    return (
      <Section header="HỌC PHẦN" subheader="TRA CỨU HỌC PHÍ">
        <Paper className={classes.root}>
          <Grid container spacing={24}>
            <Grid item xs={10}>
              <Typography variant="h6" gutterBottom>
                MSSV: {studentid}
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={24}>
            <Grid item xs={10}>
              <Typography variant="h6" gutterBottom>
                Số tiền 1 tín chỉ(VNĐ): {amount}
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={24}>
            <Grid item xs={12} lg={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor="termId">
                  Chọn kỳ học tra cứu học phí
                </InputLabel>
                <Select
                  value={input.termId}
                  onChange={this.handleInputChange("termId")}
                  open={statusDropdownOpenState}
                  onClose={this.handleStatusDropdownClose}
                  onOpen={this.handleStatusDropdownOpen}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {terms.map(term => (
                    <MenuItem key={term.id} value={term.termId}>
                      {term.termId}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {tuition ? (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Học phí của bạn như sau
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Tổng số tín chỉ học phí: {credits}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Học phí cần phải đóng(VNĐ): {tuition}
                </Typography>
              </Grid>
            ) : (
              <Grid item xs={12}>
                <Typography variant="body1" gutterBottom>
                  Bạn không có học phí kì này.
                </Typography>
              </Grid>
            )}
          </Grid>
          {isLoading && <Loading />}
        </Paper>
      </Section>
    );
  }
}

ViewFees.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  auth: PropTypes.shape({}).isRequired
};

const mapStateToProps = ({ auth }) => ({
  auth
});

const StyleViewFees = withStyles(styles)(ViewFees);
export default connect(mapStateToProps)(StyleViewFees);
