"use client";

import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const ListPropertyButton = ({ userId }: { userId: string }) => {
  const router = useRouter();
  return (
    <Button onClick={() => router.push(`/user/${userId}/properties`)}>
      List your property
    </Button>
  );
};

export default ListPropertyButton;
