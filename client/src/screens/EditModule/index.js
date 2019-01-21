import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import Section from "Shells/Section";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import EditTable from "./components/EditTable";

const styles = theme => ({
  root: {
    width: "100%",
    padding: theme.spacing.unit,
    paddingBottom: theme.spacing.unit * 1.2
  },
  loadingPaper: {
    marginTop: theme.spacing.unit,
    padding: theme.spacing.unit * 2
  }
});

class EditModule extends React.Component {
  state = {
    modules: [],
    filters: {
      moduleId: "",
      name: ""
    },
    isLoading: false
  };

  isMounted = false;

  async componentDidMount() {
    this.isMounted = true;

    this.triggerLoadingState();

    try {
      const response = await axios.get("/api/modules");

      if (this.isMounted) {
        const { modules } = response.data.details;

        this.setState(() => ({
          modules
        }));
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
    if (prop === "moduleId") {
      tempFilters[prop] = tempFilters[prop].toUpperCase();
    }
    this.setState(() => ({ filters: tempFilters }));
  };

  render() {
    const { classes } = this.props;
    const { modules, filters, isLoading } = this.state;

    const Loading = () => (
      <Paper className={classes.loadingPaper}>
        <Grid
          container
          spacing={24}
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Grid item xs={12}>
            <CircularProgress />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              Đang tải dữ liệu từ server, vui lòng chờ...
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    );

    return (
      <Section header="HỌC PHẦN" subheader="SỬA HỌC PHẦN">
        <Paper className={classes.root}>
          <Typography variant="body2">Nhập thông tin tìm kiếm</Typography>

          <Grid container spacing={24}>
            <Grid item xs={6}>
              <TextField
                label="Mã học phần"
                fullWidth
                value={filters.moduleId}
                onChange={this.handleFilterInputChange("moduleId")}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Tên học phần"
                fullWidth
                value={filters.name}
                onChange={this.handleFilterInputChange("name")}
              />
            </Grid>
          </Grid>
        </Paper>
        {isLoading ? (
          <Loading />
        ) : (
          <EditTable data={modules} filters={filters} />
        )}
      </Section>
    );
  }
}

EditModule.propTypes = {
  classes: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(EditModule);
