import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';

import Collapse from '@material-ui/core/Collapse';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import msisLogoWhite from 'Assets/images/msis-logo-white.svg';
import msisText from 'Assets/images/msis-text.svg';

import { sidebarItems } from './sidebarItems';

const styles = theme => ({
  drawer: {
    width: theme.spacing.drawerWidth.mdUp,
    [theme.breakpoints.up('xl')]: {
      width: theme.spacing.drawerWidth.xlUp
    },
    flexShrink: 0
  },
  drawerPaper: {
    width: theme.spacing.drawerWidth.mdUp,
    [theme.breakpoints.up('xl')]: {
      width: theme.spacing.drawerWidth.xlUp
    },
    boxShadow: theme.shadows[5],
    border: 'none'
  },
  logoContainer: {
    background: theme.palette.secondary.main,
    paddingTop: theme.spacing.unit / 2,
    paddingBottom: theme.spacing.unit / 2,
    boxShadow: theme.shadows[1]
  },
  logo: {
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'row'
  },
  logoText: {
    color: 'white !important'
  },
  list: {},
  listItem: {
    padding: 15 + 0.5 * theme.spacing.unit
  },
  selected: {
    color: theme.palette.secondary.main,
    backgroundColor: 'white'
  },
  nested: {
    paddingLeft: 24 + theme.spacing.unit * 0.5,
    paddingTop: theme.spacing.unit * 0.6,
    paddingBottom: theme.spacing.unit * 0.6
  },
  verticalCompact: {
    paddingTop: 0,
    paddingBottom: 0
  }
});

const defaultIsItemExpanded = {};
sidebarItems.forEach(item => {
  if (item.children) {
    defaultIsItemExpanded[item.codeName] = item.expanded;
  }
});

class Sidebar extends React.Component {
  state = {
    isItemExpanded: defaultIsItemExpanded
  };

  handleExpandItem = item => () => {
    const { isItemExpanded } = this.state;
    isItemExpanded[`${item}`] = !isItemExpanded[`${item}`];
    this.setState(() => ({ isItemExpanded }));
  };

  render() {
    const {
      classes,
      location: { pathname },
      auth
    } = this.props;
    const { isItemExpanded } = this.state;

    const LogoContainer = (
      <List className={classes.logoContainer}>
        <ListItem className={classnames(classes.logo, classes.verticalCompact)}>
          <ListItemIcon>
            <img src={msisLogoWhite} alt="mSIS Logo" width="64px" height="64px" />
          </ListItemIcon>
          <ListItemIcon>
            <img src={msisText} alt="mSIS" width="150px" height="64px" />
          </ListItemIcon>
        </ListItem>
      </List>
    );

    const SidebarNavList = (
      <List className={classnames(classes.list, classes.verticalCompact)}>
        {sidebarItems.map(item => {
          if (item.allowedRoles) {
            if (!item.allowedRoles.includes(auth.user.role)) {
              return null;
            }
          }

          if (item.children) {
            const childrenItems = item.children.map(childItem => {
              if (childItem.allowedRoles) {
                if (!childItem.allowedRoles.includes(auth.user.role)) {
                  return null;
                }
              }
              return (
                <Collapse in={isItemExpanded[item.codeName]} timeout="auto" unmountOnExit key={childItem.codeName}>
                  <List component="div" className={classes.verticalCompact}>
                    <ListItem
                      button
                      className={classes.nested}
                      component={!(childItem.path === pathname) ? Link : null}
                      to={childItem.path}
                      selected={childItem.path === pathname}
                    >
                      <ListItemIcon>{childItem.icon()}</ListItemIcon>
                      <ListItemText inset primary={childItem.displayName} />
                    </ListItem>
                  </List>
                </Collapse>
              );
            });

            return (
              <React.Fragment key={item.codeName}>
                <ListItem button className={classes.listItem} onClick={this.handleExpandItem(item.codeName)}>
                  <ListItemIcon>{item.icon()}</ListItemIcon>
                  <ListItemText primary={item.displayName} />
                  {isItemExpanded[item.codeName] ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                {childrenItems}
                <Divider />
              </React.Fragment>
            );
          }

          if (item.allowedRoles) {
            if (!item.allowedRoles.includes(auth.user.role)) {
              return null;
            }
          }
          return (
            <React.Fragment key={item.codeName}>
              <ListItem
                button
                className={classes.listItem}
                component={!(item.path === pathname) ? Link : null}
                to={item.path}
                selected={item.path === pathname}
              >
                <ListItemIcon>{item.icon()}</ListItemIcon>
                <ListItemText primary={item.displayName} />
              </ListItem>
              <Divider />
            </React.Fragment>
          );
        })}
      </List>
    );

    return (
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper
        }}
        anchor="left"
      >
        {LogoContainer}
        {SidebarNavList}
      </Drawer>
    );
  }
}

Sidebar.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
  auth: PropTypes.shape({}).isRequired
};

const mapStateToProps = ({ auth }) => ({
  auth
});

export default compose(
  withRouter,
  connect(mapStateToProps),
  withStyles(styles)
)(Sidebar);
