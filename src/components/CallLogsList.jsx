import React, { Fragment, useState } from "react";
import { BiSolidArchiveIn, BiSolidArchiveOut } from "react-icons/bi";
import moment from "moment";

import Shimmer from "./Shimmer.jsx";
import CallCard from "./CallCard.jsx";
import api from "../utils/api.js";
import { showToast } from "../utils/common.js";

const CallLogsList = ({
  isLoading,
  isArchiveTab,
  callActivity,
  fetchCallActivity,
}) => {
  const [activeCallLog, setActiveCallLog] = useState(null);

  const handleArchiveOrUnarchiveAll = async () => {
    try {
      if (!isArchiveTab) {
        const promiseArray = Object.values(callActivity.data)
          .reduce((arr, logs) => arr.concat(logs), [])
          .map((obj) =>
            api.patch(`activities/${obj.id}`, {
              is_archived: !isArchiveTab,
            })
          );
        const res = await Promise.allSettled(promiseArray);
      } else {
        const res = await api.patch("/reset");
      }
      showToast(
        `Successfully ${
          isArchiveTab ? "unarchived" : "archived"
        } all call records`
      );

      fetchCallActivity();
    } catch (e) {
      showToast(`Something went wrong`, "failure");
    }
  };

  if (isLoading) return <Shimmer variant="cardSkeleton" />;

  if (
    isArchiveTab
      ? callActivity.total.archive === 0
      : callActivity.total.inbox === 0
  )
    return (
      <div className="bg-secondary-subtle rounded text-center text-muted p-5 mt-4">
        No Call Records 
      </div>
    );

  return (
    <Fragment>
      <span title={isArchiveTab ? "Unarchive All" : "Archive All"}>
        <div
          className="d-flex justify-content-end archiveUnarchiveTag"
          onClick={handleArchiveOrUnarchiveAll}
        >
          {isArchiveTab ? (
            <BiSolidArchiveOut size={25} />
          ) : (
            <BiSolidArchiveIn size={25} />
          )}
        </div>
      </span>

      <div className="callLogsCardContainer overflow-y-auto rounded">
        {Object.keys(callActivity.data).map((date, index) => {
          const data = callActivity.data[date].filter(
            (obj) => obj.is_archived === isArchiveTab
          );

          return data.length === 0 ? null : (
            <Fragment key={index}>
              <div className="text-center text-muted fw-bold">
                {moment(date).format("MMM D, YYYY")}
              </div>
              {data.map((callLog) => (
                <CallCard
                  key={callLog.id}
                  data={callLog}
                  activeCallLog={activeCallLog}
                  setActiveCallLog={setActiveCallLog}
                  fetchCallActivity={fetchCallActivity}
                />
              ))}
            </Fragment>
          );
        })}
      </div>
    </Fragment>
  );
};
export default CallLogsList;
