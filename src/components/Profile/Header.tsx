import { IoSettingsOutline } from "react-icons/io5";
import { useNavigate } from "react-router";
import GoBackButton from "../common/GoBackButton";

interface ProfileProps {
  mypage: boolean;
  handleShow: () => void;
}

const Header = (props: ProfileProps) => {
  const { mypage } = props;
  const navigate = useNavigate();

  return (
    <div>
      <div className="fixed top-0 flex items-center justify-between z-50 px-3 w-full h-16 bg-main-100 shadow">
        {mypage ? <img src="/logo.png" className="w-16 cursor-pointer" onClick={() => navigate("/main")} /> : <GoBackButton />}
        {props.mypage && (
          <button className="border-0 text-3xl text-main-400 focus:outline-0 hover:border-0" onClick={props.handleShow}>
            <IoSettingsOutline />
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
