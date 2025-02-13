import axios from "axios";
import { useDispatch } from "react-redux";

import { logout } from "../store/slices/authSlice";

const Logout = () => {
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/logout`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      localStorage.clear();
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      dispatch(logout());
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <button
        onClick={logoutHandler}
        className="px-3 pt-1 pb-2 rounded bg-amber-300 text-black cursor-pointer"
      >
        Logout
      </button>
    </>
  );
};

export default Logout;
