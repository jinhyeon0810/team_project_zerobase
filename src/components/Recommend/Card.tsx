import { useRef, useState } from "react";
import { HiOutlineChevronRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

interface UserInfo {
  memberId: number;
  userImage: string;
  nickName: string;
  age: string;
  region: string;
  personality: {
    mbti: string;
    smoking: number;
    activeTime: number;
    pets: number;
  };
}

interface CardProps {
  data: UserInfo;
  color: string;
}

const Card = (props: CardProps) => {
  const { data, color } = props;
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [direction, setDirection] = useState<"front" | "back">("front");

  const handleCard = () => {
    if (direction === "front") {
      setDirection("back");
    } else {
      setDirection("front");
    }
  };

  const clickMore = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    navigate(`/profile/${data.memberId}`);
  };

  return (
    <section ref={cardRef} className="w-48% mb-3.5 perspective-600 h-36">
      <div
        className={`relative w-full h-full rounded-2xl ${color} style-preserve-3d transition-transform duration-500 ${
          direction === "back" ? "rotate-y-180" : ""
        }`}
        onClick={handleCard}
      >
        <div className="w-full h-full rounded-2xl backface-hidden z-20">
          <div className="absolute flex items-end justify-end w-full h-full p-3 text-base font-semibold text-white">{`${
            data.nickName.length > 4 ? data.nickName.slice(0, 4) + ".." : data.nickName
          } 님`}</div>
          {data.userImage.length !== 0 && (
            <img src={data.userImage} alt={`${data.nickName}의 프로필`} className="w-full h-full object-cover rounded-2xl" />
          )}
        </div>
        <div className="absolute top-0 left-0 flex flex-col p-3 gap-0.5 w-full h-full bg-gray-400 rounded-2xl text-xs font-light text-white z-10 rotate-y-180 backface-hidden">
          <div>{`만 ${data.age}살`}</div>
          <div>{data.region}</div>
          <div className="flex gap-1 flex-wrap text-xs mt-1 h-10 text-white overflow-hidden">
            <span className="rounded-full border border-white px-2">{`#${data.personality.mbti}`}</span>
            <span className="rounded-full border border-white px-2">{data.personality.smoking === 0 ? "#흡연" : "#비흡연"}</span>
            <span className="rounded-full border border-white px-2">
              {data.personality.activeTime === 0
                ? "#00 ~ 06시"
                : data.personality.activeTime === 1
                ? "#06 ~ 12시"
                : data.personality.activeTime === 2
                ? "#12 ~ 18시"
                : "#18 ~ 24시"}
            </span>
            <span className="rounded-full border border-white px-2">{data.personality.pets === 0 ? "#반려동물 있음" : "#반려동물 없음"}</span>
          </div>
          <button className="absolute flex items-center w-4 h-4 rounded-full justify-center bottom-3 right-3 text-xl" onClick={clickMore}>
            <HiOutlineChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Card;
