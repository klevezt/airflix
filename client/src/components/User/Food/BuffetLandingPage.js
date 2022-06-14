import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import ReactDOM from "react-dom";
import IconButton from "../../UI/Buttons/IconButton";
import { Search, Close } from "@mui/icons-material";
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
  // fetchFoodTypesFromDB,
} from "../../../api_requests/hotel_requests";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import elLocale from "date-fns/locale/el";
import BookCover from "../../UI/Book/BookCover";
import { useStateValue } from "../../../StateProvider";

import "./BuffetLandingPage.css";
import { imageGetter } from "../../../Helpers/Const/constants";
import ErrorComponent from "../../Error/Error";

const BuffetLandingPage = () => {
  const { t } = useTranslation();
  const [state] = useStateValue();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // const translate = (text) => removeUpperAccents(t(text));
  const [isSpinnerLoading, setIsSpinnerLoading] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [search, setSearch] = useState(false);
  const [foodState, setFood] = useState([]);
  const [todaysFoodCategories, setTodaysFoodCategories] = useState([]);
  const [date, setDate] = useState(new Date());
  const [openPreview, setOpenPreview] = useState(false);
  const [previewSelectedFood, setPreviewSelectedFood] = useState([]);

  const [fullDate, setFullDate] = useState(
    date.getDate() + " " + date.toLocaleString("default", { month: "long" })
  );

  useEffect(() => {
    setIsSpinnerLoading(true);
    let controller = new AbortController();
    const exec = async () => {
      try {
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
        if (data.length !== 0) {
          // ---- Error Handler ---- //
          if (data.error) {
            setErrorMessage(data.error.msg);
            throw new Error(data.error.msg);
          }

          const currentDay = weekNamesAliases[date.getDay()];
          const allCategoriesObject = data[0][currentDay];
          const allCategoriesArray = Object.entries(allCategoriesObject).map(
            (key) => {
              return key;
            }
          );

          setTodaysFoodCategories(allCategoriesArray);
        }

        const foodd = await fetchFoodFromDBWithParams(
          "status=true",
          state.token
        );

        // ---- Error Handler ---- //
        if (foodd.error) {
          setErrorMessage(foodd.error.msg);
          throw new Error(foodd.error.msg);
        }

        const { myArr } = await imageGetter(foodd, "Food/");

        // ---- Error Handler ---- //
        if (myArr === undefined || myArr === null) {
          let tmp_error =
            "User/BuffetLandingPage/useEffect => Food imageGetter Problem";
          setErrorMessage(tmp_error);
          throw new Error(tmp_error);
        }
        setFood(myArr);
        setIsSpinnerLoading(false);
      } catch (err) {
        setError(true);
        setIsSpinnerLoading(false);
      }
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

  const handleOpenPreview = () => {
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
  };
  const handlePreview = (currentFood) => {
    handleOpenPreview();
    setPreviewSelectedFood([currentFood]);
  };

  const previewFood =
    previewSelectedFood[0] !== undefined &&
    ReactDOM.createPortal(
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={"modalMenu"}
        open={openPreview}
        onClose={handleClosePreview}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openPreview}>
          <div className="modal-view-food-container">
            <div className="circular-close-button" onClick={handleClosePreview}>
              <Close />
            </div>
            <img
              src={`${previewSelectedFood[0].image}`}
              alt="food-view-img"
              className="w-100"
            />
            <div className="p-4">
              <h2 className="text-center">{t(previewSelectedFood[0].name)}</h2>
              {previewSelectedFood[0].ingredients && (
                <>
                  <hr />
                  <ul className="kp-custom kp-ingredients">
                    {previewSelectedFood[0].ingredients.map((ingr, i) => {
                      return <li key={i}> {t(ingr)}</li>;
                    })}
                  </ul>
                </>
              )}
              {previewSelectedFood[0].special_features && (
                <>
                  <hr />
                  <ul className="kp-custom kp-special-ingredients">
                    {previewSelectedFood[0].special_features.map((feat, j) => {
                      return <li key={j}> {t(feat)}</li>;
                    })}
                  </ul>
                </>
              )}
              <p>{t(previewSelectedFood[0].description)}</p>
              <IconButton
                text={t("close")}
                icon={<Close className="mr-2" />}
                variant="contained"
                onClick={handleClosePreview}
                className="mt-3"
              />
            </div>
          </div>
        </Fade>
      </Modal>,
      document.getElementById("user-preview-ingredients-root")
    );

  const showAllCategories = todaysFoodCategories.map((category, q) => {
    const foodPerEachCategory = category[1].map((food, kk) => {
      const variable = foodState.filter((f) => f.name === food);
      if (variable.length === 0) return null;
      return variable.map((currentFood, j) => {
        return (
          <div
            className={`user-home-todayFood-inner-wrapper ${
              todaysFoodCategories[q][1].length - 1 === 0 && "w-100"
            } ${kk === 0 && "final-element"}`}
            onClick={() => handlePreview(currentFood)}
            key={j}
          >
            <div className="user-buffet-wrapper" key={j}>
              <div className="user-services-img">
                <img src={`${currentFood.image}`} alt="buffet" />
              </div>
              <div className="user-services-content">
                <h2>{t(currentFood.name)}</h2>
              </div>
            </div>
          </div>
        );
      });
    });

    if (category[1].length !== 0 && foodPerEachCategory[0] !== null) {
      return (
        <div className="mb-3 max-width-100 w-100" key={q}>
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

    try {
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
      if (data.length !== 0) {
        // ---- Error Handler ---- //
        if (data.error) {
          setErrorMessage(data.error.msg);
          throw new Error(data.error.msg);
        }

        const currentDay = weekNamesAliases[date.getDay()];
        const allCategoriesObject = data[0][currentDay];
        const allCategoriesArray = Object.entries(allCategoriesObject).map(
          (key) => {
            return key;
          }
        );
        setTodaysFoodCategories(allCategoriesArray);
      }
      const foodd = await fetchFoodFromDBWithParams("status=true", state.token);

      // ---- Error Handler ---- //
      if (foodd.error) {
        setErrorMessage(foodd.error.msg);
        throw new Error(foodd.error.msg);
      }

      const { myArr } = await imageGetter(foodd, "Food/");

      // ---- Error Handler ---- //
      if (myArr === undefined || myArr === null) {
        let tmp_error =
          "User/BuffetLandingPage/useEffect => Food imageGetter Problem";
        setErrorMessage(tmp_error);
        throw new Error(tmp_error);
      }

      setFood(myArr);
      setIsSpinnerLoading(false);
    } catch (err) {
      setError(true);
      setIsSpinnerLoading(false);
    }
  };

  return (
    <>
      {!error && isSpinnerLoading && <LoadingSpinner />}
      {error && <ErrorComponent errorMessage={errorMessage} />}
      {!error && !isSpinnerLoading && (
        <div className="row">
          <BookCover
            coverHeadline={t("Μπουφές")}
            catalog={showAllCategories}
            date={fullDate}
            withSearch
            handleSearchRequest={handleSearchRequest}
            openSearchModal={handleOpen}
            closeSearchModal={handleClose}
          />
          {openPreview && previewSelectedFood.length >= 1 && previewFood}

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
                        <h3>{t("search")} </h3>
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
                        text={t("search")}
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
