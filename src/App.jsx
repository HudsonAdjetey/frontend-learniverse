// App.js
import React, { useEffect } from "react";
import {
  RouterProvider,
  Outlet,
  createBrowserRouter,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import ErrorBoundary from "./container/pages/ErrorBoundary";
import ToastContainers from "./components/toastify/ToastContainer";

// routes.js
const authRequiredRoutes = [
  { path: "/account", element: <Account /> },
  { path: "/classes", element: <Classes /> },
  { path: "/student", element: <Student /> },
  { path: "/schedule-class", element: <ScheduleClass /> },
  { path: "/subscription", element: <Subscription /> },
  { path: "/settings", element: <Settings /> },
];

const publicRoutes = [
  { path: "/home", element: <Landing /> },
  // Add other public routes if needed
];

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.user);

  useEffect(() => {
    if (!loading && user === null) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  return children;
};

const Layout = ({ isAdmin }) => {
  return (
    <section className="container">
      {isAdmin ? <Navbar /> : <Navbar2 />}
      <Outlet />
    </section>
  );
};

const App = () => {
  const { user } = useSelector((state) => state.user);
  const isAdmin = user && user.val === import.meta.env.VITE_VAL;

  const router = createBrowserRouter([
    ...authRequiredRoutes.map((route) => ({
      ...route,
      element: <AuthGuard>{route.element}</AuthGuard>,
    })),
    ...publicRoutes,
    {
      path: "/",
      element: (
        <ErrorBoundary>
          <Layout isAdmin={isAdmin} />
        </ErrorBoundary>
      ),
      children: [
        {
          path: "/",
          element: isAdmin ? <AdminHome /> : <Home />,
        },
        ...authRequiredRoutes,
        {
          path: "*",
          element: <ErrorPage />,
        },
      ],
    },
  ]);

  return (
    <>
      <ToastContainers />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
