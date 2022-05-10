import React, { useState, useEffect } from "react";

const useImageGetter = (props) => {
  const [image, setImage] = useState();

  useEffect(() => {
    let controller = new AbortController();

    const exec = async () => {
      //   props.e.preventDefault();
      //   console.log(imageRef.current.files);
      //   await fetch(process.env.REACT_APP_SERVER_URL + "/imageTest/uploads", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       filename: props.name,
      //     }),
      //   });
      const data = await fetch(
        process.env.REACT_APP_SERVER_URL + "/imageTest",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((data) => data.json());

      const img = new Buffer.from(data["items"][0]["img"].data).toString(
        "base64"
      );

      setImage(`data:${data["items"][0]["img"].contentType};base64,${img}`);
    };
    exec();
    controller = null;
    return () => controller?.abort();
  }, []);

  return [image];
};

export default useImageGetter;
