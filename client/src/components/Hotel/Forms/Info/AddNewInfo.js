import React, { useEffect, useRef, useState, Fragment } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import UndoIcon from "@mui/icons-material/Undo";
import IconButton from "../../../UI/Buttons/IconButton";
import {
  addInfo,
  // fetchInfoTypesFromDB,
} from "../../../../api_requests/hotel_requests";
import LoadingSpinner from "../../../UI/Spinners/LoadingSpinner";
import AddIcon from "@mui/icons-material/Add";
import { RemoveCircleOutline } from "@mui/icons-material";
import { useStateValue } from "../../../../StateProvider";
import ErrorComponent from "../../../Error/Error";
import { removeUpperAccents } from "../../../../Helpers/Functions/functions";

const AddNewInfo = () => {
  const [state] = useStateValue();
  const { t } = useTranslation();
  const history = useHistory();

  // const [tableState, setTableState] = useState([]);
  // const [allInfoData, setAllInfoData] = useState([]);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [newInfo, setNewInfo] = useState([
    { newInfoName: "", newInfoDescription: "", newInfoStatus: true },
  ]);
  const [isSpinnerLoading, setIsSpinnerLoading] = useState(false);

  const infoNameRef = useRef();
  const infoImageRef = useRef("");

  // All useEffect Hooks
  useEffect(() => {
    let controller = new AbortController();
    // setIsSpinnerLoading(true);
    // const exec = async () => {
    //   try {
    //     const res = await fetchInfoTypesFromDB(state.token);
    //     // setAllInfoData(data);
    //     // setTableState(data[0].content);
    //     // ---- Error Handler ---- //
    //     if (res.error) {
    //       setErrorMessage(res.error.msg);
    //       throw new Error(res.error.msg);
    //     }
    //     setIsSpinnerLoading(false);
    //   } catch (err) {
    //     setError(true);
    //     setIsSpinnerLoading(false);
    //   }
    // };
    // exec();
    controller = null;
    return () => controller?.abort();
  }, [state.token]);

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setIsSpinnerLoading(true);

    try {
      const name = infoNameRef.current.value;
      const alias = name.replace(/\s+/g, "-").toLowerCase();
      const image = infoImageRef.current.files[0];

      const res = await addInfo(name, image, newInfo, alias, state.token);
      // ---- Error Handler ---- //
      if (res.error) {
        setErrorMessage(res.error.msg);
        throw new Error(res.error.msg);
      }

      history.replace("/info");
      setIsSpinnerLoading(false);
    } catch (err) {
      setError(true);
      setIsSpinnerLoading(false);
    }
  };

  const handleChangeDescription = (i, e) => {
    let newFormValues = [...newInfo];
    newFormValues[i]["newInfoDescription"] = e.target.value;
    setNewInfo(newFormValues);
  };
  const handleChangeName = (i, e) => {
    let newFormValues = [...newInfo];
    newFormValues[i]["newInfoName"] = e.target.value;
    setNewInfo(newFormValues);
  };

  const handleRemoveNewInfoRow = (id) => {
    let tempArray = [...newInfo];
    tempArray.splice(id, 1);
    setNewInfo(tempArray);
  };

  const handleAddNewInfoRow = () => {
    setNewInfo((oldInfo) => [
      ...oldInfo,
      { newInfoName: "", newInfoDescription: "", newInfoStatus: true },
    ]);
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
              text={removeUpperAccents(t("back"))}
              icon={<UndoIcon />}
              color="warning"
              variant="contained"
            />

            <h2 className="form-headline">{t("new_info")}</h2>
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
                  ref={infoNameRef}
                  autoComplete="off"
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="info_image" className="col-sm-2 col-form-label">
                {t("image")}
              </label>
              <div className="col-sm-10">
                <input
                  className="form-control form-control-sm"
                  type="file"
                  name="info_image"
                  id="info_image"
                  ref={infoImageRef}
                  autoComplete="off"
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="staff_desc" className="col-sm-2 col-form-label">
                {t("info")}
              </label>
              {newInfo.map((info, i) => {
                return (
                  <Fragment key={i}>
                    <div
                      className={` ${
                        i !== 0 ? "offset-sm-2" : undefined
                      } col-sm-4`}
                    >
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="info_NewName"
                        name="info_NewName"
                        value={info.newInfoName}
                        onChange={(e) => handleChangeName(i, e)}
                        autoComplete="off"
                        required
                      />
                    </div>
                    <div className="col-sm-5">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="info_desc"
                        name="info_desc"
                        value={info.newInfoDescription}
                        onChange={(e) => handleChangeDescription(i, e)}
                        autoComplete="off"
                        required
                      />
                    </div>
                    <div className="col-sm-1 align-self-center">
                      <IconButton
                        className="justify-self-center min-width-unset"
                        icon={<RemoveCircleOutline />}
                        color="warning"
                        variant="contained"
                        onClick={() => handleRemoveNewInfoRow(i)}
                      />
                    </div>
                  </Fragment>
                );
              })}
              <div
                className={` ${
                  newInfo.length === 0 ? "offset-sm-9" : "offset-sm-11"
                }  col-sm-1 align-self-center`}
              >
                <IconButton
                  className="justify-self-center min-width-unset"
                  icon={<AddIcon />}
                  color="warning"
                  variant="contained"
                  onClick={handleAddNewInfoRow}
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

export default AddNewInfo;
