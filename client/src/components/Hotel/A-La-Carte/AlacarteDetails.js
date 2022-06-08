import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import { fetchSingleAlacarteFromDB } from "../../../api_requests/hotel_requests";
import { Chip } from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import IconButton from "../../UI/Buttons/IconButton";
import { useTranslation } from "react-i18next";
import { useStateValue } from "../../../StateProvider";
import ErrorComponent from "../../Error/Error";

import "./AlacarteDetails.css";

function AlacarteDetails() {
  const [state] = useStateValue();
  const params = useParams();
  const history = useHistory();
  const { t } = useTranslation();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [alacarte, setAlacarte] = useState();
  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);

  useEffect(() => {
    let controller = new AbortController();

    setIsSpinnerLoading(true);
    const exec = async () => {
      try {
        const data = await fetchSingleAlacarteFromDB(
          { alias: params.alacarteAlias },
          state.token
        );
        
        // ---- Error Handler ---- //
        if (data.error) {
          setErrorMessage(data.error.msg);
          throw new Error(data.error.msg);
        }

        setAlacarte(data[0]);
        setIsSpinnerLoading(false);
      } catch (err) {
        setError(true);
      }
    };
    exec();
    controller = null;
    return () => controller?.abort();
  }, [params.alacarteAlias]);

  const imagePath = process.env.REACT_APP_IMAGES_URL + "/Images";

  return (
    <>
      {!error && isSpinnerLoading && <LoadingSpinner />}
      {error && <ErrorComponent errorMessage={errorMessage} />}
      {!error && !isSpinnerLoading && (
        <div className="d-flex align-items-center flex-wrap flex-direction-column">
          <div className="row w-100 mb-3">
            <IconButton
              className="w-auto"
              onClick={() => {
                history.goBack();
              }}
              text={`${t("back")}`}
              icon={<UndoIcon />}
              color="warning"
              variant="contained"
            />
          </div>
          <div className="row w-100 mb-3">
            <div className="col-md-4 col-sm-12 ">
              <h1>{alacarte.name}</h1>
              <hr />
              <h6>{alacarte.description}</h6>
              {alacarte.ingredients.length !== 0 && (
                <>
                  <hr />
                  <h4>{t("ingredients")}:</h4>
                  {alacarte.ingredients.map((ingredient, i) => {
                    return (
                      <Chip
                        label={ingredient}
                        color="primary"
                        className="my-2 mx-2 chip"
                        key={i}
                      />
                    );
                  })}
                </>
              )}
              <hr />
              <h4>
                {t("price")}: {alacarte.price}€
              </h4>
            </div>
            <div className="col-6 image-container">
              <img
                src={`${imagePath}/Alacarte/${alacarte.images[0]}`}
                alt={alacarte.name}
              />
            </div>
          </div>
          {/* <Reviews data={alacarte} /> */}
        </div>
      )}
    </>
  );
}

export default AlacarteDetails;
