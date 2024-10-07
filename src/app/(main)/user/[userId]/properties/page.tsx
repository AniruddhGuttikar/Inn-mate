import AddProperty from "@/components/property/AddProperty";
import React from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const UserProperties = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  return (
    <>
      <AddProperty />
      <div>UserProperties</div>
      {user.given_name}
    </>
  );
};

export default UserProperties;
