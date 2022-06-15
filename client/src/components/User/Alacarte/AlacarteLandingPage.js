import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// import { removeUpperAccents } from "../../../Helpers/Functions/functions";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import "./AlacarteLandingPage.css";
import { fetchAlacarteTypeFromDB } from "../../../api_requests/hotel_requests";
import BookCover from "../../UI/Book/BookCover";
import { useStateValue } from "../../../StateProvider";
import { imageGetter } from "../../../Helpers/Const/constants";
import ErrorComponent from "../../Error/Error";

const AlacarteLandingPage = () => {
  const [state] = useStateValue();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { t } = useTranslation();
  // const translate = (text) => removeUpperAccents(t(text));
  const [isSpinnerLoading, setIsSpinnerLoading] = useState(false);

  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    let controller = new AbortController();

    setIsSpinnerLoading(true);
    const exec = async () => {
      try {
        const alacarte = await fetchAlacarteTypeFromDB(state.token);

        // ---- Error Handler ---- //
        if (alacarte.error) {
          setErrorMessage(alacarte.error.msg);
          throw new Error(alacarte.error.msg);
        }

        const { myArr } = await imageGetter(alacarte, "Alacarte/");

        // ---- Error Handler ---- //
        if (myArr === undefined || myArr === null) {
          let tmp_error =
            "User/AlacarteLandingPage/useEffect => Alacarte imageGetter Problem";
          setErrorMessage(tmp_error);
          throw new Error(tmp_error);
        }

        setCatalog(myArr);

        setIsSpinnerLoading(false);
      } catch (err) {
        setError(true);
        setIsSpinnerLoading(false);
      }
    };
    exec();
    controller = null;
    return () => controller?.abort();
  }, [state.token]);

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
          <h2>{t(alacarte.name)}</h2>
        </div>
      </Link>
    );
  });

  return (
    <>
      {!error && isSpinnerLoading && <LoadingSpinner />}
      {error && <ErrorComponent errorMessage={errorMessage} />}
      {!error && !isSpinnerLoading && (
        <div className="row">
          <BookCover
            coverHeadline={t("Κατάλογος A La Carte")}
            catalog={alacarteCatalog}
          />
        </div>
      )}
    </>
  );
};

export default AlacarteLandingPage;
