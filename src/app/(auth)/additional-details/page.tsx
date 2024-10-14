import { mapKindeUserToUser } from "@/actions/userActions";
import { UserForm } from "@/components/user/UserForm";
import { TKindeUser, TUser } from "@/lib/definitions";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const AdditionalDetails = async () => {
  const { getUser } = getKindeServerSession();
  const kindeUser = (await getUser()) as TKindeUser;
  const user = await mapKindeUserToUser(kindeUser);
  return <UserForm user={user as TUser} />;
};

export default AdditionalDetails;
