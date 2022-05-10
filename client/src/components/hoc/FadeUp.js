import React from "react";
import "./FadeUp.css";

const FadeUp = (props) => {
  return (
    <div {...props} className="fadeInUp">
      {props.children}
    </div>
  );
};

export default FadeUp;
