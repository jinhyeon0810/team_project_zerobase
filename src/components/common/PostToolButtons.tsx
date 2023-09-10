import { useNavigate } from "react-router-dom";
import { JsonConfig } from "../API/AxiosModule";
import Modal from "./Modal";
import { useState } from "react";

interface PostToolButtonsProps {
  page?: string;
  postId: string | number;
  handleShow: () => void;
  deletePost?: () => void;
}

const PostToolButtons = (props: PostToolButtonsProps) => {
  const navigate = useNavigate();
  const { page, postId, handleShow, deletePost } = props;
  const [showModal, setShowModal] = useState(false);

  const clickDeleteBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    setShowModal(true);
  };

  // 모달 창 닫기
  const handleModal = () => {
    handleShow();
  };

  // 기능 부여
  const handleDelete = async () => {
    try {
      await JsonConfig("delete", `api/post/${postId}`);

      if (page === "detail") {
        navigate("/main");
      } else if (deletePost) {
        deletePost();
      }
    } catch (err) {
      console.log("실패");
    }
  };

  return (
    <div onClick={handleShow}>
      <div className="fixed top-0 left-0 right-0 bottom-0 z-50 bg-black opacity-30" />
      <div className="fixed left-0 bottom-4 flex flex-col items-center z-50 w-full text-md animate-[fadeInUp_0.25s_ease-in-out]">
        <div className="mb-2 w-11/12 rounded-xl bg-white shadow opacity-80">
          {/* <button className="block px-4 py-3 w-full border-0 border-b-2 border-gray-200 rounded-t-xl rounded-b-none hover:border-gray-200 focus:outline-none">
            끌어올리기
          </button> */}
          <button
            className="block px-4 py-3 w-full border-0 border-b-2 border-gray-200 rounded-t-xl rounded-b-none hover:border-gray-200 focus:outline-none"
            onClick={() => navigate(`/edit/${postId}`)}
          >
            게시물 수정
          </button>
          <button className="block px-4 py-3 w-full border-0 rounded-t-none rounded-b-xl hover:border-0 focus:outline-none" onClick={clickDeleteBtn}>
            게시물 삭제
          </button>
        </div>
        <button className="px-4 py-3 w-11/12 border-0 rounded-xl shadow bg-white hover:border-0 focus:outline-none">닫기</button>
      </div>
      {showModal && <Modal type="confirm" content="정말 삭제하시겠습니까😃?" handleModal={handleModal} handleDelete={handleDelete} />}
    </div>
  );
};

export default PostToolButtons;
