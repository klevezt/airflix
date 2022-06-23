export const initialState = {
  user: null,
  authenticated: false,
  token: "",
  refreshToken: "",
};

export const actionTypes = {
  SET_USER: "SET_USER",
  REMOVE_JWT_TOKEN: "REMOVE_JWT_TOKEN",
  GET_CURRENT_USER: "GET_CURRENT_USER",
  SET_NEW_JWT_TOKEN: "SET_NEW_JWT_TOKEN",
  LOGOUT_USER: "LOGOUT_USER",
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
        refreshToken: action.refreshToken,
      };
    case actionTypes.LOGOUT_USER:
      return {
        ...state,
        authenticated: action.authenticated,
        token: action.token,
        refreshToken: action.refreshToken,
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
