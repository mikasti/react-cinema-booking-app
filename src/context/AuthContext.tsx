import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
  FC,
} from "react";
import { ILoginRequest, TRegisterRequest } from "../types/AppTypes";
import { cinemaApi } from "../api/cinemaApi";

interface AuthContextType {
  isAuth: boolean;
  login: (data: ILoginRequest) => Promise<void>;
  register: (data: TRegisterRequest) => Promise<void>;
  logout: () => void;

}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuth, setIsAuth] = useState<boolean>(!!localStorage.getItem("token"));

  const login = useCallback(async (data: ILoginRequest) => {
    try {
      const response = await cinemaApi.login(data);
      localStorage.setItem("token", response.token);
      setIsAuth(true);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }, []);

  const register = useCallback(async (data: TRegisterRequest) => {
    try {
      const response = await cinemaApi.register(data);
      localStorage.setItem("token", response.token);
      setIsAuth(true);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setIsAuth(false);
  }, []);

  const value = useMemo(
    () => ({ isAuth, login, register, logout }),
    [isAuth, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
