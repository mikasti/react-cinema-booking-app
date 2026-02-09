import React, { FC } from "react";
import "../../assets/css/common/loader.scss";

interface LoaderProps {
  message?: string;
}

const Loader: FC<LoaderProps> = ({ message = "Загрузка..." }) => {
  return (
    <div className="loader-container">
      <div className="loader-spinner"></div>
      {message && <p className="loader-message">{message}</p>}
    </div>
  );
};

export default Loader;
