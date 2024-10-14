"use client";

import { ListPropertyButton } from "./ListPropertyButton";
import SearchBox from "./SearchBox";
import ProfileButton from "./ProfileButton";
import RegisterButton from "./RegisterButton";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Link from "next/link";

export default function Navbar() {
  const { user, isAuthenticated } = useKindeBrowserClient();
  console.log("user in navbar: ", user);

  return (
    <nav className="flex flex-col w-full border-b-2 items-center mx-auto justify-between p-6 md:flex-row ">
      <Link href={"/"}>
        <h1 className="text-3xl font-bold left-6">INNMATE</h1>
      </Link>
      <SearchBox />
      <ListPropertyButton userId={user?.id} />
      {isAuthenticated ? <ProfileButton /> : <RegisterButton />}
    </nav>
  );
}
