import React, { FC, useMemo } from "react";
import { SessionGroupItem } from "../../../types/AppTypes";
import { formatTime } from "../../../utils/dateUtils";
import "../../../assets/css/common/sessionsList.scss";

interface SessionGroupProps {
  item: SessionGroupItem;
  onSessionClick: (sessionId: number) => void;
}

const SessionGroup: FC<SessionGroupProps> = ({ item, onSessionClick }) => {
  const sortedSessions = useMemo(() => {
    return [...item.sessions].sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );
  }, [item.sessions]);

  return (
    <div className="session-group-card">
      <div
        className={`group-title ${item.onTitleClick ? "clickable" : ""}`}
        onClick={item.onTitleClick}
      >
        {item.title}
        {item.subtitle && (
          <span
            style={{
              fontSize: "0.9em",
              color: "rgba(255, 255, 255, 0.6)",
              marginLeft: "10px",
              fontWeight: "normal",
            }}
          >
            {item.subtitle}
          </span>
        )}
      </div>

      <div className="times-list">
        {sortedSessions.map((session) => (
          <SessionButton
            key={session.id}
            session={session}
            onClick={onSessionClick}
          />
        ))}
      </div>
    </div >
  );
};

interface SessionButtonProps {
  session: { id: number; startTime: string };
  onClick: (id: number) => void;
}

const SessionButton: FC<SessionButtonProps> = ({ session, onClick }) => {
  const handleClick = () => {
    onClick(session.id);
  };

  return (
    <button className="time-chip" onClick={handleClick}>
      {formatTime(session.startTime)}
    </button>
  );
};

export default SessionGroup;
