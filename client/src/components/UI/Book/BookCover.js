import React, { useState, useEffect } from "react";
import { Search } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

import "./BookCover.css";

const BookCover = (props) => {
  const { t } = useTranslation();
  const [myArray, setArr] = useState([]);

  useEffect(() => {
    const arr = props.catalog.filter((cat) => cat !== undefined);
    setArr(arr);
  }, []);
  
  return (
    <section className="drink-user-wrapper">
      <div
        className={`w-100 d-flex flex-wrap ${myArray.length === 0 ? "justify-content-end h-fit-content" : ""
          }  ${myArray.length !== 0 ? "justify-content-center" : ""} ${props.withSearch ? "with-search flex-direction-reverse" : ""
          }`}
      >
        {props.withSearch && (
          <div className="user-book-general-search">
            <h4>{props.date}</h4>
            <Search className="search-icon" onClick={props.openSearchModal} />
          </div>
        )}
        <div
          className={`user-book-general-headline-wrapper ${props.withSearch ? "mb-4" : ""
            }`}
        >
          <h2 className="user-book-general-headline">{t(props.coverHeadline)}</h2>
        </div>
      </div>
      <div className="d-flex flex-wrap justify-content-center w-100">
        {props.withSearch && (
          <>
            {myArray.length === 0 ? (
              <h2 className="text-center color-white h-fit-content ">
                {t("no_registered_food")}
              </h2>
            ) : (
              props.catalog
            )}
          </>
        )}
        {!props.withSearch && props.catalog}
      </div>
    </section>
  );
};

export default BookCover;
