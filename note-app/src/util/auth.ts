import axios from "axios";
import { User } from "../types/User";

const auth = () => {
  const signup = async (user: User) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/signup`, {
      email: user.email,
      password: user.password,
    });
    return res;
  };
  const login = async (user: User) => {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/login`,
      {
        email: user.email,
        password: user.password,
      }
      // {withCredentials: true,}
    );
    return res;
  };
  const logout = async () => {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/logout`
      // {withCredentials: true}
    );
    return res;
  };
  return { signup, login, logout };
};

export default auth;