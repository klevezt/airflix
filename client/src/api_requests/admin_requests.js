const base_url = process.env.REACT_APP_SERVER_URL;

export const updateUserInfo = (id, uname, pass, token) => {
  return fetch(base_url + "/users/update/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      username: uname,
      password: pass,
    }),
  }).then((data) => data.json());
};

export const fetchUserInfoFromDB = (id, token) => {
  return fetch(base_url + "/users/settings/update/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((data) => data.json());
};

export const fetchUsersFromDB = (token) => {
  return fetch(base_url + "/users/all", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((users) => users.json());
};

export const setUser = (uname, pass, new_role, token) => {
  return fetch(base_url + "/users/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      username: uname,
      password: pass,
      role: new_role,
    }),
  }).then((data) => data.json());
};

export const setUserStatus = (id, stat, token) => {
  return fetch(base_url + "/users/status/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      status: stat,
    }),
  });
};

export const getUserEdit = (id, token) => {
  return fetch(base_url + "/users/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((user) => user.json());
};

export const updateUser = (id, uname, pass, new_role, token) => {
  return fetch(base_url + "/users/update/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      username: uname,
      password: pass,
      role: new_role,
    }),
  }).then((data) => data.json());
};

export const deleteUser = (id, token) => {
  return fetch(base_url + "/users/delete/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
};
