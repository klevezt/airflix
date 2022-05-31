const base_url = process.env.REACT_APP_SERVER_URL;

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
      return userWithToken;
    })
    .catch();
};
