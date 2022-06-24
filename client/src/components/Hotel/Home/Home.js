import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import "./Home.css";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import {
  fetchEventsFromDB,
  fetchFoodTypesFromDB,
} from "../../../api_requests/hotel_requests";
import { Close, ReadMore } from "@mui/icons-material";
import IconButton from "../../UI/Buttons/IconButton";
import {
  getCurrentWeekInMonth,
  removeUpperAccents,
  truncateString,
} from "../../../Helpers/Functions/functions";
import {
  fetchInfoTypesFromDB,
  fetchTodaysMenuFromDB,
} from "../../../api_requests/user_requests";
import {
  checkToken,
  imageGetter,
  weekNamesAliases,
} from "../../../Helpers/Const/constants";
import { fetchFoodFromDBWithParams } from "../../../api_requests/hotel_requests";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import { Fade, Backdrop, Modal } from "@mui/material";

import { useStateValue } from "../../../StateProvider";
import { useTranslation } from "react-i18next";
import reactDom from "react-dom";
import ErrorComponent from "../../Error/Error";
import BackgroundImage from "../../UI/Image/BackgroundImage";
import { actionTypes } from "../../../reducer";

const Home = () => {
  const [state, dispatch] = useStateValue();
  const { t } = useTranslation();

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [todayBuffet, setTodayBuffet] = useState([]);
  const [open, setOpen] = useState(false);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [todaysFoodCategories, setTodaysFoodCategories] = useState([]);
  const [foodWithImages, setFoodWithImages] = useState([]);
  const [isThereFoodToday, setIsThereFoodToday] = useState(false);

  const [previewSelectedFood, setPreviewSelectedFood] = useState([]);

  const [info, setInfo] = useState([]);

  useEffect(() => {
    const today = new Date();

    let controller = new AbortController();
    setIsSpinnerLoading(true);

    const exec = async () => {
      try {
        const { isExpired, dataaa } = await checkToken(
          state.token,
          state.refreshToken
        );
        const token = isExpired ? dataaa.accessToken : state.token;

        const dataa = await fetchEventsFromDB(token);
        // ---- Error Handler ---- //
        if (dataa.error) {
          setErrorMessage(dataa.error.msg);
          throw new Error(dataa.error.msg);
        }

        const { myArr: eventArr } = await imageGetter(dataa, "Events/", true);

        const arr = [];

        if (eventArr.length !== 0) {
          if (eventArr === undefined || eventArr === null) {
            // ---- Error Handler ---- //
            let tmp_error = "User/Home/useEffect => Event Array Problem";
            setErrorMessage(tmp_error);
            throw new Error(tmp_error);
          }
          eventArr.forEach((event) => {
            if (
              event.status &&
              new Date().getTime() < new Date(event.time).getTime()
            )
              arr.push({
                img: event.image,
                alias: event.alias,
                title: event.name,
                time: event.time,
                description: event.description,
              });
          });
          setEvents(arr.sort((a, b) => new Date(a.time) - new Date(b.time)));
        }

        const todaysYear = today.getFullYear();
        const todaysMonth = today.getMonth() + 1;
        const currentWeekNumber = getCurrentWeekInMonth(
          todaysYear,
          todaysMonth
        );
        const data = await fetchTodaysMenuFromDB(
          currentWeekNumber,
          todaysMonth,
          todaysYear,
          token
        );
        if (data.length !== 0) {
          // ---- Error Handler ---- //
          if (data.error) {
            setErrorMessage(data.error.msg);
            throw new Error(data.error.msg);
          }

          const currentDay = weekNamesAliases[today.getDay()];

          const allCategoriesObject = data[0][currentDay];
          const allCategoriesArray = Object.entries(allCategoriesObject).map(
            (key) => {
              if (key[1].length !== 0) setIsThereFoodToday(true);
              return key;
            }
          );
          setTodaysFoodCategories(allCategoriesArray);
        }
        const arr2 = [];

        const foodd = await fetchFoodFromDBWithParams({ status: true }, token);

        // ---- Error Handler ---- //
        if (foodd.error) {
          setErrorMessage(foodd.error.msg);
          throw new Error(foodd.error.msg);
        }

        const { myArr } = await imageGetter(foodd, "Food/", true);

        if (myArr.length !== 0) {
          // ---- Error Handler ---- //
          if (myArr === undefined || myArr === null) {
            let tmp_error = "User/Home/useEffect => Food Array Problem";
            setErrorMessage(tmp_error);
            throw new Error(tmp_error);
          }

          myArr.forEach((f) => {
            arr2.push({ name: f, img: f.image });
          });
          setFoodWithImages(arr2);
        }

        const buffet = await fetchFoodTypesFromDB(token);

        // ---- Error Handler ---- //
        if (buffet.error) {
          setErrorMessage(dataaa.error.msg);
          throw new Error(dataaa.error.msg);
        }
        setTodayBuffet(buffet);

        const featured_info = await fetchInfoTypesFromDB(
          {
            status: true,
            featured: true,
          },
          token
        );
        // ---- Error Handler ---- //
        if (featured_info.error) {
          setErrorMessage(featured_info.error.msg);
          throw new Error(featured_info.error.msg);
        }

        const contentArray = [];
        featured_info.forEach((element) => {
          const arr = [];
          const tempContent = element.content;

          tempContent.forEach((c) => {
            arr.push(JSON.parse(c));
          });
          contentArray.push(arr);
        });

        const tmpInfo = [];
        featured_info.forEach((inf, i) => {
          tmpInfo.push({ ...inf, content: contentArray[i] });
        });

        dispatch({
          type: actionTypes.SET_NEW_JWT_TOKEN,
          token: token,
        });

        setInfo(tmpInfo);
        setIsSpinnerLoading(false);
      } catch (err) {
        setError(true);
        setIsSpinnerLoading(false);
      }
    };
    exec();

    controller = null;
    return () => controller?.abort();
  }, [dispatch,state.token, state.refreshToken]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handlePreview = (currentFood) => {
    handleOpen();
    setPreviewSelectedFood([currentFood.name]);
  };

  const previewFood =
    previewSelectedFood[0] !== undefined &&
    reactDom.createPortal(
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={"modalMenu"}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className="modal-view-food-container">
            <div className="circular-close-button" onClick={handleClose}>
              <Close />
            </div>
            <img
              src={`${previewSelectedFood[0].image}`}
              alt="food-view-img"
              className="w-100"
            />
            <div className="p-4">
              <h2>{previewSelectedFood[0].name}</h2>
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
                text={removeUpperAccents(t("close"))}
                icon={<Close className="mr-2" />}
                variant="contained"
                onClick={handleClose}
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
      return foodWithImages
        .filter((f) => f.name.name === food)
        .map((currentFood, j) => {
          return (
            <div
              className={`user-home-todayFood-inner-wrapper ${
                q === 0 && kk === 0 ? "final-element" : ""
              }`}
              key={j}
              onClick={() => handlePreview(currentFood)}
            >
              <div className="d-flex flex-direction-column">
                <div className="user-services-img">
                  <img src={`${currentFood.img}`} alt="buffet" />
                </div>
                <div className="user-buffet-content">
                  <h2>{t(currentFood.name.name)}</h2>
                </div>
              </div>
            </div>
          );
        });
    });

    return (
      <React.Fragment key={q}>
        {category[1].length !== 0 && foodPerEachCategory}
      </React.Fragment>
    );
  });

  const nextEvents = events.map((event, i) => {
    if (i > 1) return null;
    return (
      <div
        className={`user-home-events-inner-wrapper ${
          events.length - 1 === i ? "final-element" : ""
        }`}
        key={i}
      >
        <div className="user-home-events-date">
          <p>
            {new Date(event.time).getDate()}/
            {new Date(event.time).getMonth() + 1}
          </p>
        </div>
        <Link
          to={`/events/edit/${event.alias}`}
          className="user-services-wrapper"
          key={i}
        >
          <div className="user-services-img">
            <BackgroundImage image={event.img} />
          </div>
          <div className="user-services-content justify-content-start align-items-start">
            <h2>{t(event.title)}</h2>
            <p className="d-none d-sm-block">
              {new Date(event.time).toLocaleString([], {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <div className="d-none d-sm-block text-start">
              <p>{truncateString(t(event.description), 150)}</p>
            </div>
          </div>
        </Link>
      </div>
    );
  });

  const todaysMenu = todayBuffet.map((_, i) => {
    if (i !== 0) return "";
    return (
      <div className={`mt-3 ${!isThereFoodToday ? "mb-5" : ""}`} key={i}>
        <div className="user-home-general-headline-wrapper">
          <h2 className="user-home-general-headline mb-3">{t("today_menu")}</h2>
        </div>
        {isThereFoodToday && (
          <div className="user-home-events-scroller-outer-wrapper">
            <div className="user-home-events-scroller user-home-todayFood-scroller">
              {showAllCategories}
            </div>
          </div>
        )}
        {!isThereFoodToday && (
          <p className="kp-warning">{t("no_registered_food")}</p>
        )}
      </div>
    );
  });

  const featuredInfo = info.map((inf, i) => {
    if (!inf.featured) return "";
    return (
      <div className="mb-3 kp-each-info" key={i}>
        <h6>{t(inf.name)}</h6>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableBody>
              {inf.content.map((row, j) => (
                <TableRow className="kp-table-row" key={j}>
                  <TableCell style={{ width: 160 }}>
                    {t(row.newInfoName)}
                  </TableCell>
                  <TableCell style={{ width: 160 }}>
                    {t(row.newInfoDescription)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  });

  return (
    <>
      {!error && isSpinnerLoading && <LoadingSpinner />}
      {error && <ErrorComponent errorMessage={errorMessage} />}
      {!error && !isSpinnerLoading && (
        <div className="row">
          {todayBuffet.length > 0 ? (
            todaysMenu
          ) : (
            <>
              <div className="mt-3 mb-5 user-home-general-headline-wrapper">
                <h2 className="user-home-general-headline">
                  {t("today_menu")}
                </h2>
                <p className="kp-warning">{t("no_registered_food")}</p>
              </div>
            </>
          )}
          {open && previewSelectedFood.length > 0 && previewFood}
          <div className="mt-3 mb-5">
            <div className="user-home-general-headline-wrapper">
              <h2 className="user-home-general-headline">
                {t("upcoming_events")}
              </h2>
            </div>
            {nextEvents.length > 0 ? (
              <>
                <div className="user-home-events-scroller-outer-wrapper">
                  <div className="user-home-events-scroller">{nextEvents}</div>
                </div>
                <Link to="/events/all" className="user-more-button">
                  <IconButton
                    text={removeUpperAccents(t("all_events"))}
                    icon={<ReadMore className="mr-2" />}
                    color="warning"
                    variant="contained"
                  />
                </Link>
              </>
            ) : (
              <p className="kp-warning">{t("no_events")}</p>
            )}
          </div>
          <div className="mt-3 mb-5 user-home-info-section">
            <div className="user-home-general-headline-wrapper">
              <h2 className="user-home-general-headline">{t("info")}</h2>
            </div>
            {featuredInfo.length > 0 ? (
              <>
                <div className="my-3 user-home-accordion-wrapper">
                  {featuredInfo}
                </div>
                <Link to="/info" className="user-more-button">
                  <IconButton
                    text={removeUpperAccents(t("read_more"))}
                    icon={<ReadMore className="mr-2" />}
                    color="warning"
                    variant="contained"
                  />
                </Link>
              </>
            ) : (
              <p className="kp-warning">{t("no_information")}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Home;