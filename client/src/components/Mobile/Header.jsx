import React from "react";
import { Link } from "react-router-dom";
import FullScreen from "./FullScreen";

const Header = ({ relativePath }) => {
  return (
    <div className="bg-white p-4 shadow-md">
      <div className="flex items-center justify-between">
        <h3
          className={`text-lg ${
            relativePath === "/" ? "invisible" : "visible"
          }`}
        >
          <Link
            to={"/"}
            className="flex items-center text-blue-600 hover:underline"
          >
            <svg
              className="w-6 h-6 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Link>
        </h3>

        <h3 className="text-lg font-semibold">Remotely</h3>
        <FullScreen />
      </div>
    </div>
  );
};

export default Header;
