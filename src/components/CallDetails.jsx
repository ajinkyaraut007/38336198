import React, { Fragment } from "react";
import moment from "moment";

const CallDetails = ({ callDetail }) => {
  return (
    <Fragment>
      <div className="callDetailsTag mb-2 fw-semibold">Call Details</div>

      <p>{callDetail.via ? `via ${callDetail.via}` : ""}</p>
      <p>
        {callDetail.call_type ? `${callDetail.call_type} call, ` : ""}
        {Math.floor(callDetail.duration / 60)} minutes
      </p>
      <p>{moment(callDetail.created_at).format("hh:mm A")}</p>
      <p>{moment(callDetail.created_at).format("MMMM, Do YYYY")}</p>
      <p>{callDetail.direction ? `${callDetail.direction} call` : ""}</p>
    </Fragment>
  );
};

export default CallDetails;
