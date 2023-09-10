import { useEffect, useState } from "react";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";

import { createLoginConfig } from "../API/AxiosModule";
import {
  getTokenExpiration,
  getUserId,
  isTokenValid,
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "../API/TokenAction";
import { SendMessage, lastMessage, socketAction } from "../Chat/ChatRoom/ChatUtil";
import { useSetAtom } from "jotai";

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenCategory: string;
  firstLogin: boolean;
}

const Signin = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  //const navigate: NavigateFunction = useNavigate();
  const redirect_uri = "https://iamnotalone.vercel.app/login/oauth2/code/kakao";
  const Rest_api_key = "f97c55d9d92ac41363b532958776d378";
  //const client_secret = "2y9KooWag1nZnGRfPeHbZeY8yiian4ty";
  const setSendMessage = useSetAtom(lastMessage);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("로그인");
    console.log("^^^^");
  }, []);

  const defaultSignin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    removeAccessToken();
    removeRefreshToken();
    const IDPW = {
      email: email,
      password: password,
    };

    createLoginConfig("POST", "login", IDPW)
      .then((response) => {
        console.log(response);
        const accessToken = response.data["Authorization"];
        const refreshToken = response.data["Authorization-refresh"];

        const tokenResponse: TokenResponse = {
          accessToken: accessToken,
          refreshToken: refreshToken,
          tokenCategory: "default",
          firstLogin: false,
        };

        handleTokenResponse(tokenResponse, -1, -1, (message: SendMessage) => setSendMessage(message), navigate);
      })
      .catch((error) => {
        console.log("에러");
        console.error(error);
      });
  };

  const kakaotalkSignIn = async () => {
    console.log("카카오로그인");

    await requestKakaoCode(redirect_uri, Rest_api_key);
  };

  const requestKakaoCode = async (redirect_uri: string, Rest_api_key: string) => {
    removeAccessToken();
    removeRefreshToken();
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${Rest_api_key}&redirect_uri=${redirect_uri}`;
    window.location.href = kakaoURL;
    setTimeout(() => {
      console.log("^^^");
    }, 3000);
  };

  // const handleAuthorizationCode = async() => {

  //   //console.log("^^^^");
  //   //const urlParams = new URLSearchParams(window.location.search);
  //   //console.log(urlParams);
  //   //const code = urlParams.get('code');
  //   const url = new URL(window.location.href);
  //   console.log(url);
  //   console.log(url.searchParams);
  //   const code = url.searchParams.get("code");
  //   console.log(code);
  //   if (code) {
  //     console.log(code);
  //     createKakaoLoginToServerLoginConfig("GET",code).then((response) => {
  //       console.log(response);
  //     })
  //   .catch((error)=>{
  //       console.log("에러")
  //       console.error(error);
  //     });
  //   }

  // };

  return (
    <div className="w-full h-screen pt-11 bg-main-100">
      <img className="mx-auto w-44" src="logo.png" alt="" />
      <form className="mt-11" action="">
        <div className="flex flex-col mt-5 items-center">
          <label htmlFor="input-email" className="w-9/12">
            이메일
          </label>
          <div className="flex w-9/12">
            <input type="email" id="input-email" className="w-full h-10" value={email} onChange={(e) => setEmail(e.target.value)} name="email" />
          </div>
        </div>
        <div className="flex flex-col mt-5 items-center">
          <label htmlFor="input-password" className=" w-9/12">
            비밀번호
          </label>
          <div className="flex w-9/12">
            <input
              type="password"
              id="input-password"
              className="w-full h-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
            />
          </div>
        </div>
      </form>
      <div className="bg-main-100">
        <button
          onClick={defaultSignin}
          type="submit"
          className=" flex items-center justify-center mx-auto rounded-none mt-4 py-2 w-9/12 bg-main-400 text-white"
        >
          로그인
        </button>
        <div className="flex justify-between w-9/12 items-center mx-auto mt-2 text-sm ">
          <Link to={"/findPassword"}>비밀번호찾기</Link>
          <Link to={"/Signup"}>회원가입</Link>
        </div>
        <img src="kakao_login_medium_wide.png" className="mx-auto mt-2 w-9/12" onClick={kakaotalkSignIn} />
      </div>
    </div>
  );
};

const handleTokenResponse = async (
  tokenResponse: TokenResponse,
  accessTokenExpire = -1,
  refreshTokenExpire = -1,
  setSendMessage: (m: SendMessage) => void,
  navigate: NavigateFunction
) => {
  console.log("token");
  if (tokenResponse.accessToken && tokenResponse.refreshToken) {
    setAccessToken(tokenResponse.accessToken);
    setRefreshToken(tokenResponse.refreshToken);
    localStorage.setItem("tokenCategory", tokenResponse.tokenCategory);
    getTokenExpiration("accessToken", accessTokenExpire);
    getTokenExpiration("refreshToken", refreshTokenExpire);

    const isTokenValidResponse = await isTokenValid();
    if (isTokenValidResponse === true) {
      if (tokenResponse.firstLogin === true) {
        const userId = getUserId();
        navigate(`/socialsignup/${userId}`);
        //window.location.href = `http://localhost:5173/socialsignup/${userId}`;
      } else {
        await socketAction(setSendMessage);
        navigate("/main");
        //window.location.href = "https://iamnotalone.vercel.app/main";
      }
    }
  }
};
export { handleTokenResponse, Signin };
