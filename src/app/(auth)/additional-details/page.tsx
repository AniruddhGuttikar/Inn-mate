import ProfileCompletionForm from "@/components/user/UserForm";
import { TUser } from "@/lib/definitions";
import { getUser, isUserAuthenticated } from "@/lib/userMapper";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const AdditionalDetails = async () => {
  const { isAuthenticated: isKindeAuthenticated } = getKindeServerSession();

  const isAuthenticated = await isUserAuthenticated();
  const user = await getUser();
  console.log(user);

  if ((await isKindeAuthenticated()) && isAuthenticated) {
    redirect("/");
  }

  return <ProfileCompletionForm user={user as TUser} />;
};

export default AdditionalDetails;
