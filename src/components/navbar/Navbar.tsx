import ListPropertyButton from "./ListPropertyButton";
import SearchBox from "./SearchBox";
import ProfileButton from "./ProfileButton";
import RegisterButton from "./RegisterButton";
import { getUser } from "@/lib/userMapper";

export default async function PropertyBookingDashboard() {
  const isUser = await getUser();
  return (
    <nav className="flex flex-col w-full items-center mx-auto justify-between p-6 md:flex-row ">
      <h1 className="text-3xl font-bold left-6">INNMATE</h1>
      <SearchBox />
      <ListPropertyButton userId="userId" />
      {isUser ? <ProfileButton /> : <RegisterButton />}
    </nav>
  );
}
