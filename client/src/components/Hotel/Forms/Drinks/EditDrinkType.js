import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import UndoIcon from "@mui/icons-material/Undo";
import IconButton from "../../../UI/Buttons/IconButton";
import { removeUpperAccents } from "../../../../Helpers/Functions/functions";

const EditDrinkType = (props) => {
  const { t } = useTranslation();

  const [editDrinkTypeName, setEditDrinkTypeName] = useState(
    props.selectedDrinkType.name
  );
  const newImageRef = useRef("");
  const [imageChange, setImageChange] = useState(false);

  const handleNewDrinkTypeName = (e) => {
    setEditDrinkTypeName(e.target.value);
  };

  const changeImageHandler = () => {
    setImageChange((s) => !s);
  };

  return (
    <form
      method="post"
      encType="multipart/form-data"
      className="general-form"
      onSubmit={(e) =>
        props.handleUpdateDrinkType(
          e,
          editDrinkTypeName,
          imageChange ? newImageRef.current.files[0] : null
        )
      }
    >
      <div className="form-header">
        <IconButton
          className="form-back-button"
          onClick={() => {
            props.toggleEditDrinkType();
          }}
          text={removeUpperAccents(t("back"))}
          icon={<UndoIcon />}
          color="warning"
          variant="contained"
        />

        <h2 className="form-headline">{t("edit_drink")}</h2>
        <hr className="m-0" />
      </div>
      <div className="container">
        <div className="row mb-3">
          <label htmlFor="drink_name" className="col-sm-2 col-form-label">
            {t("name")}
          </label>

          <div className="col-sm-10">
            <input
              type="text"
              className="form-control form-control-sm"
              name="drink_name"
              id="drink_name"
              value={editDrinkTypeName}
              onChange={handleNewDrinkTypeName}
              autoComplete="off"
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="drink_images" className="col-sm-2 col-form-label">
            {t("change_image")}
          </label>
          <div className="col-sm-10 align-self-center">
            <input
              className="form-check-input"
              type="checkbox"
              id="drink_images"
              autoComplete="off"
              checked={imageChange}
              onChange={changeImageHandler}
            />
          </div>
          {imageChange && (
            <div className="col-sm-10 offset-sm-2">
              <input
                className="form-control form-control-sm"
                type="file"
                autoComplete="off"
                ref={newImageRef}
                required
              />
            </div>
          )}
        </div>
        <div className="row ">
          <div className="offset-sm-2 offset-0 col-sm-4 col-12">
            <button type="submit" className="btn btn-primary-theme ">
              {t("save")}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditDrinkType;
