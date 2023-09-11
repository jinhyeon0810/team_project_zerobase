import { HiOutlineChatBubbleLeftRight, HiUserCircle, HiOutlineUserCircle, HiChatBubbleLeftRight } from "react-icons/hi2";
import { AiOutlineHeart, AiFillHeart, AiOutlineHome, AiFillHome } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import { BsHandThumbsUp, BsHandThumbsUpFill } from "react-icons/bs";
import { useTransition } from "react";

interface Props {
  selected: boolean;
  userId: number | undefined;
}

const Footer = ({ userId }: Props) => {
  const [, startTransition] = useTransition();

  const navigate = useNavigate();
  const location = useLocation();

  const moveToHome = () => {
    startTransition(() => {
      navigate("/main");
    });
  };

  const moveToCart = () => {
    startTransition(() => {
      navigate("/cart");
    });
  };

  const moveToChat = () => {
    startTransition(() => {
      navigate("/chatlist");
    });
  };

  const moveToProfile = () => {
    startTransition(() => {
      navigate(`/profile/${userId}`);
    });
  };

  const moveToRecommend = () => {
    startTransition(() => {
      navigate("/recommend");
    });
  };

  return (
    <div className="fixed w-full bottom-0 shadow">
      <article className="flex justify-between items-center h-14 bg-white text-main-300">
        <div className="flex flex-col items-center justify-center w-full text-3xl cursor-pointer" onClick={moveToProfile}>
          {location.pathname.includes("/profile/") ? <HiUserCircle /> : <HiOutlineUserCircle />}
          <div className="text-xs">프로필</div>
        </div>
        <div className="flex flex-col items-center justify-center w-full text-center text-3xl cursor-pointer" onClick={moveToCart}>
          {location.pathname.includes("/cart") ? <AiFillHeart /> : <AiOutlineHeart />}
          <div className="text-xs">관심목록</div>
        </div>
        <div className="flex flex-col items-center justify-center w-full text-center text-3xl cursor-pointer" onClick={moveToHome}>
          {location.pathname.includes("/main") ? <AiFillHome /> : <AiOutlineHome />}
          <div className="text-xs">홈</div>
        </div>
        <div className="flex flex-col items-center justify-center w-full text-center text-3xl cursor-pointer" onClick={moveToRecommend}>
          {location.pathname.includes("/recommend") ? <BsHandThumbsUpFill /> : <BsHandThumbsUp />}
          <div className="text-xs">추천</div>
        </div>
        <div className="flex flex-col items-center justify-center w-full text-center text-3xl cursor-pointer" onClick={moveToChat}>
          {location.pathname.includes("/chatlist") ? <HiChatBubbleLeftRight /> : <HiOutlineChatBubbleLeftRight />}
          <div className="text-xs">채팅</div>
        </div>
      </article>
    </div>
  );
};

export default Footer;
