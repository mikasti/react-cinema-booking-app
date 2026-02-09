import React, { ChangeEvent, FormEvent, memo, useState, FC } from "react";

interface AuthFormProps {
  isRegistered: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  onSubmit: (credentials: {
    username: string;
    password: string;
  }) => Promise<void>;
}

const AuthForm: FC<AuthFormProps> = memo(
  ({ isRegistered, error, setError, onSubmit }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const validate = () => {
      if (username.length < 8) return "Username must be at least 8 characters";
      if (password.length < 8) return "Password must be at least 8 characters";
      if (!/[A-Z]/.test(password))
        return "Password must contain at least one uppercase letter";
      if (!/\d/.test(password))
        return "Password must contain at least one digit";

      if (isRegistered) {
        if (password !== confirmPassword) return "Passwords do not match";
      }
      return null;
    };

    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      setError(null);

      const validationError = validate();
      if (validationError) {
        setError(validationError);
        return;
      }

      await onSubmit({ username, password });
    };

    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
      setUsername(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
    };
    const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
      setConfirmPassword(e.target.value);
    };

    return (
      <form onSubmit={handleSubmit}>
        <div className="auth-form-fields">
          <div className="form-group">
            <label>Логин</label>
            <input
              type="text"
              placeholder="Введите логин"
              value={username}
              onChange={handleUsernameChange}
            />
          </div>

          <div className="form-group">
            <label>Пароль</label>
            <input
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>

          {isRegistered && (
            <div className="form-group">
              <label>Повторите пароль</label>
              <input
                type="password"
                placeholder="Повторите пароль"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
            </div>
          )}

          {error && <div className="server-error">{error}</div>}

          <button type="submit" className="submit-button">
            {isRegistered ? "Зарегистрироваться" : "Войти"}
          </button>
        </div>
      </form>
    );
  },
);

export default AuthForm;
