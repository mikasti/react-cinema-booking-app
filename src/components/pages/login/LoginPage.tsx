import React, { FC } from "react";
import { useAuthForm } from "../../../hooks/useAuthForm";
import AuthForm from "./components/AuthForm";
import "../../../assets/css/login/loginPage.scss";

const LoginPage: FC = () => {
  const { isUserRegistered, error, setError, submitAuth, toggleMode } =
    useAuthForm();

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>{isUserRegistered ? "Регистрация" : "Вход"}</h1>

        <AuthForm
          isRegistered={isUserRegistered}
          error={error}
          setError={setError}
          onSubmit={submitAuth}
        />

        <div className="toggle-auth">
          {isUserRegistered ? "Уже есть аккаунт?" : "Если у вас нет аккаунта"}
          <button className="link-button" onClick={toggleMode}>
            {isUserRegistered ? "войдите" : "зарегистрируйтесь"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
