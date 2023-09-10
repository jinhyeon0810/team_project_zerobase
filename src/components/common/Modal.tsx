import { useSetAtom } from "jotai";
import { recommendAtom } from "../Main/Jotai";

interface ModalProps {
  type: "alert" | "confirm";
  content: string;
  handleModal: () => void; //모달을 닫는 함수
  handleDelete?: () => void; //로그아웃함수
}

const Modal = (props: ModalProps) => {
  const { type, content, handleModal, handleDelete } = props;
  const setRecommend = useSetAtom(recommendAtom);

  const handleClick = () => {
    if (handleDelete) {
      handleDelete();
      setRecommend(true);
    }
    handleModal();
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="fixed top-0 left-0 right-0 bottom-0 z-50 bg-black opacity-30" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-between gap-6 z-50 w-10/12 p-5 text-md bg-white rounded-2xl shadow">
        <div>{content}</div>
        <div className="flex justify-end items-center gap-2.5">
          <button
            className="px-3 py-1 rounded-md border-2 border-main-400 bg-main-400 text-white cursor-pointer hover:scale-110"
            onClick={handleClick}
          >
            확인
          </button>
          {type === "confirm" && (
            <button className="px-3 py-1 rounded-md border-2 text-gray-600 cursor-pointer hover:scale-110" onClick={handleModal}>
              취소
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
