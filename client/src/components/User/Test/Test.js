import React, { useState, useRef, useEffect } from "react";
import useImageGetter from "../../_hooks/useImageGetter";

function Test() {
  const imageRef = useRef("");
  const [image] = useImageGetter();

  const handleUpload = (e) => {
    e.preventDefault();
    console.log(imageRef.current.files[0]);
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
      <img src={image} alt="" />
    </>
  );
}

export default Test;
