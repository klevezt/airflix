import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import {
  fetchEventsFromDB,
  fetchFoodTypesFromDB,
  fetchInfoTypesFromDB,
} from "../../../api_requests/hotel_requests";
import { Close, ReadMore } from "@mui/icons-material";
import IconButton from "../../UI/Buttons/IconButton";
import { getCurrentWeekInMonth } from "../../../Helpers/Functions/functions";
import { fetchTodaysMenuFromDB } from "../../../api_requests/user_requests";
import {
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

const Home = () => {
  const [state] = useStateValue();
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
        const dataaa = await fetchEventsFromDB(state.token);
        if (dataaa.error) {
          setErrorMessage(dataaa.error.msg);
          throw new Error(dataaa.error.msg);
        }
        const { myArr: eventArr } = await imageGetter(dataaa, "Events/");

        const arr = [];

        if (eventArr === undefined || eventArr === null) {
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
              img: event.images[0],
              alias: event.alias,
              title: event.name,
              time: event.time,
              description: event.description,
            });
        });
        setEvents(arr.sort((a, b) => new Date(a.time) - new Date(b.time)));

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
          state.token
        );

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
        const arr2 = [];

        const foodd = await fetchFoodFromDBWithParams(
          "status=true",
          state.token
        );

        if (foodd.error) {
          setErrorMessage(foodd.error.msg);
          throw new Error(foodd.error.msg);
        }

        const { myArr } = await imageGetter(foodd, "Food/");

        if (myArr === undefined || myArr === null) {
          let tmp_error = "User/Home/useEffect => Food Array Problem";
          setErrorMessage(tmp_error);
          throw new Error(tmp_error);
        }

        myArr.forEach((f) => {
          arr2.push({ name: f, img: f.image });
        });
        setFoodWithImages(arr2);
        setTodaysFoodCategories(allCategoriesArray);

        const buffet = await fetchFoodTypesFromDB(state.token);

        if (buffet.error) {
          setErrorMessage(dataaa.error.msg);
          throw new Error(dataaa.error.msg);
        }
        setTodayBuffet(buffet);

        const featured_info = await fetchInfoTypesFromDB(state.token);

        if (featured_info.error) {
          setErrorMessage(featured_info.error.msg);
          throw new Error(featured_info.error.msg);
        }
        setInfo(featured_info);

        setIsSpinnerLoading(false);
      } catch (err) {
        setError(true);
      }
    };
    exec();

    controller = null;
    return () => controller?.abort();
  }, []);

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
              <h2 className="text-center">{previewSelectedFood[0].name}</h2>
              {previewSelectedFood[0].ingredients && (
                <>
                  <hr />
                  <ul className="kp-custom kp-ingredients">
                    {previewSelectedFood[0].ingredients.map((ingr, i) => {
                      return <li key={i}> {ingr}</li>;
                    })}
                  </ul>
                </>
              )}
              {previewSelectedFood[0].special_features && (
                <>
                  <hr />
                  <ul className="kp-custom kp-special-ingredients">
                    {previewSelectedFood[0].special_features.map((feat, j) => {
                      return <li key={j}> {feat}</li>;
                    })}
                  </ul>
                </>
              )}
              <p>{previewSelectedFood[0].description}</p>
              <IconButton
                text={t("close")}
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
              <div className="user-services-wrapper">
                <div className="user-services-img">
                  <img src={`${currentFood.img}`} alt="buffet" />
                </div>
                <div className="user-services-content">
                  <h2>{currentFood.name.name}</h2>
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
          to={`/events/view/${event.alias}`}
          className="user-services-wrapper"
          key={i}
        >
          <div className="user-services-img">
            <img
              src={`${process.env.REACT_APP_IMAGES_URL}/Images/Events/${event.img}`}
              alt="event"
            />
          </div>
          <div className="user-services-content">
            <h2>{event.title}</h2>
          </div>
        </Link>
      </div>
    );
  });

  const todaysMenu = todayBuffet.map((_, i) => {
    if (i !== 0) return;
    return (
      <div className={`mt-3 ${!isThereFoodToday ? "mb-5" : ""}`} key={i}>
        <div className="user-home-general-headline-wrapper">
          <h2 className="user-home-general-headline mb-3">Σημερινός Μπουφές</h2>
        </div>
        {isThereFoodToday && (
          <div className="user-home-events-scroller-outer-wrapper">
            <div className="user-home-events-scroller">{showAllCategories}</div>
          </div>
        )}
        {!isThereFoodToday && (
          <p className="kp-warning">Δεν υπάρχουν καταχωρημένα φαγητά</p>
        )}
      </div>
    );
  });

  const featuredInfo = info.map((inf, i) => {
    if (!inf.featured) return;
    return (
      <div className="mb-3 kp-each-info" key={i}>
        <h6>{t(inf.name)}</h6>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableBody>
              {inf.content.map((row, j) => (
                <TableRow className="kp-table-row" key={j}>
                  <TableCell style={{ width: 160 }}>
                    {row.newInfoName}
                  </TableCell>
                  <TableCell style={{ width: 160 }}>
                    {row.newInfoDescription}
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
          {todaysMenu}
          {open && previewSelectedFood.length >= 1 && previewFood}
          <div className="mt-3 mb-5">
            <div className="user-home-general-headline-wrapper">
              <h2 className="user-home-general-headline mb-4">
                Προσεχείς Εκδηλώσεις
              </h2>
            </div>
            {nextEvents.length > 1 ? (
              <>
                <div className="user-home-events-scroller-outer-wrapper">
                  <div className="user-home-events-scroller">{nextEvents}</div>
                </div>
                <Link to="/events/all" className="user-more-button">
                  <IconButton
                    text={t("all_events")}
                    icon={<ReadMore className="mr-2" />}
                    color="warning"
                    variant="contained"
                  />
                </Link>
              </>
            ) : (
              <p className="kp-warning">Δεν υπάρχουν εκδηλώσεις</p>
            )}
          </div>
          <div className="mt-3 mb-5 user-home-info-section">
            <div className="user-home-general-headline-wrapper">
              <h2 className="user-home-general-headline ">{t("info")}</h2>
            </div>
            <div className="my-3 user-home-accordion-wrapper">
              {featuredInfo}
            </div>
            <Link to="/info" className="user-more-button">
              <IconButton
                text={t("read_more")}
                icon={<ReadMore className="mr-2" />}
                color="warning"
                variant="contained"
              />
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
