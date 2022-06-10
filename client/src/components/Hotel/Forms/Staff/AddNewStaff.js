import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import UndoIcon from "@mui/icons-material/Undo";
import IconButton from "../../../UI/Buttons/IconButton";
import { addStaff } from "../../../../api_requests/hotel_requests";
import { fetchStaffPositionFromDB } from "../../../../api_requests/hotel_requests";
import LoadingSpinner from "../../../UI/Spinners/LoadingSpinner";
import { useStateValue } from "../../../../StateProvider";
import ErrorComponent from "../../../Error/Error";

const AddNewStaffForm = (props) => {
  const [state] = useStateValue();
  const { t } = useTranslation();
  const history = useHistory();

  const [drinkType, setDrinkTypes] = useState();
  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);

  const staffNameRef = useRef();
  const staffPositionRef = useRef();
  const staffImageRef = useRef("");
  const staffDescriptionRef = useRef();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let controller = new AbortController();

    const exec = async () => {
      setIsSpinnerLoading(true);

      try {
        const data = await fetchStaffPositionFromDB(state.token);
        // ---- Error Handler ---- //
        if (data.error) {
          setErrorMessage(data.error.msg);
          throw new Error(data.error.msg);
        }

        setDrinkTypes(data);
        setIsSpinnerLoading(false);
      } catch (err) {
        setError(true);
        setIsSpinnerLoading(false);
      }
    };
    exec();
    controller = null;
    return () => controller?.abort();
  }, []);

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setIsSpinnerLoading(true);

    try {
      const name = staffNameRef.current.value;
      const alias = name.replace(/\s+/g, "-").toLowerCase();
      const position = staffPositionRef.current.value;
      const images = staffImageRef.current.files;
      const description = staffDescriptionRef.current.value;

      const res = await addStaff(
        name,
        alias,
        position,
        images,
        description,
        state.token
      );
      // ---- Error Handler ---- //
      if (res.error) {
        setErrorMessage(res.error.msg);
        throw new Error(res.error.msg);
      }

      history.replace("/staff");
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
              text={t("back")}
              icon={<UndoIcon />}
              color="warning"
              variant="contained"
            />

            <h2 className="form-headline">{t("new_staff")}</h2>
            <hr className="m-0" />
          </div>
          <div className="container">
            <div className="row mb-3">
              <label htmlFor="staff_name" className="col-sm-2 col-form-label">
                {t("name")}
              </label>

              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  name="staff_name"
                  id="staff_name"
                  ref={staffNameRef}
                  autoComplete="off"
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">{t("image")}</label>
              <div className="col-sm-10">
                <input
                  className="form-control form-control-sm"
                  type="file"
                  ref={staffImageRef}
                  autoComplete="off"
                  multiple
                />
              </div>
            </div>
            <div className="row mb-3">
              <label
                htmlFor="staff_position"
                className="col-sm-2 col-form-label"
              >
                {t("staff_position")}
              </label>
              <div className="col-sm-10">
                <select
                  className="form-select form-select-lg mt-2 mb-3"
                  name="staff_position"
                  id="staff_position"
                  ref={staffPositionRef}
                  required
                >
                  <option value="">-</option>
                  {drinkType.map((foodType, i) => {
                    return (
                      foodType.status && (
                        <option
                          value={foodType.name}
                          key={foodType._id}
                          defaultValue={foodType.name}
                        >
                          {foodType.name}
                        </option>
                      )
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="staff_desc" className="col-sm-2 col-form-label">
                {t("description")}
              </label>
              <div className="col-sm-10">
                <textarea
                  className="form-control mt-2 mb-2"
                  name="staff_desc"
                  id="staff_desc"
                  rows="5"
                  ref={staffDescriptionRef}
                ></textarea>
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

export default AddNewStaffForm;
