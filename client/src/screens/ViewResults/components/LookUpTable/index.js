import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import LookUpTableHead from './components/LookUpTableHead';

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
  table: {
    width: '100%'
  },
  tableWrapper: {
    overflowX: 'auto'
  }
});

class LookUpTable extends React.Component {
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
    const { classes, data, filters } = this.props;
    const { order, orderBy, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    const filteredData = data.filter(n => n.moduleId.includes(filters.moduleId) && n.name.includes(filters.name));

    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <colgroup>
              <col width="10%" />
              <col width="30%" />
              <col width="15%" />
              <col width="15%" />
              <col width="15%" />
              <col width="15%" />
            </colgroup>
            <LookUpTableHead order={order} orderBy={orderBy} onRequestSort={this.handleRequestSort} />
            <TableBody>
              {filteredData.length > 0 ? (
                stableSort(filteredData, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(row => (
                    <TableRow hover tabIndex={-1} key={row.id}>
                      <TableCell component="th" scope="row" padding="none">
                        {row.moduleId}
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell numeric>{row.numOfCredits}</TableCell>
                      <TableCell numeric>{row.midTermGrade}</TableCell>
                      <TableCell numeric>{row.finalGrade}</TableCell>
                      <TableCell>{row.moduleGrade}</TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow hover tabIndex={-1}>
                  <TableCell component="th" scope="row" padding="none" colSpan={5}>
                    Không tìm được điểm học phần nào
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
      </Paper>
    );
  }
}

LookUpTable.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  filters: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(LookUpTable);
