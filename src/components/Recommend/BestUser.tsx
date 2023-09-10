import { FaCrown } from "react-icons/fa";
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

interface BestUserProps {
  data: UserInfo;
  color: string;
}

const BestUser = (props: BestUserProps) => {
  const { data, color } = props;
  const navigate = useNavigate();

  console.log(data);

  return (
    <div
      className={`relative mx-auto mb-3.5 w-full h-56 ${color} rounded-2xl text-white overflow-hidden`}
      onClick={() => navigate(`/profile/${data.memberId}`)}
    >
      {data.userImage.length !== 0 && <img src={data.userImage} alt="" className="w-full h-full object-cover rounded-2xl" />}
      <div className="absolute top-0 left-0 flex flex-col justify-between pt-3 px-4 pb-4 w-full h-full">
        <div className="flex gap-1.5 items-center self-start">
          <FaCrown className="text-2xl fill-yellow-300" />
          <div className="text-xl font-semibold uppercase ">BEST</div>
        </div>
        <div className="flex flex-col text-right self-end">
          <strong className="font-semibold text-base">{`${data.nickName} 님`}</strong>
          <span className="text-xs">{`만 ${data.age}살`}</span>
          <span className="mt-1 text-xs">{`${data.region}`}</span>
          <ul className="flex flex-wrap justify-end gap-1 text-xs mt-1 text-white w-full">
            <li className="rounded-full border border-white px-2">{`#${data.personality.mbti}`}</li>
            <li className="rounded-full border border-white px-2">{data.personality.smoking === 0 ? "#흡연" : "#비흡연"}</li>
            <li className="rounded-full border border-white px-2">
              {data.personality.activeTime === 0
                ? "#00 ~ 06시"
                : data.personality.activeTime === 1
                ? "#06 ~ 12시"
                : data.personality.activeTime === 2
                ? "#12 ~ 18시"
                : "#18 ~ 24시"}
            </li>
            <li className="rounded-full border border-white px-2">{data.personality.pets === 0 ? "#반려동물 있음" : "#반려동물 없음"}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BestUser;
