import { useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { JsonConfig, logOutConfig } from "../API/AxiosModule";
import { removeAccessToken, removeRefreshToken } from "../API/TokenAction";
import Modal from "../common/Modal";

interface SettingButtonsProps {
  handleShow: () => void;
  userId: number;
}

const SettingButtons = (props: SettingButtonsProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isLogOut, setIsLogOut] = useState<boolean>(false);
  const { userId, handleShow } = props;
  const navigate = useNavigate();

  const deleteUser = () => {
    JsonConfig("delete", `api/membership/delete/${userId}`).then(() => {
      removeRefreshToken;
      removeAccessToken;
      navigate("/");
    });
  };

  return (
    <div onClick={handleShow}>
      <div className="fixed top-0 left-0 right-0 bottom-0 z-50 bg-black opacity-30" />
      <div className="fixed bottom-4 flex flex-col items-center z-50 w-full text-md">
        <div className="mb-2 w-11/12 rounded-xl bg-white shadow opacity-80">
          <button
            className="block px-4 py-3 w-full border-0 border-b-2 border-gray-200 rounded-none hover:border-gray-200 focus:outline-none"
            onClick={() => navigate("/editprofile")}
          >
            회원정보 수정
          </button>
          <button
            className="block px-4 py-3 w-full border-0 border-b-2 border-gray-200 rounded-none hover:border-gray-200 focus:outline-none"
            onClick={() => navigate("/Editpassword")}
          >
            비밀번호 수정
          </button>
          <button
            className="block px-4 py-3 w-full border-0 border-b-2 border-gray-200 rounded-none hover:border-gray-200 focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              setIsLogOut(true);
            }}
          >
            로그아웃
          </button>
          <button
            type="button"
            className="rounded-none w-full h-12 hover:border-gray-200 focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
          >
            회원탈퇴
          </button>
        </div>
        {isLogOut && (
          <Modal type="confirm" content={"로그 아웃을 하시겠습니까?"} handleModal={handleShow} handleDelete={() => logoutUser(navigate)} />
        )}
        {showModal && <Modal type="confirm" content={"회원 탈퇴를 하시겠습니까?"} handleModal={handleShow} handleDelete={deleteUser} />}
        <button className="px-4 py-3 w-11/12 border-0 rounded-xl shadow bg-white hover:border-0 focus:outline-none">닫기</button>
      </div>
    </div>
  );
};

export const logoutUser = (navigate: NavigateFunction) => {
  logOutConfig("post", "api/logout").then(() => {
    removeRefreshToken();
    removeAccessToken();
    navigate("/");
  });
};

export default SettingButtons;
