"use client";

import { TUser } from "@/lib/definitions";
import React from "react";

export const UserForm = ({ user }: { user: TUser }) => {
  return (
    <>
      <div>user form for</div>
      {user.name}
    </>
  );
};
