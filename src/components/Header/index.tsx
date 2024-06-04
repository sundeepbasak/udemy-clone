import React from "react";
import Link from "next/link";

const Header = () => {
  return (
    <div className="bg-gray-400 p-4 flex justify-between">
      <Link href="/admin">Admin Page</Link>
      <Link href="/protected">Protected Page</Link>
    </div>
  );
};

export default Header;
