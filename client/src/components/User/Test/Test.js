import React, { useState, useRef, useEffect } from "react";
import useImageGetter from "../../_hooks/useImageGetter";
import { storage } from "../../../firebase";
import { getStorage, ref, uploadBytes } from "firebase/storage";

function Test() {
  const imageRef = useRef("");
  // const [image] = useImageGetter();
  // const [image, setImage] = useState("");

  const upload = (image) => {
    // Create a root reference
    const storage = getStorage();
    const storageRef = ref(storage, image.name);

    uploadBytes(storageRef, image).then((snapshot) => {
      console.log("Uploaded a blob or file!");
    });
  };

  const handleUpload = (e) => {
    e.preventDefault();
    upload(imageRef.current.files[0]);
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
    </>
  );
}

export default Test;
