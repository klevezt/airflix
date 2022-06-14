import { DeleteForeverSharp, Edit } from "@mui/icons-material";
import { Link } from "react-router-dom";
import Card from "../../components/UI/Card/TableCellCard";
import { getWeeksInMonth } from "../Functions/functions";
import i18next from "i18next";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";

export const imageUpload = (image) => {
  const storage = getStorage();
  const storageRef = ref(storage, image.name);

  uploadBytes(storageRef, image).then((snapshot) => {
    console.log("Uploaded a blob or file!");
  });
};

export const imageGetter = async (
  data,
  img_path,
  data_with_only_one_image = false
) => {
  var myArr = [];
  var error = false;
  var loading = true;

  try {
    await Promise.all(
      data.map(async (imageArr) => {
        var temp = data_with_only_one_image
          ? imageArr.image
          : imageArr.images[0];

        let path;
        if (!temp) path = "General/no_image.png";
        else path = img_path + temp;

        const storageRef = ref(storage, path);
        // console.log("xcaxax");
        myArr.push({
          ...imageArr,
          image:
            "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBhUIBwgWFhUWFR0ZFxUYFxkaHhUWFx0WGRoaFhUZHSggJB8nIBUVJTEnJikrLi8uGB8zODMsNygtLisBCgoKDQ0NFQwNFS0dFRkrKysrKysrLSsrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAOEA4QMBIgACEQEDEQH/xAAbAAEBAAIDAQAAAAAAAAAAAAAABAIFAQMGB//EADgQAQACAQIBBwoEBgMAAAAAAAABAgMEEQUSITFBUWFxExQiMlJygZGxwTRCodEGMzVTYoIVIyT/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABURAQEAAAAAAAAAAAAAAAAAAAAR/9oADAMBAAIRAxEAPwD7iAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADV6rV+X1XmuLJyY32m/bPs1ntBTn1+HFfydYm1vZrz/AD7GHluIZPU01a+9b9lGm0+LT05GGm338ZdwIfKcRpz2w0nwtMfVzTiOOL8jU45pP+XRPhZbswyY6ZKci9d4nqkGUTvG8OWtmL8MtvEzOKemOunfv2NjWYtG8SDkAAAAAAAAAAAAAAAAAAAAAEvEc1sWn2x+taeTXxkrocPmnm0xzdvXv279rr1H/ZxPHSeqJt8ej7rQQ6fPk0+XzbVz7l/ajsnvXvP/AMRZcnnEYotzcmJ2795/ZFh1WqyW5M6uax2zM7CV61jTJS8b0tE+DzOXLq64/K4tbNojp2mYmPGJdmhzTj4hTHh1M2rb1ubaN+vm+Ec4V6K9a3rNbRzSj4dM4cltHefV56+7PR8lqLP6HFMdo/NW0T8I3FXAAAAAAAAAAAAAAAAAAAAAAhz+hxXHaeutq/f7LYScTx2tgjLjj0qTyo+HTHyUYctM2KMuOeaY3gGg/iL8bHuR9ZSabkZdNbTTeImZi0TPRO28bb/F6TVaDT6q0WzU3mO/Z0/8Nov7c/ORI0Mb6Wl6ZOm1YiNpiY6Ymd5g4X/UaeLfTwbRTH8ufnKXR6XBotXGPPTn39C/VPdMdoRukOp9LieKsdUWn9NlsztHOh0P/o1N9X1erXwjpn4yKvgAAAAAAAAAAAAAAAAAAAAACWtmLcOyzatZnFad5iPyT1z4Nk4mNwY48lMlIvjtvE9cM0N9ByLcvR5ZpPXHTWf9Tl8Rx+thpbvi236SC51anDjz4Zx5Y5vp37pvLcQtzRpax3zbf6OPMsuf8bqN49ivNHx65BLhtqdXE6SuTekTtOSPzV7I723x0rjpFKRtEFKVx15NK7RHVDIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/9k=",
        });

        // await getDownloadURL(storageRef)
        // .then((image) => {
        // myArr.push({ ...imageArr, image });
      })
      // .catch((err) => {
      // error = true;
      // console.log(err);
      // myArr.push({
      //   ...imageArr,
      //   image:
      //     "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBhUIBwgWFhUWFR0ZFxUYFxkaHhUWFx0WGRoaFhUZHSggJB8nIBUVJTEnJikrLi8uGB8zODMsNygtLisBCgoKDQ0NFQwNFS0dFRkrKysrKysrLSsrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAOEA4QMBIgACEQEDEQH/xAAbAAEBAAIDAQAAAAAAAAAAAAAABAIFAQMGB//EADgQAQACAQIBBwoEBgMAAAAAAAABAgMEEQUSITFBUWFxExQiMlJygZGxwTRCodEGMzVTYoIVIyT/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABURAQEAAAAAAAAAAAAAAAAAAAAR/9oADAMBAAIRAxEAPwD7iAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADV6rV+X1XmuLJyY32m/bPs1ntBTn1+HFfydYm1vZrz/AD7GHluIZPU01a+9b9lGm0+LT05GGm338ZdwIfKcRpz2w0nwtMfVzTiOOL8jU45pP+XRPhZbswyY6ZKci9d4nqkGUTvG8OWtmL8MtvEzOKemOunfv2NjWYtG8SDkAAAAAAAAAAAAAAAAAAAAAEvEc1sWn2x+taeTXxkrocPmnm0xzdvXv279rr1H/ZxPHSeqJt8ej7rQQ6fPk0+XzbVz7l/ajsnvXvP/AMRZcnnEYotzcmJ2795/ZFh1WqyW5M6uax2zM7CV61jTJS8b0tE+DzOXLq64/K4tbNojp2mYmPGJdmhzTj4hTHh1M2rb1ubaN+vm+Ec4V6K9a3rNbRzSj4dM4cltHefV56+7PR8lqLP6HFMdo/NW0T8I3FXAAAAAAAAAAAAAAAAAAAAAAhz+hxXHaeutq/f7LYScTx2tgjLjj0qTyo+HTHyUYctM2KMuOeaY3gGg/iL8bHuR9ZSabkZdNbTTeImZi0TPRO28bb/F6TVaDT6q0WzU3mO/Z0/8Nov7c/ORI0Mb6Wl6ZOm1YiNpiY6Ymd5g4X/UaeLfTwbRTH8ufnKXR6XBotXGPPTn39C/VPdMdoRukOp9LieKsdUWn9NlsztHOh0P/o1N9X1erXwjpn4yKvgAAAAAAAAAAAAAAAAAAAAACWtmLcOyzatZnFad5iPyT1z4Nk4mNwY48lMlIvjtvE9cM0N9ByLcvR5ZpPXHTWf9Tl8Rx+thpbvi236SC51anDjz4Zx5Y5vp37pvLcQtzRpax3zbf6OPMsuf8bqN49ivNHx65BLhtqdXE6SuTekTtOSPzV7I723x0rjpFKRtEFKVx15NK7RHVDIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/9k=",
      // });
      // });
      // })
    );
  } catch (err) {
    console.log(err);
  }

  return { myArr, error, loading };
};

export const assignWeeksToTable = (year, month, week) => {
  const [weeeek] = getWeeksInMonth(year, month);
  const menu_week = [];
  const weekObject = [];
  const defaultValue = "";

  weeeek.forEach((_, i) => {
    week.forEach((weeks) => {
      weekObject.push(weeks);
    });
  });

  weeeek.forEach((_, i) => {
    menu_week.push({
      year: weekObject[i] ? weekObject[i].year : defaultValue,
      month: weekObject[i] ? weekObject[i].month : defaultValue,
      week: weekObject[i] ? weekObject[i].week : defaultValue,
      monday: weekObject[i] ? weekObject[i].monday : defaultValue,
      tuesday: weekObject[i] ? weekObject[i].tuesday : defaultValue,
      wednesday: weekObject[i] ? weekObject[i].wednesday : defaultValue,
      thursday: weekObject[i] ? weekObject[i].thursday : defaultValue,
      friday: weekObject[i] ? weekObject[i].friday : defaultValue,
      saturday: weekObject[i] ? weekObject[i].saturday : defaultValue,
      sunday: weekObject[i] ? weekObject[i].sunday : defaultValue,
    });
  });

  return menu_week;
};

const checkDay = (i, j, k, start, end) => {
  return (
    (i === 0 && end[i] - j < 0) ||
    (end.length - 1 === i && end[i] - start[i] < k)
  );
};

export const monthTableRow = (year, month, menu, tableMenu) => {
  const [weeeek, start, end] = getWeeksInMonth(year, month);

  weeeek.forEach((week, i) => {
    try {
      menu.push({
        week: (
          <h6 className="d-flex justify-content-center pt-2" custom_key={i}>
            {week}
          </h6>
        ),
        day1: (
          <>
            {checkDay(i, 7, 0, start, end) ? (
              <Card empty custom_key={i} />
            ) : (
              <Card
                day="monday"
                dayNumber="1"
                data={tableMenu[i].monday}
                week={
                  end.length - 1 !== i
                    ? end[i] - 6 + "/" + month
                    : start[i] + "/" + month
                }
                weekNumber={i + 1}
                yearNumber={year}
                monthNumber={month}
                custom_key={i}
              />
            )}
          </>
        ),
        day2: (
          <>
            {checkDay(i, 6, 1, start, end) ? (
              <Card empty custom_key={i} />
            ) : (
              <Card
                day="tuesday"
                dayNumber="2"
                data={tableMenu[i].tuesday}
                week={
                  end.length - 1 !== i
                    ? end[i] - 5 + "/" + month
                    : start[i] + 1 + "/" + month
                }
                weekNumber={i + 1}
                yearNumber={year}
                monthNumber={month}
                custom_key={i}
              />
            )}
          </>
        ),
        day3: (
          <>
            {checkDay(i, 5, 2, start, end) ? (
              <Card empty custom_key={i} />
            ) : (
              <Card
                day="wednesday"
                dayNumber="3"
                data={tableMenu[i].wednesday}
                week={
                  end.length - 1 !== i
                    ? end[i] - 4 + "/" + month
                    : start[i] + 2 + "/" + month
                }
                weekNumber={i + 1}
                yearNumber={year}
                monthNumber={month}
                custom_key={i}
              />
            )}
          </>
        ),
        day4: (
          <>
            {checkDay(i, 4, 3, start, end) ? (
              <Card empty custom_key={i} />
            ) : (
              <Card
                day="thursday"
                dayNumber="4"
                data={tableMenu[i].thursday}
                week={
                  end.length - 1 !== i
                    ? end[i] - 3 + "/" + month
                    : start[i] + 3 + "/" + month
                }
                weekNumber={i + 1}
                yearNumber={year}
                monthNumber={month}
                custom_key={i}
              />
            )}
          </>
        ),
        day5: (
          <>
            {checkDay(i, 3, 4, start, end) ? (
              <Card empty custom_key={i} />
            ) : (
              <Card
                day="friday"
                dayNumber="5"
                data={tableMenu[i].friday}
                week={
                  end.length - 1 !== i
                    ? end[i] - 2 + "/" + month
                    : start[i] + 4 + "/" + month
                }
                weekNumber={i + 1}
                yearNumber={year}
                monthNumber={month}
                custom_key={i}
              />
            )}
          </>
        ),
        day6: (
          <>
            {checkDay(i, 2, 5, start, end) ? (
              <Card empty custom_key={i} />
            ) : (
              <Card
                day="saturday"
                dayNumber="6"
                data={tableMenu[i].saturday}
                week={
                  end.length - 1 !== i
                    ? end[i] - 1 + "/" + month
                    : start[i] + 5 + "/" + month
                }
                weekNumber={i + 1}
                yearNumber={year}
                monthNumber={month}
                custom_key={i}
              />
            )}
          </>
        ),
        day7: (
          <>
            {checkDay(i, 1, 6, start, end) ? (
              <Card empty custom_key={i} />
            ) : (
              <Card
                day="sunday"
                dayNumber="7"
                data={tableMenu[i].sunday}
                week={
                  end.length - 1 !== i
                    ? end[i] + "/" + month
                    : start[i] + 6 + "/" + month
                }
                weekNumber={i + 1}
                yearNumber={year}
                monthNumber={month}
                custom_key={i}
              />
            )}
          </>
        ),
      });
    } catch (error) {
      // console.log("Error: " + error);
    }
  });
};

export const menuFoodRowC = (
  menuFoodRows,
  food,
  handleFoodStatus,
  handleEditFood,
  handleDeleteFood
) => {
  menuFoodRows.push({
    name: food.name,
    type: food.type,
    status: (
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          checked={food.status ? true : false}
          onChange={() => handleFoodStatus(food._id, !food.status)}
          autoComplete="off"
        />
      </div>
    ),
    actions: (
      <div>
        <Link to="/food" onClick={() => handleEditFood(food._id)}>
          <Edit />
        </Link>
        <Link to="/food" onClick={() => handleDeleteFood(food._id)}>
          <DeleteForeverSharp />
        </Link>
      </div>
    ),
  });
  return menuFoodRows;
};

export const menuFoodTypeRowC = (
  menuFoodTypeRows,
  foodType,
  handleFoodTypeStatus,
  handleEditFoodType,
  handleDeleteFoodType
) => {
  menuFoodTypeRows.push({
    name: foodType.name,
    status: (
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          checked={foodType.status ? true : false}
          onChange={() => handleFoodTypeStatus(foodType._id, !foodType.status)}
          autoComplete="off"
        />
      </div>
    ),
    actions: (
      <>
        <Link to="/food" onClick={() => handleEditFoodType(foodType._id)}>
          <Edit />
        </Link>
        <Link to="/food" onClick={() => handleDeleteFoodType(foodType._id)}>
          <DeleteForeverSharp />
        </Link>
      </>
    ),
  });
  return menuFoodTypeRows;
};

export const drinkTypesColumns = [
  {
    label: i18next.t("drink_type_name"),
    field: "name",
    attributes: {
      "aria-controls": "DataTable",
      "aria-label": "Name",
    },
  },
  {
    label: i18next.t("actions"),
    field: "actions",
  },
  {
    label: i18next.t("status"),
    field: "status",
  },
];

export const menuFoodTypesColumns = [
  {
    label: i18next.t("food_type_name"),
    field: "name",
    attributes: {
      "aria-controls": "DataTable",
      "aria-label": "Name",
    },
  },
  {
    label: i18next.t("actions"),
    field: "actions",
  },
  {
    label: i18next.t("status"),
    field: "status",
  },
];

export const menuFoodStockColumns = [
  {
    label: i18next.t("food_type_name"),
    field: "name",
    attributes: {
      "aria-controls": "DataTable",
      "aria-label": "Name",
    },
  },
  {
    label: i18next.t("quantity"),
    field: "quantity",
  },
  {
    label: i18next.t("actions"),
    field: "actions",
  },
  {
    label: i18next.t("status"),
    field: "status",
  },
];

export const menuDrinkStockColumns = [
  {
    label: i18next.t("drink_type_name"),
    field: "name",
    attributes: {
      "aria-controls": "DataTable",
      "aria-label": "Name",
    },
  },
  {
    label: i18next.t("quantity"),
    field: "quantity",
  },
  {
    label: i18next.t("actions"),
    field: "actions",
  },
  {
    label: i18next.t("status"),
    field: "status",
  },
];

export const menuFoodColumns = [
  {
    label: i18next.t("food_name"),
    field: "name",
    attributes: {
      "aria-controls": "DataTable",
      "aria-label": "Name",
    },
  },
  {
    label: i18next.t("food_type"),
    field: "type",
  },
  {
    label: i18next.t("actions"),
    field: "actions",
  },
  {
    label: i18next.t("status"),
    field: "status",
  },
];

export const menuTableColumns = [
  {
    label: i18next.t("week"),
    field: "week",
    attributes: {
      className: "",
    },
  },
  {
    label: i18next.t("monday"),
    field: "day1",
  },
  {
    label: i18next.t("tuesday"),
    field: "day2",
  },
  {
    label: i18next.t("wednesday"),
    field: "day3",
  },
  {
    label: i18next.t("thursday"),
    field: "day4",
  },
  {
    label: i18next.t("friday"),
    field: "day5",
  },
  {
    label: i18next.t("saturday"),
    field: "day6",
  },
  {
    label: i18next.t("sunday"),
    field: "day7",
  },
];

export const drinksTable = [
  {
    label: i18next.t("drink_name"),
    field: "name",
    attributes: {
      "aria-controls": "DataTable",
      "aria-label": "Name",
    },
  },
  {
    label: i18next.t("drink_type"),
    field: "type",
  },
  {
    label: i18next.t("actions"),
    field: "actions",
  },
  {
    label: i18next.t("status"),
    field: "status",
  },
];

export const months = [
  // i18next.t("january"),
  // i18next.t("february"),
  i18next.t("march"),
  i18next.t("april"),
  i18next.t("may"),
  i18next.t("june"),
  i18next.t("july"),
  i18next.t("august"),
  i18next.t("september"),
  i18next.t("october"),
  i18next.t("november"),
  i18next.t("december"),
];

export const weekNamesAliases = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export const years = [2021, 2022, 2023, 2024, 2025];

export const roomTypes = ["Superior", "Suite", "Premium"];
