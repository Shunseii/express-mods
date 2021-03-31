import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AiFillHome } from "react-icons/ai";
import { FaGamepad } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";

import NavbarLink from "./NavbarLink";
import { PrimaryLinkButton } from "./LinkButton";
import { useMeQuery } from "../generated/graphql";
import { PrimaryActionButton } from "./ActionButton";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery();

  return (
    <nav className="flex flex-row items-center justify-between px-6 py-8 mx-96">
      <div className="flex flex-row items-center">
        <Link href="/">
          <div className="flex flex-row items-center pr-6 border-r border-gray-400 cursor-pointer">
            <Image src={"/files-circle.svg"} width={40} height={40} />
            <p className="ml-3 text-xl font-medium">Express Mods</p>
          </div>
        </Link>
        <ul className="flex flex-row px-6 list-none">
          <NavbarLink href="/" label="Home" Icon={AiFillHome} />
          <NavbarLink href="/games" label="Games" Icon={FaGamepad} />
        </ul>
      </div>
      <div className="flex flex-row items-center">
        {!data?.me && (
          <>
            <PrimaryLinkButton
              href="/login"
              label="Login"
              className="mr-4 leading-none"
            />
            <PrimaryLinkButton
              href="/register"
              label="Register"
              className="leading-none"
            />
          </>
        )}
        {data?.me && (
          <>
            <span className="flex flex-row items-center pr-4 mr-4 text-lg font-medium border-r border-gray-400">
              <FaUserCircle className="mr-2" />
              {data.me.username}
            </span>
            <PrimaryActionButton
              className="w-20 leading-none"
              label="Logout"
              onClick={async () => {
                console.log("logout");
              }}
            />
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
