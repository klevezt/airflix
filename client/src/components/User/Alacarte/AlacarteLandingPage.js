import React, { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { removeUpperAccents } from "../../../Helpers/Functions/functions";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import "./AlacarteLandingPage.css";
import { fetchAlacarteTypeFromDB } from "../../../api_requests/hotel_requests";
import BookCover from "../../UI/Book/BookCover";
import { useStateValue } from "../../../StateProvider";
import { imageGetter } from "../../../Helpers/Const/constants";

const AlacarteLandingPage = () => {
  const [state] = useStateValue();

  // const { t } = useTranslation();
  // const translate = (text) => removeUpperAccents(t(text));
  const [isSpinnerLoading, setIsSpinnerLoading] = useState(false);

  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    let controller = new AbortController();

    setIsSpinnerLoading(true);
    const exec = async () => {
      const alacarte = await fetchAlacarteTypeFromDB(state.token);

      const { myArr } = await imageGetter(alacarte, "Alacarte/");

      setCatalog(myArr);

      setTimeout(() => {
        setIsSpinnerLoading(false);
      }, 500);
    };
    exec();
    controller = null;
    return () => controller?.abort();
  }, []);

  const alacarteCatalog = catalog.map((alacarte, i) => {
    return (
      <Link
        to={`/alacarte/${alacarte.name}/detail/`}
        className="drinkTypes-user-box"
        key={i}
      >
        <div className="img-wrapper">
          <img
            className="w-100"
            src={`${alacarte.image}`}
            alt="alacart-catalog-img"
          />
        </div>
        <div className="drinkTypes-user-box__bookmark-text-wrapper">
          <h2>{alacarte.name}</h2>
        </div>
      </Link>
    );
  });

  return (
    <>
      {isSpinnerLoading && <LoadingSpinner />}
      {!isSpinnerLoading && (
        <div className="row">
          <BookCover
            coverHeadline="Κατάλογος A La Carte"
            catalog={alacarteCatalog}
          />
        </div>
      )}
    </>
  );
};

export default AlacarteLandingPage;
