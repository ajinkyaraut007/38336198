import React, { useState } from "react";
import moment from "moment";
import { MdArchive, MdUnarchive, MdPhoneMissed } from "react-icons/md";
import { FaVoicemail } from "react-icons/fa";
import { BsDashLg } from "react-icons/bs";
import { HiPhoneIncoming, HiPhoneOutgoing } from "react-icons/hi";

import Shimmer from "./Shimmer.jsx";
import CallDetails from "./CallDetails.jsx";
import { showToast } from "../utils/common.js";
import api from "../utils/api.js";

const CallCard = ({
  data,
  activeCallLog,
  setActiveCallLog,
  fetchCallActivity,
}) => {
  const {
    id: callLogId,
    from = "Unknown",
    to = "unknown",
    via,
    direction,
    call_type,
    is_archived,
    created_at,
  } = data;

  const [archiveIconVisible, setArchiveIconVisible] = useState(null);
  const [isDetailLoading, setDetailLoading] = useState(false);
  const [callDetail, setCallDetail] = useState({});

  const handleExpand = () => {
    setActiveCallLog((prevActiveCallLog) =>
      prevActiveCallLog === callLogId ? null : callLogId
    );

    if (Object.keys(callDetail).length === 0 || callDetail.id !== callLogId)
      fetchCallDetails();
  };

  const fetchCallDetails = async () => {
    setDetailLoading(true);
    try {
      const res = await api.get(`activities/${callLogId}`);
      setCallDetail(res.data);
    } catch (e) {
      showToast(`Something went wrong`, "failure");
    }
    setDetailLoading(false);
  };

  const Icon = () => {
    if (!direction || !call_type) return <BsDashLg />;

    if (direction === "inbound") {
      if (call_type === "voicemail") {
        return <FaVoicemail size={25} />;
      } else if (call_type === "missed") {
        return <MdPhoneMissed size={25} />;
      } else {
        return <HiPhoneIncoming size={25} />;
      }
    } else if (direction === "outbound") {
      return <HiPhoneOutgoing size={25} />;
    }

    return <BsDashLg />;
  };

  const handleArchiveUnarchive = async (e) => {
    e.stopPropagation();
    try {
      const res = await api.patch(`activities/${callLogId}`, {
        is_archived: !is_archived,
      });
      fetchCallActivity();
      showToast(`Successfully ${is_archived ? "unarchived" : "archived"} call`);
    } catch (e) {
      showToast(`Something went wrong`, "failure");
    }
  };

  return (
    <React.Fragment>
      <div
        className="m-3 p-3 callCard bg-white rounded-3"
        onClick={() => handleExpand()}
        onMouseEnter={() => setArchiveIconVisible(callLogId)}
        onMouseLeave={() => setArchiveIconVisible(null)}
      >
        <div className="d-flex justify-content-between">
          <div className="d-flex">
            <div className="me-3 d-flex align-items-center">
              <Icon />
            </div>

            <div>
              <div
                className={`p-1 ${
                  call_type === "missed" ? "missedCall" : "regularCall"
                }`}
              >
                {from ? from : "Unknown"}
              </div>

              <div className="p-1 text-secondary">
                {call_type === "missed"
                  ? "Call missed on " + to
                  : call_type === "voicemail"
                  ? "On " + to
                  : call_type === "answered"
                  ? "Answered by " + to
                  : direction === "outbound"
                  ? "Made by " + to
                  : ""}
              </div>
            </div>
          </div>
          <div className="d-flex flex-column align-items-end fs-6 text-secondary">
            {moment(created_at).format("hh:mm A")}
            {archiveIconVisible === callLogId && (
              <span title={is_archived ? "Unarchive" : "Archive"}>
                {is_archived ? (
                  <MdUnarchive
                    className="archiveLogo"
                    size={25}
                    onClick={(e) => handleArchiveUnarchive(e)}
                  />
                ) : (
                  <MdArchive
                    className="archiveLogo"
                    size={25}
                    onClick={(e) => handleArchiveUnarchive(e)}
                  />
                )}
              </span>
            )}
          </div>
        </div>

        {activeCallLog === callLogId && (
          <div className="detailsSection border-top bg-light rounded p-3 mt-2">
            {isDetailLoading ? (
              <Shimmer variant="detailsSkeleton" />
            ) : (
              <CallDetails callDetail={callDetail} />
            )}
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default CallCard;
