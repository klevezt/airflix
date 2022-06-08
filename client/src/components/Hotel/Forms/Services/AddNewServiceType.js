import React, { useEffect, useRef, useState, Fragment } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import UndoIcon from "@mui/icons-material/Undo";
import IconButton from "../../../UI/Buttons/IconButton";
import { addServiceType } from "../../../../api_requests/hotel_requests";
import LoadingSpinner from "../../../UI/Spinners/LoadingSpinner";
import { useStateValue } from "../../../../StateProvider";
import ErrorComponent from "../../../Error/Error";

const AddNewServiceType = (props) => {
  const [state] = useStateValue();
  const { t } = useTranslation();
  const history = useHistory();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [newService, setNewService] = useState([]);
  const [isSpinnerLoading, setIsSpinnerLoading] = useState(false);

  const serviceTypeNameRef = useRef();
  const serviceTypeImageRef = useRef("");

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const name = serviceTypeNameRef.current.value;
      const alias = name.replace(/\s+/g, "-").toLowerCase();
      const images = serviceTypeImageRef.current.files;

      const res = await addServiceType(name, images, alias, state.token);
      // ---- Error Handler ---- //
      if (res.error) {
        setErrorMessage(res.error.msg);
        throw new Error(res.error.msg);
      }
      history.replace("/services");
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
          method="post"
          encType="multipart/form-data"
          className="general-form"
          onSubmit={handleSubmitForm}
        >
          <div className="form-header">
            <IconButton
              className="form-back-button"
              onClick={() => {
                history.goBack();
              }}
              text={t("Επιστροφη")}
              icon={<UndoIcon />}
              color="warning"
              variant="contained"
            />

            <h2 className="form-headline">{t("Νέα Υπηρεσία")}</h2>
            <hr className="m-0" />
          </div>
          <div className="container">
            <div className="row mb-3">
              <label htmlFor="info_name" className="col-sm-2 col-form-label">
                {t("name")}
              </label>

              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  name="info_name"
                  id="info_name"
                  ref={serviceTypeNameRef}
                  autoComplete="off"
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="info_image" className="col-sm-2 col-form-label">
                Εικόνα
              </label>
              <div className="col-sm-10">
                <input
                  className="form-control form-control-sm"
                  type="file"
                  name="info_image"
                  id="info_image"
                  ref={serviceTypeImageRef}
                  autoComplete="off"
                  multiple
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

export default AddNewServiceType;
