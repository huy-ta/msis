import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import AutoSuggestChipInput from "GlobalComponents/AutoSuggestChipInput";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import IconButton from "@material-ui/core/IconButton";
import DialogTitle from "@material-ui/core/DialogTitle";
import Edit from "@material-ui/icons/Edit";
import LinearProgress from "@material-ui/core/LinearProgress";
import FormValidator from "Utils/FormValidator";
import EditTableHead from "./components/EditTableHead";

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

const styles = theme => ({
  root: {
    width: "100%",
    padding: theme.spacing.unit,
    marginTop: theme.spacing.unit
  },
  table: {
    width: "100%"
  },
  tableWrapper: {
    overflowX: "auto"
  },
  highElevation: {
    zIndex: 3
  },
  lowElevation: {
    zIndex: 2
  },
  lowerElevation: {
    zIndex: 1
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

class EditTable extends React.Component {
  validator = new FormValidator([
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
    order: "asc",
    orderBy: "calories",
    page: 0,
    rowsPerPage: 5,
    suggestions: [],
    open: false,
    open1: false,
    open2: false,
    module: {
      id: "",
      name: "",
      moduleId: "",
      numOfCredits: "",
      numOfFeeCredits: "",
      weight: "",
      coRequisiteModules: [],
      readRequisiteModules: [],
      passRequisiteModules: []
    },
    requisiteModules: {
      coRequisiteModules1: [],
      readRequisiteModules1: [],
      passRequisiteModules1: []
    },
    isLoading: false,
    validation: this.validator.valid()
  };

  isMounted = false;

  async componentDidMount() {
    this.isMounted = true;
    await this.getModules();
  }

  componentWillUnmount() {
    this.isMounted = false;
  }

  getModules = async () => {
    try {
      const response = await axios.get("/api/modules");

      const modules = response.data.details.modules.map(module => {
        let tempModule = module;
        tempModule.name = `${module.moduleId} - ${module.name}`;
        return tempModule;
      });

      this.setState(() => ({
        suggestions: modules
      }));
    } catch (error) {
      const doNothing = () => {};
      doNothing();
    }

    this.setState(() => ({
      isLoading: false
    }));
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    const { orderBy: stateOrderBy, order: stateOrder } = this.state;

    if (stateOrderBy === property && stateOrder === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  closeevent = () => {
    this.setState({
      open1: false
    });
  };

  closeevent1 = () => {
    this.setState({
      open2: false
    });
  };

  performClientSideValidation = () => {
    const { module } = this.state;
    const validation = this.validator.validate(module);

    this.setState(() => ({
      validation
    }));

    return validation;
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleClose = () => {
    this.setState({
      open: false,
      module: {
        id: "",
        name: "",
        moduleId: "",
        numOfCredits: "",
        numOfFeeCredits: "",
        weight: "",
        coRequisiteModules: [],
        readRequisiteModules: [],
        passRequisiteModules: []
      },
      requisiteModules: {
        coRequisiteModules1: [],
        readRequisiteModules1: [],
        passRequisiteModules1: []
      }
    });
  };

  updateSettings = async () => {
    const clientSideValidation = this.performClientSideValidation();
    if (clientSideValidation.isValid) {
      let coRequisiteModuleIds1 = [];
      let passRequisiteModuleIds1 = [];
      let readRequisiteModuleIds1 = [];
      const { requisiteModules, module } = this.state;
      if (requisiteModules.coRequisiteModules1.length > 0) {
        for (
          let i = 0;
          i < requisiteModules.coRequisiteModules1.length;
          i += 1
        ) {
          coRequisiteModuleIds1[i] = requisiteModules.coRequisiteModules1[
            i
          ].slice(0, 6);
        }
      }
      if (requisiteModules.passRequisiteModules1.length > 0) {
        for (
          let i = 0;
          i < requisiteModules.passRequisiteModules1.length;
          i += 1
        ) {
          passRequisiteModuleIds1[i] = requisiteModules.passRequisiteModules1[
            i
          ].slice(0, 6);
        }
      }
      if (requisiteModules.readRequisiteModules1.length > 0) {
        for (
          let i = 0;
          i < requisiteModules.readRequisiteModules1.length;
          i += 1
        ) {
          readRequisiteModuleIds1[i] = requisiteModules.readRequisiteModules1[
            i
          ].slice(0, 6);
        }
      }
      const updateModuleRequestPayload = {
        moduleId: module.moduleId,
        name: module.name,
        numOfCredits: parseInt(module.numOfCredits, 10),
        numOfFeeCredits: parseFloat(module.numOfFeeCredits),
        weight: parseFloat(module.weight),
        coRequisiteModuleIds: coRequisiteModuleIds1,
        readRequisiteModuleIds: readRequisiteModuleIds1,
        passRequisiteModuleIds: passRequisiteModuleIds1
      };

      this.setState({ isLoading: true });
      try {
        const response = await axios.put(
          `/api/modules/${module.id}`,
          updateModuleRequestPayload
        );
        if (response.data.success) {
          this.setState({
            open: false,
            open1: true,
            requisiteModules: {
              coRequisiteModules1: [],
              readRequisiteModules1: [],
              passRequisiteModules1: []
            },
            isLoading: false
          });

          this.getModules();
        }
      } catch {
        this.setState({
          open: false,
          open2: true,
          requisiteModules: {
            coRequisiteModules1: [],
            readRequisiteModules1: [],
            passRequisiteModules1: []
          },
          isLoading: false
        });
      }
    }
  };

  handleInputChange = fieldName => e => {
    let { value } = e.target;
    if (fieldName === "name" && value.length > 0) {
      value = value.replace(value[0], value[0].toUpperCase());
    }
    if (fieldName === "numOfCredits") if (!value.match(/^\d{0,2}$/)) return;
    if (fieldName === "numOfFeeCredits")
      if (!value.match(/^\d{0,2}(\.\d{0,1})?$/)) return;
    if (fieldName === "weight")
      if (!value.match(/^0{0,1}(\.\d{0,2})?$/)) return;

    const { module } = this.state;
    module[fieldName] = value;
    this.setState(() => ({ module }));
  };

  convermodule = (moduleType, conmodule) => {
    const { requisiteModules } = this.state;
    const tempRequisiteModules = requisiteModules;
    tempRequisiteModules[moduleType] = [
      ...tempRequisiteModules[moduleType],
      `${conmodule.moduleId} - ${conmodule.name}`
    ];
    this.setState(() => ({
      requisiteModules: tempRequisiteModules
    }));
  };

  handleClickOpen = getmodule => {
    axios.get(`/api/modules/${getmodule.moduleId}`).then(res => {
      const module1 = res.data.details.module;
      const coRequisiteModuleslength = module1.coRequisiteModules.length;
      const readRequisiteModuleslength = module1.readRequisiteModules.length;
      const passRequisiteModuleslength = module1.passRequisiteModules.length;

      if (!(coRequisiteModuleslength === 0)) {
        for (let i = 0; i < coRequisiteModuleslength; i += 1)
          this.convermodule(
            "coRequisiteModules1",
            module1.coRequisiteModules[i]
          );
      }

      if (!(readRequisiteModuleslength === 0)) {
        for (let i = 0; i < readRequisiteModuleslength; i += 1) {
          this.convermodule(
            "readRequisiteModules1",
            module1.readRequisiteModules[i]
          );
        }
      }

      if (!(passRequisiteModuleslength === 0)) {
        for (let i = 0; i < passRequisiteModuleslength; i += 1) {
          this.convermodule(
            "passRequisiteModules1",
            module1.passRequisiteModules[i]
          );
        }
      }
      this.setState({
        open: true,
        module: getmodule
      });
    });
  };

  handleAddRequisiteModule = moduleType => chipValue => {
    const { requisiteModules } = this.state;
    const tempRequisiteModules = requisiteModules;
    tempRequisiteModules[moduleType] = [
      ...tempRequisiteModules[moduleType],
      chipValue
    ];
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
    const { classes, data, filters } = this.props;
    const {
      order,
      orderBy,
      rowsPerPage,
      page,
      module,
      open,
      open1,
      open2,
      suggestions,
      requisiteModules,
      isLoading,
      validation: stateValidation
    } = this.state;
    const {
      readRequisiteModules1,
      passRequisiteModules1,
      coRequisiteModules1
    } = requisiteModules;
    const clientSideValidation = stateValidation;
    const {
      id,
      name,
      moduleId,
      numOfCredits,
      numOfFeeCredits,
      weight
    } = module;

    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    const filteredData = data.filter(
      n =>
        n.moduleId.includes(filters.moduleId) && n.name.includes(filters.name)
    );
    const coRequisiteModuleSuggestions = suggestions.filter(
      suggestion =>
        !readRequisiteModules1.includes(suggestion.name) &&
        !passRequisiteModules1.includes(suggestion.name)
    );
    const readRequisiteModuleSuggestions = suggestions.filter(
      suggestion =>
        !coRequisiteModules1.includes(suggestion.name) &&
        !passRequisiteModules1.includes(suggestion.name)
    );
    const passRequisiteModuleSuggestions = suggestions.filter(
      suggestion =>
        !coRequisiteModules1.includes(suggestion.name) &&
        !readRequisiteModules1.includes(suggestion.name)
    );

    const Loading = () => (
      <React.Fragment>
        <div className={classes.overlay} />
        <LinearProgress className={classes.progress} color="secondary" />
      </React.Fragment>
    );

    return (
      <React.Fragment>
        <Paper className={classes.root}>
          {isLoading && <Loading />}
          <div className={classes.tableWrapper}>
            <Table className={classes.table} aria-labelledby="tableTitle">
              <colgroup>
                <col width="10%" />
                <col width="39%" />
                <col width="16%" />
                <col width="22%" />
                <col width="13%" />
              </colgroup>
              <EditTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={this.handleRequestSort}
              />
              <TableBody>
                {filteredData.length > 0 ? (
                  stableSort(filteredData, getSorting(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(n => (
                      <TableRow hover tabIndex={-1} key={n.id}>
                        <TableCell component="th" scope="row" padding="none">
                          {n.moduleId}
                        </TableCell>
                        <React.Fragment>
                          <TableCell>{n.name}</TableCell>
                          <TableCell numeric>{n.numOfCredits}</TableCell>
                          <TableCell numeric>{n.numOfFeeCredits}</TableCell>
                          <TableCell numeric>{n.weight}</TableCell>
                        </React.Fragment>
                        <TableCell>
                          <IconButton onClick={() => this.handleClickOpen(n)}>
                            <Edit />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow hover tabIndex={-1}>
                    <TableCell
                      component="th"
                      scope="row"
                      padding="none"
                      colSpan={5}
                    >
                      Không tìm được học phần nào
                    </TableCell>
                  </TableRow>
                )}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 49 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              "aria-label": "Previous Page"
            }}
            nextIconButtonProps={{
              "aria-label": "Next Page"
            }}
            labelRowsPerPage="Số mục trên trang"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} trong số ${count}`
            }
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>

        <Dialog
          id={id}
          open={open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          {isLoading && <Loading />}
          <DialogTitle id="form-dialog-title">
            Sửa thông tin học phần
          </DialogTitle>
          <DialogContent>
            <DialogContentText>Hãy sửa thông tin học phần</DialogContentText>

            <TextField
              disabled
              id="standard-disabled"
              label="Mã học phần"
              defaultValue={moduleId}
              className={classes.textField}
              margin="normal"
              fullWidth
            />
            <TextField
              required
              id="name"
              label="Tên học phần"
              defaultValue={name}
              className={classes.textField}
              margin="normal"
              onChange={this.handleInputChange("name")}
              fullWidth
              error={clientSideValidation.name.isInvalid}
              helperText={clientSideValidation.name.message}
            />
            <TextField
              required
              id="numOfCredits"
              label="Số tín chỉ"
              defaultValue={numOfCredits}
              className={classes.textField}
              margin="normal"
              fullWidth
              value={module.numOfCredits}
              onChange={this.handleInputChange("numOfCredits")}
              error={clientSideValidation.numOfCredits.isInvalid}
              helperText={clientSideValidation.numOfCredits.message}
            />
            <TextField
              required
              id="numOfFeeCredits"
              label="Số tín chỉ học phí"
              defaultValue={numOfFeeCredits}
              className={classes.textField}
              fullWidth
              numeric
              value={module.numOfFeeCredits}
              onChange={this.handleInputChange("numOfFeeCredits")}
              error={clientSideValidation.numOfFeeCredits.isInvalid}
              helperText={clientSideValidation.numOfFeeCredits.message}
            />
            <TextField
              required
              id="weight"
              label="Trọng số"
              className={classes.textField}
              defaultValue={weight}
              value={module.weight}
              margin="normal"
              fullWidth
              numeric
              onChange={this.handleInputChange("weight")}
              error={clientSideValidation.weight.isInvalid}
              helperText={clientSideValidation.weight.message}
            />

            <Grid container spacing={24}>
              <Grid item xs={12} className={classes.highElevation}>
                <AutoSuggestChipInput
                  label="Danh sách học phần song hành"
                  suggestions={coRequisiteModuleSuggestions}
                  chipValues={coRequisiteModules1}
                  fullWidth
                  handleAddChipToForm={this.handleAddRequisiteModule(
                    "coRequisiteModules1"
                  )}
                  handleRemoveChipFromForm={this.handleDeleteRequisiteModule(
                    "coRequisiteModules1"
                  )}
                />
              </Grid>
              <Grid item xs={12} className={classes.lowElevation}>
                <AutoSuggestChipInput
                  label="Danh sách học phần học trước"
                  suggestions={readRequisiteModuleSuggestions}
                  fullWidth
                  chipValues={readRequisiteModules1}
                  handleAddChipToForm={this.handleAddRequisiteModule(
                    "readRequisiteModules1"
                  )}
                  handleRemoveChipFromForm={this.handleDeleteRequisiteModule(
                    "readRequisiteModules1"
                  )}
                />
              </Grid>
              <Grid item xs={12} className={classes.lowerElevation}>
                <AutoSuggestChipInput
                  label="Danh sách học phần tiên quyết"
                  suggestions={passRequisiteModuleSuggestions}
                  fullWidth
                  chipValues={passRequisiteModules1}
                  handleAddChipToForm={this.handleAddRequisiteModule(
                    "passRequisiteModules1"
                  )}
                  handleRemoveChipFromForm={this.handleDeleteRequisiteModule(
                    "passRequisiteModules1"
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Hủy
            </Button>
            <Button onClick={this.updateSettings} color="primary">
              Cập nhật học phần
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={open1} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Cập nhật thành công</DialogTitle>
          <DialogActions>
            <Button onClick={this.closeevent} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={open2} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">
            Cập nhật thất bại do nhập sai học phần điều kiện
          </DialogTitle>
          <DialogActions>
            <Button onClick={this.closeevent1} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

EditTable.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  filters: PropTypes.shape({}).isRequired
};
export default withStyles(styles)(EditTable);
