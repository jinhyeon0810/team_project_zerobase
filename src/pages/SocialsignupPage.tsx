import { useEffect, useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Region from "../components/Signup/Region";
import Personality from "../components/Signup/Personality";
import GoBackButton from "../components/common/GoBackButton";
import { createLoginConfig } from "../components/API/AxiosModule";
import utility from "../utils/utils";
import { getTokenExpiration, isTokenValid, setAccessToken, setRefreshToken } from "../components/API/TokenAction";

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenCategory: string;
}

interface PersonalityProps {
  personality: {
    mbti: string;
    smoking: string;
    activeTime: string;
    pets: string;
    preferSmoking: string;
    preferActiveTime: string;
    preferPets: string;
    preferAge: string;
  };
  onPersonalityChange: (newPersonality: PersonalityProps["personality"]) => void;
}

const SocialsignUp = () => {
  const [year, setYear] = useState<number | "year">("year");
  const [month, setMonth] = useState<number | "month">("month");
  const [day, setDay] = useState<number | "day">("day");
  const [birth, setBirthday] = useState<string>("");
  const [gender, setGender] = useState<number>();
  const [introduction, setIntroduction] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [personality, setPersonality] = useState<PersonalityProps["personality"]>({
    mbti: "",
    smoking: "",
    activeTime: "",
    pets: "",
    preferSmoking: "",
    preferActiveTime: "",
    preferPets: "",
    preferAge: "",
  });
  const [regionId, setRegionId] = useState<number | null>(null);
  const [verify, setVerify] = useState<string>("false");
  const [nicknameCheckError, setenicknameCheckError] = useState<string | null>("");
  const [countdown, setCountdown] = useState<number | null>(null);

  const handlePersonalityChange = (newPersonality: PersonalityProps["personality"]) => {
    setPersonality(newPersonality);
  };

  const url = window.location.href;
  const userId = url.split("/").pop();

  const handleTokenResponse = (tokenResponse: TokenResponse, accessTokenExpire = -1, refreshTokenExpire = -1) => {
    if (tokenResponse.accessToken && tokenResponse.refreshToken) {
      setAccessToken(tokenResponse.accessToken); // 로컬스토리지에 액세스토큰 저장
      setRefreshToken(tokenResponse.refreshToken); // httponly 쿠키에 refresh 토큰 저장
      localStorage.setItem("tokenCategory", tokenResponse.tokenCategory);
      getTokenExpiration("accessToken", accessTokenExpire);
      getTokenExpiration("refreshToken", refreshTokenExpire);
      isTokenValid().then((response) => {
        if (response === true) {
          //console.log(getUserId());
          navigate("/main"); //메인페이지로 이동
        }
      });
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }

    return () => clearTimeout(timer);
  }, [countdown]);

  const handleRegionIdChange = (id: number | null) => {
    setRegionId(id);
  };

  const navigate = useNavigate();

  const years = utility.getYears();
  const months = utility.getMonths();
  const days = utility.getDays(year === "year" ? NaN : year, month === "month" ? NaN : month);

  useEffect(() => {
    if (year !== "year" && month !== "month" && day !== "day") {
      setBirthday(`${year}-${month}-${day}`);
    } else {
      setBirthday("");
    }
  }, [year, month, day]);

  const handleGenderChange = (option: string) => {
    if (option === "남성") {
      setGender(1);
    } else if (option === "여성") {
      setGender(0);
    }
  };
  console.log(userId);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const isValid = utility.socialvalidateForm(nickname, personality, regionId, birth, introduction);
    e.preventDefault();
    if (isValid) {
      const data = {
        nickname,
        birth,
        gender,
        personality: { ...personality },
        regionId,
        introduction,
        verify,
      };
      createLoginConfig("patch", `oauth/signup/${userId}`, data)
        .then((response) => {
          
          const accessToken = response.data["Authorization"];
          const refreshToken = response.data["Authorization-refresh"];

          const tokenResponse: TokenResponse = {
            accessToken: accessToken,
            refreshToken: refreshToken,
            tokenCategory: "default",
          };

          handleTokenResponse(tokenResponse);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const nicknameSubmit = async () => {
    const requestData = {
      nickname: nickname,
    };
    createLoginConfig("post", "nickname", requestData)
      .then(() => {
        alert("닉네임 사용가능 합니다.");
      })
      .catch((error) => {
        setVerify("false");
        setenicknameCheckError(error.response?.data?.message);
      });
  };

  return (
    <div className="relative bg-main-100">
      <div className="flex flex-row justify-center items-center shadow h-16">
        <div className="absolute left-5">
          <GoBackButton />
        </div>
        <h2 className="mx-10 text-center text-3xl">추가 정보</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col mt-5 mx-auto w-9/12">
          <label htmlFor="input-nickname" className="w-9/12 after:content-['*'] after:text-red-500">
            닉네임
          </label>
          <div className="flex mt-2 ">
            <input
              type="text"
              id="input-nickname"
              className="w-4/5 h-10 p-2 placeholder:text-sm"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              name="nickname"
              placeholder="닉네임을 입력해주세요"
            />
            <button className="rounded-none bg-main-400 w-1/5 h-10 text-white" type="button" onClick={nicknameSubmit}>
              <AiOutlineCheck className="mx-auto my-0" />
            </button>
          </div>
          <span className="text-red-500 text-sm w-9/12">{nicknameCheckError}</span>
        </div>
        <div className="flex flex-col mt-5 mx-auto w-9/12">
          <label htmlFor="input-birth" className="w-9/12 after:content-['*'] after:text-red-500">
            생년월일
          </label>
          <div className="flex justify-between mt-2">
            <select value={year} id="input-birth" onChange={(e) => setYear(e.target.value as number | "year")} className="py-1 w-1/4 text-sm">
              <option disabled value={"year"}>
                연도
              </option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select value={month} onChange={(e) => setMonth(e.target.value as number | "month")} className="w-1/4 text-sm">
              <option disabled value={"month"}>
                월
              </option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <select value={day} onChange={(e) => setDay(e.target.value as number | "day")} className="w-1/4 text-sm">
              <option disabled value={"day"}>
                일
              </option>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <input type="text" name="birth" className="hidden" defaultValue={birth} />
          </div>
        </div>
        <Region handleRegionIdChange={handleRegionIdChange} defaultRegionId={null} />
        <Personality personality={personality} onPersonalityChange={handlePersonalityChange} />

        <div className="flex flex-col mt-5 mx-auto w-9/12">
          <label htmlFor="input-gender" className="w-9/12 after:content-['*'] after:text-red-500">
            성별
          </label>
          <div className="flex w-9/12 mt-2.5 " id="input-gender">
            <div className="mt-1 mr-4 border">
              <input
                type="checkbox"
                id="input-gender-man"
                name="gender"
                value="1"
                onChange={() => handleGenderChange("남성")}
                checked={gender === 1}
                className="sr-only"
              />
              <label htmlFor="input-gender-man" className={`block h-full px-1 ${gender === 1 ? "bg-main-400 text-white" : "bg-white"}`}>
                남성
              </label>
            </div>
            <div className="mt-1 border">
              <input
                type="checkbox"
                id="input-gender-woman"
                name="gender"
                value="2"
                onChange={() => handleGenderChange("여성")}
                checked={gender === 0}
                className="sr-only"
              />
              <label htmlFor="input-gender-woman" className={`block h-full px-1 ${gender === 0 ? "bg-main-400 text-white" : "bg-white"}`}>
                여성
              </label>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-5 pb-20 mx-auto w-9/12">
          <label htmlFor="input-about" className="after:content-['*'] after:text-red-500">
            자기소개
          </label>
          <textarea
            name="inttroduction"
            id="input-about"
            value={introduction}
            placeholder="자신에 대해 소개해주세요"
            onChange={(e) => setIntroduction(e.target.value)}
            className="h-40 p-4 mt-2.5"
          ></textarea>
        </div>
        <button type="submit" className="fixed bottom-0 rounded-none mt-16 w-full h-14 bg-main-400 text-white">
          가입하기
        </button>
      </form>
    </div>
  );
};

export default SocialsignUp;
