import React, { FC } from "react";
import { DateGroup } from "../../../types/AppTypes";
import SessionGroup from "./SessionGroup";
import "../../../assets/css/common/sessionsList.scss";

interface SessionsListProps {
  data: DateGroup[];
  onSessionClick: (sessionId: number) => void;
}

const SessionsList: FC<SessionsListProps> = ({ data, onSessionClick }) => {
  if (data.length === 0) {
    return (
      <div className="sessions-list-container">
        <p className="no-sessions">Нет доступных сеансов</p>
      </div>
    );
  }

  return (
    <div className="sessions-list-container">
      {data.map((group) => (
        <div key={group.date} className="date-group">
          <div className="date-label">{group.date}</div>
          {group.items.map((item) => (
            <SessionGroup
              key={item.id}
              item={item}
              onSessionClick={onSessionClick}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default SessionsList;
