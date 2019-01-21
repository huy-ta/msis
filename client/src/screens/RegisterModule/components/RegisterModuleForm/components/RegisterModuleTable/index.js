import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import RegisterModuleTableHead from './components/RegisterModuleTableHead';

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
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const styles = theme => ({
  root: {
    width: '100%',
    padding: theme.spacing.unit,
    marginTop: theme.spacing.unit
  },
  table: {},
  tableWrapper: {
    overflowX: 'auto'
  },
  tableTitle: {
    marginTop: theme.spacing.unit * 2
  }
});

class RegisterModuleTable extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'calories',
    page: 0,
    rowsPerPage: 5
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    const { orderBy: stateOrderBy, order: stateOrder } = this.state;

    if (stateOrderBy === property && stateOrder === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render() {
    const { classes, data, handleDelete } = this.props;
    const { order, orderBy, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <React.Fragment>
        <Typography variant="body2" id="tableTitle" className={classes.tableTitle}>
          Danh sách học phần đăng ký
        </Typography>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <colgroup>
              <col width="10%" />
              <col width="35%" />
              <col width="15%" />
              <col width="15%" />
              <col width="15%" />
              <col width="10%" />
            </colgroup>
            <RegisterModuleTableHead order={order} orderBy={orderBy} onRequestSort={this.handleRequestSort} />
            <TableBody>
              {data.length > 0 ? (
                stableSort(data, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(n => (
                    <TableRow hover tabIndex={-1} key={n.module.id}>
                      <TableCell component="th" scope="row" padding="none">
                        {n.module.moduleId}
                      </TableCell>
                      <TableCell>{n.module.name}</TableCell>
                      <TableCell numeric>{n.module.numOfCredits}</TableCell>
                      <TableCell numeric>{n.module.numOfFeeCredits}</TableCell>
                      <TableCell numeric>{n.module.weight}</TableCell>
                      <TableCell numeric>
                        <IconButton
                          aria-label="Delete"
                          className={classes.button}
                          onClick={() => handleDelete(n.module.moduleId)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow hover tabIndex={-1}>
                  <TableCell component="th" scope="row" padding="none" colSpan={5}>
                    Chưa chọn học phần nào
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
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page'
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page'
          }}
          labelRowsPerPage="Số mục trên trang"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} trong số ${count}`}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </React.Fragment>
    );
  }
}

RegisterModuleTable.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleDelete: PropTypes.func.isRequired
};

export default withStyles(styles)(RegisterModuleTable);
