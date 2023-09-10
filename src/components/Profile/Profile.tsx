import { useEffect, useState } from "react";
import { JsonConfig } from "../API/AxiosModule";
import { FaUser } from "react-icons/fa";
import { GiFemale, GiMale } from "react-icons/gi";
import utility from "../../utils/utils";

interface Personality {
  mbti: string;
  smoking: number;
  activeTime: number;
  pets: number;
  preferSmoking: number;
  preferActiveTime: number;
  preferPets: number;
  preferAge: number;
}

interface ProfileType {
  nickname: string;
  imgPath: string;
  birth: string;
  gender: number;
  region: {
    id: number;
    sido: string;
    sigg: string;
  };
  introduction: string;
  personality: Personality;
}

interface PartnerType {
  membershipId: number;
  imgPath: string;
  nickname: string;
}

interface ProfileProps {
  profileId: string;
  setPartner: (value: React.SetStateAction<PartnerType>) => void;
}

const Profile = (props: ProfileProps) => {
  const { profileId, setPartner } = props;
  const accessToken = localStorage.getItem("accessToken");
  const [profile, setProfile] = useState<ProfileType | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await JsonConfig("get", `api/membership/detail/${profileId}`);
        const data = response.data;
        setProfile({
          nickname: data.nickname,
          imgPath: data.imgPath,
          birth: data.birth,
          introduction: data.introduction,
          gender: data.gender,
          region: data.region,
          personality: data.personality,
        });
        setPartner({
          membershipId: Number(profileId),
          imgPath: data.imgPath,
          nickname: data.nickname,
        });
      } catch (err) {
        console.log(err);
      }
    })();
  }, [profileId, accessToken, setPartner]);

  if (!profile)
    return (
      <div className="flex flex-col gap-2 p-4 pb-0">
        <div className="flex items-center gap-4">
          <div className="relative flex justify-center items-center w-16 h-16 border-2 rounded-full bg-white text-black overflow-hidden">
            <div className={"absolute top-4 flex justify-center items-center text-5xl text-main-200"}>
              <FaUser />
            </div>
          </div>
          <div className="text-lg font-semibold text-black w-16 h-5 bg-gray-300 rounded"></div>
        </div>
        <div className="flex flex-col items-start gap-2 text-sm rounded-sm">
          <div className="w-16 h-4 bg-gray-300 rounded"></div>
          <div className="w-32 h-4 bg-gray-300 rounded"></div>
          <div className="w-48 h-4 bg-gray-300 rounded"></div>
          <div className="mt-2 w-16 h-4 bg-gray-300 rounded"></div>
          <div className="w-60 h-4 bg-gray-300 rounded"></div>
          <div className="w-28 h-4 bg-gray-300 rounded"></div>
          <div className="w-60 h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col gap-2 p-4 pb-0">
      <div className="flex items-center gap-4">
        <div className="relative flex justify-center items-center w-16 h-16 border-2 rounded-full bg-white text-black overflow-hidden">
          {profile.imgPath.length ? (
            <img className="w-full h-full object-cover" src={profile.imgPath} alt={`${profile.nickname}의 프로필 이미지`} />
          ) : (
            <div className={"absolute top-4 flex justify-center items-center text-5xl text-main-200"}>
              <FaUser />
            </div>
          )}
        </div>
        <div className="flex items-center justify-center gap-0.5 text-lg font-semibold text-black">
          {profile.nickname}
          {profile.gender === 1 ? <GiMale className="text-blue-400 text-xl" /> : <GiFemale className="text-red-400 text-xl" />}
        </div>
      </div>
      <div className="flex flex-col items-start gap-0.5 text-sm">
        <div>{`만 ${utility.getAge(profile.birth)}살`}</div>
        <div>{`${profile.region.sido} ${profile.region.sigg}`}</div>
        <div className="flex-wrap break-all">{profile.introduction}</div>
        <div className="mt-2">성향 키워드</div>
        <ul className="flex flex-wrap gap-1 text-main-400">
          <li className="rounded-full border border-main-400 px-2">{`#${profile.personality.mbti}`}</li>
          <li className="rounded-full border border-main-400 px-2">{profile.personality.smoking === 0 ? "#흡연" : "#비흡연"}</li>
          <li className="rounded-full border border-main-400 px-2">
            {profile.personality.activeTime === 0
              ? "#00 ~ 06시"
              : profile.personality.activeTime === 1
              ? "#06 ~ 12시"
              : profile.personality.activeTime === 2
              ? "#12 ~ 18시"
              : "#18 ~ 24시"}
          </li>
          <li className="rounded-full border border-main-400 px-2">{profile.personality.pets === 0 ? "#반려동물 있음" : "#반려동물 없음"}</li>
        </ul>
        <div>선호하는 성향 키워드</div>
        <ul className="flex flex-wrap gap-1 text-main-400">
          <li className="rounded-full border border-main-400 px-2">{`#${profile.personality.preferAge}대`}</li>
          <li className="rounded-full border border-main-400 px-2">
            {profile.personality.preferSmoking === 0 ? "#흡연" : profile.personality.preferSmoking === 1 ? "#비흡연" : "#흡연여부 상관없음"}
          </li>
          <li className="rounded-full border border-main-400 px-2">
            {profile.personality.preferActiveTime === 0
              ? "#00 ~ 06시"
              : profile.personality.preferActiveTime === 1
              ? "#06 ~ 12시"
              : profile.personality.preferActiveTime === 2
              ? "#12 ~ 18시"
              : "#18 ~ 24시"}
          </li>
          <li className="rounded-full border border-main-400 px-2">
            {profile.personality.preferPets === 0
              ? "#반려동물 있음"
              : profile.personality.preferPets === 1
              ? "#반려동물 없음"
              : "#반려동물 유무 상관없음"}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Profile;
