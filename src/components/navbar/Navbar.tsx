"use client";

import ListPropertyButton from "./ListPropertyButton";
import SearchBox from "./SearchBox";
import ProfileButton from "./ProfileButton";

export default function PropertyBookingDashboard() {
  return (
    <nav className="flex flex-col w-full items-center mx-auto justify-between p-6 md:flex-row ">
      <h1 className="text-3xl font-bold left-6">INNMATE</h1>
      <SearchBox />
      <ListPropertyButton />
      <ProfileButton />
    </nav>
  );
}
