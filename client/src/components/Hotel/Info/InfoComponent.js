import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import { useTranslation } from "react-i18next";

import "./InfoComponent.css";
import {
  deleteInfo,
  fetchInfoTypesFromDB,
  setInfoStatus,
  updateInfo,
} from "../../../api_requests/hotel_requests";
import { DeleteOutline, Edit, Star, StarBorder } from "@mui/icons-material";
import EditInfo from "../Forms/Info/EditInfo";
import { removeUpperAccents } from "../../../Helpers/Functions/functions";
import { useStateValue } from "../../../StateProvider";

const InfoComponent = () => {
  const [state] = useStateValue();

  const { t } = useTranslation();
  const translate = (text) => removeUpperAccents(t(text));

  const [info, setInfo] = useState([]);
  const [selectedInfo, setSelectedInfo] = useState();
  const [showEdit, setShowEdit] = useState(false);

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(false);
  useEffect(() => {
    let timer;
    setIsSpinnerLoading(true);
    const exec = async () => {
      fetchInfoTypesFromDB(state.token).then((data) => {
        setInfo(data);
        setIsSpinnerLoading(false);
      });
    };
    exec();
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleDeleteInfo = async (id) => {
    setIsSpinnerLoading(true);
    await deleteInfo(id, state.token);
    fetchInfoTypesFromDB(state.token).then((data) => {
      setInfo(data);
      setIsSpinnerLoading(false);
    });
  };

  const handleUpdateInfo = async (e) => {
    setIsSpinnerLoading(true);
    // await updateInfo(name, type, content).then(() => {});
    fetchInfoTypesFromDB(state.token).then((data) => {
      setInfo(data);
      setShowEdit((s) => !s);
      setIsSpinnerLoading(false);
    });
  };

  const handleEditInfo = (selectedInfo) => {
    setShowEdit((s) => !s);
    setSelectedInfo(selectedInfo);
  };

  const handleChangeFeatured = async (selectedInfo) => {
    setIsSpinnerLoading(true);
    await setInfoStatus(selectedInfo._id, !selectedInfo.featured, state.token);
    fetchInfoTypesFromDB(state.token).then((data) => {
      setInfo(data);
      setIsSpinnerLoading(false);
    });
  };
  const allInfo = info.map((inf, i) => {
    return (
      <div className="info-flex-three" key={i}>
        <div className="w-100 buttons-wrapper">
          <Button
            variant="outlined"
            color="warning"
            className="button__rounded"
            onClick={() => handleChangeFeatured(inf)}
          >
            {inf.featured ? <Star /> : <StarBorder />}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            className="button__rounded"
            onClick={() => handleEditInfo(inf)}
          >
            <Edit />
          </Button>
          <Button
            variant="outlined"
            color="error"
            className="button__rounded"
            onClick={() => handleDeleteInfo(inf._id)}
          >
            <DeleteOutline />
          </Button>
        </div>
        <Link
          to={`/info/view/${inf.alias}`}
          className="info-avatar text-center"
        >
          <img
            src={`${process.env.REACT_APP_IMAGES_URL}/Images/Info/${inf.image}`}
            alt=""
          />
          <div className=" text-center info-description">
            <h2>{translate(inf.name)}</h2>
          </div>
        </Link>
      </div>
    );
  });

  return (
    <>
      {isSpinnerLoading && <LoadingSpinner />}
      {!isSpinnerLoading && !showEdit && (
        <section className="info-wrapper">
          <div className="row mb-5">
            <Link to="/info/add" className="text-center">
              <Button
                variant="contained"
                color="primary"
                className="button__addUser mb-3"
              >
                <AddIcon />
                {translate("Προσθήκη Πληροφοριών")}
              </Button>
            </Link>
          </div>

          <div className={`col-12 info-box`}>{allInfo}</div>
        </section>
      )}
      {!isSpinnerLoading && showEdit && (
        <EditInfo
          handleUpdateInfo={handleUpdateInfo}
          handleBackButton={() => setShowEdit((s) => !s)}
          info={selectedInfo}
        />
      )}
    </>
  );
};

export default InfoComponent;
