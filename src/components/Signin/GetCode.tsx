import { useSetAtom } from "jotai";
import { createKakaoLoginToServerLoginConfig } from "../API/AxiosModule";
import { handleTokenResponse } from "./Signin";
import { SendMessage, lastMessage } from "../Chat/ChatRoom/ChatUtil";
import { useNavigate } from "react-router-dom";

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenCategory: string;
  firstLogin: boolean;
}
const ParamCode = () => {
  const url = new URL(window.location.href);
  console.log(url);
  console.log(url.searchParams);
  const codes = url.searchParams.get("code");
  const setSendMessage = useSetAtom(lastMessage);
  const navigate = useNavigate();
  console.log(codes);
  if (codes) {
    console.log(codes);
    const code = {
      code: codes,
    };
    createKakaoLoginToServerLoginConfig("POST", code)
      .then((response) => {
        const accessToken = response.data["accessToken"];
        const refreshToken = response.data["refreshToken"];
        const firstLogin = response.data["firstLogin"];
        const tokenResponse: TokenResponse = {
          accessToken: accessToken,
          refreshToken: refreshToken,
          tokenCategory: "default",
          firstLogin: firstLogin,
        };
        handleTokenResponse(tokenResponse, -1, -1, (message: SendMessage) => setSendMessage(message), navigate);
      })
      .catch((error) => {
        console.log("에러");
        console.error(error);
      });
  }

  return (
    <>
      <div></div>
    </>
  );
};

export default ParamCode;
