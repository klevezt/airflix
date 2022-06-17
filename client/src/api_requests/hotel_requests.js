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
  const formData = new FormData();

  formData.append("name", n);
  formData.append("image", i);
  c.forEach((item) => {
    formData.append("content", JSON.stringify(item));
  });
  // formData.append("content", c);
  formData.append("alias", alias);

  console.log(formData.getAll("content"));

  return fetch(base_url + "/info/add", {
    method: "POST",
    headers: {
      "x-access-token": token,
    },
    body: formData,
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
  const formData = new FormData();

  formData.append("name", n);
  formData.append("type", type);
  formData.append("image", i);
  formData.append("alias", alias);
  formData.append("phone", phone);
  formData.append("email", email);
  formData.append("location", location);
  formData.append("description", description);

  return fetch(base_url + "/service/add", {
    method: "POST",
    headers: {
      "x-access-token": token,
    },
    body: formData,
  }).then((data) => data.json());
};

export const addServiceType = (n, i, alias, token) => {
  const formData = new FormData();

  formData.append("name", n);
  formData.append("image", i);
  formData.append("alias", alias);

  return fetch(base_url + "/serviceType/add", {
    method: "POST",
    headers: {
      "x-access-token": token,
    },
    body: formData,
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

export const addEvent = (name, alias, time, image, description, token) => {
  const formData = new FormData();

  formData.append("name", name);
  formData.append("alias", alias);
  formData.append("image", image);
  formData.append("time", time);
  formData.append("description", description);

  // console.log(name);
  // console.log(alias);
  // console.log(image);
  // console.log(time);
  // console.log(description);

  return fetch(base_url + "/events/add", {
    method: "POST",
    headers: {
      "x-access-token": token,
    },
    body: formData,
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
  }).then((data) => data.json());
};

export const setInfoStatus = (id, newFeatured, token) => {
  return fetch(base_url + "/info/update/" + id + "/featured", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      featured: newFeatured,
    }),
  }).then((data) => data.json());
};

export const setInfoContentStatus = (id, content, token) => {
  return fetch(base_url + "/info/content/update/" + id, {
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

export const toggleServiceContentStatus = (id, newStatus, token) => {
  return fetch(base_url + "/service/status/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      status: newStatus,
    }),
  }).then((data) => data.json());
};

export const toggleInfoContentStatus = (id, newStatus, token) => {
  return fetch(base_url + "/info/status/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      status: newStatus,
    }),
  }).then((data) => data.json());
};

export const toggleEventContentStatus = (id, newStatus, token) => {
  return fetch(base_url + "/events/status/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      status: newStatus,
    }),
  }).then((data) => data.json());
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
  }).then((data) => data.json());
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
  }).then((data) => data.json());
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
  }).then((data) => data.json());
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
  }).then((data) => data.json());
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
  }).then((data) => data.json());
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
  }).then((user) => user.json());
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
  const formData = new FormData();

  formData.append("name", serviceName);
  formData.append("type", serviceType);
  formData.append("alias", serviceAlias);
  formData.append("image", serviceImage);
  formData.append("phone", servicePhone);
  formData.append("email", serviceEmail);
  formData.append("location", serviceLocation);
  formData.append("description", serviceDesc);

  return fetch(base_url + "/service/update/" + id, {
    method: "PUT",
    headers: {
      "x-access-token": token,
    },
    body: formData,
  }).then((data) => data.json());
};

export const updateInfo = (id, infoName, infoAlias, infoImage, token) => {
  const formData = new FormData();

  formData.append("name", infoName);
  formData.append("alias", infoAlias);
  infoImage && formData.append("image", infoImage);

  return fetch(base_url + "/info/update/" + id, {
    method: "PUT",
    headers: {
      "x-access-token": token,
    },
    body: formData,
  }).then((data) => data.json());
};

export const updateServiceType = (
  id,
  serviceTypeName,
  serviceTypeImage,
  a,
  token
) => {
  const formData = new FormData();

  formData.append("name", serviceTypeName);
  formData.append("image", serviceTypeImage);
  formData.append("alias", a);

  return fetch(base_url + "/serviceType/update/" + id, {
    method: "PUT",
    headers: {
      "x-access-token": token,
    },
    body: formData,
  }).then((data) => data.json());
};

export const toggleServiceStatus = (id, newStatus, token) => {
  return fetch(base_url + "/serviceType/status/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      status: newStatus,
    }),
  }).then((data) => data.json());
};

export const updateDrinksOfDrinkType = (t, token) => {
  return fetch(base_url + "/drink/update-drink-type", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      type: t,
    }),
  }).then((data) => data.json());
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
  }).then((data) => data.json());
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
  }).then((data) => data.json());
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
  }).then((data) => data.json());
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
  const formData = new FormData();

  formData.append("name", eventName);
  formData.append("time", eventTime);
  formData.append("image", eventImage);
  formData.append("alias", alias);
  formData.append("description", eventDesc);

  return fetch(base_url + "/events/update/" + id, {
    method: "PUT",
    headers: {
      "x-access-token": token,
    },
    body: formData,
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
  }).then((data) => data.json());
};

export const deleteDrink = (id, token) => {
  return fetch(base_url + "/drink/delete/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((data) => data.json());
};

export const deleteAlacarte = (id, token) => {
  return fetch(base_url + "/alacarte/delete/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((data) => data.json());
};

export const deleteFoodType = (id, token) => {
  return fetch(base_url + "/foodType/delete/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((data) => data.json());
};
export const deleteDrinkType = (id, token) => {
  return fetch(base_url + "/drinkType/delete/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((data) => data.json());
};
export const deleteAlacarteType = (id, token) => {
  return fetch(base_url + "/alacarteType/delete/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((data) => data.json());
};
export const deleteInfo = (id, token) => {
  return fetch(base_url + "/info/delete/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((data) => data.json());
};
export const deleteService = (id, token) => {
  return fetch(base_url + "/service/delete/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((data) => data.json());
};
export const deleteEvent = (id, token) => {
  return fetch(base_url + "/events/delete/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((data) => data.json());
};
export const deleteServiceType = (id, token) => {
  return fetch(base_url + "/serviceType/delete/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  }).then((data) => data.json());
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
