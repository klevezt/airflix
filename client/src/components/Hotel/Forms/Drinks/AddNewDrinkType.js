import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { addDrinkType } from "../../../../api_requests/hotel_requests";
import UndoIcon from "@mui/icons-material/Undo";
import IconButton from "../../../UI/Buttons/IconButton";
import LoadingSpinner from "../../../UI/Spinners/LoadingSpinner";
import { useStateValue } from "../../../../StateProvider";
import ErrorComponent from "../../../Error/Error";
import { removeUpperAccents } from "../../../../Helpers/Functions/functions";

const AddNewDrinkType = () => {
  const [state] = useStateValue();
  const { t } = useTranslation();
  const history = useHistory();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const nameRef = useRef("");
  const imageRef = useRef("");

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSpinnerLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSpinnerLoading(true);

    try {
      const name = nameRef.current.value;
      const image = imageRef.current.files;

      const result = await addDrinkType(name, image, state.token);
      // ---- Error Handler ---- //
      if (result.error) {
        setErrorMessage(result.error.msg);
        throw new Error(result.error.msg);
      }

      setIsSpinnerLoading(false);
      history.replace("/bar/edit-drink-type");
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
        <form
          method="POST"
          encType="multipart/form-data"
          className="general-form"
          onSubmit={handleFormSubmit}
        >
          <div className="form-header">
            <IconButton
              className="form-back-button"
              onClick={() => {
                history.goBack();
              }}
              text={removeUpperAccents(t("back"))}
              icon={<UndoIcon />}
              color="warning"
              variant="contained"
            />

            <h2 className="form-headline">{t("new_drink_type")}</h2>
            <hr className="m-0" />
          </div>
          <div className="container">
            <div className="row mb-3">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                {t("type")}
              </label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  id="inputEmail3"
                  autoComplete="off"
                  ref={nameRef}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">{t("image")}</label>
              <div className="col-sm-10">
                <input
                  className="form-control form-control-sm"
                  type="file"
                  autoComplete="off"
                  ref={imageRef}
                />
              </div>
            </div>
            <div className="row ">
              <div className="offset-sm-2 offset-0 col-sm-4 col-12">
                <button type="submit" className="btn btn-primary-theme ">
                  {t("add")}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default AddNewDrinkType;
