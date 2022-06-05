import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import { useStateValue } from "../../../StateProvider";
import { useTranslation } from "react-i18next";
import { fetchInfoTypesFromDB } from "../../../api_requests/hotel_requests";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import ErrorComponent from "../../Error/Error";

const Info = () => {
  const { t } = useTranslation();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [state] = useStateValue();
  const [info, setInfo] = useState([]);

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);

  useEffect(() => {
    let controller = new AbortController();

    const exec = async () => {
      try {
        const all_info = await fetchInfoTypesFromDB(state.token);

        // ---- Error Handler ---- //
        if (all_info.error) {
          setErrorMessage(all_info.error.msg);
          throw new Error(all_info.error.msg);
        }

        setInfo(all_info);
        setIsSpinnerLoading(false);
      } catch (err) {
        setError(true);
      }
    };
    exec();
    controller = null;
    return () => {
      controller?.abort();
    };
  }, []);

  const allInfo = info.map((inf, i) => {
    return (
      <div className="mb-3 kp-each-info" key={i}>
        <h6>{t(inf.name)}</h6>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableBody>
              {inf.content.map((row, j) => (
                <TableRow className="kp-table-row" key={j}>
                  <TableCell style={{ width: 160 }}>
                    {row.newInfoName}
                  </TableCell>
                  <TableCell style={{ width: 160 }}>
                    {row.newInfoDescription}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  });

  return (
    <>
      {!error && isSpinnerLoading && <LoadingSpinner />}
      {error && <ErrorComponent errorMessage={errorMessage} />}
      {!error && !isSpinnerLoading && (
        <div className="row justify-content-center kp-events mb-5">
          <div className="mt-3">
            <div className="user-home-general-headline-wrapper">
              <h2 className="user-home-general-headline">{t("info")}</h2>
            </div>
          </div>
          <div className="user-home-accordion-wrapper">{allInfo}</div>
          {allInfo.length < 1 && (
            <p className="text-center kp-warning">
              Δεν υπάρχουν προσεχής εκδηλώσεις
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default Info;
