const base_url = process.env.REACT_APP_SERVER_URL;

export const fetchTodaysMenuFromDB = (week, month, year, token) => {
  const params = new URLSearchParams({
    week: week,
    month: month,
    year: year,
  });
  return fetch(base_url + "/weekMenu/getFullDay?" + params, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((data) => data.json());
};

export const rateTheApp = (params, token) => {
  return fetch(base_url + "/rate/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      author: params.name,
      rating: params.rating,
      content: params.content,
    }),
  }).then((data) => data.json());
};
