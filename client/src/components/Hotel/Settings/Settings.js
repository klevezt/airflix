import React, { useState, useEffect } from "react";
import SettingsForm from "../Forms/SettingsForm/SettingsForm";

import {
  fetchUserInfoFromDB,
  updateUserInfo,
} from "../../../api_requests/hotel_requests";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import { useStateValue } from "../../../StateProvider";

const Settings = (props) => {
  const [state] = useStateValue();

  const [user, setUser] = useState("");
  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);

  const handleUpdateUserInfo = async (e, updateUsername, updatePassword) => {
    e.preventDefault();
    setIsSpinnerLoading(true);
    await updateUserInfo(
      props.user._id,
      updateUsername,
      updatePassword,
      state.token
    );
    await fetchUserInfoFromDB(props.user._id, state.token).then((data) => {
      setUser(data);
      setIsSpinnerLoading(false);
    });
  };

  useEffect(() => {
    let controller = new AbortController();

    setIsSpinnerLoading(true);
    const exec = async () => {
      await fetchUserInfoFromDB(props.user._id, state.token).then((data) => {
        setUser(data);
        setIsSpinnerLoading(false);
      });
    };
    exec();
    controller = null;
    return () => {
      controller?.abort();
    };
  }, []);

  return (
    <>
      {isSpinnerLoading && <LoadingSpinner />}
      {!isSpinnerLoading && (
        <SettingsForm user={user} handleUpdateUserInfo={handleUpdateUserInfo} />
      )}
    </>
  );
};

export default Settings;
