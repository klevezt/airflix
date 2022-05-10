import React from "react";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const TableCardTypography = (props) => {
  const { t } = useTranslation();

  return (
    <div>
      <Typography
        className="typography-container"
        style={{
          paddingTop: 10,
          borderBottom: "1px solid rgb(212, 212, 212)",
        }}
        color="textSecondary"
        gutterBottom
      >
        {t(props.food)}: {props.data === undefined ? 0 : props.data.length}
      </Typography>
    </div>
  );
};

export default TableCardTypography;
