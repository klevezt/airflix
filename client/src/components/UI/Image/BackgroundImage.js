import React from 'react'

const BackgroundImage = (props) => {
  return (
    <div
      style={{
        backgroundImage: `url(${props.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: "-1"
      }}
    ></div>
  );
}

export default BackgroundImage