import { useEffect, useState } from "react";
import { getUserId } from "../components/API/TokenAction";
import Header from "../components/Main/Header";
import BestUser from "../components/Recommend/BestUser";
import Card from "../components/Recommend/Card";
import Footer from "../components/common/Footer";
import { JsonConfig } from "../components/API/AxiosModule";

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

const colors = ["bg-blue-300", "bg-indigo-300", "bg-violet-300", "bg-purple-300"];

const RecommendPage = () => {
  const userId = getUserId();
  const [recommendList, setRecommendList] = useState<UserInfo[] | null>(null);
  const index = Math.floor(Math.random() * 3);

  useEffect(() => {
    (async () => {
      const response = await JsonConfig("get", `api/personality/${userId}/5`);
      setRecommendList(response.data);
    })();
  }, [userId]);
  console.log(recommendList);

  return (
    <div className="flex justify-center pt-16 pb-14 min-h-screen bg-main-100">
      <Header />
      <div className="flex flex-col items-center w-10/12 mt-4">
        {recommendList === null && (
          <div>
            <img src="/loading.gif" className="w-16 cursor-pointer" />
          </div>
        )}
        {recommendList && recommendList.length === 0 && <div>추천 가능한 유저가 존재하지 않습니다.</div>}
        {recommendList && recommendList.length !== 0 && <BestUser data={recommendList[0]} color={colors[index]} />}
        <div className="flex flex-wrap justify-between items-start content-start w-full">
          {recommendList &&
            recommendList.map((data, idx) => {
              if (idx === 0) return;
              const index = Math.floor(Math.random() * 4);
              return <Card data={data} color={colors[index]} key={data.memberId} />;
            })}
        </div>
      </div>
      <Footer selected={false} userId={userId} />
    </div>
  );
};

export default RecommendPage;
