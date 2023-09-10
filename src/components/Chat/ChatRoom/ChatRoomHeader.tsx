import { useEffect, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { partnerInfo } from "../../../pages/Chat/ChatRoomPage";
import { FaUser } from "react-icons/fa";

const ChatRoomHeader = ({ partnerInfomation }: { partnerInfomation: partnerInfo }) => {
  const navigate = useNavigate();

  const [imgPath, setImgPath] = useState(partnerInfomation.imgPath);
  const [nickname, setNickname] = useState(partnerInfomation.nickname);
  const onClickBackBtn = () => {
    navigate(-1);
  };

  useEffect(() => {
    console.log("채팅방입장 4");
    if (partnerInfomation.nickname !== null) {
      setImgPath(partnerInfomation.imgPath);

      setNickname(partnerInfomation.nickname);
    }
  }, [partnerInfomation]);

  // const asd = () =>{
  //   console.log("로그아웃");
  //   logOutConfig("post", "api/logout")
  //   .then((response) => {
  //     console.log(response);
  //     removeAccessToken();
  //     removeRefreshToken();
  //     window.location.href = "/";
  //   })
  //   .catch((error) => {
  //     console.log("에러");
  //     console.error(error);
  //   });
  // }

  return (
    <>
      <div className="flex justify-between items-center h-16 px-3 border-solid border-black shadow-md">
        <div className="flex items-center p-4">
          <div className="hover:cursor-pointer" onClick={onClickBackBtn}>
            <IoArrowBackOutline></IoArrowBackOutline>
          </div>

          {imgPath.length ? (
            <img className="rounded-full ml-4 w-12 h-12" src={imgPath} alt="" />
          ) : (
            <div className={"pt-3 flex rounded-full justify-center items-center ml-4 w-12 h-12 bg-white text-4xl text-main-200  overflow-hidden "}>
              <FaUser />
            </div>
          )}
          {/* <img className="ml-4 w-12 h-12 border-2 rounded-full" src={imgPath} alt="" /> */}
        </div>
        <div className="mr-4">{nickname}</div>
      </div>
    </>
  );
};

export { ChatRoomHeader };
