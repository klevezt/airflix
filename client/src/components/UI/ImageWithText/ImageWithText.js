import React from "react";

import "./ImageWithText.css";
const ImageWithText = (props) => {
  const employees = props.data;
  return employees.map((employee, i) => {
    return (
      <div className="staff-block-four">
        <div
          className={`inner-box ${
            i % 2 !== 0 ? "flex-direction-row-reverse" : null
          }`}
        >
          <figure className="figure-image">
            <img src={employee.img} alt="" title="" />
          </figure>
          <div className="content-box">
            <h4>{employee.name}</h4>
            <div className="text"> {employee.description}</div>
            <div className="link-row clearfix">
              <div className="link-box">
                <span className="btn-title"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });
};

export default ImageWithText;
