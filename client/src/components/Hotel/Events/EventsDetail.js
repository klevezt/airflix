import React from "react";
import { useParams, useHistory } from "react-router-dom";

function EventsDetail() {
  const params = useParams();

  return <div>{params.eventAlias}</div>;
}

export default EventsDetail;
