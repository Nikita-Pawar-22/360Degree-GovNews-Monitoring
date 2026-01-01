import React from "react";

const Categories = () => {
  return (
    <>
      <div className="flex justify-center items-center space-x-20 pt-3 font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 pb-3 pl-5 pr-5 rounded-lg shadow-md">
        <a className="hover:cursor-pointer hover:scale-[1.2] duration-300" href="#">
          Business
        </a>
        <a className="hover:cursor-pointer hover:scale-[1.2] duration-300" href="#">
          Crime
        </a>
        <a className="hover:cursor-pointer hover:scale-[1.2] duration-300" href="#">
          Culture
        </a>
        <a className="hover:cursor-pointer hover:scale-[1.2] duration-300" href="#">
          Entertainment
        </a>
        <a className="hover:cursor-pointer hover:scale-[1.2] duration-300" href="#">
          International
        </a>
        <a className="hover:cursor-pointer hover:scale-[1.2] duration-300" href="#">
          Judiciary
        </a>
        <a className="hover:cursor-pointer hover:scale-[1.2] duration-300" href="#">
          Politics
        </a>
        <a className="hover:cursor-pointer hover:scale-[1.2] duration-300" href="#">
          Science
        </a>
        <a className="hover:cursor-pointer hover:scale-[1.2] duration-300" href="#">
          Sports
        </a>
        <a className="hover:cursor-pointer hover:scale-[1.2] duration-300" href="#">
          Technology
        </a>
      </div>
    </>
  );
};

export default Categories;