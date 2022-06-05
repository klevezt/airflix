import React, { useEffect, useState } from "react";
import {
  fetchAlacarteFromDB,
  fetchFoodTypesAlacarteFromDB,
} from "../../../api_requests/hotel_requests";
import ImageGrid from "../../UI/ImageGrid/ImageGrid";

import "./ShowAlacarte.css";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import CubeSpinner from "../../UI/Spinners/CubeSpinner";
import FadeUpLong from "../../hoc/FadeUpLong";
import { useStateValue } from "../../../StateProvider";

const ShowAlacarte = () => {
  const [state] = useStateValue();
  const [alacarte, setAlacarte] = useState([]);
  const [filteredAlacarte, setFilteredAlacarte] = useState([]);
  const [filter, setFilter] = useState("Όλα");
  const [list, setList] = useState([]);

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);
  const [isGridLoading, setIsGridLoading] = useState(true);

  useEffect(() => {
    let controller = new AbortController();

    const exec = async () => {
      const arr = [];
      fetchAlacarteFromDB(state.token).then((data) => {
        data.forEach((food) => {
          if (food.status)
            arr.push({
              img:
                process.env.REACT_APP_IMAGES_URL +
                "/Images/Alacarte/" +
                food.images[0],
              alias: food.alias,
              title: food.name,
              featured: food.featured,
              type: food.type,
            });
        });
        setAlacarte(arr);
        setFilteredAlacarte(arr);
      });
      const arr_2 = ["Όλα"];
      fetchFoodTypesAlacarteFromDB(state.token).then((data) => {
        data.forEach((type) => {
          if (type.status) arr_2.push(type.name);
        });
        setList(arr_2);
        setIsSpinnerLoading(false);
       
      });
    };
    exec();
    controller = null;
    return () => {
      controller?.abort();
    };
  }, []);

  useEffect(() => {
    let f = alacarte;
    if (filter !== "Όλα") {
      f = alacarte.filter((drink) => drink.type === filter);
    }
    setFilteredAlacarte(f);
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
      {isSpinnerLoading && <LoadingSpinner />}

      {!isSpinnerLoading && (
        <div className="d-flex justify-content-start">
          {drinkListing}
          <div className="row margin-left-40 w-100">
            <div className="feature-box col-xl-12 col-lg-6 col-sm-12">
              <FadeUpLong>
                {isGridLoading && <CubeSpinner />}
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
