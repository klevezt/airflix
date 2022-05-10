import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { addDrinkType } from "../../../../api_requests/hotel_requests";
import UndoIcon from "@mui/icons-material/Undo";
import IconButton from "../../../UI/Buttons/IconButton";
import LoadingSpinner from "../../../UI/Spinners/LoadingSpinner";
import { useStateValue } from "../../../../StateProvider";

const AddNewDrinkType = () => {
  const [state] = useStateValue();
  const { t } = useTranslation();
  const history = useHistory();

  const nameRef = useRef("");
  const imageRef = useRef("");

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsSpinnerLoading(false);
    }, 100);
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const name = nameRef.current.value;
    const image = imageRef.current.files;

    setIsSpinnerLoading(true);
    addDrinkType(name, image,state.token)
      .then(() => {
        history.replace("/bar/edit-drink-type");
      })
      .catch(() => {
        history.replace("/bar/edit-drink-type");
      });
  };

  return (
    <>
      {isSpinnerLoading && <LoadingSpinner />}
      {!isSpinnerLoading && (
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
              text="Επιστροφη"
              icon={<UndoIcon />}
              color="warning"
              variant="contained"
            />

            <h2 className="form-headline">{t("new_drink_type")}</h2>
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
              <label className="col-sm-2 col-form-label">Εικόνα</label>
              <div className="col-sm-10">
                <input
                  className="form-control form-control-sm"
                  type="file"
                  multiple
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
