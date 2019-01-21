import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import { openSnackbar } from 'GlobalComponents/Notification';
import Section from 'Shells/Section';

import ListUserTableHead from './components/ListUserTableHead';

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
    padding: theme.spacing.unit,
    marginTop: theme.spacing.unit * 2
  },
  table: {},
  tableWrapper: {
    overflowX: 'auto'
  },
  tableTitle: {
    marginTop: theme.spacing.unit * 2
  }
});

class ListUser extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'calories',
    page: 0,
    rowsPerPage: 5,
    users: []
  };

  isMounted = false;

  async componentDidMount() {
    this.isMounted = true;

    this.triggerLoadingState();

    try {
      const response = await axios.get('/api/users', {
        timeout: 10000
      });

      if (this.isMounted) {
        const { users } = response.data.details;

        this.setState(() => ({
          users
        }));
      }
    } catch (err) {
      const { response } = err;
      if (response.status === 504) {
        openSnackbar('Máy chủ hiện không phản hồi. Vui lòng thử lại sau');
      } else {
        this.setState(() => ({ serverErrors: response.data.errors }));
      }
      console.log(err);
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
    const { classes } = this.props;
    const { order, orderBy, rowsPerPage, page, users } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, users.length - page * rowsPerPage);

    return (
      <Section header="TÀI KHOẢN" subheader="DANH SÁCH TÀI KHOẢN">
        <Paper className={classes.root}>
          <Typography variant="body2" id="tableTitle" className={classes.tableTitle}>
            Danh sách người dùng
          </Typography>
          <div className={classes.tableWrapper}>
            <Table className={classes.table} aria-labelledby="tableTitle">
              <colgroup>
                <col width="20%" />
                <col width="40%" />
                <col width="40%" />
              </colgroup>
              <ListUserTableHead order={order} orderBy={orderBy} onRequestSort={this.handleRequestSort} />
              <TableBody>
                {users.length > 0 ? (
                  stableSort(users, getSorting(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(n => (
                      <TableRow hover tabIndex={-1} key={n.id}>
                        <TableCell>{n.id}</TableCell>
                        <TableCell>{n.name}</TableCell>
                        <TableCell>{n.username}</TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow hover tabIndex={-1}>
                    <TableCell component="th" scope="row" padding="none" colSpan={5}>
                      Không tìm được người dùng nào
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
            count={users.length}
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
      </Section>
    );
  }
}

ListUser.propTypes = {
  classes: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(ListUser);
