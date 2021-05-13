import React from "react";

interface ContainerProps {
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return (
    <main className={`flex flex-col mt-12 mx-96 ${className}`}>{children}</main>
  );
};

export default Container;
