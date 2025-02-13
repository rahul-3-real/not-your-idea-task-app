import { BiBell } from "react-icons/bi";
import { useSelector } from "react-redux";

import Logout from "./Logout";
import { Link } from "react-router";

const Header = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="w-full border-solid border-b border-gray-600 py-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between gap-10">
          <div className="flex items-center justify-items-start gap-5">
            <h1 className="text-white font-mono font-bold text-xl">
              <Link to="/">Dashboard</Link>
            </h1>
            <span className="h-5 w-[1px] bg-gray-500"></span>
            <h5 className="text-white">Welcome {user.fullName}</h5>
          </div>
          <nav className="flex items-center justify-end gap-5">
            <Link to="/create" className="text-white">
              Create Task
            </Link>
            <button className="cursor-pointer text-xl text-white">
              <BiBell />
            </button>

            <Logout />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
