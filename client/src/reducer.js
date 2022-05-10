export const initialState = {
  user: null,
  authenticated: false,
  token: "",
  allUsers: [],
};

export const actionTypes = {
  SET_USER: "SET_USER",
  REMOVE_JWT_TOKEN: "REMOVE_JWT_TOKEN",
  GET_ALL_USERS_ADMIN: "GET_ALL_USERS_ADMIN",
  ADD_NEW_USER_ADMIN: "ADD_NEW_USER_ADMIN",
  GET_CURRENT_USER: "GET_CURRENT_USER",
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user,
        authenticated: action.authenticated,
        token: action.jwtauthtoken,
      };
    case actionTypes.REMOVE_JWT_TOKEN:
      return {
        ...state,
        authenticated: action.authenticated,
        token: action.jwtauthtoken,
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

    default:
      return state;
  }
};

export default reducer;
