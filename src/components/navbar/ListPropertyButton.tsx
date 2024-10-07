import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const ListPropertyButton = () => {
  //const userId = getUserId();
  const router = useRouter();
  return (
    <Button onClick={() => router.push(`/user/123/properties`)}>
      List your property
    </Button>
  );
};

export default ListPropertyButton;
