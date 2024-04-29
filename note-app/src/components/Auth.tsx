import { FaUserPlus } from "react-icons/fa";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import auth from "../util/auth";
import useError from "../hooks/useError";
import { User } from "../types/User";

const Auth = () => {
  const [isLoginDisp, setIsLoginDist] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { signup, login } = auth();
  const { switchErrorHandling } = useError();

  const sendUserForm = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoginDisp) {
      // ログイン
      const doLogin = async () => {
        try {
					const user: User = {
						email: email, 
						password: password
					}
          await login(user);

          //************************
          // ログインが成功したのちにどのパスに飛ばすか以下で指定
          //************************
          navigate("/note");
        } catch (err:any) {
          if (err.response.data.message) {
            // csrf,jwtミドルウェア系のエラーはmessageに入る
            switchErrorHandling(err.response.data.message);
          } else {
            switchErrorHandling(err.response.data);
          }
        }
      };
      doLogin();
    } else {
      // 登録
      const doSignup = async () => {
        try {
					const user: User = {
						email: email, 
						password: password
					}
          await signup(user);
          await login(user);
          navigate("/search");
        } catch (err:any) {
          if (err.response.data.message) {
            // csrf,jwtミドルウェア系のエラーはmessageに入る
            switchErrorHandling(err.response.data.message);
          } else {
            switchErrorHandling(err.response.data);
          }
        }
      };
      doSignup();
    }
  };
  return (
    <div className="flex justify-center mt-10">
      <div className="w-full max-w-xs">
        <form
          className="bg-slate-200 shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={(e:React.FormEvent<HTMLFormElement>) => sendUserForm(e)}
        >
          <h4 className="text-center text-2xl">
            {isLoginDisp ? (
              <span>ログイン画面</span>
            ) : (
              <span>ユーザー登録</span>
            )}
          </h4>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              E-Mail
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="text"
              placeholder="xxx@test.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            {/* <input className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
						id="password" type="password" placeholder="******************" onChange={(e) => {setPassword(e.target.value)}} />
						<p className="text-red-500 text-xs italic">Please choose a password.</p> */}
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div className="flex justify-center items-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              {isLoginDisp ? "Login" : "SignUp"}
            </button>
          </div>
          <div className="flex justify-center mt-5">
            {isLoginDisp ? (
              <FaUserPlus
                onClick={() => {
                  setIsLoginDist((prev) => !prev);
                }}
                className="cursor-pointer"
              />
            ) : (
              <FaArrowRightFromBracket
                onClick={() => {
                  setIsLoginDist((prev) => !prev);
                }}
                className="cursor-pointer"
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;