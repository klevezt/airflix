import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactDOM from "react-dom";
import IconButton from "../../UI/Buttons/IconButton";
import { Search } from "@mui/icons-material";
import { Fade, Backdrop, Modal, TextField } from "@mui/material";

import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import { weekNamesAliases } from "../../../Helpers/Const/constants";
import {
  getSelectedDayBelongsWeekInMonth,
  // removeUpperAccents,
} from "../../../Helpers/Functions/functions";
import { fetchTodaysMenuFromDB } from "../../../api_requests/user_requests";
import { useTranslation } from "react-i18next";
import {
  fetchFoodFromDBWithParams,
  fetchFoodTypesFromDB,
} from "../../../api_requests/hotel_requests";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import elLocale from "date-fns/locale/el";
import BookCover from "../../UI/Book/BookCover";
import { useStateValue } from "../../../StateProvider";

import "./BuffetLandingPage.css";

const BuffetLandingPage = () => {
  const { t } = useTranslation();
  const [state] = useStateValue();

  // const translate = (text) => removeUpperAccents(t(text));
  const [isSpinnerLoading, setIsSpinnerLoading] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [search, setSearch] = useState(false);
  const [foodState, setFood] = useState([]);
  const [todaysFoodCategories, setTodaysFoodCategories] = useState([]);
  const [date, setDate] = useState(new Date());

  const [fullDate, setFullDate] = useState(
    date.getDate() + " " + date.toLocaleString("default", { month: "long" })
  );

  useEffect(() => {
    setIsSpinnerLoading(true);
    let controller = new AbortController();
    const exec = async () => {
      const selectedYear = date.getFullYear();
      const selectedMonth = date.getMonth() + 1;
      const currentWeekNumber = getSelectedDayBelongsWeekInMonth(
        selectedYear,
        selectedMonth,
        date
      );
      const data = await fetchTodaysMenuFromDB(
        currentWeekNumber,
        selectedMonth,
        selectedYear,
        state.token
      );

      const currentDay = weekNamesAliases[date.getDay()];
      const allCategoriesObject = data[0][currentDay];
      const allCategoriesArray = Object.entries(allCategoriesObject).map(
        (key) => {
          return key;
        }
      );

      const foodd = await fetchFoodFromDBWithParams("status=true", state.token);

      setFood(foodd);
      setTodaysFoodCategories(allCategoriesArray);

      setTimeout(() => {
        setIsSpinnerLoading(false);
      }, 500);
    };
    exec();
    controller = null;
    return () => controller?.abort();
  }, [search]);

  const handleOpen = () => {
    setOpenSearch(true);
  };

  const handleClose = () => {
    setOpenSearch(false);
  };

  const showAllCategories = todaysFoodCategories.map((category, q) => {
    const foodPerEachCategory = category[1].map((food, kk) => {
      const variable = foodState.filter((f) => f.name === food);
      return variable.map((currentFood, j) => {
        return (
          <div
            className={`user-home-todayFood-inner-wrapper ${
              todaysFoodCategories[q][1].length - 1 === 0 && "w-100"
            } ${kk === 0 && "final-element"}`}
            key={j}
          >
            <div className="user-buffet-wrapper" key={j}>
              <div className="user-services-img">
                <img
                  src={`${process.env.REACT_APP_IMAGES_URL}/Images/Food/${currentFood.images[0]}`}
                  alt="buffet"
                />
              </div>
              <div className="user-services-content">
                <h2>{currentFood.name}</h2>
              </div>
            </div>
          </div>
        );
      });
    });

    if (category[1].length !== 0) {
      return (
        <div className="mb-3 max-width-100" key={q}>
          <div className="user-buffet-general-headline-wrapper">
            <h2 className="user-buffet-general-headline">{t(category[0])}</h2>
          </div>
          <div className="user-home-events-scroller-outer-wrapper">
            <div className="user-home-events-scroller">
              {foodPerEachCategory}
            </div>
          </div>
        </div>
      );
    }
  });

  const handleSearchRequest = async () => {
    setIsSpinnerLoading(true);
    setOpenSearch(false);
    setSearch(true);

    setFullDate(
      date.getDate() + " " + date.toLocaleString("default", { month: "long" })
    );

    const selectedYear = date.getFullYear();
    const selectedMonth = date.getMonth() + 1;
    const currentWeekNumber = getSelectedDayBelongsWeekInMonth(
      selectedYear,
      selectedMonth,
      date
    );

    const data = await fetchTodaysMenuFromDB(
      currentWeekNumber,
      selectedMonth,
      selectedYear,
      state.token
    );

    const currentDay = weekNamesAliases[date.getDay()];
    const allCategoriesObject = data[0][currentDay];
    const allCategoriesArray = Object.entries(allCategoriesObject).map(
      (key) => {
        return key;
      }
    );

    const foodd = await fetchFoodFromDBWithParams("status=true", state.token);

    setFood(foodd);
    setTodaysFoodCategories(allCategoriesArray);

    setTimeout(() => {
      setIsSpinnerLoading(false);
    }, 500);
  };

  return (
    <>
      {isSpinnerLoading && <LoadingSpinner />}
      {!isSpinnerLoading && (
        <div className="row">
          <BookCover
            coverHeadline="Μπουφές"
            catalog={showAllCategories}
            date={fullDate}
            withSearch
            handleSearchRequest={handleSearchRequest}
            openSearchModal={handleOpen}
            closeSearchModal={handleClose}
          />
          {openSearch && (
            <>
              {ReactDOM.createPortal(
                <Modal
                  aria-labelledby="transition-modal-title"
                  aria-describedby="transition-modal-description"
                  className={"modalMenu"}
                  open={openSearch}
                  onClose={handleClose}
                  closeAfterTransition
                  BackdropComponent={Backdrop}
                  BackdropProps={{
                    timeout: 500,
                  }}
                >
                  <Fade in={openSearch}>
                    <div className="modalFoodSearch-container">
                      <div className="row mb-3">
                        <h3>Αναζήτηση </h3>
                      </div>
                      <div className="row mb-3">
                        <div
                          className="col-sm-12 datetime-picker"
                          id="inputSearchTime"
                        >
                          <LocalizationProvider
                            locale={elLocale}
                            dateAdapter={AdapterDateFns}
                            className="datetime-picker"
                          >
                            <DatePicker
                              mask=""
                              renderInput={(props) => (
                                <TextField {...props} size="small" />
                              )}
                              value={date}
                              onChange={(t) => {
                                setDate(t);
                              }}
                            />
                          </LocalizationProvider>
                        </div>
                      </div>
                      <IconButton
                        className="search-button"
                        text="Αναζήτηση"
                        icon={<Search />}
                        color="warning"
                        variant="contained"
                        onClick={handleSearchRequest}
                      />
                    </div>
                  </Fade>
                </Modal>,
                document.getElementById("user-search-food-modal-root")
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default BuffetLandingPage;
