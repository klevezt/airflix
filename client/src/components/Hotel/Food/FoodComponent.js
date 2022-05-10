import React, { useEffect, useState } from "react";
import { MDBDataTableV5 } from "mdbreact";
import { useTranslation } from "react-i18next";
import { Add } from "@mui/icons-material";

import {
  addNewMonth,
  fetchWeekFromDB,
} from "../../../api_requests/hotel_requests";

import "./FoodComponent.css";

import { months, years } from "../../../Helpers/Const/constants";
import {
  assignWeeksToTable,
  menuTableColumns,
  monthTableRow,
} from "../../../Helpers/Const/constants";
import PrimaryButton from "../../UI/Buttons/PrimaryButton";
import { getWeeksInMonth } from "../../../Helpers/Functions/functions";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import FadeUp from "../../hoc/FadeUp";
import { useStateValue } from "../../../StateProvider";

const Food = () => {
  const [state] = useStateValue();
  const { t } = useTranslation();

  const [monthIsInitialized, setMonthIsInitialized] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const [tableMenu, setTableMenu] = useState([]);

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(false);

  // All food tables

  let menu = [];

  const fetchMenuTable = {
    columns: menuTableColumns,
    rows: menu,
  };

  // All useEffect functions

  useEffect(() => {
    setMonth(new Date().getMonth() + 1);
    setYear(new Date().getFullYear());
  }, []);

  const handleWeekMenu = async () => {
    await fetchWeekFromDB(month, year, state.token)
      .then((week) => {
        const menu_week = assignWeeksToTable(year, month, week);
        setTableMenu(menu_week);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    monthTableRow(year, month, menu, tableMenu);
  }, [tableMenu, isSpinnerLoading]);

  useEffect(() => {
    let timer;
    const exec = async () => {
      setIsSpinnerLoading(true);
      setMonthIsInitialized(false);
      let fact = false;
      await fetchWeekFromDB(month, year, state.token)
        .then((week) => {
          week.forEach((w) => {
            w.month === month && w.year === year
              ? (fact = true)
              : (fact = false);
          });
          fact ? setMonthIsInitialized(true) : setMonthIsInitialized(false);
        })
        .then(() => {
          handleWeekMenu().then(() => {
            timer = setTimeout(() => {
              setIsSpinnerLoading(false);
            }, 10);
          });
        })
        .catch((err) => console.log(err));
    };
    exec();
    return () => {
      clearTimeout(timer);
    };
  }, [month, year]);

  // All handle events

  const handleCreateMonthTimetable = async () => {
    setIsSpinnerLoading(true);
    const [weeks] = getWeeksInMonth(year, month);

    weeks.forEach(async (_, i) => {
      await addNewMonth(month, year, i + 1, state.token);
      const w = await fetchWeekFromDB(month, year, state.token).catch((err) =>
        console.log(err)
      );
      const menu_week = assignWeeksToTable(year, month, w);
      setTableMenu(menu_week);
      setMonthIsInitialized(true);
      setIsSpinnerLoading(false);
    });
  };

  /* Month and Year Handlers */

  const handleMonthChange = (e) => {
    setMonth(Number(e.target.value));
  };

  const handleYearChange = (e) => {
    setYear(Number(e.target.value));
  };

  return (
    <div className="row">
      <div className="col-xl-12">
        <div className={`d-flex justify-content-center flex-wrap showMenu`}>
          <div className="d-flex flex-direction-column">
            <div className="d-flex justify-content-center align-items-center flex-wrap mb-4">
              <div className="d-flex">
                <div className="mx-2">
                  <label htmlFor="month" className="mr-2">
                    <strong>Μήνας:</strong>
                  </label>
                  <select
                    id="month"
                    name="month"
                    className="form-select form-select-inline"
                    onChange={handleMonthChange}
                    defaultValue={month}
                  >
                    {months.map((mmonth, i) => {
                      return (
                        (new Date().getMonth() + 1 <= i + 3 ||
                          new Date().getFullYear() < year) && (
                          <option
                            value={i + 3}
                            defaultChecked={i + 3 === month}
                            key={i}
                          >
                            {mmonth}
                          </option>
                        )
                      );
                    })}
                  </select>
                </div>
                <div className="mx-4">
                  <label htmlFor="year" className="mr-2">
                    <strong>Έτος:</strong>
                  </label>
                  <select
                    id="year"
                    name="year"
                    className="form-select form-select-inline"
                    onChange={handleYearChange}
                    defaultValue={year}
                  >
                    {years.map((y, i) => {
                      return (
                        <option
                          value={y}
                          defaultChecked={i + 1 === year}
                          key={i}
                        >
                          {y}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>
            {!isSpinnerLoading && (
              <FadeUp>
                {monthIsInitialized && !isSpinnerLoading && (
                  <MDBDataTableV5
                    className="mt-4"
                    data={fetchMenuTable}
                    paging={false}
                    searching={false}
                    sortable={false}
                    info={false}
                    hover
                  />
                )}
              </FadeUp>
            )}

            {!monthIsInitialized && !isSpinnerLoading && (
              <PrimaryButton
                show
                icon={<Add className="mr-2 " />}
                text={t("new_timetable")}
                onClick={handleCreateMonthTimetable}
              />
            )}
          </div>
        </div>

        {isSpinnerLoading && !monthIsInitialized && <LoadingSpinner />}
      </div>
    </div>
  );
};

export default Food;
