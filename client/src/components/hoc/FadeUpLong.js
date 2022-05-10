import React from "react";
import "./FadeUpLong.css";

const FadeUp = (props) => {
  return (
    <div {...props} className="fadeInUpBig">
      {props.children}
    </div>
  );
};

export default FadeUp;
