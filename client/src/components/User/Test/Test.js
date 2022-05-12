import React, { useRef } from "react";

import useImageGetter from "../../_hooks/useImageGetter";
import { imageUpload } from "../../../Helpers/Const/constants";

function Test() {
  const imageRef = useRef("");
  const { image, error, loading } = useImageGetter("taski_diversey_logo.png");

  const handleUpload = (e) => {
    e.preventDefault();
    imageUpload(imageRef.current.files[0]);
  };

  return (
    <>
      <h1>To Upload Image on mongoDB</h1>
      <hr />
      <div>
        <form method="POST" onSubmit={(e) => handleUpload(e)}>
          <div>
            <label htmlFor="image">Upload Image</label>
            <input
              className="form-control form-control-sm"
              type="file"
              autoComplete="off"
              ref={imageRef}
            />
          </div>
          <div>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
      {loading && <h1>LOADING......</h1>}
      {!loading && <img src={image} alt="" />}
    </>
  );
}

export default Test;
