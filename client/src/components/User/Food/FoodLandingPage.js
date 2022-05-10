import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { RestaurantMenu, MenuBook } from "@mui/icons-material";

import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import { weekNamesAliases } from "../../../Helpers/Const/constants";
import { getCurrentWeekInMonth } from "../../../Helpers/Functions/functions";
import { fetchTodaysMenuFromDB } from "../../../api_requests/user_requests";
import { useTranslation } from "react-i18next";
import "./FoodLandingPage.css";
import { fetchFoodFromDBWithParams } from "../../../api_requests/hotel_requests";
import { useStateValue } from "../../../StateProvider";

function FoodLandingPage() {
  const { t } = useTranslation();
  const [state] = useStateValue();

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(false);
  const [todaysFoodCategories, setTodaysFoodCategories] = useState([]);

  const [openLeft, setOpenLeft] = useState(false);
  const [openRight, setOpenRight] = useState(false);
  const handleOpenRight = () => setOpenRight((s) => !s);
  const [foodWithImages, setFoodWithImages] = useState([]);

  const handleOpenLeft = () => {
    setOpenLeft((s) => !s);
  };

  useEffect(() => {
    const today = new Date();

    setIsSpinnerLoading(true);
    let controller = new AbortController();
    const exec = async () => {
      const todaysYear = today.getFullYear();
      const todaysMonth = today.getMonth() + 1;
      const currentWeekNumber = getCurrentWeekInMonth(todaysYear, todaysMonth);
      const data = await fetchTodaysMenuFromDB(
        currentWeekNumber,
        todaysMonth,
        todaysYear,
        state.token
      );

      const currentDay = weekNamesAliases[today.getDay()];

      const allCategoriesObject = data[0][currentDay];
      const allCategoriesArray = Object.entries(allCategoriesObject).map(
        (key) => {
          return key;
        }
      );
      const arr2 = [];

      const foodd = await fetchFoodFromDBWithParams("status=true", state.token);
      foodd.forEach((f) => {
        arr2.push({ name: f, img: f.images });
      });
      setFoodWithImages(arr2);
      setTodaysFoodCategories(allCategoriesArray);
      setTimeout(() => {
        setIsSpinnerLoading(false);
      }, 1000);
    };
    exec();
    controller = null;
    return () => controller?.abort();
  }, [openLeft]);

  const showAllCategories = todaysFoodCategories.map((category, q) => {
    const foodPerEachCategory = category[1].map((food) => {
      return foodWithImages
        .filter((f) => f.name.name === food)
        .map((currentFood, j) => {
          return (
            <div className="outer-box" key={j}>
              <Link to={`/buffet/${currentFood.name.name}`}>
                {isSpinnerLoading && <LoadingSpinner />}
                {!isSpinnerLoading && (
                  <img
                    src={`${process.env.REACT_APP_IMAGES_URL}/Images/Food/${currentFood.img[0]}`}
                    alt="food"
                  />
                )}
                <hr className="d-block d-sm-none m-0" />
                <h4>{currentFood.name.name}</h4>
                <p>
                  {currentFood.name.ingredients.map((ing, i) =>
                    i === currentFood.name.ingredients.length - 1 ? (
                      <span key={i}>{ing}</span>
                    ) : (
                      <span key={i}>{ing + " , "}</span>
                    )
                  )}
                </p>
                {currentFood.name.special_features.map((_, i) => (
                  <div class="bookmark" key={i}></div>
                ))}
              </Link>
            </div>
          );
        });
    });

    return (
      <React.Fragment key={q}>
        {category[1].length !== 0 && (
          <div className="food-landing-page__category__wrapper text-center h-auto">
            <h3>{t(`${category[0]}`)}</h3>
            <div className="row food-landing-page__category__each_category">
              {foodPerEachCategory}
            </div>
          </div>
        )}
      </React.Fragment>
    );
  });

  return (
    <div className="drink-user-wrapper">
      <div
        className={`food-landing-page ${openLeft ? "openLeft" : ""} ${
          openRight ? "openRight" : ""
        } `}
      >
        <div
          className="d-flex justify-content-center align-items-center flex-direction-column"
          onClick={handleOpenLeft}
        >
          <Link to={"/buffet"}>
            <RestaurantMenu className="landing-page-icon" />
          </Link>
          <h2>MENU</h2>
        </div>
        <div
          className="d-flex justify-content-center align-items-center flex-direction-column"
          onClick={handleOpenRight}
        >
          <Link to={"/alacarte"}>
            <MenuBook className="landing-page-icon" />
          </Link>
          <h2>A LA CARTE</h2>
        </div>
      </div>
    </div>
  );
}

export default FoodLandingPage;
