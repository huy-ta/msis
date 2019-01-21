import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { fade } from '@material-ui/core/styles/colorManipulator';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Typography from '@material-ui/core/Typography';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import AccountCircle from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew';
import Lock from '@material-ui/icons/Lock';

import { logoutUser } from 'Services/authentication/actions';
import { USER_ROLES } from 'Config/enums/userRoles';

import ChangePasswordDialog from './components/ChangePasswordDialog';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.primary.dark,
    width: `calc(100% - ${theme.spacing.drawerWidth.mdUp}px)`,
    marginLeft: theme.spacing.drawerWidth.mdUp,
    [theme.breakpoints.up('xl')]: {
      width: `calc(100% - ${theme.spacing.drawerWidth.xlUp}px)`,
      marginLeft: theme.spacing.drawerWidth.xlUp
    },
    paddingTop: theme.spacing.unit / 2,
    paddingBottom: theme.spacing.unit / 2
  },
  grow: {
    flexGrow: 1
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.1),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.15)
    },
    marginRight: theme.spacing.unit,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto'
    }
  },
  searchIcon: {
    width: theme.spacing.unit * 5,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    color: 'inherit',
    width: '100%'
  },
  inputInput: {
    paddingTop: theme.spacing.unit / 2,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit / 2,
    paddingLeft: theme.spacing.unit * 5,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('lg')]: {
      width: 500
    }
  }
});

class MainAppBar extends React.Component {
  state = {
    anchorEl: null,
    changePasswordDialogOpen: false
  };

  handleOpenChangePasswordDialog = () => {
    this.setState({ changePasswordDialogOpen: true });
    this.handleMenuClose();
  };

  handleCloseChangePasswordDialog = () => {
    this.setState({ changePasswordDialogOpen: false });
  };

  handleProfileMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  handleLogout = () => {
    const { logoutUser: dispatchLogoutUser } = this.props;
    dispatchLogoutUser();
  };

  render() {
    const { anchorEl, changePasswordDialogOpen } = this.state;
    const { classes, auth } = this.props;
    const isMenuOpen = Boolean(anchorEl);

    let roleLabel = '';
    if (auth.user.role === USER_ROLES.STUDENT) roleLabel = 'Sinh viên';
    else if (auth.user.role === USER_ROLES.MANAGER) roleLabel = 'Cán bộ';
    else if (auth.user.role === USER_ROLES.ADMIN) roleLabel = 'Quản trị viên';

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={this.handleOpenChangePasswordDialog}>
          <ListItemIcon>
            <Lock />
          </ListItemIcon>
          <ListItemText inset primary="Đổi mật khâủ" />
        </MenuItem>
      </Menu>
    );

    return (
      <React.Fragment>
        <AppBar position="fixed" className={classes.root}>
          <Toolbar>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Tìm kiếm chức năng…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput
                }}
              />
            </div>
            <div className={classes.grow} />
            <Typography variant="body1" color="inherit">
              {roleLabel}: {auth.user.name}
            </Typography>
            <IconButton color="inherit" onClick={this.handleProfileMenuOpen}>
              <AccountCircle />
            </IconButton>
            <IconButton color="inherit" onClick={this.handleLogout}>
              <PowerSettingsNew />
            </IconButton>
          </Toolbar>
        </AppBar>
        {renderMenu}
        <ChangePasswordDialog
          open={changePasswordDialogOpen}
          handleClose={this.handleCloseChangePasswordDialog}
          userId={auth.user.sub}
        />
      </React.Fragment>
    );
  }
}

MainAppBar.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  auth: PropTypes.shape({}).isRequired,
  logoutUser: PropTypes.func.isRequired
};

const mapStateToProps = ({ auth }) => ({
  auth
});

const mapDispatchToProps = dispatch => ({
  logoutUser: userData => dispatch(logoutUser(userData))
});

const StyledAppBar = withStyles(styles)(MainAppBar);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StyledAppBar);
