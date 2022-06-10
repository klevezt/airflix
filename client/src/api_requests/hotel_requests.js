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

export const updateMonthsAfterDelete = async (month, year, index, token) => {
  const foodTypes = await fetchFoodTypesFromDB(token);
  let dayObject = {};
  foodTypes.forEach((type) => {
    const property = type.weekPropertyName;
    dayObject = { ...dayObject, [property]: [] };
  });
  const params = new URLSearchParams({
    week: index,
    month: month,
    year: year,
  });
  const food = await fetch(base_url + "/weekMenu/update?" + params, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      monday: dayObject,
      tuesday: dayObject,
      wednesday: dayObject,
      thursday: dayObject,
      friday: dayObject,
      saturday: dayObject,
      sunday: dayObject,
    }),
  });
  return food.json();
};

export const addNewMonth = async (month, year, index, token) => {
  const foodTypes = await fetchFoodTypesFromDB(token);
  let dayObject = {};
  foodTypes.forEach((type) => {
    const property = type.weekPropertyName;
    dayObject = { ...dayObject, [property]: [] };
  });
  const food = await fetch(base_url + "/weekMenu/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      week: index,
      month: month,
      year: year,
      monday: dayObject,
      tuesday: dayObject,
      wednesday: dayObject,
      thursday: dayObject,
      friday: dayObject,
      saturday: dayObject,
      sunday: dayObject,
    }),
  });
  return food.json();
};

export const fetchFoodFromDB = (token) => {
  return fetch(base_url + "/food", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((food) => food.json());
};

export const fetchDrinksFromDB = (token) => {
  return fetch(base_url + "/drink", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((drink) => drink.json());
};

export const fetchDrinksWithParamasFromDB = (prs, token) => {
  const params = new URLSearchParams(prs);
  return fetch(base_url + "/drink?" + params, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((drink) => drink.json());
};

export const fetchAlacarteWithParamasFromDB = (prs, token) => {
  const params = new URLSearchParams(prs);
  return fetch(base_url + "/alacarte?" + params, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((alacarte) => alacarte.json());
};

export const fetchBuffetWithParamasFromDB = (prs, token) => {
  const params = new URLSearchParams(prs);
  return fetch(base_url + "/food?" + params, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((foodType) => foodType.json());
};

export const fetchServiceWithParamasFromDB = (prs, token) => {
  const params = new URLSearchParams(prs);
  return fetch(base_url + "/service?" + params, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((service) => service.json());
};

export const fetchEventWithParamasFromDB = (prs, token) => {
  const params = new URLSearchParams(prs);
  return fetch(base_url + "/events?" + params, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((service) => service.json());
};

export const fetchEventsFromDB = (token) => {
  return fetch(base_url + "/events", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((events) => events.json());
};

export const fetchAlacarteFromDB = (token) => {
  return fetch(base_url + "/alacarte", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((alacarte) => alacarte.json());
};

export const fetchAlacarteTypeFromDB = (token) => {
  return fetch(base_url + "/alacarteType", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((alacarte) => alacarte.json());
};

export const fetchStaffFromDB = (token) => {
  return fetch(base_url + "/staff", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((staff) => staff.json());
};

export const fetchSingleDrinkFromDB = (prs, token) => {
  const params = new URLSearchParams(prs);
  return fetch(base_url + "/drink?" + params, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((drink) => drink.json());
};
export const fetchSingleReviewFromDB = (prs, token) => {
  const params = new URLSearchParams(prs);
  return fetch(base_url + "/review?" + params, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((review) => review.json());
};

export const fetchSingleAlacarteFromDB = (prs, token) => {
  const params = new URLSearchParams(prs);
  return fetch(base_url + "/alacarte?" + params, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((alacarte) => alacarte.json());
};

export const fetchSingleEventFromDB = (prs, token) => {
  const params = new URLSearchParams(prs);
  return fetch(base_url + "/events?" + params, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((alacarte) => alacarte.json());
};

export const fetchFoodFromDBWithParams = (prs, token) => {
  const params = new URLSearchParams(prs);
  return fetch(base_url + "/food?" + params, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((food) => food.json());
};

export const fetchFoodTypesFromDB = (token) => {
  return fetch(base_url + "/foodType", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((foodType) => foodType.json());
};

export const fetchFoodTypesAlacarteFromDB = (token) => {
  return fetch(base_url + "/alacarteType", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((foodType) => foodType.json());
};

export const fetchDrinksTypesFromDB = (token) => {
  return fetch(base_url + "/drinkType", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((drinkType) => drinkType.json());
};

export const fetchInfoTypesFromDB = (token) => {
  return fetch(base_url + "/info", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((info) => info.json());
};
export const fetchServicesTypesFromDB = (token) => {
  return fetch(base_url + "/serviceType", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((info) => info.json());
};

export const fetchStaffPositionFromDB = (token) => {
  return fetch(base_url + "/staffPosition", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((drinkType) => drinkType.json());
};

export const fetchWeekFromDB = (month, year, token) => {
  const params = new URLSearchParams({
    month: month,
    year: year,
  });

  return fetch(base_url + "/weekMenu?" + params, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  })
    .then((week) => week.json())
    .then((week) => week.sort((a, b) => a.week - b.week));
};

export const addFood = (n, t, i, ing, feat, desc, token) => {
  const uploadImages = [];
  for (const img of i) {
    uploadImages.push(img.name);
  }
  return fetch(base_url + "/food/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      name: n,
      type: t,
      images: uploadImages,
      ingredients: ing,
      special_features: feat,
      description: desc,
    }),
  }).then((data) => data.json());
};

export const addInfo = (n, i, c, alias, token) => {
  const uploadImages = [];
  for (const img of i) {
    uploadImages.push(img.name);
  }
  return fetch(base_url + "/info/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      name: n,
      image: uploadImages[0],
      content: c,
      alias,
    }),
  }).then((data) => data.json());
};

export const addService = (
  n,
  type,
  i,
  alias,
  phone,
  email,
  location,
  description,
  token
) => {
  const uploadImages = [];
  for (const img of i) {
    uploadImages.push(img.name);
  }

  return fetch(base_url + "/service/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      name: n,
      type,
      image: uploadImages[0],
      alias,
      phone,
      email,
      location,
      description,
    }),
  }).then((data) => data.json());
};

export const addServiceType = (n, i, alias, token) => {
  const uploadImages = [];
  for (const img of i) {
    uploadImages.push(img.name);
  }
  return fetch(base_url + "/serviceType/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      name: n,
      image: uploadImages[0],
      alias,
    }),
  }).then((data) => data.json());
};

export const addFoodWithImages = (n, i, token) => {
  const uploadImages = [];
  for (const img of i) {
    uploadImages.push(img.name);
  }
  return fetch(base_url + "/foodWithImages/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      name: n,
      images: uploadImages,
    }),
  }).then((data) => data.json());
};

export const addStaff = (n, alias, t, uploaded_images, desc, token) => {
  const uploadImages = [];
  for (const img of uploaded_images) {
    uploadImages.push(img.name);
  }
  return fetch(base_url + "/staff/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      name: n,
      alias: alias,
      position: t,
      images: uploadImages,
      description: desc,
    }),
  }).then((data) => data.json());
};

export const addDrink = (
  n,
  alias,
  t,
  images,
  desc,
  price,
  ingredients,
  token
) => {
  const uploadImages = [];
  for (const img of images) {
    uploadImages.push(img.name);
  }
  return fetch(base_url + "/drink/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      name: n,
      alias: alias,
      type: t,
      images: uploadImages,
      description: desc,
      price: price,
      ingredients: ingredients,
    }),
  }).then((data) => data.json());
};

export const addFoodType = (n, p, images, token) => {
  const uploadImages = [];
  for (const img of images) {
    uploadImages.push(img.name);
  }
  return fetch(base_url + "/foodType/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      name: n,
      weekPropertyName: p,
      image: uploadImages,
    }),
  }).then((data) => data.json());
};

export const addEvent = (name, alias, time, images, description, token) => {
  const uploadImages = [];
  for (const img of images) {
    uploadImages.push(img.name);
  }
  return fetch(base_url + "/events/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      name: name,
      alias: alias,
      time: time,
      images: uploadImages,
      description: description,
    }),
  }).then((data) => data.json());
};

export const addDrinkType = (n, images, token) => {
  const uploadImages = [];
  for (const img of images) {
    uploadImages.push(img.name);
  }
  return fetch(base_url + "/drinkType/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      name: n,
      images: uploadImages,
    }),
  }).then((data) => data.json());
};

export const setFoodStatus = (id, stat, token) => {
  return fetch(base_url + "/food/status/" + id, {
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

export const setInfoStatus = (id, stat, token) => {
  return fetch(base_url + "/info/update/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      featured: stat,
    }),
  });
};

export const setInfoContentStatus = (id, content, token) => {
  return fetch(base_url + "/info/update/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      content,
    }),
  });
};

export const setServiceContentStatus = (id, content, token) => {
  return fetch(base_url + "/service/update/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      content,
    }),
  });
};

export const setDrinkStatus = (id, stat, token) => {
  return fetch(base_url + "/drink/status/" + id, {
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

export const setAlacarteStatus = (id, stat, token) => {
  return fetch(base_url + "/alacarte/status/" + id, {
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
export const setAlacarteTypeStatus = (id, stat, token) => {
  return fetch(base_url + "/alacarteType/status/" + id, {
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

export const setFoodTypeStatus = (id, stat, token) => {
  return fetch(base_url + "/foodType/status/" + id, {
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

export const setDrinkTypeStatus = (id, stat, token) => {
  return fetch(base_url + "/drinkType/status/" + id, {
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

export const setCustomer = (uname, pass, room, room_type, token) => {
  return fetch(base_url + "/users/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      username: uname,
      password: pass,
      role: "Customer",
      room_number: room,
      room_type: room_type,
    }),
  }).then((data) => data.json());
};

export const updateCustomer = (id, uname, pass, room, room_type, token) => {
  return fetch(base_url + "/users/update/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      username: uname,
      password: pass,
      role: "Customer",
      room_number: room,
      room_type: room_type,
    }),
  }).then((data) => data.json());
};

export const updateInfoContent = (alias, content, token) => {
  return fetch(base_url + "/info/content/update/" + alias, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      content,
    }),
  }).then((data) => data.json());
};

export const getCustomerEdit = (id, token) => {
  return fetch(base_url + "/users/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((user) => user.json());
};

export const deleteCustomer = (id, token) => {
  return fetch(base_url + "/users/delete/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
};

export const fetchCustomersFromDB = (token) => {
  return fetch(base_url + "/users/customers", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((users) => users.json());
};
export const fetchInfoDetailsFromDB = (alias, token) => {
  const params = new URLSearchParams({
    alias,
  });
  return fetch(base_url + "/info?" + params.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((info) => info.json());
};
export const fetchServicesDetailsFromDB = (alias, token) => {
  const params = new URLSearchParams({
    alias,
  });
  return fetch(base_url + "/serviceType?" + params.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((service) => service.json());
};

export const fetchServiceFromDB = (token) => {
  return fetch(base_url + "/service", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((service) => service.json());
};

export const getServiceEdit = (id, token) => {
  return fetch(base_url + "/service/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((service) => service.json());
};

export const getEventEdit = (id, token) => {
  return fetch(base_url + "/events/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((event) => event.json());
};

export const getFoodEdit = (id, token) => {
  return fetch(base_url + "/food/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((food) => food.json());
};

export const getDrinkEdit = (id, token) => {
  return fetch(base_url + "/drink/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((drink) => drink.json());
};

export const getAlacarteEdit = (id, token) => {
  return fetch(base_url + "/alacarte/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((drink) => drink.json());
};

export const getFoodTypeEdit = (id, token) => {
  return fetch(base_url + "/foodType/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((foodType) => foodType.json());
};

export const getAlacarteTypeEdit = (id, token) => {
  return fetch(base_url + "/alacarteType/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((foodType) => foodType.json());
};

export const getDrinkTypeEdit = (id, token) => {
  return fetch(base_url + "/drinkType/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((foodType) => foodType.json());
};

export const updateFood = (
  id,
  foodName,
  foodType,
  foodImages,
  foodDesc,
  foodIngredients,
  foodSpecialFeatures,
  token
) => {
  return fetch(base_url + "/food/update/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      name: foodName,
      type: foodType,
      images: foodImages,
      description: foodDesc,
      ingredients: foodIngredients,
      special_features: foodSpecialFeatures,
    }),
  }).then((data) => data.json());
};

export const updateService = (
  id,
  serviceName,
  serviceType,
  serviceAlias,
  serviceImage,
  servicePhone,
  serviceEmail,
  serviceLocation,
  serviceDesc,
  token
) => {
  return fetch(base_url + "/service/update/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      name: serviceName,
      type: serviceType,
      alias: serviceAlias,
      image: serviceImage,
      phone: servicePhone,
      email: serviceEmail,
      location: serviceLocation,
      description: serviceDesc,
    }),
  }).then((data) => data.json());
};

export const updateInfo = (id, infoName, token) => {
  return fetch(base_url + "/info/update/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      name: infoName,
    }),
  }).then((data) => data.json());
};

export const updateServiceType = (id, serviceTypeName, a, token) => {
  return fetch(base_url + "/serviceType/update/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      name: serviceTypeName,
      alias: a,
    }),
  }).then((data) => data.json());
};

export const updateDrinksOfDrinkType = (t, token) => {
  return fetch(base_url + "/drink/uu/update-drink-type", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      type: t,
    }),
  })
    .then((data) => data.json())
    .catch((e) => console.log(e));
};

export const updateDrinksOfDrinkType_Status = (t, token) => {
  return fetch(base_url + "/drink/update-drink-type-statuses", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      type: t,
      status: false,
    }),
  })
    .then((data) => data.json())
    .catch((e) => console.log(e));
};

export const updateFoodOfFoodType_Status = (t, token) => {
  return fetch(base_url + "/food/update-food-type-statuses", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      type: t,
      status: false,
    }),
  })
    .then((data) => data.json())
    .catch((e) => console.log(e));
};
export const updateAlacarteOfAlacarteType_Status = (t, token) => {
  return fetch(base_url + "/alacarte/update-alacarte-type-statuses", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      type: t,
      status: false,
    }),
  })
    .then((data) => data.json())
    .catch((e) => console.log(e));
};
export const updateDrink = (
  id,
  drinkName,
  drinkType,
  drinkImage,
  drinkDesc,
  price,
  ingredients,
  token
) => {
  return fetch(base_url + "/drink/update/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      name: drinkName,
      type: drinkType,
      images: drinkImage,
      description: drinkDesc,
      price: price,
      ingredients: ingredients,
    }),
  }).then((data) => data.json());
};

export const updateAlacarte = (
  id,
  alacarteName,
  alacarteType,
  alacarteImage,
  alacarteDesc,
  price,
  ingredients,
  token
) => {
  return fetch(base_url + "/alacarte/update/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      name: alacarteName,
      type: alacarteType,
      images: alacarteImage,
      description: alacarteDesc,
      price: price,
      ingredients: ingredients,
    }),
  }).then((data) => data.json());
};

export const updateEvent = (
  id,
  eventName,
  alias,
  eventImage,
  eventTime,
  eventDesc,
  token
) => {
  return fetch(base_url + "/events/update/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      name: eventName,
      time: eventTime,
      images: eventImage,
      alias,
      description: eventDesc,
    }),
  }).then((data) => data.json());
};

export const updateFoodType = (id, foodTypeName, foodTypeImage, token) => {
  return fetch(base_url + "/foodType/update/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      name: foodTypeName,
      image: foodTypeImage,
    }),
  }).then((data) => data.json());
};
export const updateDrinkType = (id, drinkTypeName, image, token) => {
  return fetch(base_url + "/drinkType/update/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      name: drinkTypeName,
      images: image,
    }),
  }).then((data) => data.json());
};
export const updateAlacarteType = (id, type, image, token) => {
  return fetch(base_url + "/alacarteType/update/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      name: type,
      images: image,
    }),
  }).then((data) => data.json());
};
export const updateFoodWeek = (updateParams, token) => {
  const params = new URLSearchParams({
    week: updateParams.week,
    year: updateParams.year,
    month: updateParams.month,
  });
  return fetch(base_url + "/weekMenu/update?" + params.toString(), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      [updateParams.day]: updateParams.data,
    }),
  }).then((data) => data.json());
};

export const deleteFood = (id, token) => {
  return fetch(base_url + "/food/delete/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
};

export const deleteDrink = (id, token) => {
  return fetch(base_url + "/drink/delete/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
};

export const deleteAlacarte = (id, token) => {
  return fetch(base_url + "/alacarte/delete/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
};

export const deleteFoodType = (id, token) => {
  return fetch(base_url + "/foodType/delete/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
};
export const deleteDrinkType = (id, token) => {
  return fetch(base_url + "/drinkType/delete/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
};
export const deleteAlacarteType = (id, token) => {
  return fetch(base_url + "/alacarteType/delete/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
};
export const deleteInfo = (id, token) => {
  return fetch(base_url + "/info/delete/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
};
export const deleteService = (id, token) => {
  return fetch(base_url + "/service/delete/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
};

export const deleteServiceType = (id, token) => {
  return fetch(base_url + "/serviceType/delete/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
};

export const fetchReviewsFromDB = (token) => {
  return fetch(base_url + "/review", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((review) => review.json());
};

export const fetchReviewsFromDBWithParams = (prms, token) => {
  const params = new URLSearchParams(prms);
  return fetch(base_url + "/review?" + params, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((review) => review.json());
};

export const addReview = (params, token) => {
  return fetch(base_url + "/review/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      author: params.author,
      image: params.image,
      reviewFor: params.reviewFor,
      rating: params.rating,
      content: params.content,
    }),
  }).then((data) => data.json());
};

export const addStaffPosition = (name, token) => {
  return fetch(base_url + "/staffPosition/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      name,
    }),
  }).then((data) => data.json());
};

export const addAlacarte = (
  n,
  alias,
  t,
  images,
  desc,
  price,
  ingredients,
  token
) => {
  const uploadImages = [];
  for (const img of images) {
    uploadImages.push(img.name);
  }
  return fetch(base_url + "/alacarte/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      name: n,
      alias: alias,
      type: t,
      images: uploadImages,
      description: desc,
      price: price,
      ingredients: ingredients,
    }),
  }).then((data) => data.json());
};

export const addFoodTypeAlacarte = (n, images, token) => {
  const uploadImages = [];
  for (const img of images) {
    uploadImages.push(img.name);
  }
  return fetch(base_url + "/alacarteType/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      name: n,
      images: uploadImages,
    }),
  }).then((data) => data.json());
};
