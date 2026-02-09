import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export const useAuthForm = () => {
  const navigate = useNavigate();
  const { login, register } = useAuthContext();

  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitAuth = useCallback(
    async (credentials: { username: string; password: string }) => {
      setError(null);

      const currentIsRegistered = isRegistered;

      try {
        if (currentIsRegistered) {
          await register(credentials);
        } else {
          await login(credentials);
        }
        navigate("/tickets");
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Registration failed";

        if (!currentIsRegistered) {
          setError(
            "Неверный логин или пароль. Проверьте введенные данные и попробуйте снова",
          );
        } else {
          setError(errorMessage);
        }
      }
    },
    [isRegistered, register, login, navigate],
  );

  const toggleMode = useCallback(() => {
    setIsRegistered((prev) => !prev);
    setError(null);
  }, []);

  return useMemo(
    () => ({
      isUserRegistered: isRegistered,
      error,
      setError,
      submitAuth,
      toggleMode,
    }),
    [isRegistered, error, submitAuth, toggleMode],
  );
};
