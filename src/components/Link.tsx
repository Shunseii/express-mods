import React from "react";
import NextLink from "next/link";

interface LinkProps {
  href: string;
  className?: string;
  children?: React.ReactNode;
}

const Link: React.FC<LinkProps> = ({ className, href, children }) => {
  return (
    <span className={`transition-all hover:underline ${className}`}>
      <NextLink href={href}>{children}</NextLink>
    </span>
  );
};

export default Link;
