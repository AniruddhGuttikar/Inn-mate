"use client";

import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const BookPropertyButton = ({
  propertyId,
}: {
  propertyId: string | undefined;
}) => {
  const router = useRouter();

  return (
    <Button onClick={() => router.push(`/properties/${propertyId}`)}>
      Book Now
    </Button>
  );
};

export default BookPropertyButton;
