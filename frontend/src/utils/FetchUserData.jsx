import axios from "axios";
import Cookies from "js-cookie";

const FetchUserData = async () => {
  const accessToken = Cookies.get();

  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/user/profile`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (error) {
    console.log(error);

    return null;
  }
};

export default FetchUserData;
