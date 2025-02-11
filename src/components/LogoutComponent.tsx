import axios from "axios";

export const logout = async (setAuth: (auth: boolean) => void) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {}, { withCredentials: true });
      setAuth(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };