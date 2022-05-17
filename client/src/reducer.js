export const initialState = {
  user: null,
  authenticated: false,
  token: "",
  refreshToken: "",
  allUsers: [],
};

export const actionTypes = {
  SET_USER: "SET_USER",
  REMOVE_JWT_TOKEN: "REMOVE_JWT_TOKEN",
  GET_ALL_USERS_ADMIN: "GET_ALL_USERS_ADMIN",
  ADD_NEW_USER_ADMIN: "ADD_NEW_USER_ADMIN",
  GET_CURRENT_USER: "GET_CURRENT_USER",
  SET_NEW_JWT_TOKEN: "SET_NEW_JWT_TOKEN",
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user,
        authenticated: action.authenticated,
        token: action.token,
        refreshToken: action.rToken,
      };
    case actionTypes.REMOVE_JWT_TOKEN:
      return {
        ...state,
        authenticated: action.authenticated,
        token: action.token,
      };
    case actionTypes.GET_ALL_USERS_ADMIN:
      return {
        ...state,
        allUsers: action.users,
      };
    case actionTypes.ADD_NEW_USER_ADMIN:
      return {
        ...state,
        allUsers: [...state.allUsers, action.new_user],
      };
    case actionTypes.GET_CURRENT_USER:
      return {
        ...state,
        user: action.user,
      };
    case actionTypes.SET_NEW_JWT_TOKEN:
      return {
        ...state,
        token: action.token,
      };

    default:
      return state;
  }
};

export default reducer;
