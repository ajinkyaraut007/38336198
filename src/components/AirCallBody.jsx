import React, { useState, useEffect } from "react";

import CallLogsList from "./CallLogsList.jsx";
import api from "../utils/api.js";
import { showToast } from "../utils/common.js";

const AirCallBody = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isArchiveTab, setIsArchiveTab] = useState(false);
  const [callActivity, setCallActivity] = useState({
    data: {},
    total: { inbox: 0, archive: 0 },
  });

  useEffect(() => {
    fetchCallActivity();
  }, []);

  const fetchCallActivity = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("activities");
      const tempCallActivity = res.data
        .filter((obj) => !!obj.from)
        .reverse()
        .reduce(
          (obj, log) => {
            const date = log.created_at.split("T")[0];
            if (!obj.data[date]) {
              obj.data[date] = [];
            }
            obj.data[date].push(log);

            if (log.is_archived) {
              obj.total.archive += 1;
            } else {
              obj.total.inbox += 1;
            }
            return obj;
          },
          { data: {}, total: { inbox: 0, archive: 0 } }
        );
      setCallActivity(tempCallActivity);
    } catch (e) {
      showToast("Something went wrong!");
    }
    setIsLoading(false);
  };

  return (
    <div className="border-top border-dark-subtle py-3 airCallBodyContainer">
      <div className="row justify-content-around callLognavBar mb-3">
        <div
          className={`p-3 col-5 d-flex justify-content-center align-items-center rounded ${
            !isArchiveTab ? "activeInbox" : ""
          }`}
          onClick={() => setIsArchiveTab(false)}
        >
          Inbox{" "}
          {callActivity.total.inbox ? `(${callActivity.total.inbox})` : ""}
        </div>
        <div
          className={`p-3 col-5 d-flex justify-content-center align-items-center rounded ${
            !isArchiveTab ? "" : "activeArchives"
          }`}
          onClick={() => setIsArchiveTab(true)}
        >
          Archive{" "}
          {callActivity.total.archive ? `(${callActivity.total.archive})` : ""}
        </div>
      </div>

      <CallLogsList
        isLoading={isLoading}
        isArchiveTab={isArchiveTab}
        callActivity={callActivity}
        fetchCallActivity={fetchCallActivity}
      />
    </div>
  );
};

export default AirCallBody;
