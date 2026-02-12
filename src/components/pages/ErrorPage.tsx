import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/common/errorPage.scss";

const ErrorPage: FC = () => {
  const navigate = useNavigate();

  const handleReload = () => {
    navigate("/movies");
  };

  return (
    <div className="error-page">
      <div className="error-content">
        <h1>Что-то пошло не так</h1>
        <p>
          Произошла ошибка при загрузке данных. Пожалуйста, попробуйте позже.
        </p>
        <button onClick={handleReload} className="reload-button">
          На главную
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
