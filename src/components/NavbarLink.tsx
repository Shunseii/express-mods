import React from "react";
import Link from "next/link";
import { IconType } from "react-icons/lib";

interface NavbarLinkProps {
  href: string;
  label: string;
  Icon?: IconType;
}

const NavbarLink: React.FC<NavbarLinkProps> = ({ label, href, Icon }) => {
  return (
    <Link href={href} passHref>
      <li className="flex flex-row items-center mr-4 cursor-pointer">
        {Icon && <Icon className="mr-2 text-lg" />}
        <span className="text-lg">{label}</span>
      </li>
    </Link>
  );
};

export default NavbarLink;
