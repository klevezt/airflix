import React, { useEffect, useState } from "react";
import { MDBDataTableV5 } from "mdbreact";
import { useTranslation } from "react-i18next";
import { Add, Delete, Update } from "@mui/icons-material";

import {
  addNewMonth,
  deleteMonth,
  fetchFoodFromDBWithParams,
  fetchWeekFromDB,
  updateNewMonth,
} from "../../../api_requests/hotel_requests";

import "./FoodComponent.css";

import { months, years } from "../../../Helpers/Const/constants";
import {
  assignWeeksToTable,
  menuTableColumns,
  monthTableRow,
} from "../../../Helpers/Const/constants";
import PrimaryButton from "../../UI/Buttons/PrimaryButton";
import {
  getWeeksInMonth,
  removeUpperAccents,
} from "../../../Helpers/Functions/functions";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import FadeUp from "../../hoc/FadeUp";
import { useStateValue } from "../../../StateProvider";
import ErrorComponent from "../../Error/Error";
import IconButton from "../../UI/Buttons/IconButton";

const Food = () => {
  const [state] = useStateValue();
  const { t } = useTranslation();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    let controller = new AbortController();

    setMonth(new Date().getMonth() + 1);
    setYear(new Date().getFullYear());

    controller = null;
    return () => controller?.abort();
  }, []);

  useEffect(() => {
    let controller = new AbortController();

    monthTableRow(year, month, menu, tableMenu);

    controller = null;
    return () => controller?.abort();
  }, [tableMenu, isSpinnerLoading]);

  useEffect(() => {
    let controller = new AbortController();

    const exec = async () => {
      setIsSpinnerLoading(true);
      setMonthIsInitialized(false);
      let fact = false;
      try {
        const week = await fetchWeekFromDB(month, year, state.token);
        // ---- Error Handler ---- //
        if (week.error) {
          setErrorMessage(week.error.msg);
          throw new Error(week.error.msg);
        }

        week.forEach((w) => {
          w.month === month && w.year === year ? (fact = true) : (fact = false);
        });
        fact ? setMonthIsInitialized(true) : setMonthIsInitialized(false);

        const menu_week = assignWeeksToTable(year, month, week);
        setTableMenu(menu_week);
        setIsSpinnerLoading(false);
      } catch (err) {
        setError(true);
        setIsSpinnerLoading(false);
      }
    };
    exec();
    controller = null;
    return () => controller?.abort();
  }, [month, year, state.token]);

  // All handle events

  const handleCreateMonthTimetable = async () => {
    setIsSpinnerLoading(true);
    const [weeks] = getWeeksInMonth(year, month);

    weeks.forEach(async (_, i) => {
      try {
        const result = await addNewMonth(month, year, i + 1, state.token);
        // ---- Error Handler ---- //
        if (result.error) {
          setErrorMessage(result.error.msg);
          throw new Error(result.error.msg);
        }

        const w = await fetchWeekFromDB(month, year, state.token);
        // ---- Error Handler ---- //
        if (w.error) {
          setErrorMessage(w.error.msg);
          throw new Error(w.error.msg);
        }

        const menu_week = assignWeeksToTable(year, month, w);
        setTableMenu(menu_week);
        setMonthIsInitialized(true);
        setIsSpinnerLoading(false);
      } catch (err) {
        setError(true);
        setIsSpinnerLoading(false);
      }
    });
  };

  const handleUpdateMonthTimetable = async () => {
    setIsSpinnerLoading(true);
    const [weeks] = getWeeksInMonth(year, month);

    weeks.forEach(async (_, i) => {
      try {
        const result = await updateNewMonth(month, year, i + 1, state.token);
        // ---- Error Handler ---- //
        if (result.error) {
          setErrorMessage(result.error.msg);
          throw new Error(result.error.msg);
        }

        const w = await fetchWeekFromDB(month, year, state.token);
        // ---- Error Handler ---- //
        if (w.error) {
          setErrorMessage(w.error.msg);
          throw new Error(w.error.msg);
        }

        const menu_week = assignWeeksToTable(year, month, w);
        setTableMenu(menu_week);
        setTimeout(() => {
          setMonthIsInitialized(true);
          setIsSpinnerLoading(false);
        }, 500);
      } catch (err) {
        setError(true);
        setIsSpinnerLoading(false);
      }
    });
  };

  const handleDeleteMonthTimetable = async () => {
    setIsSpinnerLoading(true);
    try {
      const result = await deleteMonth(month, year, state.token);
      // ---- Error Handler ---- //
      if (result.error) {
        setErrorMessage(result.error.msg);
        throw new Error(result.error.msg);
      }

      const w = await fetchWeekFromDB(month, year, state.token);
      // ---- Error Handler ---- //
      if (w.error) {
        setErrorMessage(w.error.msg);
        throw new Error(w.error.msg);
      }

      const menu_week = assignWeeksToTable(year, month, w);
      setTableMenu(menu_week);
      setMonthIsInitialized(false);
      setIsSpinnerLoading(false);
    } catch (err) {
      setError(true);
      setIsSpinnerLoading(false);
    }
  };

  /* Month and Year Handlers */

  const handleMonthChange = (e) => {
    setMonth(Number(e.target.value));
  };

  const handleYearChange = (e) => {
    setYear(Number(e.target.value));
  };

  return (
    <>
      {!error && isSpinnerLoading && <LoadingSpinner />}
      {error && <ErrorComponent errorMessage={errorMessage} />}
      {!error && !isSpinnerLoading && (
        <div className="row hotel-food-wrapper">
          <div className="col-xl-12">
            <div className="d-flex justify-content-center flex-wrap showMenu">
              <div className="d-flex flex-direction-column flex-basis-100">
                <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
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
                            // (new Date().getMonth() + 1 <= i + 3 ||
                            //   new Date().getFullYear() < year) && (
                            <option
                              value={i + 3}
                              defaultChecked={i + 3 === month}
                              key={i}
                            >
                              {mmonth}
                            </option>
                            // )
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
                  {monthIsInitialized && !isSpinnerLoading && (
                    <IconButton
                      text={removeUpperAccents(t("update_timetable"))}
                      icon={<Update className="mr-2" />}
                      color="warning"
                      variant="contained"
                      className="w-auto"
                      onClick={handleUpdateMonthTimetable}
                    />
                  )}
                  {!monthIsInitialized && !isSpinnerLoading && (
                    <PrimaryButton
                      show
                      icon={<Add className="mr-2 " />}
                      text={removeUpperAccents(t("new_timetable"))}
                      onClick={handleCreateMonthTimetable}
                      className="m-0"
                    />
                  )}
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
              </div>
            </div>
          </div>
          {monthIsInitialized && !isSpinnerLoading && (
            <div className="row justify-content-end mt-5 mb-4">
              <IconButton
                text={removeUpperAccents(t("delete_timetable"))}
                icon={<Delete className="mr-2" />}
                color="error"
                variant="contained"
                className="w-auto"
                onClick={handleDeleteMonthTimetable}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Food;
