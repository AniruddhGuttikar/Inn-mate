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

  return (
    <Button onClick={() => router.push(`/properties/${propertyId}`)}>
      View Property
    </Button>
  );
};

export default ViewPropertyButton;
