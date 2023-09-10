import { useEffect, useState } from "react";

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

const Personality = ({ personality, onPersonalityChange }: PersonalityProps) => {
  const [mbtiOptions, setMbtiOptions] = useState<string[]>([]);
  const [mbtiValue, setMbtiValue] = useState(personality.mbti);
  const [smokingValue, setSmokingValue] = useState(personality.smoking);
  const [petsValue, setPetsValue] = useState(personality.pets);
  const [activeTimeValue, setActiveTimeValue] = useState(personality.activeTime);
  const [preferSmokingValue, setPreferSmokingValue] = useState(personality.preferSmoking);
  const [preferPetsValue, setPreferPetsValue] = useState(personality.preferPets);
  const [preferActiveTimeValue, setPreferActiveTimeValue] = useState(personality.preferActiveTime);
  const [preferAgeValue, setPreferAgeValue] = useState(personality.preferAge);

  useEffect(() => {
    setMbtiValue(personality.mbti);
    setSmokingValue(personality.smoking);
    setPetsValue(personality.pets);
    setActiveTimeValue(personality.activeTime);
    setPreferSmokingValue(personality.preferSmoking);
    setPreferPetsValue(personality.preferPets);
    setPreferActiveTimeValue(personality.preferActiveTime);
    setPreferAgeValue(personality.preferAge);
    console.log(personality);
  }, [personality]);
  useEffect(() => {
    setMbtiOptions(["ISTJ", "ISFJ", "INFJ", "INTJ", "ISTP", "ISFP", "INFP", "INTP", "ESTP", "ESFP", "ENFP", "ENTP", "ESTJ", "ESFJ", "ENFJ", "ENTJ"]);
  }, [personality]);

  const handleMbtiChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMbti = event.target.value;
    onPersonalityChange({ ...personality, mbti: selectedMbti });
  };
  const handleSmokingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSmoking = event.target.value;
    onPersonalityChange({ ...personality, smoking: selectedSmoking });
  };
  const handlePetsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPet = event.target.value;
    onPersonalityChange({ ...personality, pets: selectedPet });
  };
  const handleActiveTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedActiveTime = event.target.value;
    onPersonalityChange({ ...personality, activeTime: selectedActiveTime });
  };
  const handlePreferSmokingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPreferSmoking = event.target.value;
    onPersonalityChange({ ...personality, preferSmoking: selectedPreferSmoking });
  };
  const handlePreferPetsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPreferPet = event.target.value;
    onPersonalityChange({ ...personality, preferPets: selectedPreferPet });
  };
  const handlePreferActiveTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPreferActiveTime = event.target.value;
    onPersonalityChange({ ...personality, preferActiveTime: selectedPreferActiveTime });
  };
  const handlePreferAgeValueChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPreferAge = event.target.value;
    onPersonalityChange({ ...personality, preferAge: selectedPreferAge });
  };
  return (
    <>
      <div className="flex flex-col mt-5 mx-auto w-9/12">
        <label htmlFor="input-personality " className="after:content-['*'] after:text-red-500">
          성향
        </label>
        <div className="flex flex-wrap flex-col gap-2 mt-2.5" id="input-personality">
          <div>
            <label htmlFor="preferenceMbti" className="mr-12">
              MBTI
            </label>
            <select name="preferenceMbti" id="preferenceMbti" className="w-20 text-center" value={mbtiValue} onChange={handleMbtiChange}>
              <option>선택</option>
              {mbtiOptions.map((mbti) => (
                <option key={mbti} value={mbti}>
                  {mbti}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="smoking" className="mr-7">
              흡연여부
            </label>
            <select name="smoking" id="smoking" className="w-20 text-center" value={smokingValue} onChange={handleSmokingChange}>
              <option>선택</option>
              <option value="0">o</option>
              <option value="1">x</option>
            </select>
          </div>
          <div>
            <label htmlFor="pets" className="mr-7">
              반려동물
            </label>
            <select name="pets" id="pets" className="w-20 text-center" value={petsValue} onChange={handlePetsChange}>
              <option>선택</option>
              <option value="0">o</option>
              <option value="1">x</option>
            </select>
          </div>
          <div>
            <label htmlFor="activeTime" className="mr-7">
              활동시간
            </label>
            <select name="activeTime" id="activeTime" className="w-20 text-center" value={activeTimeValue} onChange={handleActiveTimeChange}>
              <option>선택</option>
              <option value="0">24~06</option>
              <option value="1">06~12</option>
              <option value="2">12~18</option>
              <option value="3">18~24</option>
            </select>
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-5 mx-auto w-9/12">
        <label htmlFor="input-personality " className="after:content-['*'] after:text-red-500">
          선호하는 성향
        </label>
        <div className="flex flex-wrap flex-col gap-2 mt-2.5" id="input-personality">
          <div>
            <label htmlFor="preferSmoking" className="mr-7">
              흡연여부
            </label>
            <select
              name="preferSmoking"
              id="preferSmoking"
              className="w-20 text-center"
              value={preferSmokingValue}
              onChange={handlePreferSmokingChange}
            >
              <option>선택</option>
              <option value="0">o</option>
              <option value="1">x</option>
              <option value="2">상관없음</option>
            </select>
          </div>
          <div>
            <label htmlFor="preferPets" className="mr-7">
              반려동물
            </label>
            <select name="preferPets" id="preferPets" className="w-20 text-center" value={preferPetsValue} onChange={handlePreferPetsChange}>
              <option>선택</option>
              <option value="0">o</option>
              <option value="1">x</option>
              <option value="2">상관없음</option>
            </select>
          </div>
          <div>
            <label htmlFor="preferActiveTime" className="mr-7">
              활동시간
            </label>
            <select
              name="preferActiveTime"
              id="preferActiveTime"
              className="w-20 text-center"
              value={preferActiveTimeValue}
              onChange={handlePreferActiveTimeChange}
            >
              <option>선택</option>
              <option value="0">24~06</option>
              <option value="1">06~12</option>
              <option value="2">12~18</option>
              <option value="3">18~24</option>
            </select>
          </div>
          <div>
            <label htmlFor="preferAge" className="mr-4">
              연령대(만)
            </label>
            <select name="preferAge" id="preferAge" className="w-20 text-center" value={preferAgeValue} onChange={handlePreferAgeValueChange}>
              <option>선택</option>
              <option value="10">10대</option>
              <option value="20">20대</option>
              <option value="30">30대</option>
              <option value="40">40대</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export default Personality;
