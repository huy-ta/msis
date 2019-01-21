import React from 'react';

import Add from '@material-ui/icons/Add';
import MonetizationOn from '@material-ui/icons/MonetizationOn';
import Check from '@material-ui/icons/Check';
import Class from '@material-ui/icons/Class';
import School from '@material-ui/icons/School';
import Search from '@material-ui/icons/Search';
import Edit from '@material-ui/icons/Edit';
import { APP_LINKS } from 'Config/routers/appLinks';
import { USER_ROLES } from 'Config/enums/userRoles';

const sidebarItems = [
  {
    codeName: 'module',
    displayName: 'HỌC PHẦN',
    icon: () => <Class />,
    children: [
      {
        path: APP_LINKS.CREATE_MODULE,
        codeName: 'createModule',
        displayName: 'Tạo học phần',
        icon: () => <Add />,
        allowedRoles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER]
      },
      {
        path: APP_LINKS.LOOK_UP_MODULE,
        codeName: 'lookUpModule',
        displayName: 'Tìm kiếm học phần',
        icon: () => <Search />,
        allowedRoles: [USER_ROLES.STUDENT]
      },
      {
        path: APP_LINKS.EDIT_MODULE,
        codeName: 'editModule',
        displayName: 'Tìm kiếm học phần',
        icon: () => <Search />,
        allowedRoles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER]
      },
      {
        path: APP_LINKS.REGISTER_MODULE,
        codeName: 'registerModule',
        displayName: 'Đăng ký học phần',
        icon: () => <Check />,
        allowedRoles: [USER_ROLES.STUDENT]
      },
      {
        path: APP_LINKS.LIST_MODULE_REGISTRATION,
        codeName: 'listModuleRegistration',
        displayName: 'Danh sách học phần đăng ký',
        icon: () => <Search />,
        allowedRoles: [USER_ROLES.STUDENT]
      },
      {
        path: APP_LINKS.UPDATE_MODULE_GRADES,
        codeName: 'editModuleGrades',
        displayName: 'Sửa điểm học phần',
        icon: () => <Edit />,
        allowedRoles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER]
      }
    ],
    expanded: true
  },
  {
    path: APP_LINKS.VIEW_RESULTS,
    codeName: 'results',
    displayName: 'KẾT QUẢ HỌC TẬP',
    icon: () => <School />,
    allowedRoles: [USER_ROLES.STUDENT]
  },
  {
    path: APP_LINKS.VIEW_FEES,
    codeName: 'fees',
    displayName: 'TRA CỨU HỌC PHÍ',
    icon: () => <MonetizationOn />,
    allowedRoles: [USER_ROLES.STUDENT]
  },
  {
    codeName: 'term',
    displayName: 'HỌC KỲ',
    icon: () => <Class />,
    allowedRoles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER],
    children: [
      {
        path: APP_LINKS.CREATE_TERM,
        codeName: 'createTerm',
        displayName: 'Tạo học kỳ',
        icon: () => <Add />,
        allowedRoles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER]
      },
      {
        path: APP_LINKS.LIST_TERM,
        codeName: 'listTerm',
        displayName: 'Danh sách học kỳ',
        icon: () => <Search />,
        allowedRoles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER]
      },
      {
        path: APP_LINKS.OPEN_REGISTRATION,
        codeName: 'changeTerm',
        displayName: 'Thay đổi trạng thái',
        icon: () => <Search />,
        allowedRoles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER]
      }
    ],
    expanded: true
  },
  {
    codeName: 'user',
    displayName: 'TÀI KHOẢN',
    icon: () => <Class />,
    children: [
      {
        path: APP_LINKS.CREATE_USER,
        codeName: 'createUser',
        displayName: 'Tạo tài khoản',
        icon: () => <Add />,
        allowedRoles: [USER_ROLES.ADMIN]
      },
      {
        path: APP_LINKS.LIST_USER,
        codeName: 'listUser',
        displayName: 'Danh sách tài khoản',
        icon: () => <Search />,
        allowedRoles: [USER_ROLES.ADMIN]
      }
    ],
    allowedRoles: [USER_ROLES.ADMIN],
    expanded: true
  }
];

export { sidebarItems };

export default sidebarItems;
