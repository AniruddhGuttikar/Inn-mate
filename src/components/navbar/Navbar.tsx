// "use client";

import { ListPropertyButton } from "./ListPropertyButton";
import SearchBox from "./SearchBox";
import ProfileButton from "./ProfileButton";
import RegisterButton from "./RegisterButton";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Link from "next/link";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {
  getUserByKindeId,
  isAuthenticatedUserInDb,
  mapKindeUserToUser,
} from "@/actions/userActions";

export default async function Navbar() {
  // const { user, isAuthenticated } = useKindeBrowserClient();
  const { getUser, isAuthenticated } = getKindeServerSession();

  const kindeUser = await getUser();
  const isAuthenticatedUser = await isAuthenticated();
  const user = await getUserByKindeId(kindeUser?.id);
  const isAuthenticatedInDatabase = await isAuthenticatedUserInDb(user?.id);

  return (
    <nav className="flex flex-col w-full border-b-2 items-center mx-auto justify-between p-6 md:flex-row ">
      <Link href={"/"}>
        <h1 className="text-3xl font-bold left-6">INNMATE</h1>
      </Link>
      <SearchBox />
      <ListPropertyButton userId={user?.id} />
      {isAuthenticatedUser && isAuthenticatedInDatabase ? (
        <ProfileButton />
      ) : (
        <RegisterButton />
      )}
    </nav>
  );
}
