import React from "react";
import SelectDropdownOptionsCard from "./SelectDropdownOptionsCard";

const SelectDropdownCard = (props) => {
  return (
    <select
      onChange={props.onChange}
      key={props.index}
      className={"form-select form-select-inline"}
      value={props.item}
      name={props.item}
      id={props.item}
    >
      <SelectDropdownOptionsCard
        options={props.optionsSelect}
        food={props.food}
        item={props.item}
      />
    </select>
  );
};

export default SelectDropdownCard;
