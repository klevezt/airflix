const base_url = process.env.REACT_APP_SERVER_URL;

export const authenticateUserWithToken = (username, password) => {
  return fetch(base_url + "/login", {
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
      document.cookie = `token=${userWithToken.token};max-age=100;`;
      document.cookie = `refresh-token=${userWithToken.refreshToken};max-age=2592000;`;
      return userWithToken;
    })
    .catch();
};
