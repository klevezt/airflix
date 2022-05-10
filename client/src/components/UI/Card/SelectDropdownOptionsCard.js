import React from "react";
import { useTranslation } from "react-i18next";

const SelectDropdownOptionsCard = (props) => {
  const { t } = useTranslation();
  return (
    <>
      <option value="">{t("default_select_option")}</option>
      {props.options !== undefined &&
        props.options.map((soup, j) => {
          return (
            soup.type === t(props.food) && (
              <option
                defaultChecked={soup.name === props.item}
                value={soup.name}
                key={j}
              >
                {soup.name}
              </option>
            )
          );
        })}
    </>
  );
};

export default SelectDropdownOptionsCard;
