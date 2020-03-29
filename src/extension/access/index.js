import React from 'react'
import AdminSelect from './AdminSelect'
import Permission from './PermissionTree'
import RoleSelect from './RoleSelect'

export default [
  {
    key: 'role_select',
    component: RoleSelect
  },

  {
    key: 'role_multi_select',
    component: AdminSelect
  }, {
    key: 'permission_select',
    component: Permission
  }

]