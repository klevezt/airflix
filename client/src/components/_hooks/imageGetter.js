import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";

const imageGetter = (services) => {
  var loading = true;
  var error = false;

  var arr = [];
  services.map((imageArr) => {
    const storageRef = ref(storage, imageArr.image);
    getDownloadURL(storageRef)
      .then((image) => arr.push({ ...imageArr, image }))
      .catch((e) => {
        console.log(e);
        error = true;
      })
      .finally(() => (loading = false));
  });
  return { arr, error, loading };
};

export default imageGetter;
