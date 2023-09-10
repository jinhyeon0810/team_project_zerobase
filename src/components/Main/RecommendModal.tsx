import { useAtom } from "jotai";
import { FaUser } from "react-icons/fa";
import { recommendAtom } from "./Jotai";
import { useNavigate } from "react-router-dom";

interface RecommendDataProps {
  data: {
    memberId: number;
    nickName: string;
    userImage: string;
    age: number;
    region: string;
    personality: {
      userPersonalilty: number;
      mbti: string;
      smoking: number;
      activeTime: number;
      pets: number;
    };
  };
}
const RecommendModal = ({ data }: RecommendDataProps) => {
  const navigate = useNavigate();
  const [recommend, setRecommend] = useAtom(recommendAtom);

  const onCloseRecommendModal = () => {
    setRecommend(!recommend);
  };
  console.log(data);

  const moveToProfilePage = () => {
    navigate(`/profile/${data.memberId}`);
  };
  return (
    <>
      <section className="fixed top-0 left-0 right-0 bottom-0 z-40 bg-black opacity-40"></section>
      <div className="fixed top-2/4 transform -translate-y-1/2 w-4/5 left-1/2 -translate-x-1/2 z-50 bg-white opacity-100 rounded-2xl ">
        <div className="flex flex-col justify-center p-4 items-center gap-4">
          <h1 className="text-sm font-medium">선호하는 성향으로 검색한 결과</h1>
          <div>
            <div className="w-36 h-36">
              {data.userImage === "" ? (
                <FaUser className="w-full h-full rounded-full border-2 object-contain  bg-white text-main-200" />
              ) : (
                <img src={data.userImage} alt="추천인 정보" className="w-full h-full rounded-full border-2 object-cover" />
              )}
            </div>
            <div className="text-center font-bold">{data.nickName}</div>
          </div>

          <article className="flex flex-col gap-1 text-xs">
            <p>{data.age}세</p>
            <p>{data.region}</p>
            <section className=" text-main-400">
              <button className="border-2 border-main-400 rounded-full px-2 py-1 mr-1">
                {data.personality.activeTime === 0
                  ? "#00 ~ 06시"
                  : data.personality.activeTime === 1
                  ? "#06 ~ 12시"
                  : data.personality.activeTime === 2
                  ? "#12 ~ 18시"
                  : "#18 ~ 24시"}
              </button>
              <button className="border-2 border-main-400 rounded-full px-2 py-1 mr-1">#{data.personality.mbti}</button>
              <button className="border-2 border-main-400 rounded-full px-2 py-1 mr-1">
                {data.personality.pets === 0 ? "#반려동물 있음" : "#반려동물 없음"}
              </button>
              <button className="border-2 border-main-400 rounded-full px-2 py-1 mr-1">{data.personality.smoking === 0 ? "#흡연" : "#비흡연"}</button>
            </section>
          </article>
        </div>
        <section className="flex flex-rows w-full rounded-b-2xl bg-main-400 text-white text-sm font-light">
          <button className="flex-1 px-3 py-2 cursor-pointer border-white border-r-2" onClick={moveToProfilePage}>
            자세히 보기
          </button>
          <button className="flex-1 px-3 py-2 cursor-pointer" onClick={onCloseRecommendModal}>
            닫기
          </button>
        </section>
      </div>
    </>
  );
};

export default RecommendModal;
