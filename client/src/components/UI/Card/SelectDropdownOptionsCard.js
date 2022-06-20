import React from "react";
import { useTranslation } from "react-i18next";

const SelectDropdownOptionsCard = (props) => {
  const { t } = useTranslation();
  return (
    <>
      <option value="">{t("default_select_option")}</option>
      {props.options !== undefined &&
        props.options.map((opt, j) => {
          return (
            opt.type === props.food && (
              <option
                defaultChecked={opt.name === props.item}
                value={opt.name}
                key={j}
              >
                {opt.name}
              </option>
            )
          );
        })}
    </>
  );
};

export default SelectDropdownOptionsCard;
