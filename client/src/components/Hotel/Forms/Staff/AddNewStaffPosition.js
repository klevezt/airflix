import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import UndoIcon from "@mui/icons-material/Undo";
import IconButton from "../../../UI/Buttons/IconButton";
import { addStaffPosition } from "../../../../api_requests/hotel_requests";
import LoadingSpinner from "../../../UI/Spinners/LoadingSpinner";
import { useStateValue } from "../../../../StateProvider";
import ErrorComponent from "../../../Error/Error";
import { removeUpperAccents } from "../../../../Helpers/Functions/functions";

const AddNewStaffPositionForm = (props) => {
  const [state] = useStateValue();
  const { t } = useTranslation();
  const history = useHistory();

  const stafPositionRef = useRef();
  const [isSpinnerLoading, setIsSpinnerLoading] = useState(false);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const name = stafPositionRef.current.value;

      const res = await addStaffPosition(name, state.token);
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
          className="general-form"
          onSubmit={handleSubmitForm}
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

            <h2 className="form-headline">{t("new_employee_position")}</h2>
            <hr className="m-0" />
          </div>
          <div className="container">
            <div className="row mb-3">
              <label
                htmlFor="staff_position_name"
                className="col-sm-2 col-form-label"
              >
                {t("name")}
              </label>

              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  name="staff_position_name"
                  id="staff_position_name"
                  ref={stafPositionRef}
                  autoComplete="off"
                  required
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

export default AddNewStaffPositionForm;
