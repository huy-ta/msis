import React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';

const rows = [
  { id: 'moduleId', numeric: false, disablePadding: true, label: 'Mã học phần' },
  { id: 'name', numeric: false, disablePadding: false, label: 'Tên học phần' },
  { id: 'numOfCredits', numeric: true, disablePadding: false, label: 'Số tín chỉ' },
  { id: 'midTermGrade', numeric: true, disablePadding: false, label: 'Điểm giữa kỳ' },
  { id: 'finalGrade', numeric: true, disablePadding: false, label: 'Điểm cuối kỳ' },
  { id: 'moduleGrade', numeric: false, disablePadding: false, label: 'Điểm học phần' }
];

class LookUpTableHead extends React.Component {
  createSortHandler = property => event => {
    const { onRequestSort } = this.props;
    onRequestSort(event, property);
  };

  render() {
    const { order, orderBy } = this.props;

    return (
      <TableHead>
        <TableRow>
          {rows.map(
            row => (
              <TableCell
                key={row.id}
                numeric={row.numeric}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip title="Sắp xếp" placement={row.numeric ? 'bottom-end' : 'bottom-start'} enterDelay={300}>
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            ),
            this
          )}
        </TableRow>
      </TableHead>
    );
  }
}

LookUpTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired
};

export default LookUpTableHead;
