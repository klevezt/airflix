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

const ShowDrinks = () => {
  const [state] = useStateValue();
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

        data.forEach((drink) => {
          if (drink.status)
            arr.push({
              img:
                process.env.REACT_APP_IMAGES_URL +
                "/Images/Drinks/" +
                drink.images[0],
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
  }, []);

  useEffect(() => {
    let f = drinks;
    if (filter !== "Όλα") {
      f = drinks.filter((drink) => drink.type === filter);
    }
    setFilteredDrinks(f);
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
          {drinkListing}
          <div className="row margin-left-40 w-100">
            <div className="feature-box col-xl-12 col-lg-6 col-sm-12">
              <FadeUpLong>
                {isGridLoading && <CubeSpinner />}
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
