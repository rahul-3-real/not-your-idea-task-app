import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";

import { login, setLoading } from "./store/slices/authSlice";
import { hideAlert } from "./store/slices/alertSlice";
import { AuthLayout, DashboardLayout } from "./layouts";
import FetchUserData from "./utils/FetchUserData";
import ProtectedRoute from "./utils/ProtectedRoute";
import {
  Login,
  Register,
  Tasks,
  CreateTask,
  UpdateTask,
  DetailTask,
} from "./pages";
import { Alert } from "./components";

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const alert = useSelector((state) => state.alert);

  // Close Alert Handler
  const handleCloseAlert = () => {
    dispatch(hideAlert());
  };

  useEffect(() => {
    const initializeUser = async () => {
      dispatch(setLoading(true));
      const token = localStorage.getItem("authToken");

      if (token) {
        try {
          const userData = await FetchUserData();
          if (userData) {
            dispatch(
              login({
                isAuthenticated: true,
                loading: false,
                user: userData,
                error: null,
              })
            );
          } else {
            dispatch(setLoading(false));
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          dispatch(setLoading(false));
        }
      } else {
        dispatch(setLoading(false));
      }
    };

    initializeUser();
  }, [dispatch]);

  if (loading) {
    return <p className="text-white">Loading...</p>;
  }

  return (
    <>
      {alert.visible && (
        <Alert
          className={`alert-${alert.type}`}
          message={alert.message}
          onClose={handleCloseAlert}
        />
      )}

      <Router>
        <Routes>
          {/* Authentication Routes */}
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/" /> : <AuthLayout />}
          >
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Tasks />} />
            <Route path="create" element={<CreateTask />} />
            <Route path=":id" element={<DetailTask />}>
              <Route path="update" element={<UpdateTask />} />
            </Route>
          </Route>

          {/* Catch-All Route (Redirect to Dashboard if Authenticated) */}
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? "/" : "/login"} />}
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;
