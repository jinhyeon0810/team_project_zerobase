import { useNavigate } from "react-router-dom";
import Modal from "../common/Modal";
import { useState } from "react";
import { logoutUser } from "../Profile/SettingButtons";
const Header = () => {
  const navigate = useNavigate();
  const [isLogOut, setIsLogOut] = useState<boolean>(false);
  const moveToHome = () => {
    window.scrollTo({ top: 0, behavior: "auto" });
    navigate("/main");
  };
  return (
    <div className="fixed w-full z-20 top-0 left-0 shadow bg-main-100">
      <div className="flex flex-row justify-between items-center h-16 px-3 ">
        <img src="/logo.png" className="w-16 cursor-pointer" onClick={moveToHome} alt="페이지 로고" loading="lazy" />

        <button
          className="w-16 h-12 bg-main-400"
          onClick={(e) => {
            e.stopPropagation();
            setIsLogOut(true);
          }}
        >
          로그아웃
        </button>
      </div>
      {isLogOut && (
        <Modal
          type="confirm"
          content={"로그 아웃을 하시겠습니까?"}
          handleModal={() => setIsLogOut(false)}
          handleDelete={() => logoutUser(navigate)}
        />
      )}
    </div>
  );
};

export default Header;
