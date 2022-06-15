import React, { useEffect, useState } from "react";
import {
  fetchAlacarteFromDB,
  fetchFoodTypesAlacarteFromDB,
} from "../../../api_requests/hotel_requests";
import ImageGrid from "../../UI/ImageGrid/ImageGrid";
import ErrorComponent from "../../Error/Error";

import "./ShowAlacarte.css";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import CubeSpinner from "../../UI/Spinners/CubeSpinner";
import FadeUpLong from "../../hoc/FadeUpLong";
import { useStateValue } from "../../../StateProvider";
import { imageGetter } from "../../../Helpers/Const/constants";
import { useTranslation } from "react-i18next";

const ShowAlacarte = () => {
  const [state] = useStateValue();
  const { t } = useTranslation();

  const [alacarte, setAlacarte] = useState([]);
  const [filteredAlacarte, setFilteredAlacarte] = useState([]);
  const [filter, setFilter] = useState("Όλα");
  const [list, setList] = useState([]);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);
  const [isGridLoading, setIsGridLoading] = useState(true);

  useEffect(() => {
    let controller = new AbortController();

    const exec = async () => {
      const arr = [];
      try {
        const data = await fetchAlacarteFromDB(state.token);
        // ---- Error Handler ---- //
        if (data.error) {
          setErrorMessage(data.error.msg);
          throw new Error(data.error.msg);
        }

        const { myArr } = await imageGetter(data, "Alacarte/");

        // ---- Error Handler ---- //
        if (myArr === undefined || myArr === null) {
          let tmp_error =
            "Hotel/ShowAlacarte/useEffect => Alacarte imageGetter Problem";
          setErrorMessage(tmp_error);
          throw new Error(tmp_error);
        }

        myArr.forEach((food) => {
          if (food.status)
            arr.push({
              img: food.image,
              alias: food.alias,
              title: food.name,
              featured: food.featured,
              type: food.type,
            });
        });

        setAlacarte(arr);
        setFilteredAlacarte(arr);
        const arr_2 = ["Όλα"];

        const foodTypes = await fetchFoodTypesAlacarteFromDB(state.token);
        // ---- Error Handler ---- //
        if (foodTypes.error) {
          setErrorMessage(foodTypes.error.msg);
          throw new Error(foodTypes.error.msg);
        }

        foodTypes.forEach((type) => {
          if (type.status) arr_2.push(type.name);
        });
        setList(arr_2);
        setIsSpinnerLoading(false);
        setIsGridLoading(false);
      } catch (err) {
        setError(true);
        setIsSpinnerLoading(false);
        setIsGridLoading(false);
      }
    };
    exec();
    controller = null;
    return () => controller?.abort();
  }, [state.token]);

  useEffect(() => {
    let controller = new AbortController();

    let f = alacarte;
    if (filter !== "Όλα") {
      f = alacarte.filter((drink) => drink.type === filter);
    }
    setFilteredAlacarte(f);

    controller = null;
    return () => controller?.abort();
  }, [filter, alacarte]);

  const drinkListing = (
    <ul className="drink-ul ">
      {list.map((item, i) => {
        return (
          <li
            onClick={() => handleFilter(item)}
            className={filter === item ? "active" : ""}
            key={i}
          >
            {item}
          </li>
        );
      })}
    </ul>
  );

  const handleFilter = (item) => {
    setFilter(item);
  };

  return (
    <>
      {!error && isSpinnerLoading && <LoadingSpinner />}
      {error && <ErrorComponent errorMessage={errorMessage} />}
      {!error && !isSpinnerLoading && (
        <div className="d-flex justify-content-start">
          {filteredAlacarte.length > 1 && drinkListing}
          <div className="row margin-left-40 w-100">
            <div className="feature-box col-xl-12 col-lg-6 col-sm-12">
              <FadeUpLong>
                {isGridLoading && <CubeSpinner />}
                {filteredAlacarte.length <= 1 && (
                  <div>
                    <h2 className="my-3">{t("à la carte")}</h2>
                    <p className="text-center kp-warning">
                      {t("no_food_exists")}
                    </p>
                  </div>
                )}
                {!isGridLoading && (
                  <ImageGrid
                    imagesPath="/alacarte/food/"
                    data={filteredAlacarte}
                  />
                )}
              </FadeUpLong>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShowAlacarte;
