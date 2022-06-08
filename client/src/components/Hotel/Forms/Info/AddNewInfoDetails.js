import React, { useEffect, useState, Fragment } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import UndoIcon from "@mui/icons-material/Undo";
import IconButton from "../../../UI/Buttons/IconButton";
import LoadingSpinner from "../../../UI/Spinners/LoadingSpinner";
import AddIcon from "@mui/icons-material/Add";
import { RemoveCircleOutline } from "@mui/icons-material";

const AddNewInfoDetailsForm = (props) => {
  const { t } = useTranslation();

  const [newInfo, setNewInfo] = useState([...props.info]);
  const [isSpinnerLoading, setIsSpinnerLoading] = useState(false);

  // useEffect(() => {
  //   // console.log(newInfo);
  // }, []);

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
      {isSpinnerLoading && <LoadingSpinner />}
      {!isSpinnerLoading && (
        <form
          method="post"
          encType="multipart/form-data"
          className="general-form"
          onSubmit={(e) => props.handleSubmitForm(e, newInfo)}
        >
          <div className="form-header">
            <IconButton
              className="form-back-button"
              onClick={() => {
                props.goBack();
              }}
              text={t("Επιστροφη")}
              icon={<UndoIcon />}
              color="warning"
              variant="contained"
            />

            <h2 className="form-headline">{t("Νέες Πληροφορίες")}</h2>
            <hr className="m-0" />
          </div>
          <div className="container">
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
                  {t("update")}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default AddNewInfoDetailsForm;
