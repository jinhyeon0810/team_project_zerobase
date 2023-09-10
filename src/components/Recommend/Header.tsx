import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="fixed top-0 flex items-center justify-between z-50 px-3 w-full h-16 bg-main-100 shadow">
        <img src="/logo.png" className="w-16 cursor-pointer" onClick={() => navigate("/main")} />
      </div>
    </div>
  );
};

export default Header;
