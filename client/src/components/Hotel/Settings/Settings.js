import React, { useState, useEffect } from "react";
import SettingsForm from "../Forms/SettingsForm/SettingsForm";

import {
  fetchUserInfoFromDB,
  updateUserInfo,
} from "../../../api_requests/hotel_requests";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import { useStateValue } from "../../../StateProvider";
import ErrorComponent from "../../Error/Error";

const Settings = (props) => {
  const [state] = useStateValue();

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

  const [user, setUser] = useState("");
  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);

  const handleUpdateUserInfo = async (e, updateUsername, updatePassword) => {
    e.preventDefault();
    setIsSpinnerLoading(true);
    try {
      await updateUserInfo(
        props.user._id,
        updateUsername,
        updatePassword,
        state.token
      );
      const data = await fetchUserInfoFromDB(props.user._id, state.token);
      // ---- Error Handler ---- //
      if (data.error) {
        setErrorMessage(data.error.msg);
        throw new Error(data.error.msg);
      }

      setUser(data);
      setIsSpinnerLoading(false);
    } catch (err) {
      setError(true);
      setIsSpinnerLoading(false);
    }
  };

  useEffect(() => {
    let controller = new AbortController();

    setIsSpinnerLoading(true);
    const exec = async () => {
      const data = await fetchUserInfoFromDB(props.user._id, state.token);
      // ---- Error Handler ---- //
      if (data.error) {
        setErrorMessage(data.error.msg);
        throw new Error(data.error.msg);
      }

      setUser(data);
      setIsSpinnerLoading(false);
    };
    exec();
    controller = null;
    return () => controller?.abort();
  }, []);

  return (
    <>
      {!error && isSpinnerLoading && <LoadingSpinner />}
      {error && <ErrorComponent errorMessage={errorMessage} />}
      {!error && !isSpinnerLoading && (
        <SettingsForm user={user} handleUpdateUserInfo={handleUpdateUserInfo} />
      )}
    </>
  );
};

export default Settings;
