import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";
import {
  Fade,
  Backdrop,
  Modal,
  CardActions,
  CardContent,
  Card,
} from "@mui/material";
import IconButton2 from "@mui/material/IconButton";
import {
  Add,
  AddCircleOutline,
  CancelPresentation,
  Edit,
  RemoveCircleOutline,
  Save,
  Visibility,
} from "@mui/icons-material";

import IconButton from "../Buttons/IconButton";
import TableCardTypography from "../Typography/TableCardTypography";
import CardSelectDropdown from "./SelectDropdownCard";

import "./TableCellCard.css";

import { updateFoodWeek } from "../../../api_requests/hotel_requests";
import { fetchFoodFromDBWithParams } from "../../../api_requests/hotel_requests";
import LoadingSpinner from "../Spinners/LoadingSpinner";
import { useStateValue } from "../../../StateProvider";

const TableCellCard = (props) => {
  // Translation config
  const { t } = useTranslation();
  const [state] = useStateValue();

  const [open, setOpen] = useState(false);
  const [editClicked, setEditClicked] = useState(false);
  const [isModalSpinning, setIsModalSpinning] = useState(false);
  const [data, setData] = useState(props.data);
  const [optionsSelect, setOptionsSelect] = useState([]);
  const [isTodaysCard, setIsTodaysCard] = useState("");

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const foodTypeKeys = data !== undefined ? Object.keys(data) : [];

  useEffect(() => {
    let controller = new AbortController();
    
    const exec = async () => {
      const today = new Date();
      try {
        setIsTodaysCard(
          today.getDay() + "" === props.dayNumber ? "isTodaysCard" : ""
        );

        const arr = [];
        const food = await fetchFoodFromDBWithParams(
          "?status=true",
          state.token
        );
        // ---- Error Handler ---- //
        if (food.error) {
          setErrorMessage(food.error.msg);
          throw new Error(food.error.msg);
        }
        food.forEach((f) => {
          arr.push({ name: f.name, type: f.type });
        });
        setOptionsSelect(arr);
      } catch (err) {
        setError(true);
      }
    };
    exec();
    controller = null;
    return () => controller?.abort();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    if (!editClicked) {
      setOpen(false);
    }
  };

  const handleSave = async () => {
    setEditClicked((c) => !c);
    setIsModalSpinning(true);
    try {
      const res = await updateFoodWeek(
        {
          week: props.weekNumber,
          month: props.monthNumber,
          year: props.yearNumber,
          day: props.day,
          data: data,
        },
        state.token
      );
      // ---- Error Handler ---- //
      if (res.error) {
        setErrorMessage(res.error.msg);
        throw new Error(res.error.msg);
      }

      setIsModalSpinning(false);
    } catch (err) {
      setError(true);
      setIsModalSpinning(false);
    }
  };

  const handleEdit = () => {
    setEditClicked((c) => !c);
    setIsModalSpinning(true);
    setTimeout(() => {
      setIsModalSpinning(false);
    }, 10);
  };

  const handleDeleteInputField = (id, foodType) => {
    const tempArray = data[foodType].filter((_, i) => id !== i);

    setData((state) => ({ ...state, [foodType]: tempArray }));
  };

  const handleAddNewInputField = (foodType) => {
    if (data[foodType][data[foodType].length - 1] === "") {
      return;
    }
    setData((state) => ({ ...state, [foodType]: [...state[foodType], ""] }));
  };

  const handleSelectChange = (e, i, foodType) => {
    const array = data[foodType].map((item, j) => {
      if (j === i) {
        return e.target.value;
      }
      return item;
    });
    setData((state) => ({ ...state, [foodType]: array }));
  };

  const popup = ReactDOM.createPortal(
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={"modalMenu"}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className="modalMenu-container">
          <h2 style={{ marginBottom: 10, padding: 20 }}>
            {t(props.day)} {props.week}
          </h2>
          <hr />

          <div className="modalMenu-content">
            {foodTypeKeys.map((food, key) => {
              return (
                <div className="food-table-card-container" key={key}>
                  <div className="food-table-card-header">
                    <h5>{t(food)}</h5>
                  </div>

                  {!editClicked && (
                    <ul className="list-group">
                      {data[food] !== undefined && data[food].length !== 0 ? (
                        data[food].map((item, i) => {
                          return (
                            <li
                              className="list-group-item list-group-item-theme-color"
                              key={i}
                            >
                              {item}
                            </li>
                          );
                        })
                      ) : (
                        <li className="list-group-item list-group-item-secondary">
                          {t("no_food_exists")}
                        </li>
                      )}
                    </ul>
                  )}
                  {editClicked && (
                    <div className="food-table-card-input">
                      {data !== undefined &&
                        data[food] !== undefined &&
                        data[food].map((item, i) => {
                          return (
                            <div className="basic-flex mt-2" key={i}>
                              <CardSelectDropdown
                                onChange={(e) => handleSelectChange(e, i, food)}
                                index={i}
                                food={food}
                                item={item}
                                optionsSelect={optionsSelect}
                              />

                              <IconButton2
                                onClick={() => handleDeleteInputField(i, food)}
                                size="small"
                                component="span"
                                color="error"
                              >
                                <RemoveCircleOutline />
                              </IconButton2>
                            </div>
                          );
                        })}
                      <IconButton2
                        onClick={() => handleAddNewInputField(food)}
                        size="small"
                        component="span"
                        style={{ color: "#52b202" }}
                      >
                        <AddCircleOutline />
                      </IconButton2>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="modalMenu-footer">
            <IconButton
              onClick={editClicked ? handleSave : handleEdit}
              icon={
                editClicked ? (
                  <Save className="mr-10" />
                ) : (
                  <Edit className="mr-10" />
                )
              }
              size="medium"
              text={editClicked ? t("save") : t("edit")}
            />
            <IconButton
              onClick={editClicked ? handleEdit : handleClose}
              icon={<CancelPresentation className="mr-10" />}
              size="medium"
              text={editClicked ? t("cancel") : t("close")}
            />
          </div>
        </div>
      </Fade>
    </Modal>,
    document.getElementById("modal-root")
  );

  return (
    <>
      {error && (
        <Card className="card-container-empty" key={props.custom_key}>
          <CardContent></CardContent>
        </Card>
      )}
      {!error && popup }
      {!error && (
        <Card
          key={props.custom_key}
          className={
            !props.empty
              ? `card-container ${isTodaysCard}`
              : "card-container-empty"
          }
        >
          {!props.empty && (
            <>
              <CardContent>
                {foodTypeKeys.map((food, i) => {
                  return (
                    <TableCardTypography
                      data={data[food]}
                      food={food}
                      key={i}
                    />
                  );
                })}
              </CardContent>
              <CardActions>
                <IconButton
                  onClick={handleOpen}
                  icon={
                    foodTypeKeys.length === 0 ? (
                      <Add className="mr-10" />
                    ) : (
                      <Visibility className="mr-10" />
                    )
                  }
                  text={foodTypeKeys.length === 0 ? t("add") : t("view")}
                />
              </CardActions>
            </>
          )}
        </Card>
      )}
    </>
  );
};
export default TableCellCard;
