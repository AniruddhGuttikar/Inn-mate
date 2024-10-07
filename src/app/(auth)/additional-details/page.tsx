import ProfileCompletionForm from "@/components/user/UserForm";
import { TKindeUser } from "@/lib/definitions";
import { mapKindeUserToUser } from "@/lib/userMapper";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import React from "react";

const AdditionalDetails = async () => {
  const { getUser } = getKindeServerSession();
  const kindeUser = (await getUser()) as KindeUser<TKindeUser>;
  const user = await mapKindeUserToUser(kindeUser);

  return user ? (
    <>
      <ProfileCompletionForm user={user} />
    </>
  ) : (
    <></>
  );
};

export default AdditionalDetails;
