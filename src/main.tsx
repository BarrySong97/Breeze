import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import WorkSpace from "./pages/workspace";
import App from "./App";
import "./index.css";
import "@douyinfe/semi-ui/dist/css/semi.min.css";
import Login from "./pages/Login";
import { AuthProvider, RequireAuth } from "./auth";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <App />
      </AuthProvider>
    ),
    // loader: rootLoader,
    children: [
      {
        path: "workspace",
        element: (
          <RequireAuth>
            <WorkSpace />
          </RequireAuth>
        ),
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterProvider router={router} />
);
