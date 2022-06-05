const base_url = process.env.REACT_APP_SERVER_URL;

export const issueNewToken = (refreshToken) => {
  return fetch(process.env.REACT_APP_SERVER_URL + "/auth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": refreshToken,
    },
  }).then((data) => data.json());
};

export const authenticateUserWithToken = (username, password) => {
  return fetch(base_url + "/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  })
    .then((data) => data.json())
    .then((userWithToken) => {
      document.cookie = `token=${userWithToken.accessToken};max-age=10;`;
      document.cookie = `refresh-token=${userWithToken.refreshToken};max-age=60;`;
      return userWithToken;
    })
    .catch();
};
