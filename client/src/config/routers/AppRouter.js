import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

import Login from 'Screens/Login';
import NotFound from 'Screens/NotFound';
import Layout from 'Shells/Layout';
import CreateModule from 'Screens/CreateModule';
import LookUpModule from 'Screens/LookUpModule';
import RegisterModule from 'Screens/RegisterModule';
import ViewResults from 'Screens/ViewResults';
import UpdateModuleGrades from 'Screens/UpdateModuleGrades';
import ViewFees from 'Screens/ViewFees';
import CreateUser from 'Screens/CreateUser';
import CreateTerm from 'Screens/CreateTerm';
import ListUser from 'Screens/ListUser';
import ListTerm from 'Screens/ListTerm';
import ListModuleRegistration from 'Screens/ListModuleRegistration';
import ChangeTerm from 'Screens/ChangeTerm';
import EditModule from 'Screens/EditModule';
import PrivateRoute from './PrivateRoute';
import PrivateRoleRoute from './PrivateRoleRoute';
import PublicRoute from './PublicRoute';

import { APP_LINKS } from './appLinks';
import { USER_ROLES } from '../enums/userRoles';

const history = createHistory();

const AppLayout = () => (
  <Layout>
    <Switch>
      <PrivateRoleRoute
        path={APP_LINKS.CREATE_MODULE}
        component={CreateModule}
        allowedRoles={[USER_ROLES.MANAGER, USER_ROLES.ADMIN]}
        exact
      />
      <PrivateRoute path={APP_LINKS.LOOK_UP_MODULE} component={LookUpModule} exact />
      <PrivateRoleRoute
        path={APP_LINKS.REGISTER_MODULE}
        component={RegisterModule}
        allowedRoles={[USER_ROLES.STUDENT]}
        exact
      />
      <PrivateRoleRoute
        path={APP_LINKS.VIEW_RESULTS}
        component={ViewResults}
        allowedRoles={[USER_ROLES.STUDENT]}
        exact
      />
      <PrivateRoleRoute
        path={APP_LINKS.UPDATE_MODULE_GRADES}
        component={UpdateModuleGrades}
        allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.MANAGER]}
        exact
      />
      <PrivateRoleRoute path={APP_LINKS.VIEW_FEES} component={ViewFees} allowedRoles={[USER_ROLES.STUDENT]} exact />
      <PrivateRoleRoute
        path={APP_LINKS.EDIT_MODULE}
        component={EditModule}
        allowedRoles={[USER_ROLES.MANAGER, USER_ROLES.ADMIN]}
        exact
      />
      <PrivateRoleRoute path={APP_LINKS.CREATE_USER} component={CreateUser} allowedRoles={[USER_ROLES.ADMIN]} exact />
      <PrivateRoleRoute
        path={APP_LINKS.CREATE_TERM}
        component={CreateTerm}
        allowedRoles={[USER_ROLES.MANAGER, USER_ROLES.ADMIN]}
        exact
      />
      <PrivateRoleRoute
        path={APP_LINKS.LIST_TERM}
        component={ListTerm}
        allowedRoles={[USER_ROLES.MANAGER, USER_ROLES.ADMIN]}
        exact
      />
      <PrivateRoleRoute path={APP_LINKS.LIST_USER} component={ListUser} allowedRoles={[USER_ROLES.ADMIN]} exact />
      <PrivateRoleRoute
        path={APP_LINKS.LIST_MODULE_REGISTRATION}
        component={ListModuleRegistration}
        allowedRoles={[USER_ROLES.STUDENT]}
        exact
      />
      <PrivateRoleRoute
        path={APP_LINKS.OPEN_REGISTRATION}
        component={ChangeTerm}
        allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.MANAGER]}
        exact
      />
      <PrivateRoute component={NotFound} />
    </Switch>
  </Layout>
);

const AppRouter = () => (
  <Router history={history}>
    <Switch>
      <PublicRoute path={APP_LINKS.LOGIN} component={Login} exact />
      <PrivateRoute path={APP_LINKS.MAIN} component={AppLayout} />
      <Route component={NotFound} />
    </Switch>
  </Router>
);

export { history, AppRouter };

export default AppRouter;
