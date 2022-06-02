import React, { useState, useEffect } from "react";

import {
  fetchUserInfoFromDB,
  updateUserInfo,
} from "../../../api_requests/hotel_requests";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import SettingsForm from "../Forms/SettingsForm/SettingsForm";
import { useStateValue } from "../../../StateProvider";
import ErrorComponent from "../../Error/Error";

const Settings = (props) => {
  const [user, setUser] = useState("");
  const [state] = useStateValue();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);

  const handleUpdateUserInfo = async (e, updateUsername, updatePassword) => {
    try {
      e.preventDefault();
      setIsSpinnerLoading(true);
      const updatedInfo = await updateUserInfo(
        props.user._id,
        updateUsername,
        updatePassword,
        state.token
      );

      // ---- Error Handler ---- //
      if (updatedInfo.error) {
        setErrorMessage(updatedInfo.error.msg);
        throw new Error(updatedInfo.error.msg);
      }
      const userInfo = await fetchUserInfoFromDB(props.user._id, state.token);

      // ---- Error Handler ---- //
      if (userInfo.error) {
        setErrorMessage(userInfo.error.msg);
        throw new Error(userInfo.error.msg);
      }
      setUser(userInfo);
      setIsSpinnerLoading(false);
    } catch (err) {
      setError(true);
    }
  };

  useEffect(() => {
    let controller = new AbortController();

    setIsSpinnerLoading(true);
    const exec = async () => {
      try{
        const data = await fetchUserInfoFromDB(props.user._id, state.token);

        // ---- Error Handler ---- //
        if (data.error) {
          setErrorMessage(data.error.msg);
          throw new Error(data.error.msg);
        }

        setUser(data);
        setIsSpinnerLoading(false);
      }catch(err){
        setError(true);
      }
    };
    exec();
    controller = null;
    return () => {
      controller?.abort();
    };
  }, [props.user._id]);

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
