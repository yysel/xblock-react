export default {
  namespace: '@@element',
  state: {
    edit: {},
    add: {},
    filter: {},
    change:{

    }
  },
  reducers: {
    editParent(state, { payload }) {
      return {
        ...state,
        edit: {
          ...state.edit,
          ...payload,
        },
      };
    },
    addParent(state, { payload }) {
      return {
        ...state,
        add: {
          ...state.add,
          ...payload,
        },
      };
    },
    filterParent(state, { payload }) {
      return {
        ...state,
        filter: {
          ...state.filter,
          ...payload,
        },
      };
    },


  },
};
