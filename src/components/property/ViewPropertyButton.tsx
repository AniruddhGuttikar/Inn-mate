"use client";

import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const ViewPropertyButton = ({
  propertyId,
}: {
  propertyId: string | undefined;
}) => {
  const router = useRouter();

  async function HandleClick(){
    router.push(`/properties/${propertyId}`)
  }
  return (
    <Button onClick={HandleClick}>
      View Property
    </Button>
  );
};

export default ViewPropertyButton;
