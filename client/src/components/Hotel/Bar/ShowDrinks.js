import React, { useEffect, useState } from "react";

import {
  fetchDrinksFromDB,
  fetchDrinksTypesFromDB,
} from "../../../api_requests/hotel_requests";

import ErrorComponent from "../../Error/Error";

import "./ShowDrinks.css";
import ImageGrid from "../../UI/ImageGrid/ImageGrid";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import CubeSpinner from "../../UI/Spinners/CubeSpinner";
import FadeUpLong from "../../hoc/FadeUpLong";
import { useStateValue } from "../../../StateProvider";
import { imageGetter } from "../../../Helpers/Const/constants";
import { useTranslation } from "react-i18next";

const ShowDrinks = () => {
  const [state] = useStateValue();
  const { t } = useTranslation();

  const [drinks, setDrinks] = useState([]);
  const [filteredDrinks, setFilteredDrinks] = useState([]);
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
        const data = await fetchDrinksFromDB(state.token);
        // ---- Error Handler ---- //
        if (data.error) {
          setErrorMessage(data.error.msg);
          throw new Error(data.error.msg);
        }

        const { myArr } = await imageGetter(data, "Drinks/");
        // ---- Error Handler ---- //
        if (myArr === undefined || myArr === null) {
          let tmp_error =
            "Hotel/ShowDrinks/useEffect => Drink imageGetter Problem";
          setErrorMessage(tmp_error);
          throw new Error(tmp_error);
        }

        myArr.forEach((drink) => {
          if (drink.status)
            arr.push({
              img: drink.image,
              alias: drink.alias,
              title: drink.name,
              featured: drink.featured,
              type: drink.type,
            });
        });
        setDrinks(arr);
        setFilteredDrinks(arr);
        const arr_2 = ["Όλα"];

        const drinkTypes = await fetchDrinksTypesFromDB(state.token);
        // ---- Error Handler ---- //
        if (drinkTypes.error) {
          setErrorMessage(drinkTypes.error.msg);
          throw new Error(drinkTypes.error.msg);
        }

        drinkTypes.forEach((type) => {
          if (type.status) arr_2.push(type.name);
        });
        setList(arr_2);
        setIsSpinnerLoading(false);
        setTimeout(() => {
          setIsGridLoading(false);
        }, 500);
      } catch (err) {
        setError(true);
        setIsSpinnerLoading(false);
      }
    };
    exec();
    controller = null;
    return () => controller?.abort();
  }, [state.token]);

  useEffect(() => {
    let controller = new AbortController();

    let f = drinks;
    if (filter !== "Όλα") {
      f = drinks.filter((drink) => drink.type === filter);
    }
    setFilteredDrinks(f);

    controller = null;
    return () => controller?.abort();
  }, [filter, drinks]);

  const drinkListing = (
    <ul className="drink-ul ">
      {list.map((item, i) => (
        <li
          onClick={() => handleFilter(item)}
          className={filter === item ? "active" : ""}
          key={i}
        >
          {item}
        </li>
      ))}
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
          {filteredDrinks.length > 1 && drinkListing}
          <div className="row margin-left-40 w-100">
            <div className="feature-box col-xl-12 col-lg-6 col-sm-12">
              <FadeUpLong>
                {isGridLoading && <CubeSpinner />}
                {filteredDrinks.length <= 1 && (
                  <div>
                    <h2 className="my-3">{t("drinks")}</h2>
                    <p className="text-center kp-warning">
                      {t("no_drinks_exists")}
                    </p>
                  </div>
                )}
                {!isGridLoading && (
                  <ImageGrid imagesPath="/bar/drink/" data={filteredDrinks} />
                )}
              </FadeUpLong>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShowDrinks;
