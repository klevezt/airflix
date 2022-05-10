import React, { useState, useEffect } from "react";

import {
  fetchUserInfoFromDB,
  updateUserInfo,
} from "../../../api_requests/hotel_requests";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import SettingsForm from "../Forms/SettingsForm/SettingsForm";
import { useStateValue } from "../../../StateProvider";

const Settings = (props) => {
  const [user, setUser] = useState("");
  const [state] = useStateValue();

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
  }, [props.user._id]);

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
