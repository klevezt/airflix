import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import { useStateValue } from "../../../StateProvider";
import { useTranslation } from "react-i18next";
import { fetchInfoTypesFromDB } from "../../../api_requests/user_requests";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import ErrorComponent from "../../Error/Error";
import { checkToken } from "../../../Helpers/Const/constants";
import { actionTypes } from "../../../reducer";

const Info = () => {
  const { t } = useTranslation();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [state, dispatch] = useStateValue();
  const [info, setInfo] = useState([]);

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);

  useEffect(() => {
    let controller = new AbortController();

    const exec = async () => {
      try {
        const { isExpired, dataaa } = await checkToken(
          state.token,
          state.refreshToken
        );
        const token = isExpired ? dataaa.accessToken : state.token;

        const all_info = await fetchInfoTypesFromDB(
          { status: true },
          token
        );

        // ---- Error Handler ---- //
        if (all_info.error) {
          setErrorMessage(all_info.error.msg);
          throw new Error(all_info.error.msg);
        }
        const contentArray = [];
        all_info.forEach((element) => {
          const arr = [];
          const tempContent = element.content;

          tempContent.map((c) => {
            arr.push(JSON.parse(c));
          });
          contentArray.push(arr);
        });

        const tmpInfo = [];
        all_info.forEach((inf, i) => {
          tmpInfo.push({ ...inf, content: contentArray[i] });
        });

        dispatch({
          type: actionTypes.SET_NEW_JWT_TOKEN,
          token: token,
        });

        setInfo(tmpInfo);
        setIsSpinnerLoading(false);
      } catch (err) {
        setError(true);
        setIsSpinnerLoading(false);
      }
    };
    exec();
    controller = null;
    return () => controller?.abort();
  }, [state.token]);

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
                    {t(row.newInfoName)}
                  </TableCell>
                  <TableCell style={{ width: 160 }}>
                    {t(row.newInfoDescription)}
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
        <div className="row kp-events mb-5">
          <div className="mt-3">
            <div className="user-home-general-headline-wrapper">
              <h2 className="user-home-general-headline">{t("info")}</h2>
            </div>
          </div>
          <div className="user-home-accordion-wrapper">{allInfo}</div>
          {allInfo.length < 1 && (
            <div>
              <p className="text-center kp-warning">{t("no_information")}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Info;
