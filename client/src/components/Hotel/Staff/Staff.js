import React, { useEffect, useState } from "react";

import {
  fetchStaffFromDB,
  fetchStaffPositionFromDB,
} from "../../../api_requests/hotel_requests";
import { useStateValue } from "../../../StateProvider";

import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import CubeSpinner from "../../UI/Spinners/CubeSpinner";
import FadeUpLong from "../../hoc/FadeUpLong";
import ErrorComponent from "../../Error/Error";

const Staff = () => {
  const [state] = useStateValue();

  const [drinks, setDrinks] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
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
        const data = await fetchStaffFromDB(state.token);
        // ---- Error Handler ---- //
        if (data.error) {
          setErrorMessage(data.error.msg);
          throw new Error(data.error.msg);
        }

        data.forEach((staff) => {
          if (staff.status)
            arr.push({
              img:
                process.env.REACT_APP_IMAGES_URL +
                "/Images/Staff/" +
                staff.images[0],
              alias: staff.alias,
              title: staff.name,
              featured: staff.featured,
              type: staff.position,
              description: staff.description,
            });
        });
        setDrinks(arr);
        setFilteredStaff(arr);

        const arr_2 = ["Όλα"];
        const staffPosition = await fetchStaffPositionFromDB(state.token);
        // ---- Error Handler ---- //
        if (staffPosition.error) {
          setErrorMessage(staffPosition.error.msg);
          throw new Error(staffPosition.error.msg);
        }

        staffPosition.forEach((type) => {
          if (type.status) arr_2.push(type.name);

          setList(arr_2);
          setIsSpinnerLoading(false);
          setTimeout(() => {
            setIsGridLoading(false);
          }, 500);
        });
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
      f = drinks.filter((drink) => drink.position === filter);
    }
    setFilteredStaff(f);
  }, [filter, drinks]);

  const staffListing = (
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

  const AllEmployees = () => {
    return filteredStaff.map((employee, i) => {
      return (
        <>
          <div className="about-text-box">
            <div className="row align-items-center">
              <div className="col-lg-4 ">
                <div className="about-img">
                  <img src={employee.img} alt="Employees" />
                </div>
              </div>
              <div className="col-lg-8 ">
                <div className="about-text">
                  <h4>{employee.title}</h4>
                  <p>{employee.description}</p>
                </div>
              </div>
            </div>
          </div>
          {filteredStaff.length - 1 !== i && <hr />}
        </>
      );
    });
  };

  return (
    <>
      {!error && isSpinnerLoading && <LoadingSpinner />}
      {error && <ErrorComponent errorMessage={errorMessage} />}
      {!error && !isSpinnerLoading && (
        <div className="d-flex justify-content-start filter-content-container">
          {staffListing}
          <div className="row margin-left-40 w-100">
            <div className="feature-box col-xl-12 col-lg-6 col-sm-12">
              <FadeUpLong>
                {isGridLoading && <CubeSpinner />}
                {!isGridLoading && <AllEmployees />}
              </FadeUpLong>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Staff;
