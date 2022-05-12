import React, { useState, useEffect } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";

const useImageGetter = (token) => {
  const [data, setData] = useState([]);
  const [mm_image, setImage] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    let controller = new AbortController();
    const exec = async () => {
      const d = await fetch(process.env.REACT_APP_SERVER_URL + "/serviceType", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      }).then((data) => data.json());
      setData(d);

      var arr = [];
      data.map((imageArr, i) => {
        const storageRef = ref(storage, imageArr.image);
        getDownloadURL(storageRef)
          .then((image) => arr.push({ ...imageArr, image }))
          .catch(setError(true))
          .finally(() => setLoading(false));
      });
      setImage(arr);
    };
    exec();
    controller = null;
    return () => controller?.abort();
  }, [token]);

  console.log(mm_image);
  return { mm_image, error, loading };
};

export default useImageGetter;
