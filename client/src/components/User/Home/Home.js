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
import { weekNamesAliases } from "../../../Helpers/Const/constants";
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

const Home = () => {
  const [state] = useStateValue();
  const { t } = useTranslation();

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [todayBuffet, setTodayBuffet] = useState([]);
  const prevScrollY = useRef(0);
  const [scrolled, setScrolled] = useState(0);
  const [open, setOpen] = useState(false);

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
      const arr = [];
      await fetchEventsFromDB(state.token).then((data) => {
        data.forEach((event) => {
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
      });
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
          if (key[1].length !== 0) setIsThereFoodToday(true);
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

      const buffet = await fetchFoodTypesFromDB(state.token);
      setTodayBuffet(buffet);

      const featured_info = await fetchInfoTypesFromDB(state.token);
      setInfo(featured_info);

      setTimeout(() => {
        setIsSpinnerLoading(false);
      }, 1000);
    };
    exec();
    controller = null;
    return () => controller?.abort();
  }, []);

  const onScroll = (e) => {
    const currentScrollX = e.target.scrollLeft;
    prevScrollY.current = currentScrollX;
    setScrolled(currentScrollX);
  };

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
              src={`${process.env.REACT_APP_IMAGES_URL}/Images/Food/${previewSelectedFood[0].images[0]}`}
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
                  <img
                    src={`${process.env.REACT_APP_IMAGES_URL}/Images/Food/${currentFood.img[0]}`}
                    alt="buffet"
                  />
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
        style={{ transform: `translateX(${scrolled})` }}
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
      {isSpinnerLoading && <LoadingSpinner />}
      {!isSpinnerLoading && (
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
                <div
                  className="user-home-events-scroller-outer-wrapper"
                  onScroll={onScroll}
                >
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
