import React, { useState, useEffect } from "react";
import { Search } from "@mui/icons-material";

import "./BookCover.css";

const BookCover = (props) => {
  const [myArray, setArr] = useState([]);

  useEffect(() => {
    const arr = props.catalog.filter((cat) => cat !== undefined);
    setArr(arr);
  }, []);
  return (
    <section className="drink-user-wrapper">
      <div
        className={`w-100 d-flex flex-wrap ${
          myArray.length === 0 ? "justify-content-end h-fit-content" : ""
        }  ${myArray.length !== 0 ? "justify-content-center" : ""} ${
          props.withSearch ? "with-search flex-direction-reverse" : ""
        }`}
      >
        {props.withSearch && (
          <div className="user-book-general-search">
            <h4>{props.date}</h4>
            <Search className="search-icon" onClick={props.openSearchModal} />
          </div>
        )}
        <div
          className={`user-book-general-headline-wrapper ${
            props.withSearch ? "mb-4" : ""
          }`}
        >
          <h2 className="user-book-general-headline">{props.coverHeadline}</h2>
        </div>
      </div>
      {props.withSearch && (
        <>
          {myArray.length === 0 ? (
            <h2 className="text-center color-white h-fit-content">
              Δεν υπάρχουν καταχωρημένα φαγητά
            </h2>
          ) : (
            props.catalog
          )}
        </>
      )}
      {!props.withSearch && props.catalog}
    </section>
  );
};

export default BookCover;
