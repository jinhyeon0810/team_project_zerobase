import { useEffect, useState } from "react";
import ChatRoom from "./ChatRoom";
import { JsonConfig } from "../../API/AxiosModule";
import { getUserId } from "../../API/TokenAction";
import { useAtomValue } from "jotai";
import { lastMessage } from "../ChatRoom/ChatUtil";

interface ChatListProps {
  isDeleteMode: boolean;
  allSelect: boolean;
  setAllSelect: (value: React.SetStateAction<boolean>) => void;
  filter: string;
}

interface ChatRoomType {
  lastMessage: string;
  partner: {
    membershipId: number;
    imgPath: string;
    nickname: string;
  };
  chatRoomId: number;
  lastTime: string;
  unRead: number;
}

const ChatList = (props: ChatListProps) => {
  const { allSelect, isDeleteMode, setAllSelect, filter } = props;
  const [chatRooms, setChatRooms] = useState<ChatRoomType[] | null>(null); // 모든 채팅방 목록
  const [deleteList, setDeleteList] = useState<number[]>([]);
  const [chatRoomList, setChatRoomList] = useState<ChatRoomType[] | null>(null); // 필터링된 채팅방 목록
  const userId = getUserId();
  const message = useAtomValue(lastMessage);

  // 안읽은 메세지 +1

  useEffect(() => {
    console.log(message);
    setChatRooms((prev) => {
      if (!prev) return null;

      const prevChatRooms = prev.find((room) => {
        return room.chatRoomId == message.chatRoomId;
      });

      const newChatRooms = prev.filter((room) => {
        return room.chatRoomId !== message.chatRoomId;
      });
      console.log(newChatRooms);

      newChatRooms.unshift({
        lastMessage: message.message,
        partner: message.membership,
        chatRoomId: message.chatRoomId,
        lastTime: message.createdAt,
        unRead: prevChatRooms ? prevChatRooms.unRead + 1 : 1,
      });

      return newChatRooms;
    });
  }, [message]);

  useEffect(() => {
    if (!chatRooms) return;
    if (filter === "" || isDeleteMode) {
      setChatRoomList(chatRooms);
    } else {
      const filterList = chatRooms.filter((room) => room.partner.nickname.includes(filter));
      setChatRoomList(filterList);
    }
  }, [chatRooms, filter, isDeleteMode]);

  const getChatRooms = async (uid: number) => {
    try {
      const response = await JsonConfig("get", `api/chat/room`, null, { memberId: uid });
      return response.data;
    } catch (error) {
      console.error("채팅방 목록을 가져오는 중에 에러가 발생했습니다:", error);
      throw error;
    }
  };

  useEffect(() => {
    (async () => {
      const data = await getChatRooms(userId);
      setChatRooms(data);
    })();
  }, [userId]);

  // deleteMode가 실행되면 deleteList 초기화
  useEffect(() => {
    if (isDeleteMode) {
      setDeleteList([]);
    }
  }, [isDeleteMode]);

  useEffect(() => {
    if (!isDeleteMode) return;
    if (chatRoomList && allSelect) {
      const newDeleteList = chatRoomList.map((chatRoom) => chatRoom.chatRoomId);
      setDeleteList(newDeleteList);
    }
  }, [allSelect, chatRoomList, isDeleteMode]);

  useEffect(() => {
    if (chatRoomList && chatRoomList.length === deleteList.length && !allSelect) {
      setAllSelect(true);
    }
  }, [allSelect, chatRoomList, deleteList.length, setAllSelect]);

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      await JsonConfig("put", `api/chat/room/${userId}`, {
        chatroomId: deleteList,
        senderId: userId,
      });
      setChatRooms((prev: ChatRoomType[] | null) => {
        if (!prev) return null;
        return prev.filter((room) => {
          return !deleteList.includes(room.chatRoomId);
        });
      });
      setDeleteList([]);
      //setIsDeleteMode(false)
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center pt-16">
        {!chatRoomList && (
          <div className="p-4 text-center">
            <img src="/loading.gif" className="w-16 cursor-pointer" />
          </div>
        )}
        {chatRoomList && chatRoomList.length === 0 && <div className="p-4 text-center">채팅 목록이 존재하지 않습니다.</div>}
        {chatRoomList &&
          chatRoomList.map((chat) => {
            return (
              <ChatRoom
                key={chat.chatRoomId}
                chat={chat}
                allSelect={allSelect}
                setAllSelect={setAllSelect}
                isDeleteMode={isDeleteMode}
                setDeleteList={setDeleteList}
              />
            );
          })}
      </div>
      {props.isDeleteMode && (
        <button className="fixed z-10 w-full h-12 bottom-0 bg-main-400 rounded-none text-white focus:outline-none" onClick={handleDelete}>
          삭제
        </button>
      )}
    </>
  );
};

export default ChatList;
