import { mapKindeUserToUser } from "@/actions/userActions";
import AddPropertyForm from "@/components/property/AddPropertyForm";
import { TKindeUser } from "@/lib/definitions";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import React from "react";

export default async function AddPropertyPage() {
  const { getUser } = getKindeServerSession();
  const kindeUser = (await getUser()) as TKindeUser;
  const user = await mapKindeUserToUser(kindeUser);

  if (user?.id) {
    return <AddPropertyForm userId={user.id} kindeId={kindeUser.id} />;
  } else {
    <>sorry couldn't fetch the user</>;
  }
}
