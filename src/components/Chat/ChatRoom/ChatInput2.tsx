import { Frame, StompHeaders, StompSubscription } from "@stomp/stompjs";

import React, { useEffect, useRef } from "react";

import { getAccessToken, getUserId, isTokenValid } from "../../API/TokenAction";

import { Message } from "./ChatUtil";

import { partnerInfo } from "../../../pages/Chat/ChatRoomPage";
import { useParams } from "react-router-dom";

import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs";
import axios from "axios";

interface sendMessage {
  chatRoomId: number;
  senderId: number;
  receiverId: number;
  message: string;
  createdAt: string;
}
interface ChatUtil {
  getChats: () => Message[];
  updateChats: (newChats: Message[]) => void; 
}

const ChatInput2 = ({ chatUtil, partnerInfomation }: { chatUtil: ChatUtil; partnerInfomation: partnerInfo }) => {
  const newChatRef = useRef<HTMLInputElement>(null);
  const { getChats, updateChats } = chatUtil;
  let subscription: StompSubscription | null | undefined = null;
  // const client = connectSocket(); //이건 원래 여기서 하는게 아님(소켓연결 자체는 로그인 하자마자 함)

  const roomId = Number(useParams().chatRoomId);

  const userId = getUserId();
  //const userId =11;
  //console.log(roomId)
  const token = getAccessToken();

  // const client = Stomp.over(function () {
  //       return new SockJS("http://localhost:8080/ws");
  //   });

  //   여기서 한번더 소켓연결을 하지않으면 두가지문제가 있다
  // 첫번째: 채팅방을 들어갔을때 이게 로그인했을때 구독했던방인지 아닌지 구분해야 한다.
  // 이건 가능한데 그다음에 updatechats를 적용할수가없다.(로그인했을때 구독은 updatechats를 하지않는다 그 이유는 updatechats를 기존로그인할떄 하면 기존 채팅기록 가져오면서 로그인 이후에 왔던 채팅들은 두개씩 기록된다)

  // 두번째:connect랑 subscribe를 붙이지 않으면 connect가 자꾸 끊긴다.

  const client = useRef(
    Stomp.over(function () {
      return new SockJS("https://www.imnotalone.online/ws");
    })
  );

  useEffect(() => {
    // console.log("채팅방입장")
    const connectSocket = () => {
      client.current.connect(
        {
          Authorization: `${token}`,
        },
        (frame: Frame) => {
          if (frame.headers && frame.headers["error"]) {
            const errorCode = frame.headers["error"];
            console.error(`Socket connection failed with error code: ${errorCode}`);
            return;
          }

          subscription = client.current.subscribe(
            `/sub/room/${roomId}`,
            (arrivalChat) => {
              const newMessage = JSON.parse(arrivalChat.body) as Message;
              updateChats([newMessage]);
            },
            {
              Authorization: `${token}`,
            }
          );
        }
      );
    };

    connectSocket();

    return () => {
      console.log("채팅방나감");
      if (client.current) {
        subscription?.unsubscribe();
        client.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    console.log("채팅방입장 3");
    const checkTokenValidity = async () => {
      const isValid = await isTokenValid();
      if (isValid) {
        axios({
          method: "get",
          url: `https://www.imnotalone.online/api/chat/room/${roomId}`,
          headers: {
            Authorization: `${token}`,
          },
        })
          .then((response) => {
            console.log("이전기록요청성공!!");

            updateChats(response.data);
            console.log(getChats());
          })
          .catch((error) => {
            console.error(error);
          });
        console.log("^^^^^^^^^^^^^^^^");
        console.log(getChats());
      }
    };

    checkTokenValidity();
  }, []);

  const sendMessage = () => {
    if (newChatRef.current && newChatRef.current.value !== "" && roomId) {
      const now = new Date();
      const inputValue = newChatRef.current.value;

      const messageData: sendMessage = {
        chatRoomId: roomId,
        senderId: userId,
        receiverId: partnerInfomation.membershipId,
        message: inputValue,
        createdAt: new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString(),
      };
      console.log(messageData);
      const headers = new StompHeaders();
      headers["content-type"] = "application/json";
      headers["Authorization"] = `${token}`;

      try {
        if (token) {
          client.current.publish({
            destination: "/pub/chat/send",
            headers: headers,
            body: JSON.stringify(messageData),
          });

          newChatRef.current.value = ""; // 입력 필드 초기화
        }
      } catch (error) {
        console.log("에러났음!!");
        console.error(error);
      }
    }
  };

  const pressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bottom-0 h-12 chat-input-container ">
      <div className="flex justify-between items-center  ">
        <input ref={newChatRef} onKeyDown={pressEnter} className="h-12 w-full px-4 rounded-l-2xl" placeholder="채팅을 입력" />
        <button onClick={sendMessage} className="rounded-r-2xl h-12 w-10 bg-white  border-black border-l-2  ">
          확인
        </button>
      </div>
    </div>
  );
};

export default ChatInput2;

