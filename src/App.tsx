import React, { FC, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./assets/css/common/global.scss";
import routerSetup from "./routes/RouterSetup";
import { cinemaApi } from "./api/cinemaApi";

const App: FC = () => {
  useEffect(() => {
    cinemaApi.setGlobalErrorHandler(() => {
      routerSetup.navigate("/error");
    });
  }, []);

  return (
    <AuthProvider>
      <RouterProvider router={routerSetup} />
    </AuthProvider>
  );
};

export default App;
